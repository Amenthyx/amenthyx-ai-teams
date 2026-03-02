#!/usr/bin/env node
/**
 * Amenthyx Mission Control -- CLI
 *
 * Commands:
 *   mission-control init <project_dir> <team_name> [strategy_path] [ai_tool]
 *   mission-control start [--port <backend_port>] [--frontend-port <frontend_port>]
 *   mission-control stop
 *   mission-control status
 *   mission-control health
 *
 * Cross-platform: Works on Linux, macOS, and Windows.
 */

import * as path from 'path';
import * as fs from 'fs';
import {
  startDashboard,
  stopDashboard,
  getDashboardStatus,
  healthCheck,
  formatUptime,
} from './lifecycle';

// ---------------------------------------------------------------------------
// CLI Argument Parser
// ---------------------------------------------------------------------------

interface ParsedArgs {
  command: string;
  positional: string[];
  flags: Record<string, string>;
}

function parseArgs(argv: string[]): ParsedArgs {
  const args = argv.slice(2); // Remove node and script path
  const command = args[0] || 'help';
  const positional: string[] = [];
  const flags: Record<string, string> = {};

  let i = 1;
  while (i < args.length) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        flags[key] = next;
        i += 2;
      } else {
        flags[key] = 'true';
        i += 1;
      }
    } else if (arg.startsWith('-') && arg.length === 2) {
      const key = arg.slice(1);
      const next = args[i + 1];
      if (next && !next.startsWith('-')) {
        flags[key] = next;
        i += 2;
      } else {
        flags[key] = 'true';
        i += 1;
      }
    } else {
      positional.push(arg);
      i += 1;
    }
  }

  return { command, positional, flags };
}

// ---------------------------------------------------------------------------
// Resolve Mission Control directory
// ---------------------------------------------------------------------------

function resolveMcDir(flagDir?: string): string {
  if (flagDir) {
    return path.resolve(flagDir);
  }

  // Check if we are inside a .mission-control dir
  const cwd = process.cwd();
  if (path.basename(cwd) === '.mission-control') {
    return cwd;
  }

  // Check for .mission-control in cwd
  const mcInCwd = path.join(cwd, '.mission-control');
  if (fs.existsSync(mcInCwd)) {
    return mcInCwd;
  }

  // Default: current directory IS the mission-control dir
  // (e.g., when running from inside shared/mission-control)
  if (fs.existsSync(path.join(cwd, 'package.json'))) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf-8'));
      if (pkg.name === '@amenthyx/mission-control') {
        return cwd;
      }
    } catch {
      // Ignore
    }
  }

  return mcInCwd; // Best guess
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

async function cmdInit(parsed: ParsedArgs): Promise<void> {
  const projectDir = parsed.positional[0] || '.';
  const teamName = parsed.positional[1] || 'unknown';
  const strategyPath = parsed.positional[2] || parsed.flags['strategy'] || '';
  const aiTool = parsed.positional[3] || parsed.flags['tool'] || 'auto';

  console.log('');
  console.log('========================================================');
  console.log('  AMENTHYX MISSION CONTROL -- Init');
  console.log('========================================================');
  console.log('');
  console.log(`  Project:  ${path.resolve(projectDir)}`);
  console.log(`  Team:     ${teamName}`);
  console.log(`  Strategy: ${strategyPath || '(auto-detect)'}`);
  console.log(`  AI Tool:  ${aiTool}`);
  console.log('');

  // Locate the scaffold script or generate-config.ts
  const scriptDir = path.resolve(__dirname, '..', '..');
  const generateConfigPath = path.join(scriptDir, 'scaffold', 'generate-config.ts');

  if (fs.existsSync(generateConfigPath)) {
    // Use the TypeScript config generator
    console.log('[>] Running config generator...');
    const { execSync } = await import('child_process');
    try {
      execSync(
        `npx tsx "${generateConfigPath}" "${projectDir}" "${teamName}" "${strategyPath}" "${aiTool}"`,
        { stdio: 'inherit', cwd: scriptDir }
      );
      console.log('[OK] Init complete');
    } catch (err) {
      console.error('[ERROR] Config generation failed');
      process.exit(1);
    }
  } else {
    // Fallback: try scaffold.sh
    const scaffoldPath = path.join(scriptDir, 'scaffold', 'scaffold.sh');
    if (fs.existsSync(scaffoldPath)) {
      console.log('[>] Running scaffold.sh...');
      const { execSync } = await import('child_process');
      try {
        execSync(
          `bash "${scaffoldPath}" "${projectDir}" "${teamName}" "${strategyPath}" "${aiTool}"`,
          { stdio: 'inherit' }
        );
      } catch (err) {
        console.error('[ERROR] Scaffold failed');
        process.exit(1);
      }
    } else {
      console.error('[ERROR] Neither generate-config.ts nor scaffold.sh found');
      console.error(`       Looked in: ${scriptDir}/scaffold/`);
      process.exit(1);
    }
  }
}

