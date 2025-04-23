#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// CLI args
const args = process.argv.slice(2);

if (!args.length) {
  console.error('❌ Please provide a test name. Example: node pw login --headed');
  process.exit(1);
}

// Spec file (e.g., login ➝ tests/login.spec.js)
const baseName = args[0];
const specFile = `${baseName}.spec.js`;
const fullPath = `tests/${specFile}`; // use forward slash for Playwright regex compatibility

if (!fs.existsSync(fullPath)) {
  console.error(`❌ Spec file not found: ${fullPath}`);
  process.exit(1);
}

// Flags after the filename
let flags = args.slice(1);

// Headed mode (sets env var)
if (flags.includes('--headed')) {
  process.env.HEADED = 'true';
  flags = flags.filter(f => f !== '--headed');
}

// Default workers and retries
if (!flags.some(f => f.startsWith('--workers'))) {
  flags.push('--workers=1');
}
if (!flags.some(f => f.startsWith('--retries'))) {
  flags.push('--retries=0');
}

// ✅ Browser flag support (e.g., --browser=firefox)
const browserFlag = flags.find(f => f.startsWith('--browser='));
if (browserFlag) {
  // Already included, leave it
} else {
  // Optionally add default browser (comment out if not desired)
  flags.push('--browser=chromium');
}

// Final command log
console.log(`🔍 Running: npx playwright test -- ${fullPath} ${flags.join(' ')}`);
console.log('🚀 Test started...');

// Spawn test
const child = spawn('npx', ['playwright', 'test', '--', fullPath, ...flags], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

// Process events
child.on('spawn', () => console.log('📦 Child process spawned'));

child.on('error', (err) => {
  console.error(`❌ Error: ${err.message}`);
  process.exit(1);
});

child.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Test failed with exit code ${code}`);
  } else {
    console.log('✅ Test completed successfully');
  }
});

child.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ Process closed with exit code ${code}`);
  } else {
    console.log('✅ Process closed successfully');
  }
});
