export const panObjectiveRecoveryPatch=String.raw`
/* PAN_OBJECTIVE_RECOVERY_143: physical tablet and area-correct next directions. */
function panObjectivePoint143(bandits){
 if(AREA!=='cave')return LOC.cave||{x:null,z:null};
 if(bandits){
  let closest=null,distance=Infinity;
  for(const e of ENEMIES){if(!e.alive||e.friendly||e.trainingDummy||e.area!=='cave'||!['robber','pirate','captain','bandit','archer','spearman'].includes(e.kind))continue;
   const d=(e.x-P.x)**2+(e.z-P.z)**2;if(Number.isFinite(d)&&d<distance){closest=e;distance=d;}
  }if(closest)return{x:closest.x,z:closest.z};
 }
 const dg=DGS.cave,ch=dg?.chests?.find(c=>c.idx===100),p=ch||dg?.bossPos;
 return p&&Number.isFinite(p.x)&&Number.isFinite(p.z)?{x:p.x,z:p.z}:{x:null,z:null};
}
function panUnreported143(){const f=F();return f.king&&f.cave&&!f.daedalus&&!panReturnState117().reported;}
const panObjective143Before=mainObjective13;mainObjective13=function(){
 if(panUnreported143()){
  if(panBanditsRemain117())return{t:'Clear the remaining bandits from Pan’s cave',...panObjectivePoint143(true)};
  // Physical possession is required even if an old collection flag survived loss.
  // Reading this objective does not grant/recreate loot or mark a quest complete.
  if(!panTallyHeld61())return{t:AREA==='cave'?'Take the cargo tablet from the captain’s chest':'Return to Pan’s cave for the captain’s cargo tablet',...panObjectivePoint143(false)};
  if(AREA==='cave')return{t:'Leave Pan’s cave and bring the cargo tablet to King Ikarios',...(DGS.cave?.start||{x:null,z:null})};
 }
 return panObjective143Before();
};
const panHint143Before=hintLine;hintLine=function(){
 if(panUnreported143()){
  if(panBanditsRemain117())return 'Clear the bandits still guarding Pan’s cave before reporting to Ikarios.';
  if(!panTallyHeld61())return 'Search the captain’s chest in Pan’s cave; the cargo tablet must be in your inventory.';
  if(AREA==='cave')return 'Carry the cargo tablet through the cave exit, then return to King Ikarios.';
 }return panHint143Before();
};
`;
