export const labyrinthAntlerPatch=String.raw`
/* CONTINUATION_LABYRINTH_ANTLER_IDENTITY_V1
   The established Labyrinth Initiates receive a readable antler-mask silhouette;
   this extends FACTIONS56 and its six weapon archetypes rather than adding an
   unapproved faction. */
(function(){
 const roleAccent97={spear:0x9f7445,sword:0x8a563f,axe:0x754636,greatsword:0x4f3130,bow:0x52604f,sling:0x66536c};
 function labyrinthMask97(e){
  if(!e?.hum?.head||e.labyrinthMask97)return e;
  const b=new Batch(),accent=hx(roleAccent97[e.archetype56]||0x725040),bone=K.bone,dark=hx(0x251b18);
  // Long wooden face plate, flared cheek guards, brow and visible dark eye slots.
  anatomyLoft(b,[[0,-.25,.17,.11,.035],[0,-.10,.20,.19,.055],[0,.10,.18,.18,.05],[0,.24,.13,.12,.035]],'y',accent,22);
  b.box(0,.09,.225,.34,.055,.025,dark).box(-.085,.09,.242,.055,.025,.015,K.black).box(.085,.09,.242,.055,.025,.015,K.black);
  for(const side of[-1,1]){
   anatomyLoft(b,[[side*.13,-.12,.17,.05,.035],[side*.22,-.01,.13,.055,.035],[side*.24,.13,.09,.035,.025]],'y',accent,14);
   // Antler beam angles outward and back, with three separated tines.
   anatomyLoft(b,[[side*.12,.20,.06,.035,.032],[side*.21,.36,.02,.031,.028],[side*.30,.53,-.03,.027,.023],[side*.37,.68,-.07,.010,.008]],'y',bone,16);
   for(const [y,out]of[[.37,.11],[.49,.14],[.60,.12]])anatomyLoft(b,[[side*(.20+out*.25),y,.00,.020,.017],[side*(.20+out),y+.13,.015,.004,.004]],'y',bone,10);
  }
  const mask=b.mesh(ACTOR_MAT);mask.userData.labyrinthAntler97=e.archetype56;e.hum.head.add(mask);
  // A short dark shoulder mantle broadens the silhouette without obscuring hands.
  const m=new Batch(),cloth=hx(FACTIONS56.labyrinth.cloth);
  m.dquad([-.48,1.36,-.05],[.48,1.36,-.05],[.38,.93,-.17],[-.38,.93,-.17],cloth);
  for(const side of[-1,1])m.dquad([side*.18,1.35,.08],[side*.52,1.30,.02],[side*.42,1.02,-.06],[side*.15,1.07,.01],sh(cloth,.72));
  const mantle=m.mesh(ACTOR_MAT);mantle.userData.labyrinthMantle97=true;e.hum.spine.add(mantle);
  e.labyrinthMask97=true;e.g.userData.factionSilhouette97='labyrinth-antler-'+e.archetype56;
  return e;
 }
 const labyrinthSpawn97Before=spawnEnemy;
 spawnEnemy=function(){const e=labyrinthSpawn97Before.apply(this,arguments);if(e?.faction56==='labyrinth')labyrinthMask97(e);return e;};
 Object.assign(globalThis,{labyrinthMask97});
})();`;
