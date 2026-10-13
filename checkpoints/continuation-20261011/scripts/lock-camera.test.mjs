import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {lockCameraPatch} from './lock-camera-patch.mjs';
import {openingProgressionPatch} from './opening-progression-patch.mjs';
import {lawCinematicPatch} from './law-cinematic-patch.mjs';
import {troyDispositionPatch} from './troy-disposition-patch.mjs';
import {lionAnatomyPatch} from './lion-anatomy-patch.mjs';
import {dragonAnatomyPatch} from './dragon-anatomy-patch.mjs';
import {stableInscriptionPatch} from './stable-inscription-patch.mjs';
import {npcMountedChargePatch} from './npc-mounted-charge-patch.mjs';
import {labyrinthAntlerPatch} from './labyrinth-antler-patch.mjs';
import {rivalTentCampPatch} from './rival-tent-camp-patch.mjs';
import {seaFortPatch} from './sea-fort-patch.mjs';
import {handGripPatch} from './hand-grip-patch.mjs';
import {spearShieldPatch} from './spear-shield-patch.mjs';
import {oneHandCombatPatch} from './one-hand-combat-patch.mjs';
import {greatswordPosePatch} from './greatsword-pose-patch.mjs';
import {bowAmmoIdentityPatch} from './bow-ammo-identity-patch.mjs';
import {arrowSilhouettePricePatch} from './arrow-silhouette-price-patch.mjs';
import {ownedChestPatch} from './owned-chest-patch.mjs';
import {dogRestWakePatch} from './dog-rest-wake-patch.mjs';
import {dungeonAtmospherePatch} from './dungeon-atmosphere-patch.mjs';
import {storyCinematicsPatch} from './story-cinematics-patch.mjs';
import {feedbackMenuStablePatch} from './feedback-menu-stable-patch.mjs';
import {lockGateDecayPatch} from './lock-gate-decay-patch.mjs';
import {optionalPuzzlesPatch} from './optional-puzzles-patch.mjs';
import {arrowHudHitPatch} from './arrow-hud-hit-patch.mjs';
const source=fs.readFileSync(new URL('../recovered/Cinematic-Lock-Lesson.html',import.meta.url),'utf8');
const candidate=fs.readFileSync(new URL('../'+(process.env.WDS_CANDIDATE_FILE||'Wine-Dark-Sea-Combined-Cinematic.html'),import.meta.url),'utf8');
function harness(){
 const listeners={},events=[];
 const e={alive:true,area:'over',x:10,y:0,z:10,h:2,g:{visible:true},state:'chase'};
 const c={P:{x:0,y:0,z:0,mode:'foot',rollT:.3},G:{started:true},FIRST_PERSON:true,LOCK:e,BOSS:null,ENEMIES:[e],STATE:'play',AREA:'over',T_NOW:1,
  CAM:{yaw:0,pitch:0,manual:1},keys:{KeyQ:true},once:{KeyC:true,KeyQ:true},mouse:{l:true,r:true},document:{visibilityState:'visible'},
  hyp:Math.hypot,abs:Math.abs,angDiff:(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b)),clamp:(n,a,b)=>Math.max(a,Math.min(b,n)),groundY:()=>0,
  enemySightLine:e=>!e.occluded,warDisposition22:()=> 'hostile',addEventListener:(key,fn)=>{listeners[key]=fn;},
  updateCamera(){events.push({yaw:c.CAM.yaw,pitch:c.CAM.pitch,lock:c.LOCK})},openPause(){c.STATE='pause';return 'paused'},
  healthTargetEligible72:e=>c.combatLockHostile62(e)&&Math.hypot(e.x,e.z)<=48,
  healthTargetEngaged72:e=>c.healthTargetEligible72(e)&&e.state==='chase',healthBarTarget72:()=>null,
 };
 vm.createContext(c);
 const start=source.indexOf('const COMBAT_LOCK62='),end=source.indexOf('function selectCombatLock62',start);
 const selectionEnd=source.indexOf('cycleLock=function',end);
 const code=source.slice(start,selectionEnd).replace(/try\{const k=localStorage[\s\S]*?catch\(_\)\{\}/,'');
 vm.runInContext(code,c);vm.runInContext(lockCameraPatch,c);
 return {c,e,listeners,events};
}
test('all three delivered scripts compile',()=>{
 const scripts=[...candidate.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)].filter(m=>!/src\s*=/.test(m[1]));
 assert.equal(scripts.length,3);for(const m of scripts)new vm.Script(m[2]);
});
test('build preserves recovered bytes around the final addition',()=>{
 assert.equal(candidate.replace(lockCameraPatch+openingProgressionPatch+lawCinematicPatch+troyDispositionPatch+lionAnatomyPatch+dragonAnatomyPatch+stableInscriptionPatch+npcMountedChargePatch+labyrinthAntlerPatch+rivalTentCampPatch+seaFortPatch+handGripPatch+spearShieldPatch+oneHandCombatPatch+greatswordPosePatch+bowAmmoIdentityPatch+arrowSilhouettePricePatch+ownedChestPatch+dogRestWakePatch+dungeonAtmospherePatch+storyCinematicsPatch+feedbackMenuStablePatch+lockGateDecayPatch+optionalPuzzlesPatch+arrowHudHitPatch+'\n',''),source);
 assert.equal(crypto.createHash('sha256').update(source).digest('hex'),'bf1405897255eeba324ca3095b49cf972bd7184b1f5f060c3dec952377a04fa1');
});

