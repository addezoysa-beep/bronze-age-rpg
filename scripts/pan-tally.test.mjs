import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {panTallyRuntime} from './pan-tally-checkpoint.mjs';
function fixture(){
 const f={WEIGHT:{},G:{inv:{}},flags:{cave:1,daedalus:0},world:{loot:{}},state:{chests:{}},DGS:{},AREA:'over',LOC:{cave:{x:1,z:2}},WEIGHT:{},hudQuest:()=>{},mainObjective13:()=>({t:'Daedalus'}),itemLabel:k=>k,makeBossRewardChest15:()=>{},daedalusTalk:()=>f.advanced=true,say:(name,lines)=>f.reply=lines};
 Object.assign(f,{F:()=>f.flags,livingState:()=>f.world,gstate:()=>f.state,putLoot:(id,x,z,area,items)=>f.world.loot[id]={items,claimed:false},lootEquipment:items=>{for(const[k,n]of Object.entries(items))f.G.inv[k]=(f.G.inv[k]||0)+n;}});
 vm.createContext(f);vm.runInContext(panTallyRuntime,f);return f;
}
const item='relic_pan_tally61',chest='chest:cave:100';
test('captain flag alone changes objective to actual chest item and prevents Daedalus continuation',()=>{const f=fixture();assert.match(f.mainObjective13().t,/chest/);f.daedalusTalk({name:'Daedalus'});assert.equal(f.advanced,undefined);assert.match(f.reply[0],/tablet/);assert.equal(f.G.inv[item],undefined)});
test('normal unclaimed chest gains one tablet while conserving heart',()=>{const f=fixture();f.world.loot[chest]={items:{heart:1},claimed:false};f.ensurePanTally61(chest);f.ensurePanTally61(chest);assert.equal(f.world.loot[chest].items[item],1);assert.equal(f.world.loot[chest].items.heart,1)});
test('physical acquisition advances route and blocks duplicated reward',()=>{const f=fixture();f.world.loot[chest]={items:{heart:0},claimed:true};f.ensurePanTally61(chest);f.lootEquipment({[item]:1});f.lootEquipment({[item]:1});assert.equal(f.G.inv[item],1);assert.equal(f.world.panTallyCollected61,true);f.world.loot[chest].items[item]=0;f.world.loot[chest].claimed=true;f.ensurePanTally61(chest);assert.equal(f.world.loot[chest].items[item],0);assert.equal(f.world.loot[chest].claimed,true);f.daedalusTalk({name:'Daedalus'});assert.equal(f.advanced,true);assert.equal(f.mainObjective13().t,'Daedalus')});
test('old opened chest migration adds tablet without reviving heart',()=>{const f=fixture();f.state.chests[100]=1;f.makeBossRewardChest15({id:'cave',bossPos:{x:10,z:20},def:{reward:'heart'}});assert.equal(f.world.loot[chest].items[item],1);assert.equal(f.world.loot[chest].items.heart,undefined)});
test('completed old Daedalus progression remains unblocked and no retroactive reward',()=>{const f=fixture();f.flags.daedalus=1;f.world.loot[chest]={items:{heart:0},claimed:true};f.ensurePanTally61(chest);assert.equal(f.world.loot[chest].items[item],undefined);f.daedalusTalk({name:'Daedalus'});assert.equal(f.advanced,true)});
test('unknown chest or uncleared cave grants nothing',()=>{const f=fixture();f.world.loot[chest]={items:{},claimed:false};f.flags.cave=0;f.ensurePanTally61(chest);assert.equal(f.world.loot[chest].items[item],undefined);f.flags.cave=1;f.ensurePanTally61('other');assert.equal(f.world.loot[chest].items[item],undefined)});
test('serialized receipt remains nonduplicating when reloaded',()=>{const f=fixture();f.lootEquipment({[item]:1});const save=JSON.parse(JSON.stringify({G:f.G,world:f.world}));const q=fixture();q.G=save.G;q.world=save.world;q.lootEquipment({[item]:1});assert.equal(q.G.inv[item],1);q.daedalusTalk({name:'Daedalus'});assert.equal(q.advanced,true)});
