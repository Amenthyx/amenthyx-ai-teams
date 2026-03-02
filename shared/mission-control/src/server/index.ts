import * as crypto from 'crypto';
import * as path from 'path';
import * as http from 'http';
import express from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import { initDatabase, closeDatabase, insertEvent } from './db/database';
import { createHealthRouter } from './routes/health';
import { createEventsRouter } from './routes/events';
import { createAgentsRouter } from './routes/agents';
import { createBudgetRouter } from './routes/budget';
import { createWavesRouter } from './routes/waves';
import { FileWatcherService } from './watchers/file-watcher';
import { GitWatcherService } from './watchers/git-watcher';
import { EventCategory, type MissionControlEvent } from './types/events';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const PORT = parseInt(process.env.MC_PORT || '4201', 10);
const SESSION_ID = process.env.MC_SESSION_ID || crypto.randomUUID();
const DB_PATH = process.env.MC_DB_PATH || path.resolve(__dirname, '../../data/mission-control.db');
const WATCH_DIR = process.env.MC_WATCH_DIR || path.resolve(process.cwd(), '.team');
const GIT_CWD = process.env.MC_GIT_CWD || process.cwd();
const GIT_BRANCH = process.env.MC_GIT_BRANCH || 'ai-team';

function log(level: string, message: string): void {
  const entry = { level, message, timestamp: new Date().toISOString() };
  process.stdout.write(JSON.stringify(entry) + '\n');
}

// ---------------------------------------------------------------------------
// App Setup
// ---------------------------------------------------------------------------

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ origin: ['http://localhost:4200', 'http://127.0.0.1:4200'] }));
app.use(express.json({ limit: '1mb' }));

// ---------------------------------------------------------------------------
// WebSocket Setup
// ---------------------------------------------------------------------------

const wss = new WebSocketServer({ noServer: true });
const wsClients = new Set<WebSocket>();

// Handle HTTP upgrade for WebSocket
server.on('upgrade', (request, socket, head) => {
  if (request.url === '/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

wss.on('connection', (ws: WebSocket) => {
  wsClients.add(ws);
  log('info', `WebSocket client connected (total: ${wsClients.size})`);

  ws.on('close', () => {
    wsClients.delete(ws);
    log('info', `WebSocket client disconnected (total: ${wsClients.size})`);
  });

  ws.on('error', (err) => {
    log('error', `WebSocket error: ${err.message}`);
    wsClients.delete(ws);
  });

  // Send welcome message
  const welcome = {
    type: 'connected',
    data: {
      sessionId: SESSION_ID,
      timestamp: new Date().toISOString(),
    },
  };
  ws.send(JSON.stringify(welcome));
});

/**
 * Broadcast a message to all connected WebSocket clients.
 */
function broadcast(data: Record<string, unknown>): void {
  const message = JSON.stringify(data);
  for (const client of wsClients) {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(message);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        log('error', `Failed to send WS message: ${msg}`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.use('/api', createHealthRouter(wsClients, SESSION_ID));
app.use('/api', createEventsRouter(wsClients, broadcast, SESSION_ID));
app.use('/api', createAgentsRouter(wsClients, broadcast));
app.use('/api', createBudgetRouter(wsClients, broadcast));
app.use('/api', createWavesRouter(wsClients, broadcast));

// Serve static files in production
const clientDistPath = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// SPA fallback: serve index.html for unmatched routes (except /api)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).json({ error: 'Client not built. Run: npm run build:client' });
    }
  });
});

// ---------------------------------------------------------------------------
// Initialize Services
// ---------------------------------------------------------------------------

// Ensure data directory exists
import * as fs from 'fs';
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
initDatabase(DB_PATH);

// Event handler for watchers: store in DB + broadcast via WS
function handleWatcherEvent(event: MissionControlEvent): void {
  try {
    insertEvent(event);
    broadcast({ type: 'event', data: event });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    log('error', `Failed to handle watcher event: ${message}`);
  }
}

// Start file watcher
const fileWatcher = new FileWatcherService(
  { watchDir: WATCH_DIR, sessionId: SESSION_ID },
  handleWatcherEvent
);
fileWatcher.start();

// Start git watcher
const gitWatcher = new GitWatcherService(
  { cwd: GIT_CWD, branch: GIT_BRANCH, sessionId: SESSION_ID },
  handleWatcherEvent
);
gitWatcher.start();

// ---------------------------------------------------------------------------
// Start Server
// ---------------------------------------------------------------------------

server.listen(PORT, () => {
  log('info', `Mission Control backend running on port ${PORT}`);
  log('info', `Session: ${SESSION_ID}`);
  log('info', `Database: ${DB_PATH}`);
  log('info', `Watching: ${WATCH_DIR}`);
  log('info', `Git CWD: ${GIT_CWD} (branch: ${GIT_BRANCH})`);

  // Emit startup event
  const startupEvent: MissionControlEvent = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    sessionId: SESSION_ID,
    source: { tool: 'mission-control', version: '1.0.0' },
    category: EventCategory.SYSTEM,
    type: 'server_start',
    severity: 'info',
    payload: {
      port: PORT,
      watchDir: WATCH_DIR,
      gitBranch: GIT_BRANCH,
    },
  };
  handleWatcherEvent(startupEvent);
});

// ---------------------------------------------------------------------------
// Graceful Shutdown
// ---------------------------------------------------------------------------

function shutdown(signal: string): void {
  log('info', `Received ${signal}. Shutting down gracefully...`);

  // Stop watchers
  fileWatcher.stop();
  gitWatcher.stop();

  // Close WebSocket connections
  for (const client of wsClients) {
    try {
      client.close(1001, 'Server shutting down');
    } catch {
      // Ignore close errors
    }
  }
  wsClients.clear();

  // Close database
  closeDatabase();

  // Close HTTP server
  server.close(() => {
    log('info', 'Server closed');
    process.exit(0);
  });

  // Force exit after 5 seconds
  setTimeout(() => {
    log('warn', 'Forced shutdown after timeout');
    process.exit(1);
  }, 5000);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Handle unhandled errors to prevent crashes
process.on('uncaughtException', (err) => {
  log('error', `Uncaught exception: ${err.message}`);
  log('error', err.stack || 'No stack trace');
});

process.on('unhandledRejection', (reason) => {
  const message = reason instanceof Error ? reason.message : String(reason);
  log('error', `Unhandled rejection: ${message}`);
});

export { app, server, wsClients, broadcast, SESSION_ID };
