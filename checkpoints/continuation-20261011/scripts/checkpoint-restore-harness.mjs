import fs from 'node:fs';import vm from 'node:vm';import {checkpointRestoreSafetyPatch,manualCheckpointFeedbackPatch} from './checkpoint-restore-safety-patch.mjs';import {continueSaveSafetyPatch} from './continue-save-safety-patch.mjs';
const seed=fs.readFileSync(new URL('../recovered/Cinematic-Lock-Lesson.html',import.meta.url),'utf8'),lines=seed.split('\n');
const line=p=>{const s=lines.find(x=>x.startsWith(p));if(!s)throw Error('Missing native '+p);return s;};
const saveButtonLine=lines.find(x=>x.startsWith("$('dbtn').onclick=()=>respawn();$('psave').onclick=")&&x.includes('if(save(true))'));
export function checkpointHarness(patched=true){
 const nodes=new Map(),storage=new Map(),writes=[],messages=[];
 function element(id){if(nodes.has(id))return nodes.get(id);const e={id,dataset:{},attrs:{},textContent:'',children:[],setAttribute(k,v){this.attrs[k]=v;},getAttribute(k){return this.attrs[k]||null;},appendChild(n){this.children.push(n);nodes.set(n.id,n);},querySelector(q){return q==='.bd'?element('pause-body'):null;}};nodes.set(id,e);return e;}
 const c={G:{started:1,inv:{},own:{},F:{},world:{},disc:{},pos:{x:1,z:2,m:'foot'}},P:{x:1.25,y:3.75,z:2.5,yaw:.6,mode:'foot',oxygen:8,dead:false},AREA:'over',STATE:'play',SAVE_SLOT:1,SAVE_SLOTS:12,BEGINNING21:false,STREAM:{building:false},CAM:{yaw:.7,pitch:.3,dist:8},FIRST_PERSON:false,NPCS:[],SHEEP:[],ENEMIES:[],BOAT:{x:20,z:30,yaw:1},HORSE:{x:0,z:0},DUN:{},DG:null,OVCH:[],DOCKS:[{bx:20,bz:30,yaw:1}],LOC:{start:{x:0,z:0}},F:()=>c.G.F,groundY:()=>3,setArea:a=>c.AREA=a,refreshWeapon(){},hudAll(){},hudQuest(){},applyBoat21(){},removeEnemy(){},mobKey:e=>e.key,slotKey:n=>'slot'+n,toast:t=>messages.push(t),openPause(){if(c.STATE==='play')c.STATE='pause';},localStorage:{getItem:k=>storage.get(k)||null,setItem(k,v){writes.push({k,v});storage.set(k,v);}},document:{createElement:()=>element('new'+nodes.size)},$:id=>nodes.get(id)||(['pause','psave','pause-body','dbtn'].includes(id)?element(id):null),respawn(){},SaveReadFailure150:class SaveReadFailure150 extends Error{}};
 vm.createContext(c);const at=seed.indexOf('function continueGame(){');vm.runInContext(line('function snapshot(){')+'\n'+seed.slice(at,seed.indexOf('\nfunction ',at+15))+'\n'+line('const snapshot21Before=snapshot;')+'\n'+line('const continue21Before=continueGame;')+'\n'+line('save=function(manual=false){if(manual!==true||BEGINNING21')+'\n'+saveButtonLine+'\n'+line('function routePCKey(e){'),c);
 c.enterDungeon=(id)=>{c.AREA=id;c.DG={id};};
 c.hasSave=()=>storage.has('slot'+c.SAVE_SLOT);c.loadGame=()=>true;c.streamArrival=(x,z,act)=>act();c.startGame=()=>c.streamArrival(0,0,()=>c.continueGame());c.document.body={classList:{remove(){}}};element('title').classList={add(){}};
 vm.runInContext(continueSaveSafetyPatch,c);
 if(patched)vm.runInContext(checkpointRestoreSafetyPatch+manualCheckpointFeedbackPatch,c);
 const actor=(name,x=0)=>({name,x,z:x+1,yaw:.2,area:'over',hp:80,dead:false,hostile:false,inventory:{fig:1},h:{g:{visible:true}}});
 return{c,storage,writes,messages,nodes,actor,saveButton:()=>c.$('psave').onclick(),f5:()=>c.routePCKey({type:'keydown',code:'F5',preventDefault(){},stopImmediatePropagation(){}})};
}
export const data=x=>JSON.parse(JSON.stringify(x));
