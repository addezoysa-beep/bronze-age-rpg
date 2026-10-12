import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script, createContext } from 'node:vm';

const source = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const lines = source.split('\n');

function sourceLine(prefix) {
  const matches = lines.filter(line => line.startsWith(prefix));
  assert.equal(matches.length, 1, `Expected one active source line for ${prefix}`);
  return matches[0];
}

function sourceSection(start, end) {
  const a = source.indexOf(start), b = source.indexOf(end, a);
  assert.ok(a >= 0 && b > a, `Expected source section ${start} ... ${end}`);
  return source.slice(a, b);
}

class Vec3 {
  constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; }
  clone() { return new Vec3(this.x, this.y, this.z); }
}

test('final movement wrapper leans the torso and drives opposing arm sway', () => {
  const code = sourceSection('const swayPose59Before=poseHuman13;', 'const viewHands59Before=updateViewPose;');
  const ik = [];
  const right = new Vec3(.2, 1, 0), left = new Vec3(-.2, 1, 0);
  const h = {
    _rig13: true,
    g: { visible: true, rotation: { y: 0 } },
    spine: { rotation: { x: 0, z: 0 } },
    pose22: { speed: 4, phase: Math.PI / 2 },
    _pose14: { right, left },
    armR: { id: 'right' }, armL: { id: 'left' }, W: {}
  };
  const P = { vx: 4, vz: 5, mode: 'foot' };
  const context = createContext({
    poseHuman13: () => {}, anatomicalHands59: () => {}, PH: h, P, LEFT_RIG: null,
    G: { hands: { left: 'fists' } }, THREE: { Vector3: Vec3 },
    armIK: (arm, target) => ik.push({ arm: arm.id, target }), closeGrip23: () => {},
    lerp: (a, b, t) => a + (b - a) * t,
    clamp: (v, a, b) => Math.min(b, Math.max(a, v)),
    sin: Math.sin, cos: Math.cos, hyp: Math.hypot, Math
  });
  new Script(`${code};globalThis.finalPose=poseHuman13;`).runInContext(context);
  context.finalPose(h, { w: 'spear', speed: 4, dt: .1 });
  assert.ok(h.spine.rotation.x > 0, 'forward velocity should lean the torso');
  assert.ok(h.spine.rotation.z < 0, 'lateral velocity should lean the torso');
  assert.equal(ik.length, 2);
  assert.equal(ik[0].arm, 'right');
  assert.equal(ik[1].arm, 'left');
  assert.ok(ik[0].target.z > right.z && ik[1].target.z < left.z,
    'arm targets should sway in opposing directions');
});

test('compact equipment HUD removes persistent slots without losing hand state', () => {
  const code = lines.filter(line => line.startsWith('hudSlots=function(){')).at(-1);
  assert.ok(code, 'Expected final compact HUD override');
  const el = { textContent: '' };
  const G = { peaceful16: false, weapon: 'sword', hands: { right: 'sword', left: 'shield' } };
  const context = createContext({
    G, $: id => id === 'slots' ? el : null,
    handItem22: side => G.hands[side], itemLabel: item => item.toUpperCase()
  });
  new Script(`${code};globalThis.renderSlots=hudSlots;`).runInContext(context);
  context.renderSlots();
  assert.equal(el.textContent, 'SWORD / SHIELD · R sheathe');
  G.weapon = 'fists'; G.hands = { right: 'fists', left: 'fists' };
  context.renderSlots();
  assert.equal(el.textContent, 'Hands free · R draw · I inventory');
});
