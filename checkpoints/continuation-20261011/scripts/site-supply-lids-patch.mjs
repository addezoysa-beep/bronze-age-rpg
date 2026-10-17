export const siteSupplyLidsPatch=String.raw`
/* SITE_SUPPLY_PRESENTATION_213: cold reload/new voyage reflects the actual
   persisted container, without creating supplies, rewards or saves. */
(function(){
 function syncSiteSupplyLids213(){for(const dg of Object.values(DGS)){const p=dg.siteSupplies211;if(!p?.chest?.lid)continue;const items=G.world?.siteSupplies211?.[dg.id]?.items,opened=items&&['bread','stone','arrow_wood'].every(k=>Number.isSafeInteger(items[k])&&items[k]>=0);p.chest.lid.rotation.x=opened?-1.3:0;}}
 const build213Before=buildDungeon;buildDungeon=function(){const r=build213Before.apply(this,arguments);syncSiteSupplyLids213();return r;};
 const restore213Before=restoreLivingWorld;restoreLivingWorld=function(){const r=restore213Before.apply(this,arguments);syncSiteSupplyLids213();return r;};
 const new213Before=newGame;newGame=function(){const r=new213Before.apply(this,arguments);syncSiteSupplyLids213();return r;};
 Object.assign(globalThis,{syncSiteSupplyLids213});syncSiteSupplyLids213();
})();`;
