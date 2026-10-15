export const rescueRelicGuidancePatch=String.raw`
/* RESCUE_RELIC_GUIDANCE_164: actual Labyrinth boss, then Delphi's four physical relic leads. */
(function(){
 function rescuePlan164(){G.world||={};return G.world.rescuePlan164||={briefed:false,oracleRevealed:false};}
 function advancedRescue164(){const f=F();return !!(f.proteus||f.kadmos||f.fort||f.won);}
 function relicNames164(){return Object.values(WRITING).map(w=>w.relic);}
 function inventorBriefing164(n){return say(n.name,[
  'The captain’s marks lead toward Pharos, but Shekelesh is no ordinary raider. Four inscribed relics sustain his ward. A sword alone cannot break it.',
  'Their names are '+relicNames164().join('; ')+'. Carry the actual relics: knowing their names is not enough.',
  'Before you follow that ship to Pharos, enter the Labyrinth beneath Knossos. Search the side passages for a bronze key and Ariadne’s thread. Unlock the inner door and face the Minotaur; take the bow from its treasure chest.',
  'Then visit the Pythia at Delphi. She knows where the four relics may be found, and which teachers can help you read their seals.'
 ],()=>{rescuePlan164().briefed=true;odyssey13State().activeQuest='main';hudQuest();save();});}
 const inventor164Before=daedalusTalk;daedalusTalk=function(n){if(!F().daedalus)return inventor164Before(n);const q=rescuePlan164();if(!q.briefed)return inventorBriefing164(n);if(!advancedRescue164()&&!F().laby)return say(n.name,['The Minotaur still guards the Labyrinth below Knossos. Take a key from the maze’s side passages, follow the red thread and open its inner door.','Defeat the guardian and take its treasure; afterward, seek the Pythia at Delphi before Pharos.']);if(!q.oracleRevealed)return say(n.name,['The Pythia at Delphi can reveal the four relics’ whereabouts. Their inscribed stones must be read and their relics carried before you face Shekelesh.']);return inventor164Before(n);};
 // Retain all earlier physical-Pan/tablet/royal-return gates and callbacks.
 const say164Before=say;say=function(name,lines,done,choices){if(/^Daedalus(?: the Inventor)?$/.test(name||'')&&(!F().daedalus||!rescuePlan164().briefed)&&Array.isArray(lines)&&lines.some(l=>/Pharos/.test(l))&&lines.some(l=>/Labyrinth/.test(l))){lines=[
  'The cargo marks point toward Pharos. First we must prepare you for the man who commands those ships: Warlord Shekelesh.',
  'Four inscribed relics shield him: '+relicNames164().join('; ')+'. Their names alone will not break his ward.',
  'The Minotaur guards the Labyrinth below Knossos. Search its side passages for the bronze key and red thread. Open the inner door, defeat the guardian and take the bow from its chest before following the trail to Pharos.',
  'After the maze, travel to Delphi. The Pythia will reveal the four relic locations and the teachers who can help you read them.'
 ];const previous=done;done=()=>{previous?.();if(F().daedalus){rescuePlan164().briefed=true;hudQuest();save();}};}return say164Before(name,lines,done,choices);};
 const oracle164Before=oracleTalk;oracleTalk=function(n){if(!F().daedalus)return oracle164Before(n);const q=rescuePlan164();if(!q.oracleRevealed)return say(n.name,[
  'Shekelesh hides behind four stolen names. The relics can answer that ward, if you learn to read the seals and bring the objects themselves.',
  ...Object.entries(WRITING).map(([id,w])=>w.relic+': seek '+w.scribe+' on '+(IS[w.island]?.name||w.island)+'. Complete the writing lessons, then decipher the relic stone beside that school.'),
  'The Minotaur’s maze lies beneath Knossos. If you have not faced its guardian, return there before continuing to Proteus on Pharos. The four relics may then be sought in the order your voyage allows.'
 ],()=>{q.oracleRevealed=true;for(const n of SCRIPT_SCRIBES)npcMapHints13(n,n,WRITING[n.script].title+' Scribe School');odyssey13State().activeQuest='main';hudQuest();save();});return oracle164Before(n);};
 const proteus164Before=proteusTalk;proteusTalk=function(n){if(!advancedRescue164()&&F().daedalus&&(!F().laby||!rescuePlan164().oracleRevealed))return say(n.name,[!F().laby?'Daedalus sent word: face the Minotaur in the Labyrinth below Knossos before following the raiders farther.':'The Pythia at Delphi knows how to break Shekelesh’s ward. Hear her account of the four relics before you continue this hunt.']);return proteus164Before(n);};
 const objective164Before=mainObjective13;mainObjective13=function(){const f=F(),q=rescuePlan164();if(f.daedalus&&!advancedRescue164()){
  if(!q.briefed)return{t:'Ask Daedalus about Shekelesh and the four relics',...LOC.daedalus};
  if(!f.laby)return{t:'Find the Labyrinth key, unlock the inner door and defeat the Minotaur',...LOC.laby};
  if(!q.oracleRevealed)return{t:'Travel to Delphi; hear the Pythia reveal all four relic locations',...LOC.delphi};
 }return objective164Before();};
 Object.assign(globalThis,{rescuePlan164,advancedRescue164,inventorBriefing164});
})();`;
