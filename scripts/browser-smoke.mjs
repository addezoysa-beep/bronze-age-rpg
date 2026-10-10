import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { performance } from 'node:perf_hooks';
import { root, gameHash } from './workflow.mjs';

const output = resolve(root, 'verification/runtime');
mkdirSync(output, { recursive: true });
const report = { test: 'offline-browser-smoke', status: 'failed', buildSha256: gameHash(),
  recordedAt: new Date().toISOString(), scope: 'Desktop startup, visible scene, input movement, manual save/reload only. Does not accept a milestone.',
  environment: { viewport: '1365x768', offline: true }, pageErrors: [], externalRequests: [], checks: [] };
let browser;
const check = (name, passed, detail) => {
  report.checks.push({ name, passed, detail });
  if (!passed) throw new Error(`${name}: ${JSON.stringify(detail)}`);
};
try {
  const module = process.env.PLAYWRIGHT_MODULE_PATH;
  const imported = await import(module ? pathToFileURL(resolve(module)).href : 'playwright');
  const { chromium } = imported.default || imported;
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH });
  report.environment.browser = await browser.version();
  const context = await browser.newContext({ viewport: { width: 1365, height: 768 }, offline: true });
  const page = await context.newPage();
  page.on('pageerror', error => report.pageErrors.push(error.message));
  page.on('request', request => { if (/^https?:/.test(request.url())) report.externalRequests.push(request.url()); });
  const start = performance.now();
  await page.goto(pathToFileURL(resolve(root, 'index.html')).href, { waitUntil: 'load', timeout: 60000 });
  await page.locator('#bnew').waitFor({ state: 'visible', timeout: 60000 });
  check('build-title', /Build 59/.test(await page.title()), await page.title());
  await page.locator('#bnew').click();
  await page.locator('#new-voyage30').click();
  await page.waitForFunction(() => G.started && ['play', 'talk'].includes(STATE), null, { timeout: 60000 });
  for (let i = 0; i < 5; i++) {
    if (await page.evaluate(() => STATE === 'play')) break;
    await page.keyboard.press('Escape');
  }
  await page.waitForFunction(() => STATE === 'play');
  report.startupMs = Math.round(performance.now() - start);
  await page.screenshot({ path: resolve(output, 'scene.png') });
  const png = await page.locator('#gl').screenshot();
  const pixels = await page.evaluate(async encoded => {
    const image = new Image(); image.src = `data:image/png;base64,${encoded}`; await image.decode();
    const canvas = new OffscreenCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0);
    const data = ctx.getImageData(0, 0, image.width, image.height).data;
    const colors = new Set(); let min = 255, max = 0;
    for (let i = 0; i < data.length; i += 64) {
      colors.add(`${data[i] >> 4},${data[i + 1] >> 4},${data[i + 2] >> 4}`);
      const light = (data[i] + data[i + 1] + data[i + 2]) / 3;
      min = Math.min(min, light); max = Math.max(max, light);
    }
    return { colors: colors.size, luminanceRange: max - min, width: image.width, height: image.height };
  }, png.toString('base64'));
  check('nonblank-canvas', pixels.colors > 16 && pixels.luminanceRange > 20, pixels);
  const before = await page.evaluate(() => ({ x: P.x, z: P.z }));
  await page.keyboard.down('w'); await page.waitForTimeout(1200); await page.keyboard.up('w');
  const after = await page.evaluate(() => ({ x: P.x, z: P.z }));
  check('movement', Number.isFinite(after.x + after.z) && Math.hypot(after.x - before.x, after.z - before.z) > 0.1, { before, after });
  await page.keyboard.press('Escape');
  await page.locator('#psave').click();
  const saved = await page.evaluate(() => {
    const raw = localStorage.getItem(slotKey(SAVE_SLOT));
    return raw ? { slot: SAVE_SLOT, data: JSON.parse(raw) } : null;
  });
  check('manual-save', Boolean(saved?.data?.started && saved.data.pos && saved.data.savedAt), { slot: saved?.slot, position: saved?.data?.pos });
  await page.reload({ waitUntil: 'load' });
  await page.locator('#bnew').waitFor({ state: 'visible', timeout: 60000 });
  await page.locator('#bnew').click();
  await page.locator(`[data-load="${saved.slot}"]`).click();
  await page.waitForFunction(() => G.started && ['play', 'talk'].includes(STATE), null, { timeout: 60000 });
  const restored = await page.evaluate(() => ({ x: P.x, z: P.z }));
  check('save-reload-position', Math.hypot(restored.x - saved.data.pos.x, restored.z - saved.data.pos.z) < 1, { saved: saved.data.pos, restored });
  check('uncaught-exceptions', report.pageErrors.length === 0, report.pageErrors);
  check('offline-resources', report.externalRequests.length === 0, report.externalRequests);
  report.status = 'passed';
} catch (error) { report.error = error.message; process.exitCode = 1; }
finally {
  await browser?.close();
  writeFileSync(resolve(output, 'browser-smoke.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
}
