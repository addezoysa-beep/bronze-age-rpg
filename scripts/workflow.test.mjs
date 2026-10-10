import test from 'node:test';
import assert from 'node:assert/strict';
import { releaseErrors, compileInlineScripts, validateTracker } from './workflow.mjs';

const hash = 'a'.repeat(64);
function fixture() {
  const milestones = Array.from({ length: 6 }, (_, i) => ({
    id: `M${i}`, status: 'accepted', dependsOn: i ? [`M${i - 1}`] : [],
    tests: [{ id: `TEST-${i}`, status: 'passed', buildSha256: hash, method: 'scenario', evidence: 'report.json', reviewer: 'Master Development' }]
  }));
  return { tracker: { milestones, requirements: { factions: { rosterApproval: 'approved' } } }, update: {
    id: 'test', summary: 'Test checkpoint', milestoneIds: ['M3'], buildSha256: hash,
    masterDelivery: { status: 'delivered', evidence: 'message-reference' },
    masterReview: { status: 'passed', buildSha256: hash, evidence: 'review-reference' }
  } };
}
const check = (tracker, update) => releaseErrors(tracker, update, hash, () => true);
test('Complete current-build evidence passes', () => {
  const { tracker, update } = fixture(); assert.deepEqual(check(tracker, update), []);
});
test('Pending master delivery and review cannot release', () => {
  const { tracker, update } = fixture(); update.masterDelivery.status = 'pending'; update.masterReview.status = 'pending';
  assert.ok(check(tracker, update).some(x => x.includes('delivery')));
  assert.ok(check(tracker, update).some(x => x.includes('review')));
});
test('Stale review and acceptance evidence cannot release', () => {
  const { tracker, update } = fixture(); update.masterReview.buildSha256 = 'b'.repeat(64);
  tracker.milestones[1].tests[0].buildSha256 = 'b'.repeat(64);
  assert.ok(check(tracker, update).some(x => x.includes('stale')));
  assert.ok(check(tracker, update).some(x => x.includes('review')));
});
test('Unaccepted prerequisite blocks dependent milestone', () => {
  const { tracker, update } = fixture(); tracker.milestones[2].status = 'in_progress';
  assert.ok(check(tracker, update).includes('M2: not accepted'));
});
test('Failed tests and missing reports block release', () => {
  const { tracker, update } = fixture(); tracker.milestones[3].tests[0].status = 'failed';
  assert.ok(check(tracker, update).includes('TEST-3: failed'));
  assert.ok(releaseErrors(tracker, update, hash, () => false).some(x => x.includes('missing local evidence')));
});
test('Unapproved expanded faction roster blocks M3', () => {
  const { tracker, update } = fixture(); tracker.requirements.factions.rosterApproval = 'pending';
  assert.ok(check(tracker, update).some(x => x.includes('roster')));
});
test('Dependency cycles and fabricated passed tests are rejected', () => {
  const { tracker } = fixture(); tracker.milestones[0].dependsOn = ['M3']; delete tracker.milestones[1].tests[0].reviewer;
  assert.ok(validateTracker(tracker).some(x => x.includes('cycle')));
  assert.ok(validateTracker(tracker).some(x => x.includes('passed without')));
});
test('Inline syntax errors and external script dependency are rejected', () => {
  assert.equal(compileInlineScripts('<script>let x = 1;</script>'), 1);
  assert.throws(() => compileInlineScripts('<script>let = ;</script>'));
  assert.throws(() => compileInlineScripts('<script src="https://example.com/x.js"></script>'));
});
