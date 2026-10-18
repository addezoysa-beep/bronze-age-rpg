export const relicRecoveryGuidancePatch=String.raw`
/* RELIC_RECOVERY_GUIDANCE_175 / RELIC_AREA_GUIDANCE_216 /
   RELIC_CARGO_CONSERVATION_217 / FIELD_RUBBING_GUIDANCE_218:
   physical relics, actual areas and stored copies. */
(function(){
 const stones=new Map();
 function stonePoint175(q){const x=typeof q?.x==='function'?q.x():q?.x,z=typeof q?.z==='function'?q.z():q?.z;return Number.isFinite(x)&&Number.isFinite(z)?{x,z}:null;}
 function dungeon216(area){return typeof DGS==='undefined'?null:DGS[area];}
 function outside216(area){return stonePoint175(dungeon216(area)?.out);}
 function origin216(){return AREA==='over'?stonePoint175(P):typeof DG!=='undefined'&&DG&&dungeon216(AREA)===DG?stonePoint175(DG.out):null;}
 function scribeAvailable216(n){return n&&NPCS.includes(n)&&!n.dead&&!n.hostile&&!n._party;}
 function scribePoint175(n){return n?stonePoint175((n.area||'over')==='over'?n:n.house||n.tavern15||n.inn48)||outside216(n.area):null;}
 function storedPoint216(label,p,area='over'){return{label,area,point:stonePoint175(p),outside:area==='over'?stonePoint175(p):outside216(area)};}
 function storedRelic175(key){
  if((G.logistics?.horse?.items?.[key]||0)>0)return storedPoint216('your horse’s packs',typeof HORSE==='undefined'?null:HORSE);
  for(const[name,q]of Object.entries(G.logistics?.followers||{}))if((q.items?.[key]||0)>0){const n=NPCS.find(n=>n.name===name&&!n.dead);return storedPoint216(name+'’s supplies',n,n?.area||'over');}
  // Ship cargo is native serialized storage too; never replace that extant copy.
  if((G.seafaring21?.cargo?.[key]||0)>0)return storedPoint216('your ship’s cargo',typeof BOAT==='undefined'?null:BOAT);
  for(const q of G.world?.ownedChests106||[])if((q.items?.[key]||0)>0)return storedPoint216('your cedar storage chest',q,q.area||'over');
  for(const[id,q]of Object.entries(G.world?.loot||{}))if((!q.claimed||/^(chest:|overChest:)/.test(id))&&(q.items?.[key]||0)>0)return storedPoint216(q.label||'stored belongings',q,q.area||'over');return null;
 }
 function bindRelicStones175(){stones.clear();for(const[id,w]of Object.entries(WRITING)){const label='Decipher the '+w.title+' relic stone',q=INTS.find(i=>(typeof i.label==='function'?i.label():i.label)===label);if(!q)continue;stones.set(id,q);if(q.relicRecovery175)continue;const before=q.act;q.relicRecovery175=true;q.act=function(){const point=stonePoint175(q);if(!INTS.includes(q)||AREA!=='over'||P.dead||!point||hyp(P.x-point.x,P.z-point.z)>3.5)return toast('Approach the inscribed relic stone.');const st=literacyState()[id],stored=storedRelic175(w.item);if(st.stage>=4&&(G.inv[w.item]||0)<1&&stored)return toast('Retrieve '+w.relic+' from '+stored.label+'.');if(st.stage>=4&&st.relic&&(G.inv[w.item]||0)<1){G.inv[w.item]=1;hudAll();hudQuest();save();banner('Relic recovered',w.relic+' is back in your keeping.');return;}return before.apply(this,arguments);};}}
 function missingRelic175(){
  const st=literacyState(),missing=Object.entries(WRITING).filter(([id,w])=>!st[id].relic||(G.inv[w.item]||0)<1);if(!missing.length)return null;
  const origin=origin216(),here=origin?nearestIsle(origin.x,origin.z):null;let chosen=missing.find(([,w])=>w.island===here);
  const scribe=id=>SCRIPT_SCRIBES.find(n=>n.script===id&&scribeAvailable216(n));
  if(!chosen)chosen=missing.map(([id,w])=>{const p=scribePoint175(scribe(id));return{id,w,d:origin&&p?hyp(origin.x-p.x,origin.z-p.z):Infinity};}).sort((a,b)=>a.d-b.d).map(a=>[a.id,a.w])[0];
  const[id,w]=chosen,q=st[id],n=scribe(id),stone=stones.get(id),stored=storedRelic175(w.item),field=q.stage===0&&q.accepted&&!q.fieldRead;let target;
  if(q.stage>=4&&stored)target=stored;
  else if(q.stage>=4)target={area:'over',point:stone&&INTS.includes(stone)?stonePoint175(stone):null};
  else if(field){const label='Read '+w.title+' field inscription',i=INTS.find(i=>(typeof i.label==='function'?i.label():i.label)===label);target={area:'over',point:stonePoint175(i)};}
  else target={area:n?.area||'over',point:stonePoint175(n),outside:scribePoint175(n)};
  const same=AREA===target.area&&(AREA==='over'||typeof DG!=='undefined'&&DG&&dungeon216(AREA)===DG),exit=AREA!=='over'&&!same;
  const point=same?target.point:exit?(typeof DG!=='undefined'&&DG&&dungeon216(AREA)===DG?stonePoint175(DG.start):null):target.outside||outside216(target.area);
  return{id,w,q,stored,field,area:target.area,exit,point:point||{x:null,z:null}};
 }
 const objective175Before=mainObjective13;mainObjective13=function(){const f=F();if(f.kadmos&&!f.won&&!allWritingRelics()){if(!rescuePlan164().oracleRevealed)return{t:'Ask the Pythia at Delphi where to find Shekelesh’s four ward-breaking relics',...LOC.delphi};const m=missingRelic175();if(m){let action=m.q.stage>=4&&m.stored?'Retrieve '+m.w.relic+' from '+m.stored.label:m.field?'Read the '+m.w.title+' field inscription, then return to '+m.w.scribe:m.q.stage<4?'Study with '+m.w.scribe+' · lesson '+Math.min(4,m.q.stage+1)+'/4':m.q.relic?'Recover the missing '+m.w.relic+' at its inscribed stone':'Decipher the relic stone and take '+m.w.relic;if(m.exit)action='Leave this place, then '+action.charAt(0).toLowerCase()+action.slice(1);return{t:action,...m.point};}}return objective175Before();};
 const hint175Before=hintLine;hintLine=function(){if(F().kadmos&&!F().won&&!allWritingRelics())return mainObjective13().t;return hint175Before.apply(this,arguments);};
 const populate175Before=populate;populate=async function(){const r=await populate175Before.apply(this,arguments);bindRelicStones175();return r;};bindRelicStones175();
 Object.assign(globalThis,{bindRelicStones175,missingRelic175});
})();`;
