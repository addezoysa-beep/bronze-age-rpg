import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const sha256 = data => createHash('sha256').update(data).digest('hex');
export const readJson = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
export const gameHash = () => sha256(readFileSync(resolve(root, 'index.html')));
export const updates = () => readdirSync(resolve(root, 'tracking/updates'))
  .filter(name => name.endsWith('.json')).map(name => readJson(`tracking/updates/${name}`));

export function compileInlineScripts(html) {
  // This offline build contains classic raw-text script elements, without src.
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)];
  if (!scripts.length) throw new Error('No inline scripts found');
  scripts.forEach(([ , attributes, code], index) => {
    if (/\bsrc\s*=/i.test(attributes)) throw new Error('External script dependency');
    new Script(code, { filename: `index.html:inline-${index + 1}` });
  });
  return scripts.length;
}

export function validateTracker(tracker) {
  const errors = [];
  const milestones = tracker.milestones || [];
  const ids = new Set(milestones.map(m => m.id));
  if (ids.size !== milestones.length) errors.push('Duplicate milestone IDs');
  for (const id of ['M0', 'M1', 'M2', 'M3', 'M4', 'M5']) {
    if (!ids.has(id)) errors.push(`Missing ${id}`);
  }
  const testIds = new Set();
  const visiting = new Set();
  const visited = new Set();
  const visit = id => {
    if (visiting.has(id)) { errors.push(`Dependency cycle at ${id}`); return; }
    if (visited.has(id)) return;
    visiting.add(id);
    const m = milestones.find(item => item.id === id);
    for (const dep of m?.dependsOn || []) {
      if (!ids.has(dep)) errors.push(`${id}: unknown dependency ${dep}`);
      else visit(dep);
    }
    visiting.delete(id); visited.add(id);
  };
  for (const m of milestones) {
    if (!['planned', 'in_progress', 'code_inspected', 'runtime_verified', 'accepted'].includes(m.status)) {
      errors.push(`${m.id}: invalid status`);
    }
    if (!m.tests?.length) errors.push(`${m.id}: missing acceptance tests`);
    for (const t of m.tests || []) {
      if (testIds.has(t.id)) errors.push(`Duplicate test ${t.id}`);
      testIds.add(t.id);
      if (!['pending', 'passed', 'failed'].includes(t.status)) errors.push(`${t.id}: invalid status`);
      if (t.status === 'passed' && (!t.buildSha256 || !t.method || !t.evidence || !t.reviewer)) {
        errors.push(`${t.id}: passed without hash, method, evidence and reviewer`);
      }
    }
    visit(m.id);
  }
  return errors;
}

export function validateUpdate(update, tracker) {
  const errors = [];
  if (!update.id || !update.summary) errors.push('Update needs ID and summary');
  if (!/^[a-f0-9]{64}$/.test(update.buildSha256 || '')) errors.push('Invalid game SHA-256');
  if (!update.milestoneIds?.length) errors.push('Update needs affected milestones');
  for (const id of update.milestoneIds || []) {
    if (!tracker.milestones.some(m => m.id === id)) errors.push(`Unknown update milestone ${id}`);
  }
  if (!['pending', 'delivered', 'failed'].includes(update.masterDelivery?.status)) errors.push('Invalid delivery state');
  if (!['pending', 'passed', 'failed'].includes(update.masterReview?.status)) errors.push('Invalid master review state');
  if (update.masterDelivery?.status === 'delivered' && !update.masterDelivery.evidence) errors.push('Missing delivery evidence');
  if (update.masterReview?.status === 'passed' && (!update.masterReview.evidence || !update.masterReview.buildSha256)) {
    errors.push('Missing master review evidence/hash');
  }
  return errors;
}

export function localEvidenceExists(path) {
  if (typeof path !== 'string' || isAbsolute(path)) return false;
  const rel = relative(root, resolve(root, path));
  return !rel.startsWith('..') && existsSync(resolve(root, path));
}

export function releaseErrors(tracker, update, hash, evidenceExists = localEvidenceExists) {
  const errors = [...validateTracker(tracker), ...validateUpdate(update, tracker)];
  if (update.buildSha256 !== hash) errors.push('Update does not match current game');
  if (update.masterDelivery?.status !== 'delivered') errors.push('Master delivery pending or failed');
  if (update.masterReview?.status !== 'passed' || update.masterReview.buildSha256 !== hash) {
    errors.push('Current game needs passed master review');
  }
  const required = new Set(['M0']);
  const collected = new Set();
  const collect = id => {
    if (collected.has(id)) return;
    collected.add(id);
    required.add(id);
    for (const dep of tracker.milestones.find(m => m.id === id)?.dependsOn || []) collect(dep);
  };
  for (const id of update.milestoneIds || []) collect(id);
  for (const id of required) {
    const m = tracker.milestones.find(item => item.id === id);
    if (!m || m.status !== 'accepted') errors.push(`${id}: not accepted`);
    for (const test of m?.tests || []) {
      if (test.status !== 'passed') errors.push(`${test.id}: ${test.status}`);
      else {
        if (test.buildSha256 !== hash) errors.push(`${test.id}: stale build evidence`);
        if (!evidenceExists(test.evidence)) errors.push(`${test.id}: missing local evidence`);
      }
    }
  }
  if (required.has('M3') && tracker.requirements?.factions?.rosterApproval !== 'approved') {
    errors.push('Expanded faction roster not approved');
  }
  return [...new Set(errors)];
}
