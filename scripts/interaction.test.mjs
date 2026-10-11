import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script,createContext} from 'node:vm';
import {buildOffline} from './build-offline.mjs';
const baseline=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const production=buildOffline(Buffer.from(baseline)).toString();
function fixture(source=production){
 const nodes=new Map(),handlers=[],f={wolvesDone:1},events=[];
 const $=id=>{if(!nodes.has(id))nodes.set(id,{style:{},classList:{add(){},remove(){}},children:[],appendChild(b){this.children.push(b);},addEventListener(){},set innerHTML(v){this.children=[];},get innerHTML(){return ''}});return nodes.get(id);};
 const king={name:'King Ikarios'},palace={key:'ikarios',leader:king,guards:[]};
 const ctx=createContext({$,STATE:'play',NPCS:[king],PALACES16:[palace],DG:{def:{palace16:palace},art52:[{title:'Court art',text:'painting'}],court29:{residents:[]}},LOC:{king:{x:0,z:0},cave:{x:5,z:5}},F:()=>f,compass26:()=> 'north',giveItem:x=>events.push(x),hudQuest:()=>events.push('quest'),mapReveal13(){},sfx(){},document:{exitPointerLock:()=>events.push('unlock'),createElement:()=>({})},mouse:{l:true,r:true},keys:{KeyW:true,KeyE:true},once:{},addEventListener:(type,fn)=>handlers.push(fn),cancelDialogue(){},delete:undefined});
 const start=source.indexOf('const DLG={');
 const base=source.slice(start,source.indexOf('/* ---- shops ---- */',start));
 const kingLine=source.split('\n').find(l=>l.startsWith('const king26Before='));
 const artLine=source.split('\n').find(l=>l.startsWith('const artSay52Before='));
 const inputStart=source.indexOf("addEventListener('keydown',e=>{if(e.repeat)return;const c=e.code,was=STATE;");
 const input=source.slice(inputStart,source.indexOf("$('dlg').addEventListener",inputStart));
 new Script(base+'\nfunction kingTalk(){}\n'+kingLine+'\n'+artLine+'\n'+input+'\nglobalThis.dlg=DLG;').runInContext(ctx);
 return {ctx,nodes,king,f,events,handlers,$,press:code=>handlers[0]({code,repeat:false}),finish:()=>{while(ctx.dlg.i<ctx.dlg.lines.length-1)ctx.dlgAdvance();ctx.dlgAdvance();}};
}
test('reproduce original palace-art override swallowing king story completion',()=>{
 const q=fixture(baseline);q.ctx.kingTalk(q.king);q.finish();
 assert.equal(q.f.king,undefined);assert.equal(q.ctx.STATE,'talk');assert.ok(q.ctx.dlg.choices.length);
});
test('king princess story finishes after wolves, rewards once, and leaves optional art reachable',()=>{
 const q=fixture();q.ctx.kingTalk(q.king);q.finish();
 assert.equal(q.f.king,1);assert.equal(q.ctx.STATE,'play');assert.deepEqual(q.events.filter(x=>x==='silver:60'),['silver:60']);
 q.ctx.say(q.king.name,['Court matters'],null,[{t:'Other matters',go(){}}]);
 assert.ok(q.ctx.dlg.choices.some(c=>c.t==='Ask about the palace art'));
});
test('all dialogue including no-choice stories releases pointer lock and clears held input',()=>{
 const q=fixture();q.ctx.say('Story',['Line'],()=>{});
 assert.ok(q.events.includes('unlock'));assert.equal(q.ctx.mouse.l,false);assert.equal(q.ctx.mouse.r,false);assert.equal(q.ctx.keys.KeyW,false);assert.equal(q.ctx.keys.KeyE,false);
});
test('mouse selection starts a nested story in play state and finishes its callback',()=>{
 const q=fixture();let completed=0;
 q.ctx.say('Guide',['Choose'],null,[{t:'Story',go:()=>q.ctx.say('Guide',['Next'],()=>completed++)}]);
 q.$('dchoices').children[0].onclick({stopPropagation(){}});
 assert.equal(q.ctx.STATE,'talk');q.finish();assert.equal(completed,1);assert.equal(q.ctx.STATE,'play');
});
test('top-row and numpad options 1-9 dispatch once, including paid-wagon play-state gate',()=>{
 for(const code of ['Digit1','Digit4','Digit5','Digit9','Numpad3','Numpad5','Numpad9']){
  const q=fixture();const calls=[];
  q.ctx.say('Wagon master',['Departures'],null,Array.from({length:9},(_,i)=>({t:'Departure '+i,go:()=>{assert.equal(q.ctx.STATE,'play');calls.push(i);}})));
  q.press(code);assert.deepEqual(calls,[+code.slice(-1)-1]);
 }
});
test('number shortcuts do not select hidden choices before the last line',()=>{
 const q=fixture();let called=false;q.ctx.say('Guide',['First','Last'],null,[{t:'Travel',go:()=>called=true}]);q.press('Digit1');assert.equal(called,false);assert.equal(q.ctx.STATE,'talk');
});
test('cancellation does not award the king quest',()=>{
 const q=fixture();q.ctx.kingTalk(q.king);q.ctx.dlg.done=null;q.ctx.closeDlg();assert.equal(q.f.king,undefined);assert.equal(q.events.includes('silver:60'),false);
});
test('dialogue panel keeps long choice lists inside a scrolling viewport',()=>{
 assert.ok(production.includes('width:min(820px,94vw);max-height:85vh;overflow-y:auto;'));
});

test('NPC sleep wrapper preserves the previous dialogue through successive menu assignments',()=>{
 for(const source of [baseline,production]){
  const ctx=createContext({sleepingNPC48:()=>false,sleepReply48:()=> 'asleep'});
  new Script(source.split('\n').find(l=>l.startsWith('function guardSleepingTalk48'))).runInContext(ctx);
  const npc={talk:()=> 'original quest'};ctx.guardSleepingTalk48(npc);
  const first=npc.talk;npc.talk=()=>first();
  const second=npc.talk;npc.talk=()=>second();
  if(source===baseline)assert.throws(()=>npc.talk(),/call stack/);
  else{assert.equal(npc.talk(),'original quest');ctx.sleepingNPC48=()=>true;assert.equal(npc.talk(),'asleep');}
 }
});
