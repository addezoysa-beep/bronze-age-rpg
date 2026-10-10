import { readFileSync, writeFileSync } from 'node:fs';
import { Script, createContext } from 'node:vm';
import { root, gameHash } from './workflow.mjs';

// Execute the actual source function with ten nearby, alive pack members.
// This isolates eligibility; it does not claim full in-game attack participation.
const source = readFileSync(`${root}/index.html`, 'utf8');
const code = source.match(/^function packRole29\(e\).*$/m)?.[0];
if (!code) throw new Error('packRole29 source not found');
const results = [];
for (const size of [8, 10]) {
  const enemies = Array.from({ length: size }, (_, id) => ({ id, kind: 'kobalos', alive: true, area: 'fixture', x: id / 10, z: 1 }));
  const context = createContext({ REV29: { packAt: -1, packs: new Map() }, T_NOW: 1,
    ENEMIES: enemies, AREA: 'fixture', P: { x: 0, z: 0 }, hyp: Math.hypot,
    faceHash: x => Number(x), mobKey: e => e.id, floor: Math.floor, TAU: Math.PI * 2 });
  new Script(`${code}; globalThis.roles = ENEMIES.map(packRole29);`).runInContext(context);
  const eligible = context.roles.filter(r => r.attack).length;
  results.push({ size, eligible, satisfiesSimultaneousEligibility: eligible === size });
}
const report = { test: 'pack-eligibility-source-fixture', buildSha256: gameHash(),
  status: results.every(r => r.satisfiesSimultaneousEligibility) ? 'passed' : 'failed',
  method: 'Actual packRole29 executed in VM with deterministic nearby Kobaloi fixtures; not browser gameplay acceptance', results };
writeFileSync(`${root}/verification/records/pack-limit-audit.json`, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (report.status === 'failed') process.exitCode = 1;
