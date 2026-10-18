export const mineContractPatch=String.raw`
/* MINE_CONTRACT_CONTEXT_236 / PHYSICAL_MINING_TOOLS_237 /
   GALLERY_REWARD_HANDOFF_238: existing galleries, tools and wages, no new mines. */
(function(){
 const record236=o=>!!o&&typeof o==='object'&&!Array.isArray(o);
 const count236=v=>Number.isSafeInteger(v)&&v>=0;
 const toolKeys237=['pickaxe',...['wood','flint','copper','bronze','iron','silver','gold','orichalcum','adamantine'].map(m=>'pickaxe_'+m)];
 pickaxeOwned=function(){return toolKeys237.some(k=>Number.isSafeInteger(G.inv?.[k])&&G.inv[k]>0);};
 function context236(n){const s=n?.mineSite36;return s&&MINE_SITES36.includes(s)&&s.n===n&&NPCS.includes(n)&&DUN[s.cave]?.mine36?.id===s.id&&typeof s.id==='string'&&typeof s.name==='string'&&Array.isArray(s.metals)&&Number.isFinite(s.x+s.z)?s:null;}
 function reachable236(n){return !!context236(n)&&AREA==='over'&&(n.area||'over')===AREA&&!n.dead&&!n.hostile&&!n._party&&!P.dead&&P.mode==='foot'&&P.grounded!==false&&!P.mine&&!P.rest&&!P.melee&&!(P.rollT>0)&&!(P.draw>0)&&!(P.guard>0)&&['play','talk'].includes(STATE)&&Number.isFinite(n.x+n.z+P.x+P.z)&&hyp(P.x-n.x,P.z-n.z)<=3.4;}
 function fields236(q){if(q===undefined)return {stage:0,kills:0,ore:0};if(!record236(q))return null;const a={stage:q.stage??0,kills:q.kills??0,ore:q.ore??0};return count236(a.stage)&&a.stage<=3&&count236(a.kills)&&count236(a.ore)?a:null;}
 function quote236(n){if(!reachable236(n)||G.frontier36!==undefined&&(!record236(G.frontier36)||G.frontier36.quest!==undefined&&!record236(G.frontier36.quest)))return null;const s=context236(n),f=frontier36(),book=f.quest;if(!record236(book))return null;const key='mine:'+s.id,q=book[key],v=fields236(q);return v?{game:G,n,s,name:n.name,cave:s.cave,id:s.id,x:s.x,z:s.z,metals:s.metals.join('|'),f,book,key,q,...v,used:false}:null;}
 function valid236(t){const v=fields236(t.book[t.key]);return !t.used&&G===t.game&&G.frontier36===t.f&&t.f.quest===t.book&&t.book[t.key]===t.q&&v&&['stage','kills','ore'].every(k=>v[k]===t[k])&&reachable236(t.n)&&context236(t.n)===t.s&&t.n.name===t.name&&t.s.id===t.id&&t.s.cave===t.cave&&t.s.x===t.x&&t.s.z===t.z&&t.s.metals.join('|')===t.metals&&DLG.lines===t.lines&&DLG.choices===t.choices;}
 function show236(t,lines,choices){const r=say(t.n.name,lines,null,choices.map(o=>({...o,go:()=>{if(!valid236(t))return false;t.used=true;return o.go();}})));t.lines=DLG.lines;t.choices=DLG.choices;return r;}
 function plans237(s){return ['pickhead_flint','pickaxe_flint',...s.metals.map(m=>'smelt_'+(m==='silver'?'silverIngot':m))].filter(k=>RECIPES[k]);}
 function accept237(t){if(openingPending25())return toast('Finish Lykos’s work first.');if(!claimQuest36('frontier:'+t.key))return false;
  if(!record236(G.inv)||!record236(G.own)||!record236(G.weaponMaterials??{})||!record236(t.f.blueprints??{})||!record236(G.knownRecipes30??{}))return toast('The stored tool record needs checking. Nothing was changed.');
  const priorLoan=t.f.mineLoan237===true||G.own.pickaxe>0||Object.entries(t.book).some(([k,q])=>k.startsWith('mine:')&&(q?.stage??0)>0),loan=!pickaxeOwned()&&!priorLoan;
  if(!count236(G.inv.pick_blueprint36??0)||loan&&!count236(G.inv.pickaxe_flint??0))return toast('The stored tool quantity needs checking. Nothing was changed.');
  const q=t.q||{stage:0,kills:0,ore:0,grave:false},world=odyssey13State(),id='frontier:'+t.key;
  if(t.stage===0){q.previousQuest238=typeof world.activeQuest==='string'&&world.activeQuest!==id?world.activeQuest:'main';q.stage=1;t.book[t.key]=q;}q.kills=t.kills;q.ore=t.ore;
  learnPlans36(plans237(t.s));G.inv.pick_blueprint36=Math.max(1,G.inv.pick_blueprint36||0);
  if(loan){G.inv.pickaxe_flint=(G.inv.pickaxe_flint||0)+1;G.own.pickaxe=1;G.weaponMaterials||={};G.weaponMaterials.pickaxe='flint';t.f.mineLoan237=true;}
  world.activeQuest=id;hudAll();hudQuest();return say(t.n.name,[loan?'Take this working flint pick. It is one tool, not a fresh pick each time we speak.':pickaxeOwned()?'You already carry a working pick. Keep it for the cutting.':'The first tool has already been issued. Shape a flint pick head and bind it to a wooden handle with fiber at a workbench; the taught patterns remain yours.',
   'Mine two measures yourself from this mine’s ore face and drive three intruders from its lower gallery. Purchased ore and fighting elsewhere do not demonstrate the work. Keep the ore you cut. The wage is 65 silver, two copper ingots and copper tool patterns.']);
 }
 function report238(t){if(t.stage<1)return toast('Accept the gallery contract first.');if(t.stage>=3)return false;if(t.kills<3||t.ore<2)return say(t.n.name,['Your gallery work: '+t.kills+'/3 intruders; '+t.ore+'/2 ore cut. Keep the ore you mined. Return when both tasks are done.']);
  if(!record236(G.inv)||!record236(t.f.blueprints??{})||!record236(G.knownRecipes30??{})||!count236(G.silver)||!count236(G.inv.copper??0)||G.silver>Number.MAX_SAFE_INTEGER-65||(G.inv.copper||0)>Number.MAX_SAFE_INTEGER-2||!count236(G.xp)||G.xp>Number.MAX_SAFE_INTEGER-45)return toast('The stored reward quantities need checking. Nothing was changed.');
  const q=t.q,world=odyssey13State();q.stage=3;G.silver+=65;G.inv.copper=(G.inv.copper||0)+2;addXp(45);learnPlans36(['axehead_copper','axe_copper','pickhead_copper','pickaxe_copper'].filter(k=>RECIPES[k]));
  if(world.activeQuest==='frontier:'+t.key)world.activeQuest=typeof q.previousQuest238==='string'&&q.previousQuest238!=='frontier:'+t.key?q.previousQuest238:'main';
  hudAll();hudQuest();return say(t.n.name,['The cutting is ours again. Here are your 65 silver and two copper ingots. Keep your mined ore and these copper tool patterns. The furnace turns ore into ingots; the workbench shapes and binds tools.']);
 }
 caveContract36=function(n){const t=quote236(n);if(!t)return toast('Approach the available mine keeper on foot.');const choices=[{t:'Mark the mine and cave',go:()=>{mapReveal13(t.x,t.z,60);return npcMapHints13(n,t.s,t.s.name);}}];
  if(t.stage<3)choices.push({t:t.stage?'Resume the gallery contract':'Learn mining / accept the gallery contract',go:()=>accept237(t)},{t:'Report the gallery work',go:()=>report238(t)});
  choices.push({t:'Leave',go:()=>closeDlg()});return show236(t,t.stage===3?['The workers have returned to '+t.s.name+'. Your gallery wage has been paid.']:['The '+t.s.name+' exposes '+t.s.metals.map(m=>m+' ore veins').join(', ')+'. Ore goes to the furnace; tools are shaped and bound at a workbench.','Robbers and kobaloi hold the lower gallery. Learn the cutting, keep two measures you mine yourself, and drive off three intruders for 65 silver, two copper ingots and copper tool patterns. Taking this optional assignment does not complete the king’s errand.'],choices);
 };
 const teacherBefore236=teacherTalk48;teacherTalk48=function(n,old){return context236(n)?caveContract36(n):teacherBefore236.apply(this,arguments);};
 Object.assign(globalThis,{mineContext236:context236,mineReachable236:reachable236,minePlans237:plans237});
})();`;
