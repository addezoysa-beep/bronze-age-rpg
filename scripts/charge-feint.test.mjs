import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script, createContext } from 'node:vm';
import { buildOffline } from './build-offline.mjs';

const source=buildOffline(readFileSync(new URL('../index.html',import.meta.url))).toString();
const runtime=source.slice(source.indexOf('const chargeFeint61Before='),source.indexOf('/* END BUILD48 MODULES */'));
function fixture(extra={}){
 const paths=[],damage=[],a={x:0,z:0,y:0,yaw:0,area:'over',alive:true,hum:{},_tactical14:{phase:'close',t:0,cd:0},...extra};
 const ctx=createContext({P:{x:0,z:6},AREA:'over',T_NOW:10,Math,hyp:Math.hypot,sin:Math.sin,cos:Math.cos,clamp:(x,l,h)=>Math.min(h,Math.max(l,x)),hash2:()=>.9,enemySightLine:()=>true,
 groundRouteStep:(e,x,z,speed,dt)=>{paths.push({x,z,speed,dt});const d=Math.hypot(x-e.x,z-e.z),f=Math.min(1,speed*dt/Math.max(d,.001));e.x+=(x-e.x)*f;e.z+=(z-e.z)*f;e._moving14=speed;},
 tacticalTick14:()=>{damage.push('delegated');}});
 new Script(runtime+';globalThis.tick=tacticalTick14;').runInContext(ctx);
 return {a,ctx,paths,damage,tick:(dt=.04,w='sword',ranged=false)=>ctx.tick(a,dt,w,12,3.3,ranged)};
}
test('committed charge visibly advances, pulls back, recovers and never delegates damage',()=>{
 const f=fixture();f.tick();assert.equal(f.a._tactical14.phase,'charge_feint');
 let max=0,retreated=false;
 for(let i=0;i<19;i++){const prev=f.a.z;f.tick();max=Math.max(max,f.a.z);retreated ||= f.a.z<prev;}
 assert.ok(max>.5);assert.ok(retreated);assert.deepEqual(f.damage,[]);
 assert.equal(f.a.hum._combatPose22,null);assert.equal(f.a._poseAttack14,null);
 f.tick();assert.equal(f.a.chargeFeint61,null);assert.equal(f.a._tactical14.phase,'close');assert.ok(f.a._tactical14.cd>=.4);
 assert.ok(f.a.chargeFeintReady61>f.ctx.T_NOW);f.tick();assert.deepEqual(f.damage,['delegated']);
});
test('blocked charge finishes without bypassing route collision or entering strike',()=>{
 const f=fixture();f.ctx.groundRouteStep=()=>{};
 for(let i=0;i<21;i++)f.tick();
 assert.equal(f.a.z,0);assert.equal(f.a.chargeFeint61,null);assert.deepEqual(f.damage,[]);
});
test('ranged, sparring, friendly, stunned, sleeping, dead, distant and unseen actors preserve existing AI',()=>{
 for(const extra of [{friendly:true},{spar22:true},{stun:.5},{sleeping:true},{alive:false},{dead:true},{area:'tomb'},{z:-15},{defense23:{t:0}}]){
  const f=fixture(extra);f.tick();assert.equal(f.a.chargeFeint61,undefined);assert.equal(f.damage.length,1);
 }
 const ranged=fixture();ranged.tick(.04,'bow',true);assert.equal(ranged.damage.length,1);
 const unseen=fixture();unseen.ctx.enemySightLine=()=>false;unseen.tick();assert.equal(unseen.damage.length,1);
});
test('stun interrupts a feint and clears its phase before normal AI resumes',()=>{
 const f=fixture();f.tick();f.a.stun=.5;f.tick();assert.equal(f.a.chargeFeint61,null);assert.equal(f.a._tactical14.phase,'close');assert.equal(f.damage.length,1);
});
test('hostile NPC rigs share the feint and use numeric sight height',()=>{
 const f=fixture({hum:undefined,h:{},hostile:true});let height;
 f.ctx.enemySightLine=a=>{height=a.h;return true;};f.tick();assert.equal(height,1.7);assert.ok(f.a.chargeFeint61);assert.equal(f.a.h._combatPose22,null);
});
test('large frame deltas cannot tunnel through the full feint',()=>{
 const f=fixture();f.tick(3);assert.equal(f.a.chargeFeint61.t,.06);assert.ok(f.paths.every(p=>p.dt<=.06));assert.deepEqual(f.damage,[]);
});
