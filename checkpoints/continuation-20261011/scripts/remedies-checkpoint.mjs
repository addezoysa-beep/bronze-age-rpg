export const remedyRuntime = `
/* Restoration remedies use remaining gameplay time, serialized with the save. */
const REMEDIES62={
 fig_restorative62:{name:'Honeyed fig restorative',need:{fig:2,honey:1},weight:.18,price:18,hp:18,stamina:25,description:'Restores 18 health and 25 stamina'},
 concentrated_remedy62:{name:'Concentrated herbal remedy',need:{herb:5,honey:2,water36:1},weight:.2,price:36,hp:55,description:'Restores 55 health'},
 herb_infusion62:{name:'Restorative herb infusion',need:{herb:3,honey:1,water36:1},weight:.25,price:28,effect:'heal',duration:24,budget:36,description:'Restores up to 36 health over 24 seconds; does not stack'},
 endurance_draught62:{name:'Barley endurance draught',need:{grain:3,honey:2,herb:1,water36:1},weight:.25,price:30,effect:'endurance',duration:40,description:'Adds 8 stamina per second to ordinary recovery for 40 seconds; does not stack'}
};
for(const[k,r]of Object.entries(REMEDIES62)){
 LABEL48[k]=r.name;WEIGHT[k]=r.weight;FOOD[k]=[0,0,0];
 RECIPES[k]={n:r.name+' · '+r.description,need:{...r.need},hearth22:k!=='fig_restorative62',make:()=>G.inv[k]=(G.inv[k]||0)+1};
}
function remedyState62(){
 const s=G.remedies62&&typeof G.remedies62==='object'&&!Array.isArray(G.remedies62)?G.remedies62:(G.remedies62={});
 for(const [key,maxTime,maxBudget]of [['heal',24,36],['endurance',40,0]]){
  const e=s[key];if(!e||!Number.isFinite(e.left)||e.left<=0){delete s[key];continue;}
  e.left=clamp(e.left,0,maxTime);if(key==='heal'){
   if(!Number.isFinite(e.budget)||e.budget<=0){delete s[key];continue;}
   e.budget=clamp(e.budget,0,Math.min(maxBudget,e.left*1.5));
  }
 }
 return s;
}
function remedyTick62(dt){
 const s=remedyState62();if(P.dead){G.remedies62={};return;}
 if(STATE!=='play'||!Number.isFinite(dt)||dt<=0)return;
 if(s.heal){const e=s.heal,t=Math.min(dt,e.left),gain=Math.min(e.budget,t*1.5);G.hp=clamp(G.hp+gain,0,G.maxHp);e.budget-=gain;e.left-=t;if(e.left<=1e-8||e.budget<=1e-8)delete s.heal;}
 if(s.endurance){s.endurance.left=Math.max(0,s.endurance.left-dt);if(s.endurance.left<=1e-8)delete s.endurance;}
}
const remedyEat62Before=eatFood;eatFood=function(k){
 const r=REMEDIES62[k];if(!r)return remedyEat62Before(k);
 if(P.dead||!['play','bag'].includes(STATE)||(G.inv[k]||0)<1)return;
 const s=remedyState62();if(r.effect&&s[r.effect])return toast('That remedy is still active. Wait until it wears off.');
 ensureStamina();G.inv[k]--;
 if(r.hp)G.hp=clamp(G.hp+r.hp,0,G.maxHp);
 if(r.stamina)G.stamina=clamp(G.stamina+r.stamina,0,Math.min(G.maxStamina,injuryLimit22()));
 if(r.effect)s[r.effect]={left:r.duration,...(r.budget?{budget:r.budget}:{})};
 hudAll();renderBag();sfx('drink');toast(r.name+' · '+r.description);
};
const remedyStamina62Before=staminaTick;staminaTick=function(dt){
 const e=remedyState62().endurance;remedyStamina62Before(dt);
 if(e&&STATE==='play'&&!P.dead&&Number.isFinite(dt)&&dt>0&&G.staminaDelay<=0&&!P.guard&&!P.swordGuard22&&!P.draw&&!P.melee&&!P.mine&&!P.shear22&&!P.rollT&&!mouse.r&&!keys.KeyG&&!keys.KeyK){
  const cap=Math.min(G.maxStamina,injuryLimit22());G.stamina=Math.min(cap,G.stamina+8*Math.min(dt,e.left));
 }
};
const remedyPlayer62Before=updatePlayer;updatePlayer=function(dt){const r=remedyPlayer62Before(dt);remedyTick62(dt);return r;};
const remedyDeath62Before=die;die=function(){G.remedies62={};return remedyDeath62Before();};
const remedyLoad62Before=loadGame;loadGame=function(n){const ok=remedyLoad62Before(n);if(ok)remedyState62();return ok;};
const remedyLesson62Before=lesson48;lesson48=function(n,type,page=0){
 if(type!=='remedy')return remedyLesson62Before(n,type,page);
 const all=['healing_tonic48','warming_tonic48','stamina_tonic48','bandage48','ointment48',...Object.keys(REMEDIES62)].filter(k=>RECIPES[k]&&!recipeKnown30(k)),list=all.slice(page*6,page*6+6);
 say(n.name,['I can teach instant restoratives, a slow healing infusion, or a draught that helps you catch your breath. Timed remedies do not stack.'],null,
  list.map(k=>({t:'Learn '+RECIPES[k].n+' · 18 silver',go:()=>{if(recipeKnown30(k))return toast('You already know this remedy.');if(G.silver<18)return toast('You need 18 silver.');G.silver-=18;learnPlans36([k]);hudAll();toast('Learned '+RECIPES[k].n);}})).concat(all.length>(page+1)*6?[{t:'More lessons',go:()=>lesson48(n,type,page+1)}]:[]));
};
function restorativeShop62(n){say(n.name,['The infusion heals slowly. The endurance draught helps ordinary stamina recovery; blocking, drawing and fighting still interrupt recovery.'],null,
 Object.entries(REMEDIES62).map(([k,r])=>({t:'Buy '+r.name+' · '+r.price+' silver',go:()=>buyService48(k,1,r.price)})).concat([{t:'Learn remedies',go:()=>lesson48(n,'remedy')}]));}
const remedyService62Before=serviceTalk48;serviceTalk48=function(n){
 if(n.service48!=='heal')return remedyService62Before(n);
 say(n.name,['I prepare restoratives for wounds and exhaustion. Ask about treatment, supplies or the stronger mixtures.'],null,
 [{t:'Treatment and basic supplies',go:()=>remedyService62Before(n)},{t:'More health and stamina remedies',go:()=>restorativeShop62(n)},{t:'Learn remedies',go:()=>lesson48(n,'remedy')}]);
};
const remedyBag62Before=renderBag;renderBag=function(){remedyBag62Before();if(BAG_TAB!=='food')return;for(const row of $('bagbody').querySelectorAll('[data-select]')){const r=REMEDIES62[row.dataset.select];if(r)row.querySelector('small')?.insertAdjacentText('beforeend',' · '+r.description);}};
`;
export function applyRemediesCheckpoint(html){const anchor='/* END BUILD48 MODULES */';if(html.split(anchor).length!==2)throw new Error('Remedies require one final module anchor');return html.replace(anchor,remedyRuntime+'\n'+anchor);}

