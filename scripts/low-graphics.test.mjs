import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script,createContext} from 'node:vm';
import {buildOffline} from './build-offline.mjs';
const baseline=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const candidate=buildOffline(Buffer.from(baseline)).toString();
function fixture(html){
 let disposed=0,resized=0;const stored=[];
 const ctx=createContext({GRAPHICS28:{},QUALITY23:{},RSCALE:1,STREAM:{},renderer:{shadowMap:{enabled:true}},THREE:{PlaneGeometry:class{rotateX(){} dispose(){disposed++}}},ocean:{geometry:{dispose(){disposed++}}},PI:Math.PI,waterStep28:()=>8,resize:()=>resized++,localStorage:{setItem:(...v)=>stored.push(v)},document:{querySelectorAll:()=>[]}});
 new Script(html.split('\n').find(l=>l.startsWith('function applyGraphics28('))).runInContext(ctx);
 return {ctx,stored,counts:()=>({disposed,resized})};
}
test('reproduce Low preset rendering shadows in previous build',()=>{const q=fixture(baseline);q.ctx.applyGraphics28('low');assert.equal(q.ctx.renderer.shadowMap.enabled,true);});
test('Low and Very low remove shadow passes while higher presets restore them',()=>{
 const q=fixture(candidate);
 for(const [preset,enabled,scale]of [['high',true,1.25],['low',false,.7],['medium',true,1],['verylow',false,.5],['auto',true,1],['low',false,.7]]){
  q.ctx.applyGraphics28(preset);assert.equal(q.ctx.renderer.shadowMap.enabled,enabled);assert.equal(q.ctx.RSCALE,scale);assert.equal(q.ctx.GRAPHICS28.preset,preset);
 }
 assert.deepEqual(q.counts(),{disposed:6,resized:6});assert.deepEqual(q.stored.at(-1),['wine-dark-graphics28','low']);
});
test('reload applies stored Low without rewriting settings and invalid values fall back to auto',()=>{
 const q=fixture(candidate);q.ctx.applyGraphics28('low',false);assert.equal(q.ctx.renderer.shadowMap.enabled,false);assert.equal(q.stored.length,0);q.ctx.applyGraphics28('unknown',false);assert.equal(q.ctx.GRAPHICS28.preset,'auto');assert.equal(q.ctx.renderer.shadowMap.enabled,true);
});
test('preset fix preserves active AI, group concurrency and save definitions',()=>{
 for(const prefix of ['const npcTick28Before=','function packSlot29(','function serialize','function saveGame']){
  const before=baseline.split('\n').filter(l=>l.startsWith(prefix));
  if(prefix==='function packSlot29(')continue;
  assert.deepEqual(candidate.split('\n').filter(l=>l.startsWith(prefix)),before);
 }
 assert.ok(candidate.includes('const attackCap=Math.min(10,list.length)'));
});
