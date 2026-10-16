export const rescueObjectivePatch=String.raw`
/* RESCUE_OBJECTIVE_192: boss defeat is not completed princess rescue.
   Read-only guidance; no flag, item, actor, cage or discovery mutation. */
(function(){
 function rescueObjective192(){const f=F();if(f.won)return{t:'Erigone has been freed from the fortress. Your voyages may continue.',x:null,z:null};if(!f.fort||!allWritingRelics())return null;
  const dg=DGS.fort,inFort=AREA==='fort'&&DG===dg;
  if(!inFort)return{t:'Return to the Alashiya fortress and speak to Erigone beyond the upper hall',x:LOC.fort?.x??null,z:LOC.fort?.z??null};
  const e=ENEMIES.find(e=>e.alive&&e.area==='fort'&&e.kind==='warlord');if(e)return{t:'The warlord still holds the upper hall. Defeat him before freeing Erigone',x:e.x,z:e.z};
  const n=NPCS.find(n=>n.name==='Princess Erigone'&&!n.dead&&(n.area||'over')==='fort'),p=n||dg?.cage;
  return{t:!dg?.cage?.open?'Read the four-script seal at Erigone’s cage':dg.cage.solid?'Wait for Erigone’s cage bars to lower, then approach her':'Speak to Erigone and finish the rescue conversation',x:Number.isFinite(p?.x)?p.x:null,z:Number.isFinite(p?.z)?p.z:null};
 }
 const objective192Before=mainObjective13;mainObjective13=function(){return rescueObjective192()||objective192Before.apply(this,arguments);};
 const hint192Before=hintLine;hintLine=function(){const q=rescueObjective192();return q?q.t:hint192Before.apply(this,arguments);};
 Object.assign(globalThis,{rescueObjective192});
})();`;