function openingHarness(){
 const saved=[],spoken=[];
 const c={
  q:{stage:'intro',sheared:[],kills:[]},flags:{},G:{wolves:0},STATE:'play',DGS:{cave:{bossPos:{x:7,z:9}}},LOC:{cave:{x:1,z:2}},
  opening25(){return c.q;},F(){return c.flags;},livingState(){return c.living;},panTallyHeld61(){return (c.G.inv?.relic_pan_tally61||0)>0;},
  PAN_TALLY61:'relic_pan_tally61',PAN_CHEST61:'chest:cave:100',hudQuest(){},newGame(){c.q={stage:'intro',sheared:[],kills:[]};},
  continueGame(){},buildDungeon(){return 'built';},daedalusTalk(){c.progressed=true;},save(){saved.push(c.q.stage);},
  putLoot(id,x,z,area,items,label){c.living.loot[id]={x,z,area,items,label,claimed:false};},say(name,lines){spoken.push({name,lines});},
  living:{loot:{},panTallyCollected61:false},spoken,saved,Set,
 };
 vm.createContext(c);vm.runInContext(openingProgressionPatch,c);return c;
}
test('Lykos stage changes checkpoint once through the real HUD boundary',()=>{
 const c=openingHarness();c.hudQuest();assert.deepEqual(c.saved,[]);
 for(const stage of ['wool','wolves','done']){c.q.stage=stage;c.hudQuest();}
 assert.deepEqual(c.saved,['wool','wolves','done']);assert.equal(c.flags.wolvesDone,1);assert.equal(c.G.wolves,3);
 c.hudQuest();assert.deepEqual(c.saved,['wool','wolves','done']);
});
test('opening migration normalizes old arrays and completed flags without an autosave claim',()=>{
 const c=openingHarness();c.q={stage:'broken',sheared:['ewe','ewe',null],kills:null};c.flags.lykos=1;c.continueGame();
 assert.equal(c.q.stage,'wool');assert.deepEqual(Array.from(c.q.sheared),['ewe']);assert.deepEqual(Array.from(c.q.kills),[]);assert.deepEqual(c.saved,[]);
});
test('Daedalus cannot advance from a flag-only tablet and restores physical chest loot',()=>{
 const c=openingHarness();c.flags.cave=1;c.living.panTallyCollected61=true;c.daedalusTalk({name:'Daedalus'});
 assert.equal(c.progressed,undefined);assert.equal(c.spoken.length,1);assert.equal(c.living.panTallyCollected61,false);
 assert.equal(c.living.loot[c.PAN_CHEST61].items[c.PAN_TALLY61],1);assert.equal(c.living.loot[c.PAN_CHEST61].claimed,false);
 c.G.inv={[c.PAN_TALLY61]:1};c.daedalusTalk({name:'Daedalus'});assert.equal(c.progressed,true);
});
test('recovered Lykos callbacks cross the checkpoint HUD boundary after every mutation',()=>{
 for(const anchor of [
  "q.stage='wool';F().lykos=1;loanShears25();hudAll();hudQuest()",
  "G.training.stick=1;equipHand('stick_wood','right');activatePack25();hudAll()",
  "q.stage='done';F().wolvesDone=1;G.wolves=3;G.silver+=20;addXp(35);hudAll();hudQuest()",
 ])assert.ok(source.includes(anchor),anchor);
 assert.ok(source.includes("function activatePack25(){const q=opening25();resetOpeningPack25();q.kills=[];q.stage='wolves'"));
 assert.ok(source.includes("odyssey13State().activeQuest='main';hudQuest();}"));
});
function lawHarness(){
 const bodyClasses=new Set(),spoken=[],toasts=[],crimes=[];
 const guard={name:'Watch Guard',x:1,z:1,area:'over',dead:false,hostile:false,h:{g:{visible:true}}};
 const animal={kind:'sheep',x:2,z:2,hp:5,dead:false};
 const c={STATE:'play',AREA:'over',T_NOW:10,G:{silver:10,law:{bounty:40,heat:30},peaceful16:false},P:{x:0,z:0,mode:'foot',dead:false},NPCS:[guard],PASTORAL:[animal],SHEEP:[],WILD_HORSES16:[],SERVICES48:new Map([['village',{id:'village',x:0,z:0}]]),POLITIES36:new Map(),PALACES16:[],
  mouse:{l:false,r:false},document:{body:{classList:{add:k=>bodyClasses.add(k),remove:k=>bodyClasses.delete(k)}},head:{appendChild(){}},createElement:()=>({id:'',textContent:''}),exitPointerLock(){}},$:()=>null,
  lawState70(){return c.q;},lawKey70:n=>n.name,lawGuard70:n=>!n.dead,localRealm:()=>({I:{name:'Ikaria'}}),hyp:Math.hypot,groundRouteStep(){},
  say(name,lines,done,choices){spoken.push({name,lines,choices});c.STATE='talk';},toast:s=>toasts.push(s),arrest(){c.arrested=true;},
  closeDlg(){c.STATE='play';},cancelDialogue(){c.closeDlg();},lawSettle70(){c.G.law.bounty=0;},lawRefuse70(){c.refused=(c.refused||0)+1;},
  damageAnimal(a,d){a.hp-=d;if(a.hp<=0)a.dead=true;},witnessCrime:(k,v)=>crimes.push([k,v]),courtWeaponsDrawn26:()=>true,peaceful16(){c.G.peaceful16=true;},
  updatePlayer(){},populate:async()=>{},Set,Map,Number,Math,
  q:{phase:'pursuit',targets:{},warnings:{}},guard,animal,spoken,toasts,crimes,bodyClasses,
 };
 vm.createContext(c);vm.runInContext('let LAW_OFFER70=null;',c);vm.runInContext(lawCinematicPatch,c);return c;
}
test('cancelling a cinematic law offer resumes pursuit without becoming refusal',()=>{
 const c=lawHarness();vm.runInContext('lawOffer70(guard)',c);assert.equal(c.STATE,'talk');assert.equal(c.bodyClasses.has('lawcine91'),true);
 vm.runInContext('cancelDialogue()',c);assert.equal(c.refused,undefined);assert.equal(c.q.phase,'pursuit');assert.equal(c.q.reofferAt91,12);assert.equal(vm.runInContext('LAW_OFFER70',c),null);
});
test('insufficient-funds law choice conserves silver and remains surrender-safe',()=>{
 const c=lawHarness();vm.runInContext('lawOffer70(guard)',c);const pay=c.spoken.at(-1).choices[1];pay.go();
 assert.equal(c.G.silver,10);assert.equal(c.G.law.bounty,40);assert.equal(c.q.phase,'pursuit');assert.equal(c.STATE,'play');assert.equal(c.refused,undefined);
});
test('killing settlement livestock reports one witnessed fine event',()=>{
 const c=lawHarness();c.damageAnimal(c.animal,8);c.damageAnimal(c.animal,8);
 assert.deepEqual(c.crimes,[['killing household livestock',65]]);
});
test('settlement guard stop keeps choices visible and removes mechanical palace label',()=>{
 const c=lawHarness();c.G.law.bounty=0;c.updatePlayer(.25);const scene=c.spoken.at(-1);assert.match(scene.lines[0],/settled place/);assert.equal(scene.choices.length,2);
 assert.ok(lawCinematicPatch.includes("'Palace guards bar the armed approach'"));assert.equal(lawCinematicPatch.includes('safe to approach palace guards'),false);
});
function troyHarness(){
 const civilian={name:'Troad Vineyard Worker',role:'farm',hum:{},x:-200,z:0,area:'over',dead:false,hostile:false};
 const invader={name:'Achaean Siege Invader',role:'warrior',hum:{},x:-220,z:0,area:'over',alive:true,dead:false,hostile:true,combat:true,_tactical14:{}};
 const c={IS:{troy:{cx:0,cz:0}},AREA:'over',G:{world:{}},P:{},NPCS:[civilian,invader],ENEMIES:[],PARTY_TARGET20:invader,LOCK:invader,
  F:()=>c.faction,theatre29:a=>(a.area||'over')==='over'&&Math.hypot(a.x,a.z)<550,troop29:a=>!!a.hum,
  warSide22:a=>a.x<-160?'Achaea':'Troy',warDisposition22:a=>a.warProvoked22||c.faction.warside&&c.faction.warside!==c.warSide22(a)?'hostile':'neutral',
  npcThreatTick(){c.threatCalls=(c.threatCalls||0)+1;},updEnemy(){c.enemyCalls=(c.enemyCalls||0)+1;},Math,
  faction:{warside:null},civilian,invader,
 };
 vm.createContext(c);vm.runInContext(troyDispositionPatch,c);return c;
}
test('Troy theatre does not infer war allegiance for civilians and workers',()=>{
 const c=troyHarness();assert.equal(c.troop29(c.civilian),false);assert.equal(c.warSide22(c.civilian),null);
});
test('neutral Achaean siege troops clear stale hostility and player targeting',()=>{
 const c=troyHarness();c.npcThreatTick(.1);assert.equal(c.invader.warSide22,'Achaea');assert.equal(c.invader.hostile,false);assert.equal(c.invader.combat,false);assert.equal(c.PARTY_TARGET20,null);assert.equal(c.LOCK,null);
});
test('opposed or provoked Achaean troops remain hostile',()=>{
 const c=troyHarness();c.faction.warside='Troy';c.npcThreatTick(.1);assert.equal(c.invader.hostile,true);
 c.faction.warside=null;c.invader.warProvoked22=true;c.npcThreatTick(.1);assert.equal(c.invader.hostile,true);
});
test('lion checkpoint uses a purpose-built articulated rig instead of the canine rescale',()=>{
 assert.ok(lionAnatomyPatch.includes("return{g,body,spine:body,neck,head,jaw,tail,legs,kind:'lion',lion93:true}"));
 assert.ok(lionAnatomyPatch.includes('for(const[x,z]of[[-.36,.73],[.36,.73],[-.34,-.78],[.34,-.78]])'));
 assert.ok(lionAnatomyPatch.includes('q.jaw.rotation.x=charge?.34'));
 assert.equal(lionAnatomyPatch.includes('anatomCanine'),false);
});
test('dragon checkpoint replaces the static shell with bounded articulated anatomy',()=>{
 assert.ok(dragonAnatomyPatch.includes('CONTINUATION_DRAGON_ANATOMY_V1'));
 assert.ok(dragonAnatomyPatch.includes("dragonRig={g,body,neck,head,jaw,tail,legs,wings,kind:'dragon',dragon94:true}"));
 assert.ok(dragonAnatomyPatch.includes('spawnDragon=function'));
 assert.ok(dragonAnatomyPatch.includes('quadrupedPose=function'));
 assert.ok(dragonAnatomyPatch.includes("attack?.phase==='charge'"));
 assert.equal(dragonAnatomyPatch.includes("spawnEnemy('boar'"),false);
});
test('Ikaria stable placard becomes a diegetic horse-and-tally inscription',()=>{
 assert.ok(stableInscriptionPatch.includes('CONTINUATION_IKARIA_STABLE_INSCRIPTION_V1'));
 assert.ok(stableInscriptionPatch.includes("stableInscription96='horse-and-tally'"));
 assert.ok(stableInscriptionPatch.includes('paintHorseTally96(canvas)'));
 assert.equal(stableInscriptionPatch.includes('fillText'),false);
 assert.equal(stableInscriptionPatch.includes('IKARIA STABLE'),false);
});
function mountedChargeHarness(){
 const hits=[],horse={g:{visible:false,position:{set(){}},rotation:{y:0}}},e={alive:true,friendly:false,area:'over',x:0,z:0,yaw:Math.PI/2,d:{spd:5},hum:{},mountedRaider96:horse};
 const c={WeakMap,Map,Math,AREA:'over',STATE:'play',T_NOW:10,P:{x:1,z:0,dead:false},HORSE_CHARGE79:{minSpeed:8.5,cooldown:1.15},ENEMIES:[e],OVER:{add(){}},
  hyp:Math.hypot,sin:Math.sin,cos:Math.cos,clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),segmentDistance79:(px,pz,ax,az,bx,bz)=>Math.abs(pz),horseChargeDamage79:()=>20,
  hurt:(d,x,z,src)=>{hits.push([d,src]);return true;},makeHorse:()=>horse,hx:x=>x,horseBuild35(){},ensureMountedRaiders(){},updEnemy(){},continueGame(){},groundY:()=>0,quadrupedPose(){},mountedPose50(){},globalThis:null};
 c.globalThis=c;vm.createContext(c);vm.runInContext(npcMountedChargePatch,c);return{c,e,hits};
}
test('hostile NPC horse charge uses swept contact and a per-rider cooldown',()=>{
 const {c,e,hits}=mountedChargeHarness();assert.equal(c.npcHorseChargeSweep96(e,0,0,1,0,10),true);assert.equal(hits.length,1);
 assert.equal(c.npcHorseChargeSweep96(e,0,0,1,0,10),false);c.T_NOW=12;assert.equal(c.npcHorseChargeSweep96(e,0,0,1,0,10),true);assert.equal(hits.length,2);
});
test('friendly, slow and missed NPC mount contacts do no damage',()=>{
 const {c,e,hits}=mountedChargeHarness();e.friendly=true;assert.equal(c.npcHorseChargeSweep96(e,0,0,1,0,10),false);e.friendly=false;
 assert.equal(c.npcHorseChargeSweep96(e,0,0,1,0,4),false);c.P.z=3;assert.equal(c.npcHorseChargeSweep96(e,0,0,1,0,10),false);assert.equal(hits.length,0);
});
test('Labyrinth Initiates gain branched antler masks without inventing a faction',()=>{
 assert.ok(labyrinthAntlerPatch.includes('CONTINUATION_LABYRINTH_ANTLER_IDENTITY_V1'));
 assert.ok(labyrinthAntlerPatch.includes("e?.faction56==='labyrinth'"));
 assert.ok(labyrinthAntlerPatch.includes("'labyrinth-antler-'+e.archetype56"));
 assert.ok(labyrinthAntlerPatch.includes("for(const [y,out]of[[.37,.11],[.49,.14],[.60,.12]])"));
 for(const role of ['spear','sword','axe','greatsword','bow','sling'])assert.ok(labyrinthAntlerPatch.includes(role+':'));
 assert.equal(labyrinthAntlerPatch.includes('FACTIONS56.'+'new'),false);
});
test('rival field camp is a clearable eight-defender Retainer layout',()=>{
 assert.ok(rivalTentCampPatch.includes('CONTINUATION_RIVAL_TENT_CAMP_V1'));
 assert.ok(rivalTentCampPatch.includes("sitePoint56('scythia',.46,-.26)"));
 assert.ok(rivalTentCampPatch.includes("const roles98=['spear','bow','sword','axe','greatsword','sling','spear','bow']"));
 assert.ok(rivalTentCampPatch.includes("factionKind56('retainers',roles98[i])"));
 assert.ok(rivalTentCampPatch.includes("vis:()=>rivalCampState98().cleared"));
 assert.ok(rivalTentCampPatch.includes("if(!livingState().loot[id])putLoot"));
 assert.ok(rivalTentCampPatch.includes("RIVAL_CAMP98.enemies.some(e=>e.alive)"));
});
test('Watchtower sea fort has landing, ascent, finite ranged attacks and persistent gated loot',()=>{
 assert.ok(seaFortPatch.includes('CONTINUATION_WATCHTOWER_SEA_FORT_V1'));
 assert.ok(seaFortPatch.includes("mkDock('i7','Watchtower Fort Landing'"));
 assert.ok(seaFortPatch.includes('for(let i=0;i<6;i++)'));
 assert.ok(seaFortPatch.includes("for(let i=legacy.length;i<8;i++)"));
 assert.ok(seaFortPatch.includes("e.inventory.arrow_flint--"));
 assert.ok(seaFortPatch.includes("!enemySightLine(e)"));
 assert.ok(seaFortPatch.includes("vis:()=>seaFortState99().cleared"));
 assert.ok(seaFortPatch.includes("if(!livingState().loot[id])putLoot"));
});
test('Watchtower fort reuses a legacy garrison, tops up to eight, consumes arrows and clears once',()=>{
 const world={loot:{}},spawned=[],events=[],legacy=[
  {alive:true,area:'over',x:700,z:-560,d:{ranged:true,w:'bow',range:27},inventory:{}},
  {alive:true,area:'over',x:704,z:-558,d:{ranged:true,w:'bow',range:27},inventory:{}},
  {alive:true,area:'over',x:696,z:-557,d:{ranged:false,w:'sword',range:3},inventory:{}}
 ];
 const batch={box(){return this;}},c={Math,console,globalThis:null,IS:{i7:{cx:700,cz:-560}},K:{stoneD:1,stone:2,woodD:3,wood:4,gold:5},
  livingState:()=>world,populate:async()=>{},frame:()=>{},T_NOW:2,P:{x:700,z:-550},ENEMIES:legacy,INTS:[],OVER:{add(){}},INT_GRID16:{count:0},
  hyp:Math.hypot,TAU:Math.PI*2,sin:Math.sin,cos:Math.cos,heightAt:()=>4,groundY:()=>4,addFlat:()=>4,ibatch:()=>batch,
  mkDock:(...a)=>({args:a}),fortWall(){},addBridge(){},addRectRot(){},makeChestMesh:()=>({g:{position:{set(){}}},lid:{rotation:{x:0}}}),
  enemySightLine:()=>true,enemyAttack:e=>events.push(['attack',e]),factionKind56:(f,r)=>f+':'+r,
  spawnEnemy:(kind,x,z,opt)=>{const weapon=kind.split(':').at(-1),e={alive:true,area:'over',x,z,d:{ranged:['bow','sling'].includes(weapon),w:weapon,range:27},inventory:{},...opt};spawned.push(e);c.ENEMIES.push(e);return e;},
  DISCOVER(){},banner:(...a)=>events.push(['banner',...a]),save:()=>events.push(['save']),hudQuest(){},toast(){},putLoot(){},takeWorldLoot(){}
 };c.globalThis=c;vm.createContext(c);vm.runInContext(seaFortPatch,c);const fort=c.buildSeaFort99();
 assert.equal(fort.enemies.length,8);assert.equal(spawned.length,5);assert.equal(fort.dock.args[1],'Watchtower Fort Landing');
 const bow=fort.enemies.find(e=>e.d.ranged&&e.d.w==='bow');assert.equal(bow.inventory.arrow_flint,14);c.enemyAttack(bow);assert.equal(bow.inventory.arrow_flint,13);assert.equal(events.filter(e=>e[0]==='attack').length,1);
 for(const e of fort.enemies)e.alive=false;assert.equal(c.seaFortClear99(),true);assert.equal(world.seaFort99.cleared,true);assert.equal(events.filter(e=>e[0]==='banner').length,1);assert.equal(c.seaFortClear99(),true);assert.equal(events.filter(e=>e[0]==='banner').length,1);
});
test('shaft grip seats the handle and uses asymmetric finger/thumb opposition',()=>{
 class Vector3{constructor(x=0,y=0,z=0){Object.assign(this,{x,y,z});}applyQuaternion(){return this;}}
 const stub=()=>{},c={globalThis:null,THREE:{Vector3},closeGrip23:stub,setWeapon:stub,refreshWeapon:stub,syncLeftHand:stub,populate:async()=>{},PH:{W:{}},VIEW:null,LEFT_RIG:null,LEFT_VIEW:null,G:{hands:{}},NPCS:[],ENEMIES:[]};c.globalThis=c;vm.createContext(c);vm.runInContext(handGripPatch,c);
 const finger=()=>({f:{rotation:{x:0,z:0}},m:{rotation:{x:0}},tip:{rotation:{x:0}}}),palm={userData:{fingers:[finger(),finger(),finger(),finger()],thumb:{rotation:{x:0,y:0,z:0}}}};
 const source={visible:true,quaternion:{},position:{z:0,add(v){this.z+=v.z;}},userData:{gripKind100:'staff'}},arm={userData:{palm,wrist:{},side59:-1}};c.closeGrip23(arm,source);
 assert.equal(source.position.z,-.014);assert.equal(source.userData.gripSeat100,-.014);assert.equal(palm.userData.gripKind100,'staff');
 assert.notEqual(palm.userData.fingers[0].f.rotation.x,palm.userData.fingers[1].f.rotation.x);assert.ok(palm.userData.fingers.every(v=>v.f.rotation.x<0&&v.m.rotation.x<0&&v.tip.rotation.x<0));
 assert.equal(palm.userData.thumb.rotation.y,-.34);assert.equal(palm.userData.thumb.rotation.z,-.46);
 assert.ok(handGripPatch.includes("const seat=/^(stick|staff|spear|pole)$/.test(kind)?-.014:-.008"));assert.ok(handGripPatch.includes('LEFT_VIEW.userData.gripKind100'));
});
test('spear stance keeps shield forward and free hand braced through recovery',()=>{
 const c={globalThis:null,poseHuman13(){},clamp:(v,a,b)=>Math.max(a,Math.min(b,v))};c.globalThis=c;vm.createContext(c);vm.runInContext(spearShieldPatch,c);
 const idleShield=c.spearPose101(null,true),wind=c.spearPose101({t:.18,duration:.68,variant:1},true),hit=c.spearPose101({t:.34,duration:.68,variant:1},true),recovered=c.spearPose101({t:.68,duration:.68,variant:1},true),twoHand=c.spearPose101({t:.34,duration:.68,variant:1},false);
 assert.equal(idleShield.shield,true);assert.ok(idleShield.direction[1]>.9,'idle spear is upright');
 assert.ok(hit.right[2]>wind.right[2],'strike extends forward after wind-up');assert.ok(hit.left[2]>=idleShield.left[2],'shield remains forward during thrust');
 assert.ok(Math.abs(recovered.right[2]-idleShield.right[2])<.001,'recovery returns to idle seat');assert.ok(twoHand.left[2]>idleShield.left[2],'free hand braces forward on the shaft');
 assert.ok(spearShieldPatch.includes('gripCurl100(h.armL.userData.palm'));assert.ok(spearShieldPatch.includes("h.shield.rotation.set(-PI/2,-.08,.035)"));
});
test('sword dagger and axe retain six-form motion with final palm seating',()=>{
 const c={globalThis:null,poseHuman13(){},updateViewPose(){},closeGrip23(){},gripCurl100(){},clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),sin:Math.sin,PI:Math.PI,Set,PH:{},G:{hands:{}},P:{mode:'foot'},VIEW:null,LEFT_RIG:null,LEFT_VIEW:null};c.globalThis=c;vm.createContext(c);vm.runInContext(oneHandCombatPatch,c);
 const sword=c.oneHandLoad102('sword',{t:.5,duration:1,variant:2,side:'right'}),dagger=c.oneHandLoad102('dagger',{t:.5,duration:1,variant:0,side:'left'}),axe=c.oneHandLoad102('axe',{t:.5,duration:1,variant:1,side:'right'}),done=c.oneHandLoad102('axe',{t:1,duration:1,variant:1,side:'right'});
 assert.equal(sword.handle,-.08);assert.equal(dagger.handle,.03);assert.equal(axe.handle,-.035);
 assert.ok(axe.pitch>sword.pitch&&sword.pitch>dagger.pitch,'body load follows weapon weight');assert.ok(Math.abs(done.load)<1e-12,'recovery removes added load');
 assert.ok(source.includes('m.form54=m.air29||m.heavy22?2:serial%6'),'player retains six attack forms');
 assert.ok(source.includes('m.move54=COMBAT_FORMS54[m.form54]'),'forms retain their named move mapping');
 assert.ok(oneHandCombatPatch.includes('finalOneHandGrip102(h.armR,source,w)'));assert.ok(oneHandCombatPatch.includes('finalOneHandGrip102(VIEW.right'));
 assert.ok(oneHandCombatPatch.includes('LEFT_RIG?.visible'));assert.ok(oneHandCombatPatch.includes('LEFT_VIEW?.visible'));
});
test('greatsword keeps a final two-hand grip and regional commission path',()=>{
 assert.ok(greatswordPosePatch.includes('closeGrip23(right,source,-.08)'));
 assert.ok(greatswordPosePatch.includes("gripCurl100(arm.userData.palm,'greatsword'"));
 assert.ok(greatswordPosePatch.includes('finalGreatswordGrip103(VIEW.right,VIEW.left'));
 assert.ok(source.includes("if(key.startsWith('greatsword_')&&side!=='right')return toast('A greatsword uses both hands.')"));
 assert.ok(source.includes("if(w==='greatsword')q.left.copy(q.right).addScaledVector(q.rd,-.145)"));
 assert.ok(source.includes("const GREAT_CITIES71=new Set(['mycenae','sparta','ithaca','krete','troy','athens','egypt','pharos','mesopotamia','ur','tyre','phoenicia','alashiya'])"));
 assert.ok(source.includes("orders[id]={key,readyDay:G.day+1,price:offer.price};hudAll();save()"));
 assert.ok(source.includes("G.inv[order.key]=(G.inv[order.key]||0)+1;delete orders[id];hudAll();save()"));
});
test('nocked bow arrows use player selection and actual NPC ammunition stock',()=>{
 const c={globalThis:null,PH:{},G:{arrowMaterial30:'flint'},ENEMIES:[],NPCS:[],VIEW:null,actorBow27:h=>h.bow,poseDrawBow(){},arrowGeometry30:m=>'geometry:'+m};c.globalThis=c;vm.createContext(c);vm.runInContext(bowAmmoIdentityPatch,c);
 const rig=()=>({userData:{bowRig:{arrow:{geometry:null,userData:{}}}}}),playerRig=rig(),npcRig=rig(),h={bow:npcRig};c.PH.bow27=playerRig;c.ENEMIES.push({hum:h,inventory:{arrow_flint:3,arrow_wood:0}});
 assert.equal(c.bowAmmoMaterial104(c.PH),'flint');assert.equal(c.bowAmmoMaterial104(h),'flint');c.actorBow27(h);assert.equal(npcRig.userData.bowRig.arrow.geometry,'geometry:flint');
 c.G.arrowMaterial30='wood';c.poseDrawBow(playerRig,.8,true);assert.equal(playerRig.userData.bowRig.arrow.geometry,'geometry:wood');
 const plainRig=rig(),plain={bow:plainRig};c.NPCS.push({h:plain,inventory:{}});c.actorBow27(plain);assert.equal(plainRig.userData.bowRig.arrow.geometry,'geometry:wood');
 assert.ok(source.includes("p.m.geometry=arrowGeometry30(p.arrowMaterial30)"),'fired projectiles already use ammo geometry');
 assert.ok(source.includes("a.m.geometry=arrowGeometry30(a.arrowMaterial30)"),'recoverable arrows already retain ammo geometry');
});
test('wooden arrows have a continuous wooden point while tipped arrows retain material identity and price advantage',()=>{
 class Batch{constructor(){this.calls=[];}cyl(...a){this.calls.push(['cyl',...a]);return this;}dquad(...a){this.calls.push(['dquad',...a]);return this;}mesh(){return{geometry:{calls:this.calls,userData:{}}};}}
 class Group{constructor(){this.children=[];this.userData={};this.scale={setScalar:v=>this.scale.value=v};}add(v){this.children.push(v);}}
 class Mesh{constructor(geometry,material){this.geometry=geometry;this.material=material;this.position={x:0};}}
 const items={};for(const m of ['wood','flint','copper','bronze','iron'])items['arrows48_'+m]={p:0,d:''};
 const c={globalThis:null,MATERIAL30:{wood:1,flint:1.12,copper:1.25,bronze:1.42,iron:1.8},ARROW_GEOMETRY30:new Map(),Batch,K:{wood:10,stoneD:11,cream:12},METAL_COLORS:{flint:20,copper:21,bronze:22,iron:23},PI:Math.PI,ACTOR_MAT:{},arrowPrices48:{wood:6,flint:8,copper:14,bronze:24,iron:45},ITEMS:items,itemModel55:key=>({legacy:key}),THREE:{Group,Mesh}};c.globalThis=c;
 vm.createContext(c);vm.runInContext(arrowSilhouettePricePatch,c);
 const wood=c.arrowGeometry30('wood'),bronze=c.arrowGeometry30('bronze');
 assert.equal(wood.userData.woodenPoint105,true);assert.equal(wood.userData.separateTip105,false);assert.equal(wood.calls.filter(v=>v[0]==='cyl').every(v=>v[8]===10),true,'all wooden arrow cylinders use wood');
 assert.equal(bronze.userData.separateTip105,true);assert.ok(bronze.calls.some(v=>v[0]==='cyl'&&v[8]===22),'bronze head uses bronze identity');
 assert.deepEqual(Array.from(c.ARROW_PRICE105&&Object.values(c.ARROW_PRICE105)),[6,18,32,52,90]);assert.ok(c.arrowPrices48.flint>=c.arrowPrices48.wood*3);
 const preview=c.itemModel55('arrow_bronze');assert.equal(preview.userData.arrowMaterial105,'bronze');assert.equal(preview.children[0].children.length,3);assert.ok(preview.children[0].children.every(m=>m.geometry===bronze));
 assert.equal(c.arrowProfile105('wood').damage,1);assert.ok(c.arrowProfile105('bronze').damage>c.arrowProfile105('wood').damage);
});
function remedyHarness(){
 const notices=[];const c={globalThis:null,LABEL48:{},WEIGHT:{},FOOD:{},RECIPES:{},G:{inv:{fig_restorative62:2,concentrated_remedy62:1,herb_infusion62:2,endurance_draught62:2},hp:40,maxHp:100,stamina:30,maxStamina:100,staminaDelay:0},P:{dead:false,guard:0,swordGuard22:0,draw:0,melee:null,mine:false,shear22:false,rollT:0},STATE:'bag',BAG_TAB:'food',mouse:{r:false},keys:{KeyG:false,KeyK:false},
  clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),ensureStamina(){},injuryLimit22:()=>100,hudAll(){},renderBag(){},sfx(){},toast:s=>notices.push(s),eatFood(){},staminaTick(){},updatePlayer(){},die(){c.P.dead=true;},loadGame:()=>true,lesson48(){},recipeKnown30:()=>false,say(){},learnPlans36(){},buyService48(){},serviceTalk48(){},$:()=>({querySelectorAll:()=>[]}),Object,Number,Array,Math,notices};
 c.globalThis=c;vm.createContext(c);const start=source.indexOf('/* Restoration remedies use remaining gameplay time'),end=source.indexOf('/* END BUILD48 MODULES */',start);vm.runInContext(source.slice(start,end),c);return c;
}
test('four remedies consume exactly one, clamp instant restoration and refuse timed stacking',()=>{
 const c=remedyHarness();c.eatFood('fig_restorative62');assert.equal(c.G.inv.fig_restorative62,1);assert.equal(c.G.hp,58);assert.equal(c.G.stamina,55);
 c.G.hp=80;c.eatFood('concentrated_remedy62');assert.equal(c.G.inv.concentrated_remedy62,0);assert.equal(c.G.hp,100);
 c.G.hp=40;c.eatFood('herb_infusion62');assert.equal(c.G.inv.herb_infusion62,1);c.eatFood('herb_infusion62');assert.equal(c.G.inv.herb_infusion62,1);assert.match(c.notices.at(-1),/still active/);
 c.STATE='play';c.updatePlayer(4);assert.equal(c.G.hp,46);c.STATE='pause';c.updatePlayer(4);assert.equal(c.G.hp,46,'pause freezes gradual healing');
});
test('remedy duration, stamina restrictions, death and old-save normalization remain bounded',()=>{
 const c=remedyHarness();c.STATE='play';c.eatFood('endurance_draught62');c.G.stamina=20;c.staminaTick(1);assert.equal(c.G.stamina,28);
 c.P.guard=1;c.staminaTick(1);assert.equal(c.G.stamina,28,'guard blocks the bonus');c.P.guard=0;c.G.staminaDelay=1;c.staminaTick(1);assert.equal(c.G.stamina,28,'stamina delay blocks the bonus');
 c.G.remedies62={heal:{left:999,budget:999},endurance:{left:999},bad:{left:999}};c.loadGame(1);assert.equal(c.G.remedies62.heal.left,24);assert.equal(c.G.remedies62.heal.budget,36);assert.equal(c.G.remedies62.endurance.left,40);
 c.die();assert.deepEqual(Object.keys(c.G.remedies62),[]);
 for(const key of ['fig_restorative62','concentrated_remedy62','herb_infusion62','endurance_draught62']){assert.ok(c.RECIPES[key]);assert.ok(c.FOOD[key]);assert.ok(c.WEIGHT[key]>0);}
});
function addChestLifecycleHarness(c){
 c.CG=new Map();c.CSZ=32;c.floor=Math.floor;c.ckey=(x,z)=>x+','+z;
 c.cadd=(q,x0,x1,z0,z1)=>{for(let x=Math.floor(x0/32);x<=Math.floor(x1/32);x++)for(let z=Math.floor(z0/32);z<=Math.floor(z1/32);z++){const k=c.ckey(x,z);if(!c.CG.has(k))c.CG.set(k,[]);c.CG.get(k).push(q);}};
 c.newGame=()=>{c.G={world:{},inv:{}};};
 c.closeLoot=()=>{c.LOOT_CONTEXT=null;};
 c.OVER.remove=g=>{g.parent=null;};
 const add=c.OVER.add;c.OVER.add=g=>{add(g);g.parent=c.OVER;};
 return c;
}
test('owned chest placement conserves the kit and exposes persistent two-way storage',async()=>{
 const built=[],ints=[],notices=[],loot=[];class Map106 extends Map{};const mesh=()=>({g:{position:{set(x,y,z){Object.assign(this,{x,y,z});}},userData:{}},lid:{rotation:{x:0}}});
 const c={globalThis:null,Map:Map106,LABEL48:{},WEIGHT:{},RECIPES:{},G:{inv:{owned_chest106:1},world:{}},P:{x:0,z:0,yaw:0,dead:false,mode:'foot'},AREA:'over',STATE:'play',K:{woodD:1},OVER:{add:g=>built.push(g)},INTS:ints,INT_GRID16:{count:0},LOOT_CONTEXT:null,BAG_TAB:'materials',
  Number,Object,Array,Math,MathFloor:Math.floor,hyp:Math.hypot,sin:Math.sin,cos:Math.cos,landPoint15:(x,z)=>({x,z}),heightAt:()=>3,groundY:()=>3,colBlocked:()=>false,makeChestMesh:mesh,addRect(){},itemLabel:k=>k,
  removePlayerItem(k,n){if((c.G.inv[k]||0)<n)return false;c.G.inv[k]-=n;return true;},lootEquipment:o=>loot.push(o),hudAll(){},showLoot(title,items,take){c.LOOT_CONTEXT={title,items,take};},renderLoot(){},renderBag(){},closeBag(){c.STATE='play';},toast:s=>notices.push(s),populate:async()=>{},restoreLivingWorld(){},$:()=>null,document:{createElement:()=>({dataset:{}})}};c.globalThis=c;
 addChestLifecycleHarness(c);vm.createContext(c);vm.runInContext(ownedChestPatch,c);assert.ok(c.RECIPES.owned_chest106.need.bronze===1);assert.equal(c.placeOwnedChest106(),true);assert.equal(c.G.inv.owned_chest106,0);assert.equal(c.G.world.ownedChests106.length,1);assert.equal(built.length,1);assert.equal(ints.length,1);
 const q=c.G.world.ownedChests106[0];q.items.wood=3;c.P.z=q.z;c.openOwnedChest106(q);assert.equal(c.LOOT_CONTEXT.storage52,q);assert.equal(c.LOOT_CONTEXT.take('wood',2),true);assert.equal(JSON.stringify(loot),JSON.stringify([{wood:2}]));assert.equal(q.items.wood,1);
 const same=q;c.syncOwnedChests106();assert.equal(c.G.world.ownedChests106[0],same,'restore preserves the interaction storage identity');assert.equal(built.length,1,'restore does not duplicate runtime chest');assert.match(notices[0],/pause menu/);
});
test('owned chest rejects unsafe placement without consuming inventory and sanitizes old saves',()=>{
 const c={globalThis:null,Map,LABEL48:{},WEIGHT:{},RECIPES:{},G:{inv:{owned_chest106:1},world:{ownedChests106:[{id:'ok',x:1,z:1,items:{wood:2,bad:-3,float:1.8}},{id:'bad',x:null,z:2,items:{wood:9}}]}},P:{x:0,z:0,yaw:0,dead:false,mode:'foot'},AREA:'over',STATE:'play',K:{woodD:1},OVER:{add(){}},INTS:[],INT_GRID16:{count:0},LOOT_CONTEXT:null,BAG_TAB:'materials',Number,Object,Array,Math,hyp:Math.hypot,sin:Math.sin,cos:Math.cos,landPoint15:()=>null,heightAt:()=>3,groundY:()=>3,colBlocked:()=>false,makeChestMesh:()=>({g:{position:{set(){}},userData:{}},lid:{rotation:{x:0}}}),addRect(){},removePlayerItem(){throw Error('must not consume');},lootEquipment(){},hudAll(){},showLoot(){},renderLoot(){},renderBag(){},closeBag(){},toast(){},populate:async()=>{},restoreLivingWorld(){},$:()=>null,document:{createElement:()=>({dataset:{}})}};c.globalThis=c;
 addChestLifecycleHarness(c);vm.createContext(c);vm.runInContext(ownedChestPatch,c);assert.equal(c.placeOwnedChest106(),false);assert.equal(c.G.inv.owned_chest106,1);const a=c.ownedChestState106();assert.equal(a.length,1);assert.deepEqual(Object.keys(a[0].items).sort(),['float','wood']);assert.equal(a[0].items.float,1);
});
function chestReloadHarness(){
 const built=[],removed=[],received=[];
 const c={globalThis:null,Map,Set,LABEL48:{},WEIGHT:{},RECIPES:{},G:{world:{ownedChests106:[{id:'ownedChest106:1',x:1,z:1,items:{wood:3}}]},inv:{owned_chest106:1}},P:{x:1,z:1,yaw:0,dead:false,mode:'foot'},AREA:'over',STATE:'play',K:{woodD:1},OVER:{add:g=>built.push(g)},INTS:[],INT_GRID16:{count:0},LOOT_CONTEXT:null,BAG_TAB:'materials',Number,Object,Array,Math,hyp:Math.hypot,sin:Math.sin,cos:Math.cos,landPoint15:(x,z)=>({x,z}),heightAt:()=>3,groundY:()=>3,colBlocked:()=>false,makeChestMesh:()=>({g:{position:{set(x,y,z){Object.assign(this,{x,y,z});}},userData:{}},lid:{rotation:{x:0}}}),lootEquipment:o=>received.push(o),removePlayerItem(k,n){if(!(c.G.inv[k]>=n))return false;c.G.inv[k]-=n;return true;},hudAll(){},showLoot(title,items,take){c.LOOT_CONTEXT={title,items,take};},renderLoot(){},renderBag(){},closeBag(){},toast(){},populate:async()=>{},restoreLivingWorld(){},$:()=>null,document:{createElement:()=>({dataset:{}})}};
 c.globalThis=c;addChestLifecycleHarness(c);c.OVER.remove=g=>{removed.push(g);g.parent=null;};vm.createContext(c);vm.runInContext(ownedChestPatch,c);c.syncOwnedChests106();return{c,built,removed,received};
}
test('owned chest ordinary interaction binds loaded contents, invalidating pre-load loot callbacks',()=>{
 const {c,built,received}=chestReloadHarness(),old=c.G.world.ownedChests106[0];c.INTS[0].act();const oldTake=c.LOOT_CONTEXT.take;
 c.G=JSON.parse(JSON.stringify(c.G));c.G.world.ownedChests106[0].items.wood=9;c.restoreLivingWorld();assert.equal(c.LOOT_CONTEXT,null);assert.equal(built.length,1);
 assert.equal(oldTake('wood',2),false);assert.equal(old.items.wood,3);assert.equal(received.length,0);
 c.INTS[0].act();assert.equal(c.LOOT_CONTEXT.storage52,c.G.world.ownedChests106[0]);assert.equal(c.LOOT_CONTEXT.take('wood',2),true);assert.equal(c.G.world.ownedChests106[0].items.wood,7);
 assert.equal(c.LOOT_CONTEXT.take('wood',.5),false);
});
test('switching saves removes orphaned chest meshes interactions and only its colliders',()=>{
 const {c,built,removed}=chestReloadHarness(),foreign={x:9,z:9,r:1};const key=[...c.CG.keys()][0];c.CG.get(key).push(foreign);
 c.G.world.ownedChests106=[];c.restoreLivingWorld();assert.equal(c.OWNED_CHESTS106.size,0);assert.equal(c.INTS.length,0);assert.equal(removed.length,1);
 assert.deepEqual([...c.CG.values()].flat(),[foreign]);assert.equal(c.INT_GRID16.count,-1);assert.equal(built[0].parent,null);
});
test('same chest identity moves on slot load, new voyage clears it, serial migration prevents ID reuse',()=>{
 const {c,built,removed}=chestReloadHarness();c.G=JSON.parse(JSON.stringify(c.G));c.G.world.ownedChests106[0].x=65;c.G.world.ownedChestSerial106=0;c.restoreLivingWorld();
 assert.equal(built.length,1);assert.equal(c.INTS[0].x,65);assert.equal(built[0].position.x,65);assert.equal(c.G.world.ownedChestSerial106,1);
 assert.ok([...c.CG.values()].flat().every(q=>q.x===65),'colliders follow loaded coordinates');
 c.newGame();assert.equal(c.OWNED_CHESTS106.size,0);assert.equal(c.INTS.length,0);assert.equal(c.CG.size,0);assert.equal(removed.length,1);
});
test('duplicate save chest IDs and fractional zero contents cannot create duplicate storage',()=>{
 const {c}=chestReloadHarness();c.G.world.ownedChests106.push({id:'ownedChest106:1',x:2,z:2,items:{wood:1000}});c.G.world.ownedChests106[0].items.fiber=.5;c.syncOwnedChests106();
 assert.equal(c.G.world.ownedChests106.length,1);assert.equal(c.OWNED_CHESTS106.size,1);assert.equal(c.INTS.length,1);assert.equal(c.G.world.ownedChests106[0].items.fiber,undefined);
});
function atmosphereHarness(){
 class Group{constructor(){this.userData={};this.children=[];this.visible=true;}add(m){this.children.push(m);}}
 class Batch{constructor(){this.p=[];this.calls=[];}cyl(...a){this.calls.push(['cyl',...a]);this.p.push(1);return this;}box(...a){this.calls.push(['box',...a]);this.p.push(1);return this;}ball(...a){this.calls.push(['ball',...a]);this.p.push(1);return this;}mesh(){return{calls:this.calls,userData:{}};}}
 const c={globalThis:null,THREE:{Group},Batch,TS:4,faceHash:()=>1,hyp:Math.hypot,hx:v=>v,K:{stoneD:1,bronze:2,iron:3},floorSample26:()=>.2,DGS:{},DG:null,T_NOW:0,P:{x:0,z:0},buildDungeon:()=> 'base',dgUpdate:()=> 'tick',veryLow28:()=>false};c.globalThis=c;vm.createContext(c);vm.runInContext(dungeonAtmospherePatch,c);
 const W=22,H=22,grid=Array(W*H).fill(1);for(let z=1;z<H-1;z++)for(let x=1;x<W-1;x++)grid[z*W+x]=0;
 const dg={id:'cave108',def:{name:'Deep Cave',objs:[[2,2,'S'],[20,20,'c']],theme:{wall:4}},ox:100,oz:200,W,H,grid,group:new Group(),terrain26:{},cavern40:{roof:()=>6.4},solids:[],routes:[]};return{c,dg};
}
test('cave formations are deterministic, bounded, wall-side and clear of puzzle routes',()=>{
 const {c,dg}=atmosphereHarness(),plan=c.atmospherePlan108(dg);assert.ok(plan.length>0&&plan.length<=12);assert.equal(JSON.stringify(plan),JSON.stringify(c.atmospherePlan108(dg)));
 for(const p of plan){assert.equal(p.y,.2);assert.equal(p.roof,6.4);assert.equal(p.kind,'cave');for(const [x,z]of dg.def.objs)assert.ok(Math.hypot(p.x-(dg.ox+(x+.5)*4),p.z-(dg.oz+(z+.5)*4))>=5);}
 const p=plan[0];dg.routes=[{x0:p.x-1,x1:p.x+1,z:p.z,width:4}];assert.ok(c.atmospherePlan108(dg).every(q=>Math.hypot(q.x-p.x,q.z-p.z)>2));
 dg.def.palace16={};assert.equal(c.atmospherePlan108(dg).length,0);delete dg.def.palace16;dg.id='home_test';assert.equal(c.atmospherePlan108(dg).length,0);
});
test('cave and mine dressing uses sampled floors and roofs once without altering colliders',()=>{
 const {c,dg}=atmosphereHarness(),solids=dg.solids.length,q=c.installAtmosphere108(dg);assert.ok(q.formations>0&&q.formations<=24);assert.ok(q.puddles>0&&q.puddles<=12);assert.equal(q.chains,0);assert.ok(q.meshes.length<=3);assert.equal(dg.solids.length,solids);
 assert.equal(c.installAtmosphere108(dg),q);assert.equal(dg.group.children.length,1);assert.ok(q.meshes.flatMap(m=>m.calls).some(a=>a[0]==='ball'&&a[2]>.2&&a[2]<.25));
 const mine=atmosphereHarness();mine.dg.def.mine36={};assert.equal(mine.c.atmospherePlan108(mine.dg)[0].kind,'mine');
 const steep=atmosphereHarness();steep.c.floorSample26=(_dg,x)=>x*.4;assert.equal(steep.c.installAtmosphere108(steep.dg)?.puddles||0,0,'uneven ground cannot create floating puddles');
});
test('dungeon hanging chains keep headroom and dressing culls on a bounded interval',()=>{
 const {c,dg}=atmosphereHarness();dg.id='cata108';dg.def.name='Burial Halls';c.DGS[dg.id]=dg;assert.equal(c.buildDungeon(dg.id),'base');const q=dg.atmosphere108;
 assert.equal(q.formations,0);assert.equal(q.puddles,0);assert.ok(q.chains>0&&q.chains<=4);assert.equal(q.meshes.length,1);assert.ok(q.meshes[0].calls.filter(a=>a[0]==='cyl').every(a=>a[2]>=2.8));
 c.DG=dg;c.P.x=1e5;assert.equal(c.dgUpdate(.016),'tick');assert.equal(q.root.visible,false);c.P.x=q.sites[0].x;c.P.z=q.sites[0].z;c.T_NOW=.1;c.dgUpdate(.016);assert.equal(q.root.visible,false);c.T_NOW=.3;c.dgUpdate(.016);assert.equal(q.root.visible,true);
});
function cinemaHarness110(){
 const classes=new Set(),elements=new Map(),node=()=>({textContent:'',style:{},classList:{add(){},remove(){}},appendChild(){}});
 const c={globalThis:null,STATE:'play',AREA:'over',P:{x:0,z:0,y:0,vx:1,vz:1,dead:false},NPCS:[{name:'Daedalus the Inventor',x:2,z:2,area:'over'}],ENEMIES:[],G:{world:{}},CINE84:null,VIEW_ROOT:{visible:true},DLG:{i:0,lines:[],choices:null},mouse:{l:true,r:true},keys:{KeyW:true},once:{KeyQ:true},document:{createElement:node,head:{appendChild(n){elements.set(n.id,n);}},body:{classList:{add:k=>classes.add(k),remove:k=>classes.delete(k),toggle(k,b){b?classes.add(k):classes.delete(k);}}},exitPointerLock(){}},$:id=>elements.get(id)||elements.set(id,node()).get(id),camera:{position:{x:0,y:2,z:0,clone(){return{x:this.x,y:this.y,z:this.z};},lerp(){}},quaternion:{clone:()=>({})},lookAt(){}},clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),hyp:Math.hypot,groundY:()=>0,cinematicUI84(){},endCinematic84(){c.CINE84=null;classes.delete('cine84');},closeDlg(){c.STATE='play';},cinematicTick84(){},say(name,lines,done,choices){c.STATE='talk';c.DLG={name,lines,i:0,done,choices};},dlgAdvance(){c.advanced=(c.advanced||0)+1;},DG:null,dgUpdate(){if(c.DG?.groups?.test)c.DG.groups.test.open=true;},newGame(){},restoreLivingWorld(){}};c.globalThis=c;vm.createContext(c);vm.runInContext(storyCinematicsPatch,c);return{c,classes};
}
test('main-quest cinema retains real choices and cannot auto-grant dialogue rewards',()=>{
 const {c,classes}=cinemaHarness110();c.camera.position.clone=function clone(){return{x:this.x,y:this.y,z:this.z,clone};};let reward=0;c.say('Daedalus the Inventor',['Choose your route'],()=>reward++,[{t:'Continue',go:()=>reward++}]);assert.ok(c.CINE84.extended110);assert.ok(classes.has('cinechoices110'));assert.equal(c.VIEW_ROOT.visible,false);assert.equal(c.keys.KeyW,false);assert.equal(c.once.KeyQ,undefined);
 c.cinematicTick84(30);assert.equal(c.advanced,undefined);assert.equal(reward,0);assert.equal(c.DLG.choices.length,1);c.closeDlg();assert.equal(c.CINE84,null);assert.equal(classes.has('cinechoices110'),false);
});
test('puzzle-open cinema waits out nearby combat and does not alter puzzle or quest rewards',()=>{
 const {c}=cinemaHarness110();c.AREA='cave';c.DG={id:'cave',groups:{test:{open:false,gates:[{x:3,z:4}]}},def:{}};c.ENEMIES.push({alive:true,area:'cave',x:2,z:0});c.dgUpdate(.1);assert.equal(c.STATE,'play');assert.equal(c.PUZZLE_CINE110.queue.length,1);
 c.ENEMIES=[];c.dgUpdate(.1);assert.equal(c.STATE,'talk');assert.ok(c.CINE84.extended110);assert.equal(c.PUZZLE_CINE110.queue.length,0);assert.equal(c.G.world.rewards,undefined);assert.equal(c.DG.groups.test.open,true);
 c.closeDlg();c.dgUpdate(.1);assert.equal(c.STATE,'play','an already-open gate does not re-run its transition');
});
test('legacy invisible stable seller is removed while nearby actual keepers remain usable',()=>{
 const legacy={label:()=> 'Buy a trained horse or saddle'},valid={label:()=> 'Ikaria Stable · Timaios, Hippos and owned mounts'},n={name:'Timaios',x:1,z:1,area:'over'},e=()=>({hidden:false,style:{},parentElement:{querySelector:()=>({})}}),els={pq1:e(),pq2:e(),pq3:e()};let bought=0,graphics=null;
 const c={globalThis:null,INTS:[legacy,valid],INT_GRID16:{count:0},NPCS:[n],AREA:'over',P:{x:0,z:0},hyp:Math.hypot,stableBuy20(){bought++;},currentInts:()=>[legacy,valid],populate:async()=>{},toast(){},graphicsMenu28(){},applyGraphics28:p=>graphics=p,$:id=>els[id]||null,document:{querySelectorAll:()=>[],title:''}};c.globalThis=c;vm.createContext(c);vm.runInContext(feedbackMenuStablePatch,c);
 assert.equal(c.INTS.length,1);assert.equal(c.currentInts().length,1);c.stableBuy20({name:'Invisible Stable Keeper',x:0,z:0});assert.equal(bought,0);c.stableBuy20(n);assert.equal(bought,1);c.P.x=100;c.stableBuy20(n);assert.equal(bought,1);
 assert.equal(graphics,'auto');assert.ok(els.pq1.hidden&&els.pq2.hidden&&els.pq3.hidden);assert.match(c.document.title,/Combined Cinematic/);
});
test('combined source retains animated sling pouch load wind release and both camera rigs',()=>{
 for(const name of ['slingPose85','slingRigPose85','SLING_RIG85','SLING_VIEW85','rangedTarget86','releaseSling86'])assert.ok(candidate.includes(name),name+' must remain in delivered source');
});
function lockGateHarness112(){
 const texts=[],commands=[],canvas=new Proxy({}, {get:(o,k)=>k in o?o[k]:(...a)=>{commands.push([k,...a]);}}),elements={'lock-canvas16':{getContext:()=>canvas},'pin-lift16':{},'lock-feedback16':{}},ch={lid:{rotation:{x:0}}},dg={id:'cave',def:{},groups:{plate:{open:false,sw:[{on:false}],gates:[{x:1,z:1,open:false}]}}};
 const c={globalThis:null,LOCK16:{dg,ch,id:'lock:cave',targets:[20,40,60],heights:[35,35,35],selected:0,set:[false,false,false],tension:false,stress:0,hold:0},STATE:'lockpick',G:{skills:{lockpick:0},inv:{lockpick:2},world:{locks:{}}},keys:{},P:{x:0,z:0,dead:false},AREA:'cave',T_NOW:10,AU:{on:false},DG:dg,ENEMIES:[],Number,Math,Object,Set,clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),hyp:Math.hypot,$:id=>elements[id],drawLock16(){},lockTick16(){},closeLock16(){c.LOCK16=null;c.STATE='play';},unlockedChestBefore(){c.rewards=(c.rewards||0)+1;},guildEvidence16(){},toast(){},save(){},sfx(){},noiseB(){},dgUpdate(){},say:(n,lines)=>texts.push(...lines),beginStoryCinema110(){},setWeapon(){},spawnEnemy(){return c.spawned;},decayMesh41:m=>{m.geometry={decayed:true};c.decays=(c.decays||0)+1;}};c.globalThis=c;vm.createContext(c);vm.runInContext(lockGateDecayPatch,c);return{c,commands,elements,texts,dg};
}
test('tactile lock hides target gaps and uses bounded binding difficulty and pick stress',()=>{
 const {c,elements}=lockGateHarness112();c.drawLock16();assert.equal(c.drawLock16.toString().includes('q.targets'),false);assert.match(elements['lock-feedback16'].textContent,/Feel the next pin/);
 const easy=c.lockFeel112(c.LOCK16).tolerance;c.LOCK16.dg.def.faction56='oathkeepers';assert.ok(c.lockFeel112(c.LOCK16).tolerance<easy);c.LOCK16.tension=true;
 for(let i=0;i<60;i++)c.lockTick16(.05);assert.equal(c.G.inv.lockpick,1);assert.equal(c.G.world.locks['lock:cave'],undefined);assert.equal(c.rewards,undefined);
});
test('tactile lock completes only after all pins held and preserves ordinary chest reward path',()=>{
 const {c}=lockGateHarness112();c.LOCK16.tension=true;for(let pin=0;pin<3;pin++){c.LOCK16.heights[pin]=c.LOCK16.targets[pin];for(let i=0;i<11;i++)c.lockTick16(.05);}
 assert.equal(c.LOCK16,null);assert.equal(c.G.world.locks['lock:cave'],true);assert.equal(c.G.inv.lockpick,2);assert.equal(c.rewards,1);
});
test('approaching an unsolved mechanism gate presents the locked-gate dialogue once',()=>{
 const {c,texts,dg}=lockGateHarness112();c.STATE='play';c.dgUpdate(.1);assert.ok(texts.includes('The gate seems locked.'));c.dgUpdate(.1);assert.equal(texts.filter(t=>t==='The gate seems locked.').length,1);assert.equal(dg.groups.plate.open,false,'the dialogue cannot solve the gate');
});
test('revenant weapons decay after spawn and late equip without repainting living actors',()=>{
 const {c}=lockGateHarness112(),mesh=()=>({isMesh:true,userData:{},geometry:{clean:true}}),sword=mesh(),shield=mesh(),h={revenant36:true,W:{sword},shield};c.setWeapon(h,'sword');assert.ok(sword.geometry.decayed);assert.ok(shield.geometry.decayed);const count=c.decays;c.setWeapon(h,'sword');assert.equal(c.decays,count,'cached gear does not clone every equip');
 const bow=mesh();h.W.bow=bow;c.setWeapon(h,'bow');assert.ok(bow.geometry.decayed);const living={W:{sword:mesh()}};c.setWeapon(living,'sword');assert.equal(living.W.sword.geometry.clean,true);
});
test('two optional puzzle variants reset fairly and give only one ordinary loot reward',()=>{
 for(const seed of [0,1]){const world={loot:{}},c={globalThis:null,faceHash:()=>seed,livingState:()=>world,save(){},closeDlg(){},say(){},beginStoryCinema110(){},toast(){},putLoot(id,x,z,area,items){world.loot[id]={x,z,area,items};c.rewards=(c.rewards||0)+1;},DGS:{},buildDungeon(){},atmospherePlan108:()=>[],Batch:class{},K:{}};c.globalThis=c;vm.createContext(c);vm.runInContext(optionalPuzzlesPatch,c);const dg={id:'test'},p={x:1,z:2};
  if(seed===0){c.mechanismInput113(dg,p,'high');assert.equal(c.mechanismState113('test').progress,0);for(const a of ['low','high','middle'])c.mechanismInput113(dg,p,a);}else{c.mechanismInput113(dg,p,'left');c.mechanismInput113(dg,p,'reset');assert.equal(c.mechanismState113('test').left,0);for(let i=0;i<3;i++)c.mechanismInput113(dg,p,'left');for(let i=0;i<5;i++)c.mechanismInput113(dg,p,'right');}
  assert.equal(c.mechanismState113('test').solved,true);assert.equal(c.rewards,1);c.mechanismInput113(dg,p,'left');assert.equal(c.rewards,1);assert.deepEqual(Object.keys(world.loot['mechanism113:test'].items).sort(),['arrow_wood','bread','stone']);
 }
});
function progressionHarness(){
 const classes=()=>{const set=new Set();return{set,add:k=>set.add(k),remove:k=>set.delete(k)}};
 const elements={dlg:{classList:classes()},pause:{classList:classes()},bagwin:{classList:classes()},bagbody:{scrollTop:9,prepend(){},querySelectorAll:()=>[]}};
 const notices=[];const c={globalThis:null,G:{lvl:1,xp:0,skillPoints:0,maxHp:100,hp:70,maxStamina:100,stamina:50},P:{dead:false,draw:1,buffer22:{}},STATE:'loading',BAG_TAB:'weapons',mouse:{l:true,r:true},keys:{KeyW:true},once:{KeyQ:true},document:{exitPointerLock(){},createElement:()=>({textContent:''}),head:{appendChild(){}}},
  ensurePolish(){},ensureStamina(){},hasPerk20:()=>false,xpNeed:()=>100,injuryLimit22:()=>200,sfx(){},toast:s=>notices.push(s),hudAll(){},save(){c.saves=(c.saves||0)+1;},renderBag(){},closeBag(){elements.bagwin.classList.remove('on');c.STATE='play';},frame(){},newGame(){},continueGame(){},exitWithoutSaving(){},$:id=>elements[id],queueMicrotask,Number,Object,Array,Math,notices,elements};
 c.globalThis=c;vm.createContext(c);const start=source.indexOf('let LEVEL_PENDING23=false'),end=source.indexOf('/* Jump release shortens a hop',start);vm.runInContext(source.slice(start,end),c);return c;
}
test('level gains award independent attribute and skill points with bounded stat spending',()=>{
 const c=progressionHarness();c.addXp(250);assert.equal(c.G.lvl,3);assert.equal(c.G.xp,50);assert.equal(c.G.skillPoints,2);assert.equal(c.G.progression23.attributePoints,2);
 c.renderBag=()=>{};assert.equal(c.buyAttribute23('health'),true);assert.equal(c.G.maxHp,110);assert.equal(c.G.hp,80);assert.equal(c.G.skillPoints,2,'attribute spending does not consume skill points');
 assert.equal(c.buyAttribute23('carry'),true);assert.equal(c.carryingCapacity(),75);assert.equal(c.buyAttribute23('stamina'),false,'no attribute points remain');assert.equal(c.saves,2);
});
test('level screen suspends and restores an active dialogue without leaking combat input',()=>{
 const c=progressionHarness();c.STATE='talk';c.renderBag=()=>{};c.showLevel23();assert.equal(c.STATE,'bag');assert.equal(c.elements.dlg.classList.set.has('on'),false);assert.equal(c.elements.bagwin.classList.set.has('on'),true);assert.equal(c.mouse.l,false);assert.equal(c.keys.KeyW,false);assert.deepEqual(Object.keys(c.once),[]);assert.equal(c.P.draw,0);assert.equal(c.P.buffer22,null);
 c.closeBag();assert.equal(c.STATE,'talk');assert.equal(c.elements.dlg.classList.set.has('on'),true);assert.equal(c.elements.bagwin.classList.set.has('on'),false);
});
test('active equipment HUD is the compact equipped-hands readout, not the old slot bar',()=>{
 const start=source.indexOf("hudSlots=function(){const el=$('slots');if(!el)return;const right=");const end=source.indexOf('\n',start);assert.ok(start>0&&end>start);
 const slots={textContent:''},c={G:{hands:{right:'spear_bronze',left:'shield_bronze'},peaceful16:false},$:id=>id==='slots'?slots:null,itemLabel:k=>k.replaceAll('_',' '),handItem22:s=>c.G.hands[s]};vm.createContext(c);vm.runInContext(source.slice(start,end),c);c.hudSlots();assert.match(slots.textContent,/spear bronze \/ shield bronze/);assert.match(slots.textContent,/R sheathe/);assert.equal(slots.textContent.includes('<div'),false);
 c.G.peaceful16=true;c.hudSlots();assert.equal(slots.textContent,'Hands free · R draw · I inventory');
});
function dogRestHarness(){
 const rotation={x:0,y:0,z:0,set(x,y,z){Object.assign(this,{x,y,z});}},position={x:0,y:0,z:0,set(x,y,z){Object.assign(this,{x,y,z});}};
 const legs=Array.from({length:4},()=>({rotation:{x:0}})),dog={kind:'dog',dead:false,x:0,z:0,a:.4,t:2,mv:true,g:{visible:true,rotation,position},q:{neck:{rotation:{x:0}},head:{rotation:{x:0}},legs}};
 const c={globalThis:null,AREA:'over',G:{time:23},T_NOW:20,P:{x:3,z:0,vx:0,vz:0,crouch:true,draw:0,melee:null},mouse:{l:false},PASTORAL:[dog],ENEMIES:[],PI:Math.PI,hyp:Math.hypot,groundY:()=>2,
  updVisuals(){dog.g.position.y=2;dog.q.legs.forEach(l=>l.rotation.x=0);},updSheep(){dog.x+=1;dog.g.position.set(dog.x,2,dog.z);},damageAnimal(a,d){a.hp=(a.hp||20)-d;},animalVoice26(){c.voiced=true;}};c.globalThis=c;vm.createContext(c);vm.runInContext(dogRestWakePatch,c);return{c,dog};
}
test('domestic dogs rest at night and allow a quiet crouched stealth approach',()=>{
 const {c,dog}=dogRestHarness();c.updSheep(.1);assert.equal(dog.sleeping107,true);assert.equal(dog.x,0,'rest pose anchors the dog despite ordinary wander update');assert.equal(dog.g.position.y,1.6);assert.equal(dog.g.rotation.z,0);assert.deepEqual(dog.q.legs.map(l=>l.rotation.x),[-.72,-.72,.68,.68]);
 c.updVisuals(.1);assert.equal(dog.g.position.y,1.6,'final visual boundary retains rest pose');assert.deepEqual(dog.q.legs.map(l=>l.rotation.x),[-.72,-.72,.68,.68]);
});
test('dogs wake to ordinary approach, nearby threats, touch and injury',()=>{
 const {c,dog}=dogRestHarness();c.updSheep(.1);c.P.crouch=false;c.T_NOW=21;c.updSheep(.1);assert.equal(dog.sleeping107,false);assert.equal(dog.g.rotation.z,0);assert.equal(dog.dogWakeUntil107,33);
 dog.sleeping107=true;c.damageAnimal(dog,4);assert.equal(dog.sleeping107,false);assert.equal(dog.agitated,9);dog.sleeping107=true;c.animalVoice26(dog);assert.equal(dog.sleeping107,false);assert.equal(c.voiced,true);
 dog.sleeping107=true;c.P.x=30;c.ENEMIES.push({alive:true,friendly:false,area:'over',x:2,z:0});c.updSheep(.1);assert.equal(dog.sleeping107,false);
});
test('agitated dogs never resume sleep even after the wake deadline expires',()=>{
 const {c,dog}=dogRestHarness();c.P.x=30;c.T_NOW=100;dog.dogWakeUntil107=10;dog.agitated=4;c.updSheep(.1);assert.equal(dog.sleeping107,false);assert.equal(dog.dogWakeUntil107,112);
});
test('FP camera follows lock during roll and preserves target',()=>{
 const {c,e,events}=harness();c.updateCamera(.016);
 assert.equal(c.LOCK,e);assert.ok(events[0].yaw>0);assert.ok(events[0].pitch>0);assert.equal(c.CAM.manual,0);
});
test('TP retains existing camera path without double-steering',()=>{
 const {c,e,events}=harness();c.FIRST_PERSON=false;c.updateCamera(.016);
 assert.equal(events[0].yaw,0);assert.equal(c.LOCK,e);
});
test('death, area, range, LOS and menu expire lock before camera uses it',()=>{
 for(const mutate of [c=>c.LOCK.alive=false,c=>c.LOCK.area='cave',c=>c.LOCK.x=49,c=>c.LOCK.occluded=true,c=>c.STATE='loot',c=>c.P.dead=true]){
  const {c,events}=harness();mutate(c);c.updateCamera(.016);assert.equal(c.LOCK,null);assert.equal(events[0].yaw,0);
 }
});
test('pause and blur clear queued dodge, jump, mouse and lock input',()=>{
 for(const mode of ['pause','blur','hidden']){
  const {c,listeners}=harness();c.P.dodgeBuffer62=.16;c.P._jumpBuffer=.1;
  if(mode==='pause')assert.equal(c.openPause(),'paused');else if(mode==='blur')listeners.blur();else{c.document.visibilityState='hidden';listeners.visibilitychange();}
  assert.equal(c.LOCK,null);assert.equal(c.once.KeyC,undefined);assert.equal(c.once.KeyQ,undefined);assert.equal(c.keys.KeyQ,false);assert.equal(c.mouse.l,false);assert.equal(c.P.dodgeBuffer62,0);assert.equal(c.P._jumpBuffer,0);
 }
});
test('lock acquisition excludes friends and cycles eligible enemies',()=>{
 const {c,e}=harness();c.LOCK=null;c.ENEMIES.push({...e,x:4,z:1,friendly:true},{...e,x:1,z:4});
 vm.runInContext('selectCombatLock62()',c);const first=c.LOCK;assert.equal(first.friendly,undefined);
 vm.runInContext('selectCombatLock62(true)',c);assert.notEqual(c.LOCK,first);
 vm.runInContext('selectCombatLock62()',c);assert.equal(c.LOCK,null);
});
test('HUD target selection retains lock priority and clears stale bosses',()=>{
 const {c,e}=harness();const other={...e,x:2,z:2};c.ENEMIES.push(other);c.BOSS={...e,x:100};
 assert.equal(c.healthBarTarget72(),e);assert.equal(c.BOSS,null);c.LOCK=null;assert.equal(c.healthBarTarget72(),other);
 c.STATE='pause';assert.equal(c.healthBarTarget72(),null);
});
