import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script, createContext } from 'node:vm';
import { buildOffline, candidateHash } from './build-offline.mjs';
import { root, sha256 } from './workflow.mjs';
import { resolve } from 'node:path';

const game = buildOffline(readFileSync(resolve(root, 'index.html')));
assert.equal(sha256(game), candidateHash);
const source = game.toString('utf8');
const section = (start, end) => {
  const a = source.indexOf(start), b = source.indexOf(end, a);
  assert.ok(a >= 0 && b > a, `Missing combat section: ${start}`);
  return source.slice(a, b);
};
const base = section('function kobFight26(e,dt,d)', 'function kobPose26(e)');
const moves = section('const KOB_MOVES26=', 'function kobMove26');
const crawl = section('const crawlFight26Before=kobFight26;', 'const crawlerPose26Before=');
const pack = source.split('\n').find(line => line.startsWith('const packKob29Before='));
const dread = section('const dreadFight44Before=kobFight26;', 'const dreadPose44Before=');

// Execute the actual final call chain. Stub world navigation/pack scheduling and
// perception; this verifies action/damage contracts, not full encounter behavior.
function fixture({ phase = 'strike', index = 0, distance = 1.5, yaw = 0, sight = true, dreadActor = false } = {}) {
  const hits = [];
  const P = { x: 0, y: 0, z: distance, vx: 10, vz: 10, guard: 0 };
  const context = createContext({ P, T_NOW: 10, Math, PI: Math.PI,
    clamp: (v, a, b) => Math.min(b, Math.max(a, v)),
    angDiff: (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b)),
    sin: Math.sin, cos: Math.cos, abs: Math.abs, hyp: Math.hypot,
    faceHash: () => 1, kobMove26: () => {}, enemySightLine: () => sight,
    startEvade26: () => false, stepEvade26: () => {},
    packApproach29: () => false, fxBurst22: () => {},
    hurt: damage => hits.push(damage)
  });
  new Script(`${moves}\n${base}\n${crawl}\n${pack}\n${dread}\n globalThis.fight=kobFight26;globalThis.moves=KOB_MOVES26;`).runInContext(context);
  const e = { x: 0, y: 0, z: 0, yaw: 0, name: 'fixture', home: { x: 0 }, dread44: dreadActor,
    kob26: { phase, t: 0, cd: 0, count: 1, side: 1, index, yaw, hit: false, move: context.moves[index] } };
  return { e, P, hits, step: dt => context.fight(e, dt, Math.hypot(P.x - e.x, P.z - e.z)) };
}

test('final Kobaloi chain cancels fifth-attack feint without damage', () => {
  const f = fixture({ phase: 'close' }); f.e.kob26.count = 4;
  f.step(.01); assert.equal(f.e.kob26.phase, 'feint');
  f.step(.23); assert.equal(f.e.kob26.phase, 'close');
  assert.equal(f.e.kob26.cd, .18); assert.deepEqual(f.hits, []);
});

test('three claw attacks wind up, hit once, and enter recovery', () => {
  for (const [index, damage] of [11, 15, 19].entries()) {
    const f = fixture({ phase: 'wind', index });
    f.step(f.e.kob26.move.wind); assert.equal(f.e.kob26.phase, 'strike');
    assert.deepEqual(f.hits, []);
    f.step(.13); f.step(.05); assert.deepEqual(f.hits, [damage]);
    f.step(.2); assert.equal(f.e.kob26.phase, 'recover');
  }
});

test('claw damage requires range, facing, vertical proximity, and sight', () => {
  for (const options of [{ distance: 4 }, { yaw: Math.PI }, { sight: false }, {}]) {
    const f = fixture(options); if (!Object.keys(options).length) f.P.y = 2;
    f.step(.13); assert.deepEqual(f.hits, []);
  }
});

test('crawl has a windup and a bounded pursuit timeout', () => {
  const f = fixture({ phase: 'close', distance: 5 }); f.e.kob26.count = 3;
  f.step(.01); assert.equal(f.e.kob26.phase, 'crawl_wind');
  f.step(.51); assert.equal(f.e.kob26.phase, 'crawl');
  f.step(2.81); assert.equal(f.e.kob26.phase, 'recover');
  assert.deepEqual(f.hits, []);
});

test('low strike hits once and slows player only on a successful hit', () => {
  const f = fixture({ phase: 'low_strike' }); f.e.kob26.move = { damage: 17, recover: .85 };
  f.step(.17); f.step(.1); assert.deepEqual(f.hits, [17]); assert.equal(f.P.vx, 6.5);
  f.step(.2); assert.equal(f.e.kob26.phase, 'recover');
  const blocked = fixture({ phase: 'low_strike', sight: false });
  blocked.e.kob26.move = { damage: 17 }; blocked.step(.17);
  assert.deepEqual(blocked.hits, []); assert.equal(blocked.P.vx, 10);
});

test('dread leap hits once and leaves its damage window for recovery', () => {
  const f = fixture({ phase: 'dread_wind', dreadActor: true });
  f.e.kob26.move = { damage: 28, recover: .85 };
  f.step(.58); assert.equal(f.e.kob26.phase, 'dread_leap'); assert.deepEqual(f.hits, []);
  f.step(.26); f.step(.05); assert.deepEqual(f.hits, [28]);
  f.step(.2); assert.equal(f.e.kob26.phase, 'dread_recover');
  f.step(.86); assert.equal(f.e.kob26.phase, 'close');
});
