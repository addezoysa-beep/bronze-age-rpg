import test from 'node:test';
import assert from 'node:assert/strict';
import {createContext,runInContext} from 'node:vm';
import {remedyRuntime} from './remedies-checkpoint.mjs';
function fixture(){
 const c=createContext({G:{hp:10,maxHp:100,stamina:10,maxStamina:100,inv:{},silver:100,staminaDelay:0},P:{dead:false},STATE:'bag',LABEL48:{},WEIGHT:{},FOOD:{},RECIPES:Object.fromEntries(['healing_tonic48','warming_tonic48','stamina_tonic48','bandage48','ointment48'].map(k=>[k,{n:k}])),mouse:{},keys:{},BAG_TAB:'food',
 clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),eatFood:()=>{},staminaTick:()=>{},updatePlayer:()=>{},die:()=>{},loadGame:()=>true,lesson48:()=>{},serviceTalk48:()=>{},renderBag:()=>{},recipeKnown30:()=>false,
 ensureStamina:()=>{},injuryLimit22:()=>100,hudAll:()=>{},sfx:()=>{},toast:()=>{},learnPlans36:()=>{},say:()=>{},buyService48:()=>{},$:()=>({querySelectorAll:()=>[]})});
 runInContext(remedyRuntime+'\nglobalThis.defs=REMEDIES62;',c);return c;
}
test('four remedies register real ingredient IDs, recipe output, Food use, labels and weights',()=>{
 const c=fixture();assert.equal(Object.keys(c.defs).length,4);
 const allowed=new Set(['fig','honey','herb','water36','grain']);
 for(const k of Object.keys(c.defs)){const r=c.RECIPES[k];
  for(const [ingredient,n]of Object.entries(r.need)){assert.ok(allowed.has(ingredient));assert.ok(Number.isInteger(n)&&n>0);}
  r.make();assert.equal(c.G.inv[k],1);assert.ok(c.FOOD[k]);assert.ok(c.LABEL48[k]);assert.ok(c.WEIGHT[k]>0);
 }
});
test('instant remedies consume one, clamp health/stamina, and cannot consume absent items',()=>{
 const c=fixture();c.G.inv.fig_restorative62=2;c.eatFood('fig_restorative62');assert.equal(c.G.hp,28);assert.equal(c.G.stamina,35);assert.equal(c.G.inv.fig_restorative62,1);
 c.G.hp=98;c.G.stamina=98;c.eatFood('fig_restorative62');assert.equal(c.G.hp,100);assert.equal(c.G.stamina,100);assert.equal(c.G.inv.fig_restorative62,0);c.eatFood('fig_restorative62');assert.equal(c.G.inv.fig_restorative62,0);
 c.G.inv.concentrated_remedy62=1;c.G.hp=10;c.eatFood('concentrated_remedy62');assert.equal(c.G.hp,65);
});
test('healing infusion pauses, heals at most 36, expires, and cannot stack or refresh',()=>{
 const c=fixture();c.G.inv.herb_infusion62=2;c.eatFood('herb_infusion62');c.eatFood('herb_infusion62');assert.equal(c.G.inv.herb_infusion62,1);
 c.remedyTick62(10);assert.equal(c.G.hp,10);assert.equal(c.G.remedies62.heal.left,24);
 c.STATE='play';c.remedyTick62(8);assert.equal(c.G.hp,22);assert.equal(c.G.remedies62.heal.left,16);
 c.eatFood('herb_infusion62');assert.equal(c.G.inv.herb_infusion62,1);assert.equal(c.G.remedies62.heal.left,16);
 c.remedyTick62(30);assert.equal(c.G.hp,46);assert.equal(c.G.remedies62.heal,undefined);c.remedyTick62(30);assert.equal(c.G.hp,46);
});
test('endurance boosts only ordinary recovery and expires without stacking',()=>{
 for(const restriction of ['delay','guard','swordGuard22','draw','melee','mine','shear22','rollT','mouse','key']){
  const c=fixture();c.G.inv.endurance_draught62=2;c.eatFood('endurance_draught62');c.eatFood('endurance_draught62');assert.equal(c.G.inv.endurance_draught62,1);c.STATE='play';
  if(restriction==='delay')c.G.staminaDelay=1;else if(restriction==='mouse')c.mouse.r=true;else if(restriction==='key')c.keys.KeyG=true;else c.P[restriction]=1;
  c.staminaTick(1);assert.equal(c.G.stamina,10,restriction);
 }
 const c=fixture();c.G.inv.endurance_draught62=1;c.eatFood('endurance_draught62');c.STATE='play';c.staminaTick(1);assert.equal(c.G.stamina,18);c.remedyTick62(39.75);c.staminaTick(1);assert.equal(c.G.stamina,20);c.remedyTick62(1);assert.equal(c.G.remedies62.endurance,undefined);c.staminaTick(1);assert.equal(c.G.stamina,20);
});
test('timed effects survive JSON save/load with remaining potency and safe old-save defaults',()=>{
 const c=fixture();c.G.inv.herb_infusion62=1;c.eatFood('herb_infusion62');c.STATE='play';c.remedyTick62(7);
 const restored=fixture();restored.G=JSON.parse(JSON.stringify(c.G));restored.loadGame(1);restored.STATE='play';restored.remedyTick62(100);assert.equal(restored.G.hp,46);assert.equal(restored.G.remedies62.heal,undefined);
 const old=fixture();old.loadGame(1);assert.deepEqual(JSON.parse(JSON.stringify(old.G.remedies62)),{});
});
test('death clears effects and blocks consumption; malformed saved durations/potency are bounded',()=>{
 const c=fixture();c.G.remedies62={heal:{left:999,budget:999},endurance:{left:999}};c.loadGame(1);assert.equal(c.G.remedies62.heal.left,24);assert.equal(c.G.remedies62.heal.budget,36);assert.equal(c.G.remedies62.endurance.left,40);
 c.G.remedies62.heal={left:2,budget:999};c.loadGame(1);assert.equal(c.G.remedies62.heal.budget,3);c.die();assert.equal(Object.keys(c.G.remedies62).length,0);c.P.dead=true;c.G.inv.concentrated_remedy62=1;c.eatFood('concentrated_remedy62');assert.equal(c.G.inv.concentrated_remedy62,1);
 c.G.remedies62={heal:{left:NaN,budget:30},endurance:{left:Infinity}};c.loadGame(1);assert.equal(Object.keys(c.G.remedies62).length,0);
});
test('healer sells all four with real purchase callbacks and paginated recipe lessons',()=>{
 const c=fixture();let options,bought,learned;c.say=(name,lines,done,choices)=>{options=choices};c.buyService48=(...a)=>{bought=a};c.learnPlans36=a=>{learned=a};
 const n={name:'Healer',service48:'heal'};c.serviceTalk48(n);options.find(o=>o.t==='More health and stamina remedies').go();assert.equal(options.length,5);
 options[0].go();assert.deepEqual(bought,['fig_restorative62',1,18]);
 c.lesson48(n,'remedy',1);assert.equal(options.length,3);const choice=options[0];c.G.silver=0;choice.go();assert.equal(learned,undefined);c.G.silver=18;choice.go();assert.equal(c.G.silver,0);assert.ok(c.defs[learned[0]]);
});
