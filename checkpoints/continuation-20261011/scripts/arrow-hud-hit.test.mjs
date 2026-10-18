import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {arrowHudHitPatch} from './arrow-hud-hit-patch.mjs';
import {dragonAnatomyPatch} from './dragon-anatomy-patch.mjs';
const source=fs.readFileSync(new URL('../recovered/Cinematic-Lock-Lesson.html',import.meta.url),'utf8');
function harness(){
 const listeners={},stock={wood:4,bronze:3,flint:0};
 const c={G:{arrows:7,arrowStock30:stock,arrowMaterial30:'wood'},P:{dead:false,draw:0,crouch:true,melee:{w:'sword',variant:0}},STATE:'play',ARCHERY27:{phase:'idle'},REV29:{hitSkill:'onehand'},ammo30:()=>stock,selectArrow30(m){c.G.arrowMaterial30=m;},hudSilver(){},updHud(){},$:()=>null,addEventListener:(k,f)=>listeners[k]=f,toast:t=>c.notice=t,
 arrowImpact27(p,hit){if(c.throwImpact)throw Error('impact');if(c.REV29.hitSkill||c.P.melee)return false;hit.c.a.hp-=p.dmg;p.done27=true;return true;}};
 vm.createContext(c);vm.runInContext(arrowHudHitPatch,c);return{c,stock,listeners};
}
test('HUD selection wraps stocked types without consuming arrows or selecting empty stock',()=>{
 const {c,stock}=harness();assert.equal(c.cycleArrow114(1),true);assert.equal(c.G.arrowMaterial30,'bronze');c.cycleArrow114(1);assert.equal(c.G.arrowMaterial30,'wood');c.cycleArrow114(-1);assert.equal(c.G.arrowMaterial30,'bronze');assert.equal(c.G.arrows,7);assert.deepEqual(stock,{wood:4,bronze:3,flint:0});
});
test('arrow selection is blocked during draw, release, death and menus',()=>{
 for(const mutate of[c=>c.P.draw=.5,c=>c.ARCHERY27.phase='release',c=>c.P.dead=true,c=>c.STATE='talk']){const {c}=harness();mutate(c);assert.equal(c.cycleArrow114(1),false);assert.equal(c.G.arrowMaterial30,'wood');}
});
test('Alt-wheel and bracket controls switch ammunition without camera-wheel propagation',()=>{
 const {c,listeners}=harness();let stopped=0;listeners.wheel({altKey:true,deltaY:100,preventDefault(){},stopImmediatePropagation(){stopped++;}});assert.equal(c.G.arrowMaterial30,'bronze');assert.equal(stopped,1);listeners.keydown({code:'BracketRight',repeat:false,target:{tagName:'CANVAS'},preventDefault(){},stopImmediatePropagation(){}});assert.equal(c.G.arrowMaterial30,'wood');
});
test('crouched arrow damage clears stale melee restrictions and restores context exactly',()=>{
 const {c}=harness(),enemy={hp:50,d:{}},melee=c.P.melee,p={from:'p',dmg:12};assert.equal(c.arrowImpact27(p,{c:{type:'enemy',a:enemy}}),true);assert.equal(enemy.hp,38);assert.equal(c.REV29.hitSkill,'onehand');assert.equal(c.P.melee,melee);c.arrowImpact27(p,{c:{type:'enemy',a:enemy}});assert.equal(enemy.hp,38,'duplicate impact cannot damage twice');
});
test('projectile context is restored even if impact handler throws',()=>{
 const {c}=harness();c.throwImpact=true;assert.throws(()=>c.arrowImpact27({},{c:null}),/impact/);assert.equal(c.REV29.hitSkill,'onehand');assert.equal(c.P.melee.w,'sword');
});
test('actual delivered height/skill wrappers accept arrows independently of shooter elevation',()=>{
 for(const crouch of[false,true]){const c={P:{y:0,crouch,melee:{w:'sword'}},G:{},REV29:{hitSkill:'onehand'},STATE:'play',ARCHERY27:{},hudSilver(){},updHud(){},$:()=>null,addEventListener(){},toast(){},practice29:(skill,n)=>{c.practiced=skill;},dmgEnemy(e,d){e.hp-=d;},arrowImpact27(p,hit){c.dmgEnemy(hit.c.a,p.dmg);}};vm.createContext(c);
 for(const prefix of['const dmg29Before=dmgEnemy;','const arrowImpact29Before=arrowImpact27;']){const start=source.indexOf(prefix);vm.runInContext(source.slice(start,source.indexOf('\n',start)),c);}
 vm.runInContext(arrowHudHitPatch,c);const e={kind:'human',y:10,h:1.8,hp:40,d:{}};c.arrowImpact27({from:'p',dmg:14},{c:{type:'enemy',a:e}});assert.equal(e.hp,26);assert.equal(c.practiced,'archery');assert.equal(c.REV29.hitSkill,'onehand');assert.equal(c.REV29.arrowPlayer,false);
 }
});
test('dragon wing construction executes actual Batch triangle/quad methods with valid colors',()=>{
 class Group{constructor(){this.children=[];this.userData={};this.position={set(){}};this.rotation={};}add(x){this.children.push(x);}}
 const c={THREE:{Group},hx:()=>[.3,.4,.5],sh:c=>c,K:{bone:[.9,.8,.7],gold:[1,.8,.1],black:[0,0,0]},PI:Math.PI,hyp:Math.hypot,spawnDragon(){},quadrupedPose(){}};
 vm.createContext(c);const start=source.indexOf('class Batch{'),end=source.indexOf(' tbox(',start);
 vm.runInContext(source.slice(start,end)+`cyl(...a){if(!Array.isArray(a[7]))throw Error('bad cylinder color');return this;}ball(...a){if(!Array.isArray(a[4]))throw Error('bad ball color');return this;}};globalThis.Batch=Batch;`,c);
 c.animalPart=f=>{const b=new c.Batch();f(b);for(const v of [...b.p,...b.c])assert.ok(Number.isFinite(v));return new Group();};c.anatomyLoft=()=>{};c.shapedLeg=()=>{const g=new Group();g.userData.knee=new Group();return g;};vm.runInContext(dragonAnatomyPatch,c);const model=c.makeDragon();assert.equal(model.userData.dragonRig.wings.length,2);assert.equal(model.userData.dragonRig.legs.length,4);
});
test('all continuation mesh palette references exist or specify an explicit fallback',()=>{
 const start=source.indexOf('const K0='),end=source.indexOf('const sh=',start),palette=source.slice(start,end),known=new Set([...palette.matchAll(/\b(\w+):0x/g)].map(m=>m[1]));
 for(const file of fs.readdirSync(new URL('./',import.meta.url)).filter(f=>f.endsWith('-patch.mjs'))){const code=fs.readFileSync(new URL(file,import.meta.url),'utf8');for(const m of code.matchAll(/\bK\.(\w+)/g)){const suffix=code.slice(m.index+m[0].length);assert.ok(known.has(m[1])||/^\s*\|\|/.test(suffix),file+' references undefined K.'+m[1]);}}
});
