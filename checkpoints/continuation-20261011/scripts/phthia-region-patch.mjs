export const phthiaRegionPatch=String.raw`
/* PHTHIA_REGION_134: Achilles and his existing eight Myrmidons return home. */
const PHTHIA134=IS.phthia||appendLand({id:'phthia',name:'Phthia',cx:-1500,cz:-1200,rx:270,rz:185,rot:.20,amp:26,w:.12,f:.011,biome:'greek',cell:8,peaks:[{x:-1605,z:-1235,r:112,h:44},{x:-1460,z:-1320,r:82,h:23}]});
WORLD.x0=Math.min(WORLD.x0,PHTHIA134.bb[0]-40);WORLD.z0=Math.min(WORLD.z0,PHTHIA134.bb[2]-40);
function phthiaActorPoint134(name,x,z){
 if(name!=='Achilles'&&!/^Myrmidon [1-8]$/.test(name||''))return null;
 return{x:PHTHIA134.cx+x-(IS.troy.cx-245),z:PHTHIA134.cz+40+z-(IS.troy.cz+70)};
}
const phthiaActor134Before=addNPC;addNPC=function(o){
 const p=phthiaActorPoint134(o?.name,o?.x,o?.z),n=phthiaActor134Before(p?{...o,...p,culture:'aegean'}:o);
 if(p)n.homeRealm134='phthia';return n;
};
let PHTHIA_BUILT134=false;
function buildPhthia134(){
 if(PHTHIA_BUILT134)return false;PHTHIA_BUILT134=true;
 const I=PHTHIA134,x=I.cx,z=I.cz,b=ibatch(I.id);
 // The valley court, houses and southern assembly yard leave broad open streets.
 addFlat(x,z+22,112,20,7);indexFlats();
 palace(b,x,z-34,'achaean');market(b,x-32,z+14,[K.cream,K.red,K.ochre]);workshop(b,x+32,z+14,0);
 for(const side of[-1,1])for(let i=0;i<4;i++)greekHouse(b,x+side*58,z-30+i*24,side>0?-PI/2:PI/2,8,6,K.plaster);
 // Existing Myrmidon camp is subsequently built by its original camp-population path.
 mkDock(I.id,'Phthian Harbour',x+I.rx*.64,z+I.rz*.16,0,18);
 DISCOVER('Phthia — Achilles’ Homeland',x,z+22,120,25);return true;
}
const phthiaPopulate134Before=epicPopulate;epicPopulate=function(){buildPhthia134();return phthiaPopulate134Before.apply(this,arguments);};
function migratePhthiaHomes134(){
 G.world||={};if(G.world.phthiaHomeMigration134)return false;
 const followers=new Set(typeof partyMembers==='function'?partyMembers():[]);
 for(const n of NPCS){
  if(n.homeRealm134!=='phthia'||n.dead||followers.has(n)||n._party||(/^Myrmidon /.test(n.name)&&F().myrmidons))continue;
  // Only the old home-region restoration is migrated; travelling actors stay put.
  if(nearestIsle(n.x,n.z)!=='troy')continue;
  const home=n.home||{x:PHTHIA134.cx,z:PHTHIA134.cz+40},p=freeLandNear(home.x,home.z,3);
  n.x=p.x;n.z=p.z;n.y=groundY(p.x,p.z);n.area='over';n.nav15=n.render16=null;
  if(n.h?.g){n.h.g.position.set(n.x,n.y,n.z);n.h.g.visible=true;}
 }
 G.world.phthiaHomeMigration134=1;return true;
}
// Restore checkpoints first, then migrate the obsolete home locations once.
const phthiaContinue134Before=continueGame;continueGame=function(){const r=phthiaContinue134Before.apply(this,arguments);migratePhthiaHomes134();return r;};
const phthiaNew134Before=newGame;newGame=function(){const r=phthiaNew134Before.apply(this,arguments);G.world||={};G.world.phthiaHomeMigration134=1;return r;};
`;
