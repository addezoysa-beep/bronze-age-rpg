export const openingProgressionPatch=String.raw`

/* Resume checkpoint 90: durable opening stages and a physical Pan-tablet handoff. */
let OPENING_STAGE90=null;
function reconcileOpening90(){
 const q=opening25();
 q.sheared=Array.isArray(q.sheared)?[...new Set(q.sheared.filter(Boolean))]:[];
 q.kills=Array.isArray(q.kills)?[...new Set(q.kills.filter(Boolean))]:[];
 if(!['intro','wool','wolves','done'].includes(q.stage))q.stage=F().wolvesDone?'done':F().lykos?'wool':'intro';
 if(F().wolvesDone)q.stage='done';
 if(q.stage==='done'){F().lykos=1;F().lykosStick=1;F().wolvesDone=1;G.wolves=Math.max(3,G.wolves||0);}
 else if(q.stage==='wolves'){F().lykos=1;F().lykosStick=1;G.wolves=q.kills.length;}
 else if(q.stage==='wool')F().lykos=1;
 return q;
}
function checkpointOpening90(){
 const q=reconcileOpening90(),previous=OPENING_STAGE90;OPENING_STAGE90=q.stage;
 if(previous&&previous!==q.stage&&['wool','wolves','done'].includes(q.stage)&&STATE!=='title')save();
}
const openingHud90Before=hudQuest;hudQuest=function(...args){const r=openingHud90Before(...args);checkpointOpening90();return r;};
const openingNew90Before=newGame;newGame=function(...args){OPENING_STAGE90=null;const r=openingNew90Before(...args);OPENING_STAGE90=opening25().stage;return r;};

function restorePanTablet90(){
 if(!F().cave||F().daedalus||panTallyHeld61())return false;
 const s=livingState();s.panTallyCollected61=false;
 let loot=s.loot[PAN_CHEST61];
 if(!loot){const dg=DGS.cave,p=dg?.bossPos||LOC.cave;putLoot(PAN_CHEST61,p.x,p.z,'cave',{},'Captain\u2019s stores');loot=s.loot[PAN_CHEST61];}
 loot.items||={};loot.items[PAN_TALLY61]=1;loot.claimed=false;
 return true;
}
const openingContinue90Before=continueGame;continueGame=function(...args){
 const r=openingContinue90Before(...args);reconcileOpening90();OPENING_STAGE90=opening25().stage;restorePanTablet90();hudQuest();return r;
};
const panBuild90Before=buildDungeon;buildDungeon=function(id){const r=panBuild90Before(id);if(id==='cave')restorePanTablet90();return r;};
const daedalusTablet90Before=daedalusTalk;daedalusTalk=function(n){
 if(!F().daedalus&&F().cave&&!panTallyHeld61()){
  restorePanTablet90();
  return say(n.name,['The captain\u2019s cargo tablet must be in your hands before I can read its route marks. Return to Pan\u2019s cave and take the salt-stained tablet from his chest.']);
 }
 return daedalusTablet90Before(n);
};
`;
