export function repairCampaignGuidance(source){
 const from="if(typeof mainObjective13!=='function'||typeof WRITING==='undefined')return;";
 if(source.split(from).length!==2)throw Error('Relic objective reconciliation anchor changed');
 return source.replace(from,"if(typeof mainObjective13!=='function'||typeof WRITING==='undefined'||typeof missingRelic175==='function')return;");
}
export const campaignReconciliationPatch=String.raw`
/* CAMPAIGN_AREA_RECONCILIATION_267: retain the master216–218 relic/storage
   guidance; route new Labyrinth/Delphi/inventor wording through actual areas. */
(function(){
 const before=mainObjective13;
 mainObjective13=function(){const q=before.apply(this,arguments);if(!q||typeof q.t!=='string')return q;
  if(/^Speak with Ariadne and take her thread/.test(q.t)){
   if(AREA!=='over'){const p=DG&&DGS[AREA]===DG?DG.start:null;return{...q,t:'Leave this place, then speak with Ariadne and take her thread before entering the Labyrinth',x:p?.[0]??p?.x??null,z:p?.[1]??p?.z??null};}
   const n=NPCS.find(n=>n.name==='Ariadne, Keeper of the Thread'&&!n.dead&&!n.hostile&&(n.area||'over')==='over');return{...q,x:Number.isFinite(n?.x)?n.x:null,z:Number.isFinite(n?.z)?n.z:null};
  }
  const text=/^Complete Knossos Labyrinth:/.test(q.t)?'Find the Labyrinth key, unlock the inner door and defeat the Minotaur':/^Travel to Delphi and hear the Pythia/.test(q.t)?'Travel to Delphi; hear the Pythia reveal all four relic locations':/^Ask Daedalus how to prepare for Shekelesh$/.test(q.t)?'Ask Daedalus about Shekelesh and the four relics':null;
  if(!text||typeof routeObjective214!=='function')return q;const routed=routeObjective214({...q,t:text});if(!routed)return q;
  return{...routed,t:routed.t.startsWith('Leave this place, then ')?'Leave this place, then '+q.t.charAt(0).toLowerCase()+q.t.slice(1):q.t};
 };
})();`;
