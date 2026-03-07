import { getDatabase } from '../db/database';

export function initFTS(): void {
  const db = getDatabase();
  try {
    db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS events_fts USING fts5(
        type, payload, agent_role,
        content='events',
        content_rowid='rowid'
      );

      CREATE TRIGGER IF NOT EXISTS events_ai AFTER INSERT ON events BEGIN
        INSERT INTO events_fts(rowid, type, payload, agent_role)
        VALUES (new.rowid, new.type, new.payload, new.agent_role);
      END;
    `);
  } catch {
    // FTS5 may not be available in all SQLite builds
  }
}

export function searchFTS(query: string, limit = 20): Array<{ type: string; payload: string; agent_role: string }> {
  const db = getDatabase();
  try {
    return db.prepare(`
      SELECT type, payload, agent_role FROM events_fts
      WHERE events_fts MATCH ? ORDER BY rank LIMIT ?
    `).all(query, limit) as Array<{ type: string; payload: string; agent_role: string }>;
  } catch {
    return [];
  }
}
