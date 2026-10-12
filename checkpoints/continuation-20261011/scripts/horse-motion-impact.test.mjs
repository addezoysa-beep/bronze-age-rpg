import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {root} from './workflow.mjs';
import {applyHorseMotionImpactCheckpoint} from './horse-motion-impact-checkpoint.mjs';

const source=readFileSync(resolve(root,'index.html'),'utf8');
const built=applyHorseMotionImpactCheckpoint(source);

test('taming no longer requires a pre-purchased saddle',()=>{
  assert.doesNotMatch(built,/Bring a saddle before taming (a wild horse|this horse)/);
  assert.match(built,/rideable bareback/);
});
test('horse charge uses swept contact, direction, speed, and per-target cooldowns',()=>{
  assert.match(built,/segmentDistance79/);
  assert.match(built,/minSpeed:8\.5/);
  assert.match(built,/forward<\.55/);
  assert.match(built,/cooldown:1\.15/);
  assert.match(built,/clamp\(Math\.round\(8\+\(speed-HORSE_CHARGE79\.minSpeed\)\*2\.2\),12,30\)/);
});
test('charges damage hostile actors and route civilian impacts through law',()=>{
  assert.match(built,/dmgEnemy\(e,damage/);
  assert.match(built,/assaultNPC\(n,damage\)/);
  assert.match(built,/e\.friendly/);
});
test('horse gait articulates stance, swing, knees, hocks, and hooves',()=>{
  for(const term of ["'stand'","'walk'","'trot'","'gallop'",'flight','stance','knee','hock','hoof'])assert.ok(built.includes(term),term);
});
test('stable registration conserves money and grants one riding quilt',()=>{
  assert.match(built,/if\(G\.silver<40\)return toast/);
  assert.match(built,/G\.silver-=40/);
  assert.match(built,/G\.inv\.riding_quilt=Math\.max\(1,G\.inv\.riding_quilt\|\|0\)/);
});
test('load migration initializes registration defaults and clears transient impacts',()=>{
  assert.match(built,/continueHorse79Before=continueGame/);
  assert.match(built,/mountRegistration79\(\)/);
  assert.match(built,/HORSE_CHARGE79\.enemy\.clear\(\)/);
});
