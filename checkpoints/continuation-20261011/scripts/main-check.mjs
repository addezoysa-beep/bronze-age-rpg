import { readJson, gameHash, updates, releaseErrors } from './workflow.mjs';
const tracker = readJson('tracking/milestones.json');
const hash = gameHash();
const matching = updates().filter(u => u.buildSha256 === hash);
if (!matching.some(u => releaseErrors(tracker, u, hash).length === 0)) {
  console.error('Main promotion blocked: no current-build update has accepted milestones and passed master review.');
  process.exitCode = 1;
}
