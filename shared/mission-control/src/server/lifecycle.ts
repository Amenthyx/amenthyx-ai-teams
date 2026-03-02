/**
 * Amenthyx Mission Control -- Port Management & Process Lifecycle
 *
 * Provides utilities for:
 * - Finding available ports
 * - PID file management
 * - Process health checks
 * - Dashboard start/stop lifecycle
 *
 * Cross-platform: Works on Linux, macOS, and Windows.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as net from 'net';
import * as http from 'http';
import { execSync, spawn, ChildProcess } from 'child_process';

// ---------------------------------------------------------------------------
// Port Management
// ---------------------------------------------------------------------------

/**
 * Check if a specific port is available by attempting to bind to it.
 * This is the most reliable cross-platform approach.
 */
export function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        // Other errors -- treat as available (will fail later if truly unavailable)
        resolve(true);
      }
    });

    server.once('listening', () => {
      server.close(() => {
        resolve(true);
      });
    });

    server.listen(port, '127.0.0.1');
  });
}

/**
 * Find an available port starting from `startPort`.
 * Increments by `step` (default 2 to keep backend/frontend in sync)
 * until a free port is found or `maxAttempts` is reached.
 */
export async function findAvailablePort(
  startPort: number,
  step: number = 2,
  maxAttempts: number = 50
): Promise<number> {
  let port = startPort;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const available = await isPortAvailable(port);
    if (available) {
      return port;
    }
    port += step;
  }

  throw new Error(
    `No available port found after ${maxAttempts} attempts (starting from ${startPort}, step ${step})`
  );
}

/**
 * Find an available backend/frontend port pair.
 * Backend starts at `backendStart`, frontend is always `backendStart - 1`.
 * Returns { backend, frontend }.
 */
export async function findAvailablePortPair(
  backendStart: number = 4201,
  frontendStart: number = 4200
): Promise<{ backend: number; frontend: number }> {
  let backend = backendStart;
  let frontend = frontendStart;

  for (let attempt = 0; attempt < 50; attempt++) {
    const backendAvailable = await isPortAvailable(backend);
    const frontendAvailable = await isPortAvailable(frontend);

    if (backendAvailable && frontendAvailable) {
      return { backend, frontend };
    }

    backend += 2;
    frontend += 2;
  }

  throw new Error('No available port pair found after 50 attempts');
}

// ---------------------------------------------------------------------------
// PID File Management
// ---------------------------------------------------------------------------

/**
 * Write the current process PID to a file.
 * Creates parent directories if they do not exist.
 */
