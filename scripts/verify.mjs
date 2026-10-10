import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { root, readJson, gameHash, updates, compileInlineScripts, validateTracker, validateUpdate } from './workflow.mjs';

try {
  const tracker = readJson('tracking/milestones.json');
  const hash = gameHash();
  const count = compileInlineScripts(readFileSync(resolve(root, 'index.html'), 'utf8'));
  const records = updates();
  const errors = [...validateTracker(tracker), ...records.flatMap(u => validateUpdate(u, tracker))];
  if (!records.some(u => u.buildSha256 === hash)) errors.push('Current game has no update record');
  if (errors.length) throw new Error(errors.join('\n'));
  const baseline = readJson('baseline/build-59.json');
  const report = { status: 'passed', buildSha256: hash, inlineScripts: count, milestones: tracker.milestones.length,
    updates: records.length, baselineUnchanged: hash === baseline.sourceSha256,
    bytes: readFileSync(resolve(root, 'index.html')).length, recordedAt: new Date().toISOString() };
  if (process.argv.includes('--record')) {
    mkdirSync(resolve(root, 'verification/runtime'), { recursive: true });
    writeFileSync(resolve(root, 'verification/runtime/repository-checks.json'), `${JSON.stringify(report, null, 2)}\n`);
  }
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  console.error(error.message); process.exitCode = 1;
}
