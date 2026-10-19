import vm from 'node:vm';import {constructionHarness,source} from './batch-construction-harness.mjs';
import {checkpointRestoreSafetyPatch,manualCheckpointFeedbackPatch} from './checkpoint-restore-safety-patch.mjs';
import {attachedBronzeAgeAdditions} from './attached-bronze-age-additions.mjs';
import {repairCityAccess} from './reconciled-city-access-patch.mjs';
import {repairRiverCityPlacement} from './river-city-placement-patch.mjs';
import {repairRiverCityAccess} from './river-city-access-patch.mjs';
const line=p=>{const s=source.split('\n').find(x=>x.startsWith(p));if(!s)throw Error(p);return s;},range=(a,b)=>source.slice(source.indexOf(a),source.indexOf(b,source.indexOf(a)));
export function riverCityHarness(patched=true,access=false){const {c,Batch}=constructionHarness(false),batch=new Batch();
 Object.assign(c,{CG:null,OCC:[],IS:{mesopotamia:{}},DUN:{},DGS:{},LOC:{},INTS:[],INT_GRID16:{count:0},AREA:'over',P:{y:7,x:0,z:0,mode:'foot',dead:false},STATE:'play',COLLISION_ACTOR15:null,ZIGGURAT140:{built:true},heightAt:()=>7,groundY:()=>7,clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),floor:Math.floor,lerp:(a,b,t)=>a+(b-a)*t,hx:()=>[.4,.3,.2],jit:a=>a,hash2:()=>.5,rr:(a,b)=>(a+b)/2,rnd:()=>.5,pick:a=>a[0],ibatch:()=>batch,addFlat(){},shrine(){},DISCOVER(){},freeLandNear:(x,z)=>({x,z}),addNPC:o=>{const n={...o};c.actors.push(n);return n;},actors:[],say(){},installBronzeAgeLife263(){},populate:async()=>{},enterDungeon(id,out){c.entered={id,out};},toast:t=>c.lastToast=t,closeDlg(){}});
 const palette=['mudD','mud','stoneL','plaster','dark','blue','gold','ochre','red','cream','black','wood','woodD'];for(const k of palette)c.K[k]=[.4,.3,.2];
 vm.runInContext(range('class Rig{','/* materials & renderer')+'\n'+line('const RIGY=')+'\n'+range('const CG=new Map()','/* ---- terrain colours ---- */')+'\nglobalThis.CG=CG;\n'+line('function occFree(')+'\n'+range('function wallSeg(','function lionGate(')+'\n'+line('function fortWall(')+'\n'+line('function riverCityWalls('),c);
 // Actual native village and occupation/collider checks; controlled house mesh
 // records only its ordinary native footprint, not its decoration/inhabitants.
 c.houses=[];c.mudHouse=(b,x,z,ry,w,d)=>{c.houses.push({x,z,ry,w,d});c.addRectRot(x,z,w,d,ry);};
 vm.runInContext(line('function faceC(')+'\n'+range('function village(','/* ---- NPCs ---- */'),c);
 if(access){Object.assign(c,{G:{inv:{},dg:{},world:{},F:{}},DG:null,TS:4,MAT:c.ACTOR_MAT,MATB:c.ACTOR_MAT,scene:new c.THREE.Scene(),palaceDungeon:()=>false,F:()=>c.G.F,lootRemaining15:()=>false,sfx(){},save(){c.saveAttempts=(c.saveAttempts||0)+1;return false;},hudAll(){},banner(){},hurt(){},fadeFlash(){},showAreaTitle(){},spawnDungeonEnemies(){},CAM:{},HORSE:{},setArea:id=>{c.AREA=id;c.DG=id==='over'?null:c.DGS[id];}});
  vm.runInContext(range('const K0=','const K={')+'for(const k in K0)K[k]=hx(K0[k]);'+range('const LEG={','function genMaze(')+'\n'+line('function carve(')+'\n'+line('function gstate(')+'\n'+line('function part(')+'\n'+range('function makeChestMesh(','const GEO=')+'\n'+range('function buildDungeon(','/* ----- area switching ----- */')+'\n'+range('function enterDungeon(','/* ================= 06 PLACES:'),c);
  c.spawnDungeonEnemies=()=>{};c.groundY=(x,z)=>c.AREA==='over'?c.heightAt(x,z):0;
 }
 let city=repairCityAccess(attachedBronzeAgeAdditions.slice(attachedBronzeAgeAdditions.indexOf('/* ODYSSEY LXIV')));if(patched)city=repairRiverCityPlacement(city);if(access)city=repairRiverCityAccess(city);vm.runInContext(city,c);
 return{c,batch};
}
export function installRiverSaveBackend(c){const storage=new Map();Object.assign(c,{NPCS:c.actors,SHEEP:[],ENEMIES:[],BOAT:{x:20,z:30,yaw:0},HORSE:{x:0,z:0},CAM:{yaw:.2,pitch:.3,dist:8},FIRST_PERSON:false,OVCH:[],SAVE_SLOT:1,SAVE_SLOTS:12,BEGINNING21:false,STREAM:{building:false},SaveReadFailure150:class extends Error{},slotKey:n=>'slot'+n,$:()=>null,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},removeEnemy(){},refreshWeapon(){},applyBoat21(){},hudAll(){},hudQuest(){},mobKey:e=>e.id,openPause(){c.STATE='pause';}});
 c.G.started=1;c.G.own={};c.G.disc={};c.G.pos={x:1,z:2,m:'foot'};c.P.yaw=.4;
 for(const n of c.NPCS){n.yaw??=0;n.hp??=80;n.dead??=false;n.hostile??=false;n.h??={g:new c.THREE.Group()};}
 const at=source.indexOf('function continueGame(){');vm.runInContext(line('function snapshot(){')+'\n'+source.slice(at,source.indexOf('\nfunction ',at+15))+'\n'+line('const snapshot21Before=snapshot;')+'\n'+line('const continue21Before=continueGame;')+'\n'+line('save=function(manual=false){if(manual!==true||BEGINNING21')+'\n'+checkpointRestoreSafetyPatch+manualCheckpointFeedbackPatch,c);return storage;
}
