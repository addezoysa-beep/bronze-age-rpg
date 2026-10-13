import {runRemedyScenario} from './browser-remedy-scenario.mjs';
import {runGripScenario} from './browser-grip-scenario.mjs';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { performance } from 'node:perf_hooks';
import {runPanScenario} from './browser-pan-scenario.mjs';
import {runCombatLockScenario} from './browser-combat-lock-scenario.mjs';
import {runFastTravelScenario} from './browser-fast-travel-scenario.mjs';
import {runPaidWagonScenario} from './browser-wagon-scenario.mjs';
import {runInteractionScenario} from './browser-interaction-scenario.mjs';
import { root, gameHash, sha256 } from './workflow.mjs';

const gameFile = resolve(root, 'dist/Wine-Dark-Sea-Combined-Cinematic.html');
const artifactHash = sha256(readFileSync(gameFile));
if(artifactHash!=='add0bd26bbef5aefabe610f120cd3ffdaebdfb3b43133d36b4b82528441ea16e')throw Error('Current combined browser candidate hash mismatch');
const output = resolve(root, 'verification/runtime');
mkdirSync(output, { recursive: true });
const report = { test: 'offline-browser-smoke', status: 'failed', buildSha256: artifactHash, sourceSha256: gameHash(), gameFile: 'dist/Wine-Dark-Sea-Combined-Cinematic.html',
  recordedAt: new Date().toISOString(), scope: 'Desktop startup, visible scene, input movement, manual save/reload, king quest, nested wagon-guide mouse choices, paid Ur travel and destination manual Save/reload. Does not accept a milestone.',
  environment: { viewport: '1365x768', offline: true }, pageErrors: [], externalRequests: [], checks: [] };