async function cmdStart(parsed: ParsedArgs): Promise<void> {
  const mcDir = resolveMcDir(parsed.flags['dir']);

  const backendPort = parsed.flags['port'] ? parseInt(parsed.flags['port'], 10) : undefined;
  const frontendPort = parsed.flags['frontend-port']
    ? parseInt(parsed.flags['frontend-port'], 10)
    : undefined;

  console.log('');
  console.log('========================================================');
  console.log('  AMENTHYX MISSION CONTROL -- Start');
  console.log('========================================================');
  console.log('');

  // Check if already running
  const status = await getDashboardStatus(mcDir);
  if (status.running) {
    console.log(`[!] Dashboard is already running (PID: ${status.pid})`);
    if (status.healthy && status.ports) {
      console.log(`    Dashboard: http://localhost:${status.ports.frontend}`);
      console.log(`    API:       http://localhost:${status.ports.backend}/api`);
    }
    console.log('');
    console.log('    Use "mission-control stop" first if you want to restart.');
    return;
  }

  console.log('[>] Starting Mission Control dashboard...');

  try {
    const result = await startDashboard(mcDir, {
      backendPort,
      frontendPort,
    });

    console.log(`[>] Dashboard PID: ${result.pid}`);
    console.log(`[>] Log file: ${result.logPath}`);
    console.log('[>] Waiting for health check...');

    const healthy = await healthCheck(result.backend, 30000);

    if (healthy) {
      console.log('');
      console.log('========================================================');
      console.log('  [OK] Mission Control running');
      console.log(`       Dashboard: http://localhost:${result.frontend}`);
      console.log(`       API:       http://localhost:${result.backend}/api`);
      console.log(`       PID:       ${result.pid}`);
      console.log('========================================================');
    } else {
      console.log('');
      console.log('[!] Dashboard started but health check timed out after 30s');
      console.log(`    Check logs: ${result.logPath}`);
      console.log('    The dashboard may still be starting up.');
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[ERROR] Failed to start dashboard: ${message}`);
    process.exit(1);
  }
}

async function cmdStop(parsed: ParsedArgs): Promise<void> {
  const mcDir = resolveMcDir(parsed.flags['dir']);

  console.log('');
  console.log('========================================================');
  console.log('  AMENTHYX MISSION CONTROL -- Stop');
  console.log('========================================================');
  console.log('');

  const result = await stopDashboard(mcDir);

  if (result.stopped) {
    console.log(`[OK] ${result.message}`);
  } else {
    console.log(`[!] ${result.message}`);
  }
}

async function cmdStatus(parsed: ParsedArgs): Promise<void> {
  const mcDir = resolveMcDir(parsed.flags['dir']);

  console.log('');
  console.log('========================================================');
  console.log('  AMENTHYX MISSION CONTROL -- Status');
  console.log('========================================================');
  console.log('');

  const status = await getDashboardStatus(mcDir);

  console.log(`  Directory: ${mcDir}`);
  console.log(`  Running:   ${status.running ? 'YES' : 'NO'}`);

  if (status.pid !== null) {
    console.log(`  PID:       ${status.pid}`);
  }

  if (status.ports) {
    console.log(`  Backend:   http://localhost:${status.ports.backend}/api`);
    console.log(`  Frontend:  http://localhost:${status.ports.frontend}`);
  }

  if (status.healthy) {
    console.log(`  Health:    OK`);
  } else if (status.running) {
    console.log(`  Health:    UNHEALTHY (not responding)`);
  } else {
    console.log(`  Health:    N/A (not running)`);
  }

  if (status.uptime !== null) {
    console.log(`  Uptime:    ${formatUptime(status.uptime)}`);
  }

  if (status.sessionId) {
    console.log(`  Session:   ${status.sessionId}`);
  }

  console.log('');
}

async function cmdHealth(parsed: ParsedArgs): Promise<void> {
  const mcDir = resolveMcDir(parsed.flags['dir']);
  const port = parsed.flags['port'] ? parseInt(parsed.flags['port'], 10) : null;

  let backendPort = port;

  if (!backendPort) {
    // Try to read from config
    const configPath = path.join(mcDir, 'mission-control.config.json');
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      backendPort = config.ports?.backend ?? 4201;
    } catch {
      backendPort = 4201;
    }
  }

  console.log(`[>] Checking health at http://localhost:${backendPort}/api/health...`);

  const healthy = await healthCheck(backendPort!, 5000, 1000);

  if (healthy) {
    console.log('[OK] Dashboard is healthy');
    process.exit(0);
  } else {
    console.log('[FAIL] Dashboard is not responding');
    process.exit(1);
  }
}

function cmdHelp(): void {
  console.log(`
Amenthyx Mission Control -- CLI v1.0

Usage:
  mission-control <command> [options]

Commands:
  init <project_dir> <team_name> [strategy_path] [ai_tool]
      Initialize Mission Control in a project directory.
      Generates config and optionally scaffolds the full setup.

  start [options]
      Start the Mission Control dashboard in the background.
      --port <number>           Backend port (default: 4201)
      --frontend-port <number>  Frontend port (default: 4200)
      --dir <path>              Mission Control directory

  stop [options]
      Stop the running Mission Control dashboard.
      --dir <path>              Mission Control directory

  status [options]
      Show the current status of Mission Control.
      --dir <path>              Mission Control directory

  health [options]
      Check if the dashboard is healthy (exits 0 or 1).
      --port <number>           Backend port to check
      --dir <path>              Mission Control directory

  help
      Show this help message.

Examples:
  mission-control init ./my-project fullStack ./STRATEGY.md
  mission-control start --port 4201
  mission-control stop
  mission-control status
`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const parsed = parseArgs(process.argv);

  switch (parsed.command) {
    case 'init':
      await cmdInit(parsed);
      break;
    case 'start':
      await cmdStart(parsed);
      break;
    case 'stop':
      await cmdStop(parsed);
      break;
    case 'status':
      await cmdStatus(parsed);
      break;
    case 'health':
      await cmdHealth(parsed);
      break;
    case 'help':
    case '--help':
    case '-h':
      cmdHelp();
      break;
    default:
      console.error(`Unknown command: ${parsed.command}`);
      console.error('Run "mission-control help" for usage information.');
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(`[FATAL] ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
