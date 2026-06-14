---
name: run-portfolio-v2
description: Build, run, and drive portfolio-v2. Use when asked to start the app, run the dev server, take a screenshot of the UI, interact with the running portfolio, or verify a change in the browser.
---

This is a Next.js 16 single-page portfolio site (React 19, Framer Motion, react-globe.gl / Three.js, Lenis smooth scroll, Tailwind 4). The agent path drives it via `driver.mjs` — a Playwright Chromium script located at `.claude/skills/run-portfolio-v2/driver.mjs`. No `chromium-cli` is available in this environment.

All paths below are relative to the repo root (`portfolio-v2/`).

## Prerequisites

Playwright Chromium browser must be installed once after `npm install`:

```bash
npx playwright install chromium
```

No additional system packages needed on macOS.

## Setup

```bash
npm install
npx playwright install chromium
```

## Run (agent path)

The driver starts the dev server automatically if nothing is listening on port 3000, then launches headless Chromium and performs the requested action. Screenshots land in `/tmp/portfolio-shots/`.

```bash
# Smoke test: navigate to /, screenshot, assert no real console errors
node .claude/skills/run-portfolio-v2/driver.mjs smoke

# Screenshot at a scroll offset
node .claude/skills/run-portfolio-v2/driver.mjs screenshot 400 hero-mid

# Scroll to y=800 and screenshot
node .claude/skills/run-portfolio-v2/driver.mjs scroll 800 below-fold

# Navigate to an arbitrary URL and screenshot
node .claude/skills/run-portfolio-v2/driver.mjs nav http://localhost:3000 home

# Check for real console errors (exits 1 if any found)
node .claude/skills/run-portfolio-v2/driver.mjs check-errors
```

| command | what it does |
|---|---|
| `smoke` | `goto /` → wait 2 s → screenshot → assert no errors → exit 0 |
| `screenshot [y] [name]` | goto `/` → scroll to y → screenshot → `/tmp/portfolio-shots/<name>.png` |
| `scroll <y> [name]` | same as screenshot but y is required |
| `nav <url> [name]` | goto url → screenshot → `/tmp/portfolio-shots/<name>.png` |
| `check-errors` | goto `/` → wait for networkidle → exit 1 if real errors found |

Screenshots → `/tmp/portfolio-shots/*.png`.
Dev server log → `/tmp/portfolio-dev.log`.
Dev server PID → `/tmp/portfolio-dev.pid`.

## Run (human path)

```bash
npm run dev   # → http://localhost:3000. Stop with Ctrl-C.
```

## Test

No test suite is configured. Lint only:

```bash
npm run lint
```

## Gotchas

- **Globe cloud-texture CORS error is noise.** The 3D globe loads an earth-clouds overlay from `unpkg.com/three-globe` via CDN. In headless Playwright, unpkg redirects with no CORS header, triggering a console error and an `ERR_FAILED`. The globe renders correctly without it. The driver filters these two strings out so `check-errors` doesn't false-positive.

- **Port 3000 may already be in use.** If another `next dev` is running, the new one will use 3001 and immediately exit, leaving only the 3000 server alive. The driver polls port 3000 — this is fine. Kill stale servers with `kill $(cat /tmp/portfolio-dev.pid)` or `pkill -f "next dev"` before restarting.

- **Lenis smooth scroll intercepts `window.scrollTo`.** The driver uses `page.evaluate(() => window.scrollTo(0, y))` which bypasses Lenis and jumps the real scroll position directly. This is intentional — Lenis's smooth easing would require a longer wait. For sections below the fold, pass a y value larger than 900 to clear the viewport.

- **First load is slow.** Next.js Turbopack compiles the globe component (Three.js) on first request — it can take 5–10 seconds. The driver waits 2 seconds after `domcontentloaded` before screenshotting. If you get a blank screenshot, add a longer `page.waitForTimeout(5000)` in the driver.

- **`chromium-cli` is not available in this environment.** The driver uses the project's own `playwright` dev dependency. Always require it via the project path: `node_modules/playwright`.

## Troubleshooting

- **`Cannot find module '.../node_modules/playwright'`**: Run `npm install` from the repo root, then `npx playwright install chromium`.
- **Dev server did not start within 60 s**: Check `/tmp/portfolio-dev.log` for errors. A common cause is a port conflict — kill existing servers first.
- **Blank screenshot**: The Three.js globe takes time. Add `await page.waitForTimeout(5000)` before the screenshot call in driver.mjs, or run `smoke` a second time (warm cache is faster).
