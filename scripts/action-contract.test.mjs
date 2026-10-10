import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script, createContext } from 'node:vm';
const source=readFileSync(new URL('../index.html',import.meta.url),'utf8');
function kobFixture(phase,extra={}) {
 const code=source.match(/function kobFight26\(e,dt,d\)\{[\s\S]*?\n\}/)?.[0];
 assert.ok(code,'Original Kobalos action function remains inspectable');
 const hits=[],e={name:'fixture',home:{x:0},x:0,z:0,y:0,yaw:0,kob26:{phase,t:0,cd:0,count:1,side:1,index:0,yaw:0,move:{wind:.3,reach:2.5,damage:9,recover:.6},...extra}};
 const ctx=createContext({P:{x:0,z:2,y:0,melee:null},T_NOW:10,Math,abs:Math.abs,sin:Math.sin,cos:Math.cos,
 clamp:(v,a,b)=>Math.min(b,Math.max(a,v)),angDiff:(a,b)=>a-b,
 kobMove26:()=>{},enemySightLine:()=>true,startEvade26:()=>false,
 stepEvade26:()=>{},hurt:(n)=>hits.push(n)});
 new Script(code+';globalThis.fight=kobFight26;').runInContext(ctx);
 return {e,hits,ctx};
}
test('Canceled Kobalos feint returns to approach without damage',()=>{
 const {e,hits,ctx}=kobFixture('feint');
 ctx.fight(e,.23,2);
 assert.equal(e.kob26.phase,'close');assert.deepEqual(hits,[]);
});
test('A strike damages once during its action window',()=>{
 const {e,hits,ctx}=kobFixture('strike');
 ctx.fight(e,.13,2);ctx.fight(e,.1,2);
 assert.deepEqual(hits,[9]);ctx.fight(e,.11,2);assert.equal(e.kob26.phase,'recover');
});
test('An out-of-range windup aborts without damage',()=>{
 const {e,hits,ctx}=kobFixture('wind');
 ctx.fight(e,.35,10);assert.equal(e.kob26.phase,'recover');assert.deepEqual(hits,[]);
});
test('Anatomical hand assignment is idempotent and routes bow/shield left',()=>{
 const code=source.match(/function anatomicalHands59\(h\)\{[\s\S]*?return h;\}/)?.[0];
 assert.ok(code);
 const hand=id=>({id,add(item){item.parent=this;}});
 const oldLeft=hand('physical-right'),oldRight=hand('physical-left');
 const h={_rig13:true,armL:{userData:{}},armR:{userData:{}},hand:oldRight,handL:oldLeft,
 W:{spear:{},bow:{}},shield:{}};
 const ctx=createContext({PH:null,LEFT_RIG:null});
 new Script(code+';globalThis.assign=anatomicalHands59;').runInContext(ctx);
 ctx.assign(h);
 assert.equal(h.hand,oldLeft);assert.equal(h.W.spear.parent,h.hand);
 assert.equal(h.W.bow.parent,h.handL);assert.equal(h.shield.parent,h.handL);
 const right=h.armR;ctx.assign(h);assert.equal(h.armR,right);
});
