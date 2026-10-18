export const shekeleshPresentationPatch=String.raw`
/* SHEKELESH_PRESENTATION_177: presentation only; native ward, attack and rescue
   callbacks remain authoritative. No extra boss or remote preview is spawned. */
(function(){
 let next177=0;
 function dressShekelesh177(e){
  if(e?.kind!=='warlord'||!e.hum?.spine||!e.hum.head||e.presentation177)return e;
  const h=e.hum,b=new Batch(),bronze=hx(0x997044),dark=hx(0x382c26),ivory=K.bone;
  // Overlapping cuirass scales follow the existing articulated torso, never hands.
  for(let row=0;row<4;row++)for(let col=-2;col<=2;col++){
   const x=col*.105,z=.222-Math.abs(col)*.014,y=1.13+row*.085;
   b.box(x,y,z,.097,.105,.035,(row+col)%2?bronze:sh(bronze,.82));
  }
  for(const side of[-1,1]){
   b.box(side*.255,1.35,.04,.105,.18,.32,dark);
   for(let i=0;i<3;i++)b.box(side*(.27+i*.045),1.45-i*.022,.02,.065,.05,.32,bronze);
   b.box(side*.12,.92,.17,.17,.12,.07,bronze);
  }
  b.box(0,1.02,.23,.09,.08,.035,ivory);
  const shell=b.mesh(ACTOR_MAT);shell.userData.shekeleshCuirass177=true;h.spine.add(shell);
  const crest=new Batch();for(let i=-3;i<=3;i++){
   const x=i*.065;crest.box(x,.28+(.07-Math.abs(i)*.015),-.055,.046,.23,.025,i%2?ivory:bronze);
  }
  crest.box(0,.185,-.055,.49,.05,.09,dark);
  const crown=crest.mesh(ACTOR_MAT);crown.userData.shekeleshCrest177=true;h.head.add(crown);
  e.presentation177=true;return e;
 }
 const spawn177Before=spawnEnemy;spawnEnemy=function(){return dressShekelesh177(spawn177Before.apply(this,arguments));};
 function readyShekelesh177(e){return !!(e?.kind==='warlord'&&e.alive&&e.area===AREA&&ENEMIES.includes(e)&&e.g?.visible&&Number.isFinite(e.x+e.z)&&hyp(e.x-P.x,e.z-P.z)<=14&&e.state!=='wind'&&e.state!=='rec'&&!['wind','strike','recover'].includes(e._tactical14?.phase)&&enemySightLine(e));}
 function showShekelesh177(e){
  if(STATE!=='play'||P.dead||P.melee||P.draw>0||P.rollT>0||P.mode!=='foot'||F().won||G.world?.shekeleshScene177||T_NOW<next177||!readyShekelesh177(e))return false;
  if(ENEMIES.some(a=>a!==e&&a.alive&&!a.friendly&&!a.trainingDummy&&a.area===AREA&&hyp(a.x-P.x,a.z-P.z)<10))return false;
  next177=T_NOW+30;
  const lines=['So the shepherd has crossed the sea. I am Shekelesh. You have come a long way to demand what kings could not keep.',
   allWritingRelics()?'You carry the four inscribed relics. Then let the stolen names fall silent; face the man beneath the bronze.':'Four stolen names bind my ward. Steel cannot answer them. Go back and learn what the stones remember.',
   'Erigone is beyond this hall. If you mean to take her home, keep your feet—and watch my axe.'];
  say('Warlord Shekelesh',lines,()=>{if(e.alive&&e.area===AREA){G.world||={};G.world.shekeleshScene177=true;}});
  if(STATE==='talk')beginStoryCinema110(e,false);
  return STATE==='talk';
 }
 const player177Before=updatePlayer;updatePlayer=function(dt){const r=player177Before(dt);if(STATE==='play'&&!G.world?.shekeleshScene177&&T_NOW>=next177){const e=ENEMIES.find(e=>e.kind==='warlord'&&e.alive&&e.area===AREA);if(e)showShekelesh177(e);}return r;};
 // Name the antagonist in the king's existing account, without exposing a location.
 const say177Before=say;say=function(name,lines,done,choices){if(/King Ikarios/.test(name||'')&&Array.isArray(lines)&&lines.some(l=>/sea-raiders took my daughter/.test(l))&&!lines.some(l=>/Shekelesh/.test(l)))lines=[...lines,'The survivors whisper their commander’s name: Shekelesh. Bring back my daughter, not another tale of his cruelty.'];return say177Before(name,lines,done,choices);};
 const new177Before=newGame;newGame=function(){next177=0;return new177Before.apply(this,arguments);};
 const restore177Before=restoreLivingWorld;restoreLivingWorld=function(){next177=0;return restore177Before.apply(this,arguments);};
 Object.assign(globalThis,{dressShekelesh177,readyShekelesh177,showShekelesh177});
})();`;
