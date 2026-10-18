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
  assert.ok(a >= 0 && b > a, `Missing section: ${start}`);
  return source.slice(a, b);
};
const roster = section('const revSpawn60Before=spawnEnemy;', 'const battleCue59Before=');
const faction = section('const spawnFaction56Before=spawnEnemy;', 'const talkFaction56Before=');

test('tomb build guarantees explicit revenant archer and swordsman slots', () => {
  const DGS = { tomb: { spawns: [
    { id: 'grave36_0', kind: 'revenant36' },
    { id: 'grave36_1', kind: 'revenant36' },
    { id: 'other', kind: 'mummy' }
  ] } };
  const context = createContext({ DGS,
    buildDungeon: id => DGS[id], spawnEnemy: () => null, setWeapon: () => {},
    factionKind56: (f, a) => `faction56:${f}:${a}`
  });
  new Script(`${roster};globalThis.run=buildDungeon;`).runInContext(context);
  context.run('tomb');
  assert.equal(DGS.tomb.spawns[0].kind, 'faction56:oathkeepers:bow');
  assert.equal(DGS.tomb.spawns[1].kind, 'faction56:oathkeepers:sword');
  assert.equal(DGS.tomb.spawns[2].kind, 'mummy');
});

test('Oathkeeper archer and swordsman retain revenant identity and weapon contracts', () => {
  const equipped = [];
  const ARCHETYPES56 = {
    bow: { base: 'archer', w: 'bow', hp: 65, damage: 14, spd: 4.2, reach: 2 },
    sword: { base: 'robber', w: 'sword', hp: 86, damage: 19, spd: 4.2, reach: 2.7 }
  };
  const context = createContext({ ARCHETYPES56,
    FACTIONS56: { oathkeepers: { name: 'Barrow Oathkeepers', cloth: 0, trim: 0, lines: [] } },
    DUN: { tomb: { culture55: 'egypt' } }, DGS: {}, buildDungeon: () => null,
    factionKind56: (f, a) => `faction56:${f}:${a}`,
    THREE: { Mesh: class { constructor(geometry) { this.geometry = geometry; } } },
    ACTOR_MAT: {}, K: { red: [] }, hx: () => [], sh: value => value,
    Batch: class { dquad() { return this; } mesh() { return {}; } },
    anatomyLoft: () => {}, regionalShell48: () => {},
    weapon48: (w, culture, material) => ({ w, culture, material }),
    setWeapon: (_hum, weapon) => equipped.push(weapon),
    spawnEnemy: kind => ({ kind, area: 'tomb', id: kind, inventory: {},
      hum: { W: {}, hand: { add() {} }, spine: { add() {} }, head: { add() {} } },
      g: { scale: { set() {} } }, d: { w: 'sword' } })
  });
  new Script(`${faction};${roster};globalThis.spawn=spawnEnemy;`).runInContext(context);
  const bow = context.spawn('faction56:oathkeepers:bow', 1, 2, {});
  const sword = context.spawn('faction56:oathkeepers:sword', 3, 4, {});
  assert.equal(bow.kind, 'revenant36');
  assert.equal(bow.revenant36, true);
  assert.equal(bow.name, 'Grave Revenant Archer');
  assert.equal(bow.faction56, 'oathkeepers');
  assert.equal(bow.archetype56, 'bow');
  assert.equal(bow.d.w, 'bow');
  assert.equal(bow.d.ranged, true);
  assert.equal(bow.inventory.arrow_flint, 14);
  assert.equal(sword.kind, 'revenant36');
  assert.equal(sword.revenant36, true);
  assert.equal(sword.name, 'Grave Revenant Swordsman');
  assert.equal(sword.d.w, 'sword');
  assert.equal(sword.d.ranged, false);
  assert.equal(equipped.at(-3), 'bow');
  assert.deepEqual(equipped.slice(-2), ['sword', 'sword']);
});
