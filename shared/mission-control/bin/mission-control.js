#!/usr/bin/env node

/**
 * Amenthyx Mission Control -- CLI Entry Point
 *
 * This file serves as the bin entry for the "mission-control" command.
 * It loads the compiled CLI from dist/server/cli.js.
 *
 * Usage:
 *   npx mission-control <command> [options]
 *   mission-control <command> [options]  (if globally linked)
 *
 * Commands: init, start, stop, status, health, help
 */

'use strict';

const path = require('path');
const fs = require('fs');

// Resolve paths for compiled and source versions
const distPath = path.join(__dirname, '..', 'dist', 'server', 'cli.js');
const srcPath = path.join(__dirname, '..', 'src', 'server', 'cli.ts');

if (fs.existsSync(distPath)) {
  // Use compiled JavaScript (production)
  require(distPath);
} else if (fs.existsSync(srcPath)) {
  // Fallback: run TypeScript directly via tsx (development)
  const { execSync } = require('child_process');
  const args = process.argv.slice(2).map(a => `"${a}"`).join(' ');

  try {
    execSync(`npx tsx "${srcPath}" ${args}`, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    });
  } catch (err) {
    // execSync throws on non-zero exit; the child already printed errors
    process.exit(err.status || 1);
  }
} else {
  console.error('Mission Control CLI not found.');
  console.error('');
  console.error('The compiled CLI is missing. Please build first:');
  console.error('  cd ' + path.join(__dirname, '..'));
  console.error('  npm run build:server');
  console.error('');
  console.error('Or run directly in development mode:');
  console.error('  npx tsx src/server/cli.ts <command>');
  process.exit(1);
}
