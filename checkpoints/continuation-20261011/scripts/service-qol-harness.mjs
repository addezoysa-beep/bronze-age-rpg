import fs from 'node:fs';import vm from 'node:vm';
import {regionalServiceIdentitiesPatch} from './regional-service-identities-patch.mjs';
import {serviceInteractionGuardPatch} from './service-interaction-guard-patch.mjs';
import {greatswordSmithRuntime} from './greatsword-smith-checkpoint.mjs';
import {healerServicePriorityPatch} from './healer-service-priority-patch.mjs';
import {resourceDirectionsPatch} from './resource-directions-patch.mjs';
import {remedyRuntime} from './remedies-checkpoint.mjs';
const seed=fs.readFileSync(new URL('../recovered/Cinematic-Lock-Lesson.html',import.meta.url),'utf8');
export function serviceHarness({remedies=false}={}){
 const elements=new Map(),element=()=>({textContent:'',style:{},children:[],classList:{add(){},remove(){}},appendChild(n){this.children.push(n);},set innerHTML(v){this.children=[];},get innerHTML(){return'';}});
 const group=()=>({position:{set(){}},rotation:{},add(){}});
 const c={Math,STATE:'play',AREA:'over',P:{x:0,z:0,mode:'foot',dead:false},G:{silver:1000,hp:10,maxHp:100,level:1,day:1,inv:{},world:{deaths:{},loot:{},followers:[],greatOrders71:{},chart:{rumours:{}}}},NPCS:[],INTS:[],DISC:[],INT_GRID16:{},SERVICES48:new Map(),IS:{},EGYPT58:{cities:[{id:'luxor58',name:'Waset · Luxor'},{id:'valley58',name:'Valley of the Kings · Workers’ Village'}]},HOUSE_ENTRIES:[],TEXTILE_WORKERS36:[],K:{cream:1,woodD:2,ochre:3,linen:4},ACTOR_MAT:{},OVER:{add(){}},Batch:class{mesh(){return{};}},hyp:Math.hypot,rr:()=>0,rnd:()=>.3,makeHuman:()=>({g:group()}),makeShadow:()=>({}),setWeapon(){},npcRole:()=> 'social',groundY:()=>3,landPoint15:(x,z)=>({x,z}),detailedBench14(){},furnace14(){},assignResident(){},nearestIsle:()=>c.region||'ikaria',holdCulture20:id=>id==='egypt'||id==='pharos'?'egypt':id==='mesopotamia'?'mesopotamia':id==='scythia'?'scythian':'aegean',DISCOVER(name,x,z,r,xp){c.DISC.push({id:name,name,x,z,r,xp});},restoreLivingWorld(){},syncWorldLoot(){},householdTick(){},populate:async()=>{},currentInts:()=>[],T_NOW:0,document:{createElement:()=>element(),exitPointerLock(){}},mouse:{},keys:{},$:(id)=>{if(!elements.has(id))elements.set(id,element());return elements.get(id);},DLG:{},sfx(){},toast:m=>c.message=m,hudAll(){},save(){c.saves=(c.saves||0)+1;},lootEquipment(items){for(const[k,v]of Object.entries(items))c.G.inv[k]=(c.G.inv[k]||0)+v;},itemLabel:k=>k,recipeKnown30:k=>!!c.known[k],learnPlans36(ks){for(const k of ks)c.known[k]=1;},known:{},KNOWLEDGE48:{cook:[]},RECIPES:{wool_tunic:{n:'Wool tunic'},greatsword_aegean_copper:{n:'Copper long blade'},greatsword_aegean_bronze:{n:'Bronze long blade'}},FOOD:{},REGIONAL_ITEMS48:{greatsword_aegean_copper:{culture:'aegean'},greatsword_aegean_bronze:{culture:'aegean'}},openingPending25:()=>false,livingState:()=>c.G.world,odyssey13State:()=>c.G.world,npcMapHints13(n,p,name){c.G.world.chart.rumours[name]={id:name,name,x:p.x,z:p.z};},TAVERNS15:[],INNS48:new Map(),WELLS36:[],existingWellUsable76:()=>true};
 vm.createContext(c);
 const line=(prefix)=>{const s=seed.split('\n').find(l=>l.startsWith(prefix));if(!s)throw Error('Missing actual source '+prefix);return s;};
 vm.runInContext(seed.slice(seed.indexOf('function say('),seed.indexOf('/* ---- shops ---- */')),c);
 for(const name of['function addNPC(','function serviceTalk48(','function buyService48(','function createServices48(','function serviceDirections48(','function restoreLivingWorld(','function arrowTrade48(','function lesson48(','const arrowPrices48='])vm.runInContext(line(name),c);
 if(remedies){Object.assign(c,{LABEL48:{},WEIGHT:{},clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),eatFood(){},staminaTick(){},updatePlayer(){},die(){},loadGame(){return true;},renderBag(){},ensureStamina(){},injuryLimit22:()=>100});vm.runInContext(remedyRuntime,c);}
 c.addArrows30=(m,n)=>{c.G.inv['arrow_'+m]=(c.G.inv['arrow_'+m]||0)+n;};
 c.rawSpeakers=[];const say=c.say;c.say=function(name,...args){c.rawSpeakers.push(name);return say(name,...args);};
 vm.runInContext(greatswordSmithRuntime,c);vm.runInContext(healerServicePriorityPatch,c);vm.runInContext(resourceDirectionsPatch,c);
 vm.runInContext(regionalServiceIdentitiesPatch,c);vm.runInContext(serviceInteractionGuardPatch,c);
 function hub(key,id=key,extra={}){c.IS[id]||={name:id};const s={id,x:c.SERVICES48.size*1000,z:0,cast:[],...extra};c.SERVICES48.set(key,s);c.createServices48(s);return s;}
 return {c,hub,elements};
}
export function stand(c,n){c.P.x=n.x;c.P.z=n.z;c.AREA=n.area||'over';c.STATE='play';}
export function serviceClick(c,text){while(c.DLG.i<c.DLG.lines.length-1)c.dlgAdvance();const b=c.$('dchoices').children.find(b=>b.textContent.includes(text));if(!b)throw Error('No native choice '+text+' in '+c.$('dchoices').children.map(b=>b.textContent).join('; '));b.onclick({stopPropagation(){}});}
