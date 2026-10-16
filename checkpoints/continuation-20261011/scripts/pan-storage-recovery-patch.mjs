export const panStorageRecoveryPatch=String.raw`
/* PAN_STORAGE_RECOVERY_205: possession, storage and lost-tablet recovery are
   different states. Never replace an extant copy or replay chest rewards. */
(function(){
 let withdrawing205=null;
 function tabletStorage205(exclude=null){
  const has=q=>(q?.[PAN_TALLY61]||0)>0,point=(p,area='over')=>area===AREA&&Number.isFinite(p?.x)&&Number.isFinite(p?.z)?{x:p.x,z:p.z}:{x:null,z:null};
  if(has(G.logistics?.horse?.items))return{label:'your horse’s packs',...point(typeof HORSE==='undefined'?null:HORSE)};
  for(const[name,q]of Object.entries(G.logistics?.followers||{}))if(has(q.items)){const n=NPCS.find(n=>n.name===name&&!n.dead);return{label:name+'’s supplies',...point(n,n?.area||'over')};}
  if(has(G.seafaring21?.cargo))return{label:'your ship’s cargo',...point(typeof BOAT==='undefined'?null:BOAT)};
  for(const q of G.world?.ownedChests106||[])if(has(q.items))return{label:'your cedar storage chest',...point(q)};
  for(const[id,q]of Object.entries(G.world?.loot||{}))if(q!==exclude&&id!==PAN_CHEST61&&(!q.claimed||/^(chest:|overChest:)/.test(id))&&has(q.items))return{label:q.label||'stored belongings',...point(q,q.area||'over')};
  return null;
 }
 const ensure205Before=ensurePanTally61;ensurePanTally61=function(id){if(tabletStorage205())return;return ensure205Before.apply(this,arguments);};
 restorePanTablet90=function(){
  if(!F().cave||F().daedalus||F().proteus||F().kadmos||F().won||panTallyHeld61()||tabletStorage205())return false;
  const s=livingState(),p=DGS.cave?.bossPos;let q=s.loot[PAN_CHEST61];
  // LOC.cave is the outdoor entrance, not a valid dungeon chest coordinate.
  if(!q){if(!Number.isFinite(p?.x)||!Number.isFinite(p?.z))return false;s.loot[PAN_CHEST61]=q={x:p.x,z:p.z,area:'cave',items:{},label:'Captain’s stores'};}
  q.items||={};q.items[PAN_TALLY61]=1;q.claimed=false;s.panTallyCollected61=false;return true;
 };
 const loot205Before=lootEquipment;lootEquipment=function(items){
  if(!(items?.[PAN_TALLY61]>0))return loot205Before.apply(this,arguments);
  const data={...items},s=livingState(),collected=s.panTallyCollected61;
  if(panTallyHeld61()||tabletStorage205(withdrawing205))delete data[PAN_TALLY61];
  else{data[PAN_TALLY61]=1;s.panTallyCollected61=false;}
  // Native transfers debit storage before delivery. Its old collection flag
  // must not swallow the only actual tablet on withdrawal.
  try{return loot205Before.call(this,data);}finally{if(collected||panTallyHeld61())s.panTallyCollected61=true;}
 };
 // Native world-loot UI debits AFTER its take callback; unlike carrier/owned
 // chest transfer, the source still holds the tablet during lootEquipment.
 const show205Before=showLoot;showLoot=function(title,items,take){const game=G,entry=Object.entries(G.world?.loot||{}).find(([,q])=>q.items===items),q=entry?.[1];if(!q||typeof take!=='function')return show205Before.apply(this,arguments);
  const wrapped=function(k,n){if(k!==PAN_TALLY61)return take.apply(this,arguments);if(G!==game||STATE!=='loot'||LOOT_CONTEXT?.take!==wrapped||G.world?.loot?.[entry[0]]!==q||q.items!==items||n!==1||!(items[k]>=n)||panTallyHeld61()||tabletStorage205(q))return false;
   const previous=withdrawing205;withdrawing205=q;try{return take.apply(this,arguments);}finally{withdrawing205=previous;}
  };return show205Before.call(this,title,items,wrapped);
 };
 function missing205(){const f=F();return !!(f.cave&&!f.daedalus&&!f.proteus&&!f.kadmos&&!f.won&&!panTallyHeld61());}
 const king205Before=kingTalk;kingTalk=function(n){const stored=missing205()&&tabletStorage205();if(F().king&&stored)return say(n.name,['Bring the actual cargo tablet from '+stored.label+'. I cannot read a report in its place.','The stored tablet is still yours; there is no need to search for another copy in Pan’s cave.']);return king205Before.apply(this,arguments);};
 const inventor205Before=daedalusTalk;daedalusTalk=function(n){const stored=missing205()&&tabletStorage205();if(stored)return say(n.name,['Retrieve the captain’s cargo tablet from '+stored.label+' and bring it in your own keeping.','I need the actual marks before I can read the ship’s route.']);return inventor205Before.apply(this,arguments);};
 const objective205Before=mainObjective13;mainObjective13=function(){if(missing205()){
  if(panBanditsRemain117())return objective205Before.apply(this,arguments);
  const stored=tabletStorage205();if(stored)return{t:'Retrieve the captain’s cargo tablet from '+stored.label,x:stored.x,z:stored.z};
  return{t:AREA==='cave'?'Take the cargo tablet from the captain’s chest':'Return to Pan’s cave for the captain’s cargo tablet',...panObjectivePoint143(false)};
 }return objective205Before.apply(this,arguments);};
 const hint205Before=hintLine;hintLine=function(){return missing205()?mainObjective13().t:hint205Before.apply(this,arguments);};
 Object.assign(globalThis,{tabletStorage205});
})();`;
