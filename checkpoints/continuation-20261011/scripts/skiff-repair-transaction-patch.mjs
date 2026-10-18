export const skiffRepairTransactionPatch=String.raw`
/* SKIFF_REPAIR_TRANSACTION_206: an open quote is not a material reservation.
   Keep the harvest/material price and all existing owned-ship services. */
(function(){
 function skiffDock206(){return DOCKS.find(d=>d.name==='Ikarion Harbour'&&[d.x,d.z,d.bx,d.bz,d.yaw].every(Number.isFinite));}
 function berthClear206(d){return !!d&&!FERRY.trip&&!(typeof STREAM!=='undefined'&&STREAM.building)&&!boatBlockedAt(d.bx,d.bz,d.yaw);}
 const shipwright206Before=shipwrightTalk;shipwrightTalk=function(n){return invokeStory189(n,()=>{
  economyState();if(G.work.boatOwned)return shipwright206Before(n);
  G.work.boatOffer=true;const game=G,work=G.work,dock=skiffDock206(),stamp=dock&&JSON.stringify(dock),ready=work.completed>0&&(G.inv.wood||0)>=4&&(G.inv.fiber||0)>=3;
  return say(n.name,['Finish one harvest contract, then bring four wood and three flax fiber to repair the old skiff. The materials are checked when we begin the repair.','The skiff belongs at Ikarion Harbour. Passenger ferries remain an alternative while you earn it.'],null,[{t:ready?'Repair the skiff and claim it':'Check repair materials',go:()=>{
   if(G!==game||G.work!==work||!storyReach189(n)||work.boatOwned||F().ownBoat)return false;
   if(!(work.completed>0&&(G.inv.wood||0)>=4&&(G.inv.fiber||0)>=3))return toast('Needed: one completed harvest contract, 4 wood, 3 fiber.'),false;
   if(!dock||skiffDock206()!==dock||JSON.stringify(dock)!==stamp||!berthClear206(dock))return toast('The Ikarion berth is not ready. Keep your materials and ask again when the harbour is clear.'),false;
   G.inv.wood-=4;G.inv.fiber-=3;work.boatOwned=true;F().ownBoat=1;BOAT.x=dock.bx;BOAT.z=dock.bz;BOAT.yaw=dock.yaw;BOAT.sp=0;G.boat={x:BOAT.x,z:BOAT.z,yaw:BOAT.yaw};
   toast('The repaired skiff is yours. Board it at Ikarion Harbour.');addXp(45);hudAll();hudQuest();save();return true;
  }}]);
 });};
 function bindShipwright206(){for(const n of NPCS)if(n.name==='Melanthios the Shipwright'&&!n.shipwright206){n.shipwright206=true;n.talk=actor=>shipwrightTalk(actor||n);}}
 const populate206Before=populate;populate=async function(){const r=await populate206Before.apply(this,arguments);bindShipwright206();return r;};
 const restore206Before=restoreLivingWorld;restoreLivingWorld=function(){const r=restore206Before.apply(this,arguments);bindShipwright206();return r;};
 bindShipwright206();Object.assign(globalThis,{skiffDock206,bindShipwright206});
})();`;
