import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';
import {buildOffline} from './build-offline.mjs';
import {arrowRuntime} from './arrows-checkpoint.mjs';
const source=buildOffline(readFileSync(new URL('../index.html',import.meta.url))).toString();
function fixture(){
 const c=createContext({MATERIAL30:{wood:1,flint:1.12,copper:1.25,bronze:1.42,iron:1.8},arrowPrices48:{wood:6,flint:8,copper:14,bronze:24,iron:45},ITEMS:Object.fromEntries(['wood','flint','copper','bronze','iron'].map(m=>['arrows48_'+m,{p:0}])),
 VIEW:{},PH:{},G:{arrowMaterial30:'wood'},PROJ:[],itemModel55:()=>{},poseDrawBow:()=>{},poseHuman13:()=>{},tacticalTick14:()=>{},arrowGeometry30:m=>({material:m}),spawnProj:(kind,x,y,z,dx,dy,dz,speed,dmg,from)=>{c.PROJ.push({kind,from,dmg,m:{}})}});
 runInContext(arrowRuntime,c);return c;
}
test('tipped bundles cost at least five times wood and all existing shops read the updated price',()=>{
 const c=fixture();assert.equal(c.arrowPrices48.wood,6);for(const [mat,p]of Object.entries(c.arrowPrices48)){assert.equal(c.ITEMS['arrows48_'+mat].p,p);if(mat!=='wood')assert.ok(p>=30);}
 assert.ok(c.arrowPrices48.flint<c.arrowPrices48.copper&&c.arrowPrices48.copper<c.arrowPrices48.bronze&&c.arrowPrices48.bronze<c.arrowPrices48.iron);
});
test('wooden arrow damage is reduced without weakening wooden melee weapons',()=>{
 const c=fixture();assert.equal(c.arrowDamageMultiplier63('wood'),.55);assert.equal(c.MATERIAL30.wood,1);assert.ok(c.arrowDamageMultiplier63('flint')>2*c.arrowDamageMultiplier63('wood'));assert.match(source,/dmg\*\(mat\?arrowDamageMultiplier63\(mat\):1\)/);
});
test('wood geometry has a slender wooden point and flint has a stone head',()=>{
 const records=[];class Batch{cyl(...a){records.push(a);return this;}dquad(){return this;}mesh(){return{geometry:{records:[...records]}};}}
 const fn=source.split('\n').find(l=>l.startsWith('function arrowGeometry30('));
 const c=createContext({Batch,ARROW_GEOMETRY30:new Map(),METAL_COLORS:{bronze:'bronze'},K:{wood:'wood',bronze:'bronze',stoneD:'stone',cream:'cream'},PI:Math.PI,ACTOR_MAT:{}});runInContext(fn,c);
 const wood=c.arrowGeometry30('wood');assert.equal(wood.records[1][7],'wood');assert.equal(wood.records[1][4],.009);assert.equal(wood.records[1][5],.10);
 records.length=0;const stone=c.arrowGeometry30('flint');assert.equal(stone.records[1][7],'stone');assert.equal(stone.records[1][4],.025);
});
test('player nocks use selected ammo; NPC nocks retain their own ammo identity',()=>{
 const c=fixture(),player={userData:{bowRig:{arrow:{userData:{}}}}},npc={userData:{arrowMaterial63:'flint',bowRig:{arrow:{userData:{}}}}};c.VIEW.bow=player;
 c.poseDrawBow(player,.8);assert.equal(player.userData.bowRig.arrow.geometry.material,'wood');c.G.arrowMaterial30='iron';c.poseDrawBow(player,.8);assert.equal(player.userData.bowRig.arrow.geometry.material,'iron');
 c.poseDrawBow(npc,.8);assert.equal(npc.userData.bowRig.arrow.geometry.material,'flint');
});
test('NPC projectile material follows its actor and does not leak into other actors',()=>{
 const c=fixture();
 // The dynamic preexisting tactical function is captured during runtime registration.
 const c2=createContext({...c,tacticalTick14:(a)=>c2.spawnProj('arrow',0,0,0,0,0,1,30,20,'e'),spawnProj:(kind,x,y,z,dx,dy,dz,speed,dmg,from)=>c2.PROJ.push({kind,from,dmg,m:{}}),PROJ:[]});
 runInContext(arrowRuntime,c2);c2.tacticalTick14({arrowMaterial30:'wood',hum:{}});assert.equal(c2.PROJ.at(-1).arrowMaterial30,'wood');assert.equal(c2.PROJ.at(-1).dmg,11);
 c2.tacticalTick14({hum:{}});assert.equal(c2.PROJ.at(-1).arrowMaterial30,'bronze');assert.equal(c2.PROJ.at(-1).dmg,20);
});
