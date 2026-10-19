export const worldLootTransactions275=String.raw`
/* WORLD_LOOT_TRANSACTIONS_275: native UI still owns the source debit. */
(function(){
 const contexts275=new WeakMap();
 function nearWorldLoot275(a,area,room){
  if(!a||!['play','loot'].includes(STATE)||P.dead||AREA!==area||(a.area||'over')!==area||!Number.isFinite(P.x+P.y+P.z+a.x+a.z)||Math.hypot(P.x-a.x,P.z-a.z)>3.4)return false;
  if(area!=='over'&&(DG!==room||DGS[area]!==room||DUN[area]!==room?.def))return false;
  if(a.y!=null)return Number.isFinite(a.y)&&P.mode==='swim'&&P.y<-.6&&Math.abs(P.y-a.y)<=1.35;
  const y=groundY(a.x,a.z);return Number.isFinite(y)&&Math.abs(P.y-y)<=2.8;
 }
 const beforeTake275=takeWorldLoot;takeWorldLoot=function(id){const a=G.world?.loot?.[id];
  // Validate BEFORE native52 resets a reusable chest's claimed flag.
  if(!nearWorldLoot275(a,a?.area||'over',DG))return false;return beforeTake275.apply(this,arguments);
 };
 const beforeShow275=showLoot;showLoot=function(title,items,take){
  const matches=Object.entries(G.world?.loot||{}).filter(([,a])=>a?.items===items);
  if(!matches.length||typeof take!=='function')return beforeShow275.apply(this,arguments);
  if(matches.length!==1)return false;
  const [id,a]=matches[0],game=G,world=G.world,area=a.area||'over',room=DG,x=a.x,z=a.z,y=a.y;let context=null;
  const ready=()=>G===game&&G.world===world&&world.loot?.[id]===a&&a.items===items&&a.x===x&&a.z===z&&a.y===y&&nearWorldLoot275(a,area,room);
  if(!ready())return false;
  const current=()=>ready()&&STATE==='loot'&&context&&LOOT_CONTEXT===context&&context.items===items;
  const guarded=function(k,n){if(!current()||typeof k!=='string'||!Object.hasOwn(items,k)||!Number.isSafeInteger(n)||n<1||!Number.isSafeInteger(items[k])||items[k]<n)return false;return take.apply(this,arguments);};
  const r=beforeShow275.call(this,title,items,guarded);context=LOOT_CONTEXT;
  if(context&&context.items===items)contexts275.set(context,current);return r;
 };
 const beforeAll275=takeAllLoot15;takeAllLoot15=function(){const ready=LOOT_CONTEXT&&contexts275.get(LOOT_CONTEXT);if(ready&&!ready())return false;return beforeAll275.apply(this,arguments);};
 // Native52 permits depositing into opened dungeon/world chests; keep that path,
 // but a stale menu must not debit the new voyage or a remote container.
 const beforeDeposit275=deposit52;deposit52=function(){const ready=LOOT_CONTEXT&&contexts275.get(LOOT_CONTEXT);if(ready&&!ready())return false;return beforeDeposit275.apply(this,arguments);};
 Object.assign(globalThis,{nearWorldLoot275});
})();
`;
export function repairWorldLootTransactions(source){for(const a of['const chestLoot52Before=takeWorldLoot','const show205Before=showLoot','function deposit52('])if(!source.includes(a))throw Error('Missing native loot composition anchor: '+a);const at=source.lastIndexOf('</script>');if(at<0)throw Error('Missing game script boundary');return source.slice(0,at)+worldLootTransactions275+source.slice(at);}