let browser;
let page;
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
  const preset = 'auto';
  report.environment.graphicsPreset = preset;
  await context.addInitScript(p => { localStorage.setItem('wine-dark-graphics28', p); }, preset);
  page = await context.newPage();
  // Software-rendered CI startup may exceed the default input timeout.
  page.setDefaultTimeout(180000);
  page.on('pageerror', error => report.pageErrors.push(error.message));
  page.on('request', request => { if (/^https?:/.test(request.url())) report.externalRequests.push(request.url()); });
  const start = performance.now();
  await page.goto(pathToFileURL(gameFile).href, { waitUntil: 'load', timeout: 60000 });
  await page.locator('#bnew').waitFor({ state: 'visible', timeout: 60000 });
  check('build-title', /Build 59/.test(await page.title()), await page.title());
  await page.locator('#bnew').click();
  await page.locator('#new-voyage30, [data-new]').first().click({ noWaitAfter: true });
  await page.waitForFunction(() => G.started && ['play', 'talk'].includes(STATE), null, { timeout: 180000 });
  for (let i = 0; i < 5; i++) {
    if (await page.evaluate(() => STATE === 'play')) break;
    await page.keyboard.press('Escape');
  }
  await page.waitForFunction(() => STATE === 'play');
  report.startupMs = Math.round(performance.now() - start);
  // Read an actual animation frame; no forced rendering or gameplay mutation.
  const frame = await page.evaluate(() => new Promise(resolveFrame => {
    requestAnimationFrame(() => {
      const canvas = document.getElementById('gl');
      const gl = canvas?.getContext('webgl2') || canvas?.getContext('webgl');
      if (!gl) return resolveFrame({ colors: 0, luminanceRange: 0, error: 'No WebGL context' });
      const width = gl.drawingBufferWidth, height = gl.drawingBufferHeight;
      const data = new Uint8Array(width * height * 4);
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
      const colors = new Set(); let min = 255, max = 0;
      for (let i = 0; i < data.length; i += 64) {
        colors.add(`${data[i] >> 4},${data[i + 1] >> 4},${data[i + 2] >> 4}`);
        const light = (data[i] + data[i + 1] + data[i + 2]) / 3;
        min = Math.min(min, light); max = Math.max(max, light);
      }
      resolveFrame({ colors: colors.size, luminanceRange: max - min, width, height, png: canvas.toDataURL('image/png') });
    });
  }));
  const { png, ...pixels } = frame;
  check('nonblank-canvas', pixels.colors > 16 && pixels.luminanceRange > 20, pixels);
  if (png?.startsWith('data:image/png;base64,')) writeFileSync(resolve(output, 'scene.png'), Buffer.from(png.split(',')[1], 'base64'));
  const before = await page.evaluate(() => ({ x: P.x, z: P.z }));
  await page.keyboard.down('w'); await page.waitForTimeout(1200); await page.keyboard.up('w');
  const after = await page.evaluate(() => ({ x: P.x, z: P.z }));
  check('movement', Number.isFinite(after.x + after.z) && Math.hypot(after.x - before.x, after.z - before.z) > 0.1, { before, after });
  await page.keyboard.press('Escape');
  const guideLayout = await page.evaluate(() => {
    const guide = document.querySelector('#pause [data-newguide]');
    return { insidePanel: Boolean(guide?.closest('#pause .win .bd')), overlayParagraphs: document.querySelectorAll('#pause > p').length };
  });
  check('pause-guide-layout', guideLayout.insidePanel && guideLayout.overlayParagraphs === 0, guideLayout);
  await page.waitForFunction(() => document.pointerLockElement === null);
  const graphics = await page.evaluate(() => ({preset:GRAPHICS28.preset,choices:document.querySelectorAll('[data-graphics-row28]').length,renderControls:['pq1','pq2','pq3'].filter(id=>document.getElementById(id)&&getComputedStyle(document.getElementById(id)).display!=='none').length}));
  check('automatic-graphics-and-single-menu',graphics.preset==='auto'&&graphics.choices===0&&graphics.renderControls===0,graphics);
  const saveHit = await page.locator('#psave').evaluate(button => {
    const r = button.getBoundingClientRect();
    const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    return { target: hit?.id || hit?.tagName, reachable: hit === button || button.contains(hit), pointerLocked: Boolean(document.pointerLockElement) };
  });
  check('pause-save-hit-target', saveHit.reachable && !saveHit.pointerLocked, saveHit);
  await page.locator('#psave').click({ timeout: 30000 });
  const saved = await page.evaluate(() => {
    const raw = localStorage.getItem(slotKey(SAVE_SLOT));
    return raw ? { slot: SAVE_SLOT, data: JSON.parse(raw) } : null;
  });
  check('manual-save', Boolean(saved?.data?.started && saved.data.pos && saved.data.savedAt), { slot: saved?.slot, position: saved?.data?.pos });
  await page.reload({ waitUntil: 'load' });
  await page.locator('#bnew').waitFor({ state: 'visible', timeout: 60000 });
  await page.locator('#bnew').click();
  await page.locator(`[data-load="${saved.slot}"]`).click({ noWaitAfter: true });
  await page.waitForFunction(() => G.started && ['play', 'talk'].includes(STATE), null, { timeout: 180000 });
  const restored = await page.evaluate(() => ({ x: P.x, z: P.z }));
  check('save-reload-position', Math.hypot(restored.x - saved.data.pos.x, restored.z - saved.data.pos.z) < 1e-6, { saved: saved.data.pos, restored });
  const scenario=process.env.WDS_SMOKE_SCENARIO || 'travel';
  report.scenario=scenario;
  if(scenario==='pan')await runPanScenario(page,check);
  else if(scenario==='remedy')await runRemedyScenario(page,check);
  else if(scenario==='grip')await runGripScenario(page,check,output);
  else if(scenario==='lock')await runCombatLockScenario(page,check);
  else if(scenario==='travel'){
    await runInteractionScenario(page,check);
    await runPaidWagonScenario(page,check);
    await runFastTravelScenario(page,check);
  }else throw Error('Unknown checkpoint browser scenario: '+scenario);
  check('uncaught-exceptions', report.pageErrors.length === 0, report.pageErrors);
  check('offline-resources', report.externalRequests.length === 0, report.externalRequests);
  report.status = 'passed';
} catch (error) {
  report.error = error.message;
  process.exitCode = 1;
  if (page && !page.isClosed()) {
    await page.screenshot({ path: resolve(output, 'failure-scene.png'), timeout: 5000 }).catch(() => {});
    report.visibleControls = await page.locator('button:visible').allTextContents().catch(() => []);
    report.failureState = await page.evaluate(()=>({ready:window.WDS_READY33,state:typeof STATE==='undefined'?null:STATE,slot:typeof SAVE_SLOT==='undefined'?null:SAVE_SLOT,storageKeys:Object.keys(localStorage),savedSlots:typeof saveSummary==='function'?Array.from({length:SAVE_SLOTS},(_,i)=>({slot:i+1,summary:saveSummary(i+1),bytes:localStorage.getItem(slotKey(i+1))?.length||0})):null})).catch(error=>({diagnosticError:error.message}));
  }
}
finally {
  await browser?.close();
  writeFileSync(resolve(output, 'browser-smoke.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
}



