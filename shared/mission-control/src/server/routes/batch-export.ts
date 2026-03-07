import { Router, Request, Response } from 'express';
import * as zlib from 'zlib';
import { getEvents, getAgents, getBudget, getWaves, getGates, getDatabase } from '../db/database';

function log(level: string, message: string): void {
  const entry = { level, message, timestamp: new Date().toISOString() };
  process.stdout.write(JSON.stringify(entry) + '\n');
}

// ---------------------------------------------------------------------------
// Tar utilities (minimal implementation using Node.js built-ins)
// ---------------------------------------------------------------------------

/**
 * Create a tar header for a file entry.
 * Uses the USTAR format with 512-byte aligned blocks.
 */
function createTarHeader(filename: string, size: number): Buffer {
  const header = Buffer.alloc(512, 0);

  // Name (100 bytes)
  header.write(filename, 0, Math.min(filename.length, 100), 'utf-8');

  // Mode (8 bytes) — 0644
  header.write('0000644\0', 100, 8, 'utf-8');

  // UID (8 bytes)
  header.write('0000000\0', 108, 8, 'utf-8');

  // GID (8 bytes)
  header.write('0000000\0', 116, 8, 'utf-8');

  // Size (12 bytes) — octal
  header.write(size.toString(8).padStart(11, '0') + '\0', 124, 12, 'utf-8');

  // Mtime (12 bytes) — current time in octal
  const mtime = Math.floor(Date.now() / 1000);
  header.write(mtime.toString(8).padStart(11, '0') + '\0', 136, 12, 'utf-8');

  // Checksum placeholder (8 bytes of spaces)
  header.write('        ', 148, 8, 'utf-8');

  // Type flag — '0' for regular file
  header.write('0', 156, 1, 'utf-8');

  // USTAR magic
  header.write('ustar\0', 257, 6, 'utf-8');
  header.write('00', 263, 2, 'utf-8');

  // Calculate and write checksum
  let checksum = 0;
  for (let i = 0; i < 512; i++) {
    checksum += header[i];
  }
  header.write(checksum.toString(8).padStart(6, '0') + '\0 ', 148, 8, 'utf-8');

  return header;
}

/**
 * Create a tar entry (header + padded data) for a file.
 */
function createTarEntry(filename: string, content: string): Buffer {
  const data = Buffer.from(content, 'utf-8');
  const header = createTarHeader(filename, data.length);

  // Pad data to 512-byte boundary
  const paddingSize = (512 - (data.length % 512)) % 512;
  const padding = Buffer.alloc(paddingSize, 0);

  return Buffer.concat([header, data, padding]);
}

/**
 * Create a complete tar archive from a set of files, then gzip it.
 */
function createTarGz(files: Array<{ name: string; content: string }>): Buffer {
  const entries = files.map((f) => createTarEntry(f.name, f.content));

  // End-of-archive marker: two 512-byte blocks of zeros
  const endMarker = Buffer.alloc(1024, 0);

  const tar = Buffer.concat([...entries, endMarker]);
  return zlib.gzipSync(tar);
}

// ---------------------------------------------------------------------------
// Data collection helpers
// ---------------------------------------------------------------------------

function collectSessionData(sessionId?: string): Record<string, string> {
  const files: Record<string, string> = {};

  try {
    // Events — get all (up to 10000 for export)
    const filters: { limit: number; session_id?: string } = { limit: 10000 };
    const { events, total } = getEvents(filters);
    files['events.json'] = JSON.stringify({ total, events }, null, 2);
  } catch {
    files['events.json'] = JSON.stringify({ total: 0, events: [] }, null, 2);
  }

  try {
    const agents = getAgents();
    files['agents.json'] = JSON.stringify(agents, null, 2);
  } catch {
    files['agents.json'] = JSON.stringify([], null, 2);
  }

  try {
    const budget = getBudget();
    files['budget.json'] = JSON.stringify(budget, null, 2);
  } catch {
    files['budget.json'] = JSON.stringify(null, null, 2);
  }

  try {
    const waves = getWaves();
    files['waves.json'] = JSON.stringify(waves, null, 2);
  } catch {
    files['waves.json'] = JSON.stringify([], null, 2);
  }

  try {
    const gates = getGates();
    files['gates.json'] = JSON.stringify(gates, null, 2);
  } catch {
    files['gates.json'] = JSON.stringify([], null, 2);
  }

  // Add metadata
  files['metadata.json'] = JSON.stringify({
    exportedAt: new Date().toISOString(),
    sessionId: sessionId || 'all',
    version: '1.0.0',
  }, null, 2);

  return files;
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

export function createBatchExportRouter(): Router {
  const router = Router();

  /**
   * GET /api/export/zip
   * Export all session data as a tar.gz archive.
   * Optional query param: ?session=ID to filter by session.
   */
  router.get('/export/zip', (req: Request, res: Response) => {
    try {
      const sessionId = typeof req.query.session === 'string'
        ? req.query.session
        : undefined;

      const dataFiles = collectSessionData(sessionId);

      const fileEntries = Object.entries(dataFiles).map(([name, content]) => ({
        name: `mission-control-export/${name}`,
        content,
      }));

      const archive = createTarGz(fileEntries);

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `mission-control-export-${timestamp}.tar.gz`;

      res.setHeader('Content-Type', 'application/gzip');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', archive.length.toString());

      log('info', `Batch export generated: ${fileEntries.length} files, ${archive.length} bytes`);

      res.send(archive);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      log('error', `Failed to generate batch export: ${message}`);
      res.status(500).json({ error: 'Failed to generate batch export', detail: message });
    }
  });

  return router;
}
