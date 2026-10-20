export const chestLockContext277=String.raw`
/* CHEST_LOCK_CONTEXT_277: interior chest/pick transactions stay with the live room. */
(function(){
 const picks277=new WeakMap();
 function interior277(dg){return !!dg?.id&&Object.hasOwn(DUN,dg.id);}
 function chestReady277(dg,ch,states){
  if(!dg||!ch||DG!==dg||DGS[dg.id]!==dg||DUN[dg.id]!==dg.def||AREA!==dg.id||!states.includes(STATE)||P.dead||P.mode!=='foot'||P.grounded===false||!dg.chests?.includes(ch)||ch.m?.parent!==dg.group||!Number.isFinite(P.x+P.y+P.z+ch.x+ch.z)||Math.hypot(P.x-ch.x,P.z-ch.z)>3.4)return false;
  const y=ch.m.position.y;return Number.isFinite(y)&&Math.abs(P.y-y)<=1.5;
 }
 const open277Before=openChest;openChest=function(dg,ch){if(interior277(dg)&&!chestReady277(dg,ch,['play','loot']))return false;return open277Before.apply(this,arguments);};
 const begin277Before=beginLockpick;beginLockpick=function(dg,ch){
  if(!interior277(dg))return begin277Before.apply(this,arguments);
  if(!chestReady277(dg,ch,['play','talk'])||ch.guardian72?.alive||!Number.isSafeInteger(G.inv.lockpick)||G.inv.lockpick<1)return false;
  const game=G,world=G.world,ledger=G.dg?.[dg.id],definition=dg.def,x=ch.x,z=ch.z,y=ch.m.position.y,r=begin277Before.apply(this,arguments),q=LOCK16;
  if(q&&q.dg===dg&&q.ch===ch&&STATE==='lockpick')picks277.set(q,()=>G===game&&G.world===world&&G.dg?.[dg.id]===ledger&&dg.def===definition&&ch.x===x&&ch.z===z&&ch.m.position.y===y&&chestReady277(dg,ch,['lockpick'])&&!ch.open&&!ch.guardian72?.alive&&Number.isSafeInteger(G.inv.lockpick)&&G.inv.lockpick>0);
  return r;
 };
 const tick277Before=lockTick16;lockTick16=function(dt){const q=LOCK16;if(q&&STATE==='lockpick'&&interior277(q.dg)){const current=picks277.get(q);if(!current||!current()){closeLock16();toast('You have moved away from this lock. Nothing was opened.');return false;}}return tick277Before.apply(this,arguments);};
})();
`;
export function repairLockDefinition277(source){for(const key of['faction56','boss','mine36']){const before='q.dg?.def.'+key;if(source.split(before).length!==2)throw Error('Native lock definition anchor changed: '+key);source=source.replace(before,'q.dg?.def?.'+key);}return source;}
export function repairChestLockContext(source){for(const a of['const guardedChest72Before=openChest','LOCK_FEEDBACK_163','ENTRANCE_KEY_CACHE_270','WORLD_LOOT_TRANSACTIONS_275'])if(!source.includes(a))throw Error('Chest/pick composition anchor missing: '+a);source=repairLockDefinition277(source);const end=source.lastIndexOf('</script>');if(end<0)throw Error('Missing game script boundary');return source.slice(0,end)+chestLockContext277+source.slice(end);}
