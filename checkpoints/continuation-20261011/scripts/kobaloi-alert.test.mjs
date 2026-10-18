import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Script, createContext } from 'node:vm';
import { buildOffline, candidateHash } from './build-offline.mjs';
import { root, sha256 } from './workflow.mjs';

const game = buildOffline(readFileSync(resolve(root, 'index.html')));
assert.equal(sha256(game), candidateHash);
const source = game.toString('utf8');
const start = source.indexOf('const KOB_ALERT45=');
const end = source.indexOf('/* Looted horns', start);
assert.ok(start >= 0 && end > start, 'Final Kobaloi alert wrapper remains inspectable');
const alertCode = source.slice(start, end);

function fixture({ blocked = false } = {}) {
  const calls = { base: 0, fx: 0, tone: 0, toast: 0 };
  const P = { x: 3, z: 4 };
  const caller = { id: 'caller', kind: 'kobalos', alive: true, friendly: false, area: 'over', x: 0, y: 0, z: 0, h: 1.7, yaw: 0, suspicion: 1 };
  const near = { id: 'near', kind: 'kobalos', alive: true, friendly: false, area: 'over', x: 10, y: 0, z: 0, h: 1.7, state: 'idle', suspicion: 0 };
  const far = { id: 'far', kind: 'kobalos', alive: true, friendly: false, area: 'over', x: 40, y: 0, z: 0, h: 1.7, state: 'idle', suspicion: 0 };
  const other = { id: 'other', kind: 'wolf', alive: true, friendly: false, area: 'over', x: 8, y: 0, z: 0, h: 1.2, state: 'idle', suspicion: 0 };
  const context = createContext({
    P, ENEMIES: [caller, near, far, other], T_NOW: 100, Math,
    hyp: Math.hypot, lerp: (x, y, t) => x + (y - x) * t,
    clamp: (v, lo, hi) => Math.min(hi, Math.max(lo, v)),
    angDiff: (x, y) => Math.atan2(Math.sin(x - y), Math.cos(x - y)),
    heightAt: () => 0, colBlocked: () => blocked, dgLOS: () => !blocked,
    mobKey: e => e.id, enemySightLine: () => true,
    fxBurst22: () => calls.fx++, tone: () => calls.tone++, toast: () => calls.toast++,
    kobFight26: () => calls.base++
  });
  new Script(`${alertCode};globalThis.callPack=kobAlertPack45;globalThis.active=kobAlertActive45;globalThis.fight=kobFight26;`).runInContext(context);
  return { context, calls, caller, near, far, other };
}

test('yell has a readable windup and alerts only eligible nearby Kobaloi', () => {
  const f = fixture();
  f.context.fight(f.caller, .01, 5);
  assert.ok(f.caller.kobYell45);
  assert.equal(f.calls.base, 0);
  f.context.fight(f.caller, .50, 5);
  assert.equal(f.near.state, 'idle');
  f.context.fight(f.caller, .02, 5);
  assert.equal(f.near.state, 'chase');
  assert.equal(f.near.suspicion, 1);
  assert.equal(f.near._lastSeen.x, 3);
  assert.equal(f.near._lastSeen.z, 4);
  assert.equal(f.far.state, 'idle');
  assert.equal(f.other.state, 'idle');
  assert.equal(f.calls.fx, 1);
  assert.equal(f.calls.tone, 2);
  assert.equal(f.calls.toast, 1);
});

test('terrain occlusion blocks propagation', () => {
  const f = fixture({ blocked: true });
  assert.equal(f.context.callPack(f.caller), 0);
  assert.equal(f.near.state, 'idle');
  assert.equal(f.calls.fx, 0);
});

test('alert target expires and receiver cooldown prevents an immediate chain', () => {
  const f = fixture();
  assert.equal(f.context.callPack(f.caller), 1);
  assert.equal(f.context.active(f.near), true);
  assert.equal(f.near.kobAlertReady45, 114);
  f.context.T_NOW = 111;
  assert.equal(f.context.active(f.near), false);
  assert.equal(f.near.kobAlert45, null);
  f.context.fight(f.near, .01, 5);
  assert.equal(f.near.kobYell45, undefined);
});

test('isolated caller does not yell', () => {
  const f = fixture();
  f.near.alive = false;
  f.context.fight(f.caller, .01, 5);
  assert.equal(f.caller.kobYell45, undefined);
  assert.equal(f.calls.base, 1);
});
