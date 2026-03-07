import { Router, Request, Response } from 'express';
import { execSync } from 'child_process';

function log(level: string, message: string): void {
  const entry = { level, message, timestamp: new Date().toISOString() };
  process.stdout.write(JSON.stringify(entry) + '\n');
}

/**
 * Git routes factory.
 * Provides endpoints for querying git diff data.
 */
export function createGitRouter(repoPath?: string): Router {
  const router = Router();

  /**
   * GET /api/git/diff/:hash
   * Returns the unified diff for a specific commit hash.
   */
  router.get('/git/diff/:hash', (req: Request, res: Response) => {
    try {
      const hash = req.params.hash;

      // Validate hash format (short or full SHA)
      if (!/^[a-f0-9]{4,40}$/i.test(hash)) {
        res.status(400).json({ error: 'Invalid commit hash format' });
        return;
      }

      const cwd = repoPath || process.cwd();
      const diff = execSync(`git diff ${hash}^..${hash}`, {
        cwd,
        encoding: 'utf-8',
        maxBuffer: 5 * 1024 * 1024, // 5MB
        timeout: 10_000,
      });

      const stat = execSync(`git diff --stat ${hash}^..${hash}`, {
        cwd,
        encoding: 'utf-8',
        timeout: 10_000,
      });

      const commitInfo = execSync(
        `git log -1 --format="%H%n%an%n%ae%n%s%n%b%n%aI" ${hash}`,
        {
          cwd,
          encoding: 'utf-8',
          timeout: 10_000,
        }
      );

      const [fullHash, authorName, authorEmail, subject, body, date] = commitInfo
        .trim()
        .split('\n');

      res.json({
        hash: fullHash,
        author: { name: authorName, email: authorEmail },
        subject,
        body: body || undefined,
        date,
        stat: stat.trim(),
        diff,
      });

      log('info', `Retrieved diff for commit ${hash}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';

      // Handle common git errors
      if (message.includes('unknown revision')) {
        res.status(404).json({ error: 'Commit not found', detail: message });
        return;
      }
      if (message.includes('not a git repository')) {
        res.status(400).json({ error: 'Not a git repository', detail: message });
        return;
      }

      log('error', `Failed to get git diff: ${message}`);
      res.status(500).json({ error: 'Failed to get git diff', detail: message });
    }
  });

  return router;
}
