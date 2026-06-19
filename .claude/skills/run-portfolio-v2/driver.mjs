#!/usr/bin/env node
/**
 * Driver for portfolio-v2. Uses the project's installed Playwright.
 *
 * Usage:
 *   node .claude/skills/run-portfolio-v2/driver.mjs [command] [args...]
 *
 * Commands:
 *   smoke              Navigate to / and take a screenshot (default)
 *   screenshot [y]     Screenshot at optional scroll offset y (px)
 *   scroll <y>         Scroll to y and screenshot
 *   nav <url>          Navigate to a URL and screenshot
 *   check-errors       Navigate to / and report any console errors
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { execSync, spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../..');   // portfolio-v2/
const SHOTS_DIR = '/tmp/portfolio-shots';
const DEV_URL = 'http://localhost:3000';
const DEV_PID_FILE = '/tmp/portfolio-dev.pid';
const DEV_LOG = '/tmp/portfolio-dev.log';

const require = createRequire(import.meta.url);
const { chromium } = require(path.join(ROOT, 'node_modules/playwright'));

fs.mkdirSync(SHOTS_DIR, { recursive: true });

// ── helpers ─────────────────────────────────────────────────────────────────

function isServerRunning() {
  try {
    execSync(`curl -sf ${DEV_URL} -o /dev/null`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function startServer() {
  if (isServerRunning()) return;
  console.log('Starting dev server...');
  const log = fs.openSync(DEV_LOG, 'w');
  const child = spawn('npm', ['run', 'dev'], {
    cwd: ROOT,
    detached: true,
    stdio: ['ignore', log, log],
  });
  child.unref();
  fs.writeFileSync(DEV_PID_FILE, String(child.pid));

  // Poll until ready (up to 60 s)
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 1000));
    if (isServerRunning()) { console.log('Server ready.'); return; }
  }
  throw new Error('Dev server did not start within 60 s. Check ' + DEV_LOG);
}

async function withPage(fn) {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  const errors = [];
  // Ignore known CORS noise from the globe's CDN cloud-texture fetch (visual renders fine).
  // Also filter the generic ERR_FAILED that accompanies the CDN CORS block.
  const IGNORED = ['unpkg.com/three-globe', 'earth-clouds.png', 'ERR_FAILED'];
  page.on('console', msg => {
    if (msg.type() === 'error' && !IGNORED.some(s => msg.text().includes(s)))
      errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  try {
    await fn(page, errors);
  } finally {
    await browser.close();
  }
}

function shotPath(name) {
  return path.join(SHOTS_DIR, name.endsWith('.png') ? name : name + '.png');
}

async function screenshot(page, scrollY, filename) {
  if (scrollY) await page.evaluate(y => window.scrollTo(0, y), Number(scrollY));
  // Wait for animations to settle a bit
  await page.waitForTimeout(2000);
  const dest = shotPath(filename || 'screenshot');
  await page.screenshot({ path: dest });
  console.log('Screenshot:', dest);
  return dest;
}

// ── commands ─────────────────────────────────────────────────────────────────

const [,, cmd = 'smoke', ...args] = process.argv;

await startServer();

if (cmd === 'smoke') {
  await withPage(async (page, errors) => {
    await page.goto(DEV_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await screenshot(page, 0, 'home');
    const title = await page.title();
    const h1 = await page.locator('h1').first().textContent().catch(() => 'n/a');
    console.log('Title:', title);
    console.log('H1:', h1);
    if (errors.length) {
      console.error('Console errors:', errors);
      process.exit(1);
    }
    console.log('OK — no console errors.');
  });

} else if (cmd === 'screenshot') {
  const [y, filename] = args;
  await withPage(async (page) => {
    await page.goto(DEV_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await screenshot(page, y || 0, filename || 'screenshot');
  });

} else if (cmd === 'scroll') {
  const [y, filename] = args;
  if (!y) { console.error('Usage: scroll <y> [filename]'); process.exit(1); }
  await withPage(async (page) => {
    await page.goto(DEV_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await screenshot(page, y, filename || `scroll-${y}`);
  });

} else if (cmd === 'nav') {
  const [url, filename] = args;
  if (!url) { console.error('Usage: nav <url> [filename]'); process.exit(1); }
  await withPage(async (page) => {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await screenshot(page, 0, filename || 'nav');
  });

} else if (cmd === 'check-errors') {
  await withPage(async (page, errors) => {
    await page.goto(DEV_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    if (errors.length) {
      console.error('Console errors found:');
      errors.forEach(e => console.error(' -', e));
      process.exit(1);
    }
    console.log('No console errors.');
  });

} else {
  console.error('Unknown command:', cmd);
  console.error('Commands: smoke | screenshot [y] [name] | scroll <y> [name] | nav <url> [name] | check-errors');
  process.exit(1);
}
