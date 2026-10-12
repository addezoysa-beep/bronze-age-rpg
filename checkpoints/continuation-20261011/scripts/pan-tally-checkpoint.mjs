export const panTallyRuntime = `
const PAN_TALLY61='relic_pan_tally61',PAN_CHEST61='chest:cave:100';
WEIGHT[PAN_TALLY61]=.15;
const panLabel61Before=itemLabel;itemLabel=function(k){return k===PAN_TALLY61?'Salt-stained cargo tablet':panLabel61Before(k);};
function panTallyHeld61(){return (G.inv[PAN_TALLY61]||0)>0;}
function ensurePanTally61(id){
 if(id!==PAN_CHEST61||!F().cave||F().daedalus||panTallyHeld61()||livingState().panTallyCollected61)return;
 const loot=livingState().loot[id];if(!loot)return;
 loot.items[PAN_TALLY61]=1;loot.claimed=false;
}
const panLoot61Before=lootEquipment;lootEquipment=function(items){
 const data={...items};
 if(data[PAN_TALLY61]){
  if(panTallyHeld61()||livingState().panTallyCollected61)delete data[PAN_TALLY61];
  else data[PAN_TALLY61]=1;
 }
 const r=panLoot61Before(data);
 if(data[PAN_TALLY61]&&panTallyHeld61()){livingState().panTallyCollected61=true;hudQuest();}
 return r;
};
const panChest61Before=makeBossRewardChest15;makeBossRewardChest15=function(dg){
 const r=panChest61Before(dg);
 if(dg.id==='cave'){
  const id=PAN_CHEST61,s=livingState();
  // Migrate an already-open pre-patch chest without resurrecting its heart reward.
  if(gstate(dg.id).chests[100]&&!s.loot[id]){
   putLoot(id,dg.bossPos.x,dg.bossPos.z,dg.id,{},'CaptainÃÂ¢ÃÂÃÂs stores');s.loot[id].reward15=dg.def.reward;
  }
  ensurePanTally61(id);
 }
 return r;
};
const panObjective61Before=mainObjective13;mainObjective13=function(){
 if(F().cave&&!F().daedalus&&!panTallyHeld61()&&!livingState().panTallyCollected61){
  const ch=DGS.cave?.chests.find(c=>c.idx===100);
  return {t:'Search the captainÃÂ¢ÃÂÃÂs chest for the cargo tablet',x:AREA==='cave'?ch?.x??LOC.cave.x:LOC.cave.x,z:AREA==='cave'?ch?.z??LOC.cave.z:LOC.cave.z};
 }
 return panObjective61Before();
};
const panDaedalus61Before=daedalusTalk;daedalusTalk=function(n){
 if(!F().daedalus&&!F().cave)return say(n.name,['A shepherd from Ikaria? IkariosÃÂ¢ÃÂÃÂs daughter is missing, and the raiders were seen near PanÃÂ¢ÃÂÃÂs cave. Bring me something from their stores; a shipÃÂ¢ÃÂÃÂs record may tell us where they went.']);
 if(!F().daedalus&&!panTallyHeld61()&&!livingState().panTallyCollected61)return say(n.name,['A captainÃÂ¢ÃÂÃÂs word dies with him. Search his chest in PanÃÂ¢ÃÂÃÂs cave for the cargo tablet, then bring it here.']);
 return panDaedalus61Before(n);
};
`;
export function applyPanTallyCheckpoint(html){
 const anchor='const tutorial35Before=tutorialTalk2;tutorialTalk2=function(n)';
 if(html.split(anchor).length!==2)throw Error('Expected story insertion anchor');
 html=html.replace(anchor,panTallyRuntime+'\n'+anchor);
 for(const [before,after] of [['if(!ch.supply22)','if(!ch||!ch.supply22)'],['if(ch.items36){','if(ch&&ch.items36){']]){
  if(html.split(before).length!==2)throw Error('Expected chest-wrapper guard');
  html=html.replace(before,after);
 }
 const reward='s.loot[id].reward15=item;return takeWorldLoot(id);';
 if(html.split(reward).length!==2)throw Error('Expected normal chest loot route');
 html=html.replace(reward,'s.loot[id].reward15=item;ensurePanTally61(id);return takeWorldLoot(id);');
 const narration="Among the captainÃÂ¢ÃÂÃÂs stores you find a tally marked Knossos. A mapmaker named Daedalus supplied the route. The trail leads to Krete.";
 if(html.split(narration).length!==2)throw Error('Expected captain narration');
 return html.replace(narration,"The captainÃÂ¢ÃÂÃÂs chest stands among his stores. Search it for the salt-stained cargo tablet; its record may tell you where the raiders sailed.");
}
