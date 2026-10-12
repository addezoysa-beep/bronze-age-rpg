import test from 'node:test';
import assert from 'node:assert/strict';
import {wildHerdsGrassRuntime,applyWildHerdsGrassCheckpoint} from './wild-herds-grass-checkpoint.mjs';

test('checkpoint applies once immediately before readiness',()=>{
 const source='<script>window.WDS_READY33=true;</script>',built=applyWildHerdsGrassCheckpoint(source);
 assert.match(built,/const WILD_HERD_SITES83=/);assert.equal((built.match(/window\.WDS_READY33=true;/g)||[]).length,1);
 assert.throws(()=>applyWildHerdsGrassCheckpoint(built),/Unexpected wild herd source/);
});
test('coverage is grouped and excludes desert riverlands',()=>{
 const regions=[...wildHerdsGrassRuntime.matchAll(/region:'([^']+)'/g)].map(m=>m[1]);
 assert.deepEqual(regions,['scythia','scythia','ithaca','sparta','troy']);
 assert.doesNotMatch(wildHerdsGrassRuntime,/region:'(?:egypt|mesopotamia|philistia|pharos)'/);
 assert.match(wildHerdsGrassRuntime,/I\.biome==='desert'/);
});
test('horses use existing taming, identity, and persistence contracts',()=>{
 assert.match(wildHerdsGrassRuntime,/WILD_HORSES16\.push\(a\)/);
 assert.match(wildHerdsGrassRuntime,/beginTame31\(a\)/);
 assert.match(wildHerdsGrassRuntime,/G\.world\.tamedHorses16/);
 assert.match(wildHerdsGrassRuntime,/G\.world\.wildHerds83/);
 assert.match(wildHerdsGrassRuntime,/rec83\.x=a\.x/);
});
test('routes and visuals have grounded safety and Low budgets',()=>{
 assert.match(wildHerdsGrassRuntime,/nearestIsle\(p\.x,p\.z\)!==I\.id/);
 assert.match(wildHerdsGrassRuntime,/colBlocked\(p\.x,p\.z,.7\)/);
 assert.match(wildHerdsGrassRuntime,/groundRouteStep\(a,tx,tz,1.45,dt,.55\)/);
 assert.match(wildHerdsGrassRuntime,/preset==='verylow'\?105/);
 assert.match(wildHerdsGrassRuntime,/preset==='verylow'\?70/);
});
