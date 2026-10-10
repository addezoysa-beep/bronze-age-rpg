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
const start = source.indexOf('function packRole29(e)');
const end = source.indexOf('const packWolf29Before=', start);
assert.ok(start >= 0 && end > start, 'Final pack scheduler remains inspectable');
const packCode = source.slice(start, end);

function fixture(size) {
  const moves = [];
  const enemies = Array.from({ length: size }, (_, index) => ({
    id: index, alive: true, area: 'over', kind: 'kobalos', friendly: false,
    x: Math.sin(index * Math.PI * 2 / size) * 3,
    z: Math.cos(index * Math.PI * 2 / size) * 3,
    combat: false, dash26: null, kob26: { phase: 'close' }, cd: 1
  }));
  const context = createContext({
    REV29: { packAt: -1, packs: new Map() }, ENEMIES: enemies,
    AREA: 'over', P: { x: 0, z: 0, yaw: 0 }, T_NOW: 10,
    Math, TAU: Math.PI * 2, floor: Math.floor, ceil: Math.ceil,
    hyp: Math.hypot, sin: Math.sin, cos: Math.cos,
    faceHash: value => Number(value), mobKey: enemy => enemy.id,
    wolfMove25: () => {}, kobMove26: enemy => moves.push(enemy.id)
  });
  new Script(`${packCode};globalThis.role=packRole29;globalThis.approach=packApproach29;`).runInContext(context);
  return { enemies, moves, role: enemy => context.role(enemy), approach: enemy => context.approach(enemy, .016) };
}

for (const size of [8, 10]) {
  test(`${size}-actor Kobaloi pack makes every actor attack-capable`, () => {
    const f = fixture(size);
    const roles = f.enemies.map(f.role);
    assert.equal(roles.filter(role => role.attack).length, size);
    assert.ok(roles.every(role => role.attackCap === size));
    const handled = f.enemies.map(f.approach);
    assert.ok(handled.every(result => result === false));
    assert.ok(f.enemies.every(enemy => enemy.packRole29 === 'committed attacker'));
    assert.deepEqual(f.moves, []);
  });
}

test('packs above ten retain a ten-attacker ceiling and relief ring', () => {
  const f = fixture(12);
  const roles = f.enemies.map(f.role);
  assert.equal(roles.filter(role => role.attack).length, 10);
  assert.ok(roles.every(role => role.attackCap === 10));
  f.enemies.forEach(f.approach);
  assert.equal(f.enemies.filter(enemy => enemy.packRole29 === 'committed attacker').length, 10);
  assert.equal(f.enemies.filter(enemy => enemy.packRole29 === 'encircling').length, 2);
});
