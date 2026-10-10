import { readJson, gameHash, updates } from './workflow.mjs';
const tracker = readJson('tracking/milestones.json');
const hash = gameHash();
console.log(`Game SHA-256: ${hash}`);
for (const m of tracker.milestones) {
  const passed = m.tests.filter(t => t.status === 'passed' && t.buildSha256 === hash).length;
  console.log(`${m.id} ${m.title}: ${m.status}; ${passed}/${m.tests.length} current-build acceptance tests passed`);
  console.log(`  Next: ${m.nextAction}`);
}
for (const u of updates().filter(u => u.buildSha256 === hash)) {
  console.log(`Update ${u.id}: delivery=${u.masterDelivery.status}, review=${u.masterReview.status}, release=${u.releaseStatus}`);
}
