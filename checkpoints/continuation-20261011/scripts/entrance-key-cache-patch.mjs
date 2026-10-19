export const unlatchedEntranceCache270=String.raw`
 /* ENTRANCE_KEY_CACHE_270: only the registered entry cache is unlatched. */
 const entranceCaches270=new WeakMap();
 const chest270Before=openChest;
 openChest=function(dg,ch){const record=dg&&entranceCaches270.get(dg);
  if(!record||record.ch!==ch)return chest270Before.apply(this,arguments);
  if(DG!==dg||DGS[dg.id]!==dg||DUN[dg.id]!==record.def||dg.def!==record.def||AREA!==dg.id||!['play','loot'].includes(STATE)||P.dead||P.mode!=='foot'||P.grounded===false||!Number.isFinite(P.x+P.y+P.z)||Math.hypot(P.x-ch.x,P.z-ch.z)>3.1||Math.abs(P.y-ch.m.position.y)>1.25)return false;
  if(ch.item!=='key'||ch.legend56||ch.guardian72?.alive)return false;
  if(ch.open)return lootRemaining15('chest:'+dg.id+':'+ch.idx)?rewardChest(dg,ch):false;
  // Retain native open-state, physical loot UI, reward identity and manual-save policy.
  // The earlier alias is the native opener BEFORE the blanket chest-lock layer.
  const r=unlockedChestBefore(dg,ch);ch.lid.rotation.x=-1.35;return r;
 };
`;
export function repairEntranceKeyCache(source){
 const marker=' function ensureDungeonKey262(dg){';if(source.split(marker).length!==2)throw Error('Entry cache helper anchor changed');
 source=source.replace(marker,unlatchedEntranceCache270+'\n'+marker);
 const anchor='dg.chests.push(ch);dg.keySource262=true;';if(source.split(anchor).length!==2)throw Error('Entry cache registration anchor changed');
 source=source.replace(anchor,anchor+'entranceCaches270.set(dg,{ch,def:dg.def});');
 const label="label:()=>'Open the entrance chest · bronze key'";if(source.split(label).length!==2)throw Error('Entry cache label anchor changed');
 return source.replace(label,"label:()=>'Open the unlatched entrance chest · bronze key'");
}
