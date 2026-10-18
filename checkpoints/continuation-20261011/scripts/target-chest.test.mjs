import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {targetChestRuntime,applyTargetChestCheckpoint} from './target-chest-checkpoint.mjs';
import {buildOffline} from './build-offline.mjs';
const original=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const production=buildOffline(Buffer.from(original)).toString();
const line=(source,prefix)=>source.split('\n').find(l=>l.startsWith(prefix));
function fixture(){
 const events=[],states={};const f={events,BOSS:null,LOCK:null,STATE:'play',AREA:'over',P:{x:0,z:0},ENEMIES:[],hyp:Math.hypot,
 combatLockHostile62:e=>!!(e?.alive&&!e.friendly&&!e.trainingDummy&&e.area==='over'&&e.g?.visible!==false),enemySightLine:e=>e.sight!==false,
 toast:m=>events.push(m),gstate:id=>states[id]||={open:{},chests:{}},openChest:(dg,ch)=>{ch.open=true;events.push('opened');},
 IS:{troy:{cx:0,cz:0,rx:20,rz:20}},freeLandNear:(x,z)=>({x,z}),spawnEnemy:()=>{const e={alive:true};f.enemy=e;return e;},makeChestMesh:()=>({g:{position:{set(){}}},lid:{rotation:{}}}),groundY:()=>3,OVER:{add(){}},GUARD_CHESTS:[],INTS:[],survivalState(){},G:{world:{locks:{}}},lockId:(dg,ch)=>dg.id+':'+ch.idx};
 vm.createContext(f);return f;
}
const enemy=(name,x=5,extra={})=>({name,x,z:0,alive:true,area:'over',state:'chase',...extra});
test('reproduce original boss priority over a newly locked giant',()=>{const f=fixture();f.BOSS=enemy('dragon',100);f.LOCK=enemy('giant');assert.equal(vm.runInContext('BOSS&&BOSS.alive?BOSS:LOCK',f).name,'dragon');});
test('locked giant owns health bar and distant dragon clears',()=>{const f=fixture();vm.runInContext(targetChestRuntime,f);f.BOSS=enemy('dragon',100);f.LOCK=enemy('giant');assert.equal(f.healthBarTarget72(),f.LOCK);assert.equal(f.BOSS,null);});
test('nearer engaged giant replaces nearby boss without requiring lock',()=>{const f=fixture();vm.runInContext(targetChestRuntime,f);f.BOSS=enemy('dragon',30);const giant=enemy('giant');f.ENEMIES=[f.BOSS,giant];assert.equal(f.healthBarTarget72(),giant);});
for(const [name,patch]of [['idle',{state:'idle'}],['dead',{alive:false}],['other area',{area:'cave'}],['friendly',{friendly:true}],['occluded',{sight:false}],['hidden',{g:{visible:false}}]])test(name+' boss does not pin health bar',()=>{const f=fixture();vm.runInContext(targetChestRuntime,f);f.BOSS=enemy('dragon',5,patch);f.ENEMIES=[f.BOSS];assert.equal(f.healthBarTarget72(),null);assert.equal(f.BOSS,null);});
test('menu and player death clear boss presentation',()=>{const f=fixture();vm.runInContext(targetChestRuntime,f);for(const state of ['map','pause','play']){f.STATE=state;f.P.dead=state==='play';f.BOSS=enemy('dragon');assert.equal(f.healthBarTarget72(),null);assert.equal(f.BOSS,null);}});
test('reproduce outdoor chest crash in original Egyptian override',()=>{const f=fixture();vm.runInContext(line(original,'const egyptChest58Before='),f);assert.throws(()=>f.openChest({id:'plains_troy'},{open:false}),/egyptPuzzle58/);});
test('ordinary giant chest interaction warns alive and opens after guardian dies',()=>{const f=fixture();vm.runInContext(line(production,'const egyptChest58Before=')+'\n'+targetChestRuntime+'\n'+line(production,'function giantGuard('),f);f.giantGuard('troy');const interaction=f.INTS[0],ch=f.GUARD_CHESTS[0].ch;interaction.act();assert.equal(ch.open,false);assert.match(f.events[0],/giant still guards/);assert.deepEqual(Object.keys(f.G.world.locks),[]);f.enemy.alive=false;interaction.act();assert.equal(ch.open,true);assert.equal(f.events.at(-1),'opened');assert.equal(Object.keys(f.G.world.locks).length,1);});
test('Egyptian sealed chest still respects lamps and sequence',()=>{const f=fixture();vm.runInContext(line(production,'const egyptChest58Before=')+'\n'+targetChestRuntime,f);const dg={id:'egypt',def:{egyptPuzzle58:true,special:'relic'},seqSw:{on:false}},ch={item:'relic',open:false};f.openChest(dg,ch);assert.equal(ch.open,false);assert.match(f.events[0],/three lamps/);dg.seqSw.on=true;f.openChest(dg,ch);assert.equal(ch.open,true);});
test('missing chest inputs return safely',()=>{const f=fixture();vm.runInContext(targetChestRuntime,f);assert.doesNotThrow(()=>f.openChest(null,null));assert.match(f.events[0],/nothing/);});
test('checkpoint fails closed against unexpected source',()=>assert.throws(()=>applyTargetChestCheckpoint('bad')));
