export const coreBrazierContinuityPatch=String.raw`
/* BRAZIER_PREFIX_254 / BRAZIER_CONTEXT_255: native saved sequence is authority.
   Cold entry after an overworld Save must show the actual completed prefix.
   No new puzzle, automatic save, sequence increment or reward is introduced. */
(function(){
 function sequence254(dg){const seq=dg?.def?.seq,st=G.dg?.[dg?.id];return dg&&DGS[dg.id]===dg&&Array.isArray(dg.braziers)&&dg.seqSw&&Array.isArray(seq)&&seq.length>0&&seq.length<=16&&seq.every(Number.isSafeInteger)&&new Set(seq).size===seq.length&&Number.isInteger(st?.seq)&&st.seq>=0&&st.seq<=seq.length?{seq,st}:null;}
 function syncBrazierPrefix254(dg){const q=sequence254(dg);if(!q)return false;const count=q.st.open?.[dg.def.seqG||'C']?q.seq.length:q.st.seq;
  for(const br of dg.braziers){br.lit=q.seq.slice(0,count).includes(br.n);br.fire.visible=br.lit;}
  dg.seqSw.on=count===q.seq.length;return true;
 }
 const buildBefore=buildDungeon;buildDungeon=function(id){const r=buildBefore.apply(this,arguments);syncBrazierPrefix254(DGS[id]);return r;};
 const enterBefore=enterDungeon;enterDungeon=function(id){const r=enterBefore.apply(this,arguments);if(AREA===id&&DG===DGS[id])syncBrazierPrefix254(DG);return r;};
 const continueBefore=continueGame;continueGame=function(){const r=continueBefore.apply(this,arguments);if(AREA!=='over'&&DG===DGS[AREA])syncBrazierPrefix254(DG);return r;};
 // The same native interaction still performs the sequence and its sound cues.
 // Reject retired-room/duplicate/distant/dead/paused callbacks before mutation.
 const lightBefore=lightBrazier;lightBrazier=function(dg,br){const q=sequence254(dg);
  if(!q||DG!==dg||AREA!==dg.id||!['play','talk'].includes(STATE)||P.dead||P.mode!=='foot'||!dg.braziers.includes(br)||br.lit||!Number.isFinite(P.x)||!Number.isFinite(P.z)||hyp(P.x-br.x,P.z-br.z)>3.2||q.st.open?.[dg.def.seqG||'C'])return false;
  const r=lightBefore.apply(this,arguments);syncBrazierPrefix254(dg);return r;
 };
 for(const dg of Object.values(DGS))syncBrazierPrefix254(dg);
 Object.assign(globalThis,{syncBrazierPrefix254});
})();
`;