export function writePidFile(pidPath: string, pid?: number): void {
  const dir = path.dirname(pidPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(pidPath, String(pid ?? process.pid), 'utf-8');
}

/**
 * Read a PID from a PID file. Returns null if the file does not exist
 * or contains invalid content.
 */
export function readPidFile(pidPath: string): number | null {
  try {
    const content = fs.readFileSync(pidPath, 'utf-8').trim();
    const pid = parseInt(content, 10);
    return isNaN(pid) || pid <= 0 ? null : pid;
  } catch {
    return null;
  }
}

/**
 * Remove a PID file if it exists.
 */
export function removePidFile(pidPath: string): void {
  try {
    if (fs.existsSync(pidPath)) {
      fs.unlinkSync(pidPath);
    }
  } catch {
    // Ignore removal errors
  }
}

// ---------------------------------------------------------------------------
// Process Lifecycle
// ---------------------------------------------------------------------------

/**
 * Check if a process with the given PID is currently running.
 * Cross-platform: works on Unix (kill -0) and Windows (tasklist).
 */
export function isProcessRunning(pid: number): boolean {
  try {
    // On all platforms, process.kill(pid, 0) checks existence without killing
    process.kill(pid, 0);
    return true;
  } catch (err) {
    const error = err as NodeJS.ErrnoException;
    // EPERM means the process exists but we lack permission
    if (error.code === 'EPERM') {
      return true;
    }
    // ESRCH means no such process
    return false;
  }
}

/**
 * Kill a process by PID. Returns true if successfully signaled.
 * On Windows, uses taskkill; on Unix, uses SIGTERM then SIGKILL.
 */
export function killProcess(pid: number, force: boolean = false): boolean {
  try {
    if (process.platform === 'win32') {
      const flag = force ? '/F' : '';
      execSync(`taskkill ${flag} /PID ${pid} /T`, { stdio: 'ignore' });
    } else {
      process.kill(pid, force ? 'SIGKILL' : 'SIGTERM');
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Stop a running Mission Control dashboard.
 *
 * 1. Read PID from .dashboard.pid
 * 2. Check if process is running
 * 3. Send SIGTERM, wait, then SIGKILL if needed
 * 4. Clean up PID file
 */
export async function stopDashboard(mcDir: string): Promise<{
  stopped: boolean;
  pid: number | null;
  message: string;
}> {
  const pidPath = path.join(mcDir, '.dashboard.pid');
  const pid = readPidFile(pidPath);

  if (pid === null) {
    return { stopped: false, pid: null, message: 'No PID file found -- dashboard may not be running' };
  }

  if (!isProcessRunning(pid)) {
    removePidFile(pidPath);
    return { stopped: false, pid, message: `Process ${pid} is not running -- cleaned up stale PID file` };
  }

  // Attempt graceful shutdown
  killProcess(pid, false);

  // Wait up to 5 seconds for graceful shutdown
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    if (!isProcessRunning(pid)) {
      removePidFile(pidPath);
      return { stopped: true, pid, message: `Dashboard (PID ${pid}) stopped gracefully` };
    }
    await sleep(500);
  }

  // Force kill
  killProcess(pid, true);
  await sleep(1000);

  removePidFile(pidPath);

  if (!isProcessRunning(pid)) {
    return { stopped: true, pid, message: `Dashboard (PID ${pid}) force-killed after timeout` };
  }

  return { stopped: false, pid, message: `Failed to stop dashboard (PID ${pid})` };
}

/**
 * Start the Mission Control dashboard as a background process.
 * Returns the child process and the assigned ports.
 */
export async function startDashboard(mcDir: string, options?: {
  backendPort?: number;
  frontendPort?: number;
}): Promise<{
  pid: number;
  backend: number;
  frontend: number;
  logPath: string;
}> {
  const resolvedMcDir = path.resolve(mcDir);

  // Check if package.json exists
  const packageJsonPath = path.join(resolvedMcDir, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`No package.json found at ${resolvedMcDir} -- is this a Mission Control directory?`);
  }

  // Find available ports
  const requestedBackend = options?.backendPort ?? 4201;
  const requestedFrontend = options?.frontendPort ?? 4200;

  const ports = await findAvailablePortPair(requestedBackend, requestedFrontend);

  // Write PID file path
  const pidPath = path.join(resolvedMcDir, '.dashboard.pid');
  const logPath = path.join(resolvedMcDir, 'dashboard.log');

  // Remove old PID file
  removePidFile(pidPath);

  // Open log file for writing
  const logFd = fs.openSync(logPath, 'w');

  // Determine npm command (Windows uses npm.cmd)
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  // Spawn dashboard process
  const child: ChildProcess = spawn(npmCmd, ['run', 'dashboard'], {
    cwd: resolvedMcDir,
    env: {
      ...process.env,
      MC_PORT: String(ports.backend),
      VITE_PORT: String(ports.frontend),
    },
    stdio: ['ignore', logFd, logFd],
    detached: true,
    windowsHide: true,
  });

  // Unref so the parent can exit independently
  child.unref();

  const childPid = child.pid;
  if (!childPid) {
    fs.closeSync(logFd);
    throw new Error('Failed to spawn dashboard process -- no PID returned');
  }

  // Write PID file
  writePidFile(pidPath, childPid);
  fs.closeSync(logFd);

  return {
    pid: childPid,
    backend: ports.backend,
    frontend: ports.frontend,
    logPath,
  };
}

// ---------------------------------------------------------------------------
// Health Check
// ---------------------------------------------------------------------------

/**
 * Poll the /api/health endpoint until it responds or timeout is reached.
 * Returns true if the server responds with HTTP 200.
 */
export async function healthCheck(
  port: number,
  timeoutMs: number = 30000,
  intervalMs: number = 2000
): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const healthy = await checkHealthOnce(port);
    if (healthy) return true;
    await sleep(intervalMs);
  }

  return false;
}

/**
 * Single health check attempt against /api/health.
 */
function checkHealthOnce(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get(
      {
        hostname: '127.0.0.1',
        port,
        path: '/api/health',
        timeout: 3000,
      },
      (res) => {
        // Consume response data to free the socket
        res.resume();
        resolve(res.statusCode === 200);
      }
    );

    req.on('error', () => {
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

// ---------------------------------------------------------------------------
// Dashboard Status
// ---------------------------------------------------------------------------

export interface DashboardStatus {
  running: boolean;
  pid: number | null;
  ports: { backend: number; frontend: number } | null;
  uptime: number | null;
  sessionId: string | null;
  healthy: boolean;
}

/**
 * Get the current status of the Mission Control dashboard.
 */
export async function getDashboardStatus(mcDir: string): Promise<DashboardStatus> {
  const pidPath = path.join(mcDir, '.dashboard.pid');
  const configPath = path.join(mcDir, 'mission-control.config.json');

  const pid = readPidFile(pidPath);
  const running = pid !== null && isProcessRunning(pid);

  let ports: { backend: number; frontend: number } | null = null;
  let sessionId: string | null = null;

  // Read config for port/session info
  try {
    const configContent = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configContent);
    ports = config.ports || null;
    sessionId = config.sessionId || null;
  } catch {
    // Config may not exist yet
  }

  let healthy = false;
  let uptime: number | null = null;

  if (running && ports) {
    try {
      const healthData = await getHealthData(ports.backend);
      if (healthData) {
        healthy = true;
        uptime = healthData.uptime ?? null;
        sessionId = healthData.sessionId ?? sessionId;
      }
    } catch {
      // Not healthy
    }
  }

  return { running, pid, ports, uptime, sessionId, healthy };
}

/**
 * Fetch health data from the /api/health endpoint.
 */
function getHealthData(port: number): Promise<Record<string, unknown> | null> {
  return new Promise((resolve) => {
    const req = http.get(
      {
        hostname: '127.0.0.1',
        port,
        path: '/api/health',
        timeout: 3000,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk: Buffer) => { data += chunk.toString(); });
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve(null);
          }
        });
      }
    );

    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Format seconds into human-readable duration.
 */
export function formatUptime(seconds: number): string {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}
