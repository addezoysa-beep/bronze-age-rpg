export const rivalTentCampPatch=String.raw`
/* CONTINUATION_RIVAL_TENT_CAMP_V1
   A reachable Exiled Royal Retainer field camp in sparse steppe terrain. The
   eight defenders use the existing six faction weapon contracts; its stores
   unlock once and remain depleted through the normal living-world save data. */
(function(){
 const RIVAL_CAMP98={id:'retainer_steppe_field98',status:'unbuilt',x:0,z:0,enemies:[],chest:null};
 const roles98=['spear','bow','sword','axe','greatsword','sling','spear','bow'];
 function rivalCampState98(){const w=livingState();return w.rivalCamp98||=( {cleared:false,announced:false} );}
 function rivalCampClear98(){
  const q=rivalCampState98();if(q.cleared)return true;
  if(RIVAL_CAMP98.enemies.some(e=>e.alive))return false;
  q.cleared=true;if(!q.announced){q.announced=true;banner('Lost Banner Camp Cleared','The Exiled Royal Retainers abandon their field stores.');}
  save();hudQuest();return true;
 }
 function rivalCampChest98(){
  const q=rivalCampState98();if(!q.cleared)return toast('Defenders still hold the supply enclosure.');
  const id='camp:'+RIVAL_CAMP98.id+':stores';
  if(!livingState().loot[id])putLoot(id,RIVAL_CAMP98.x+7,RIVAL_CAMP98.z-5,'over',{silver:70,arrow_flint:12,barley:3,bandage:2},'Retainer field stores');
  RIVAL_CAMP98.chest.lid.rotation.x=-1.3;takeWorldLoot(id);
 }
 function campTent98(b,x,z,yaw,cloth){
  const r=RIGY(b,x,z,yaw);r.box(-1.8,1.2,0,.13,2.4,.13,K.woodD).box(1.8,1.2,0,.13,2.4,.13,K.woodD).box(0,2.35,0,3.7,.12,.12,K.woodD);
  r.roof(0,2.15,0,4.3,1.75,5.4,cloth);r.box(0,.12,0,3.8,.18,4.7,K.hide);addRectRot(x,z,3.8,4.6,yaw);
 }
 function buildRivalCamp98(){
  if(RIVAL_CAMP98.status!=='unbuilt')return RIVAL_CAMP98;
  const p=sitePoint56('scythia',.46,-.26);if(!p){RIVAL_CAMP98.status='no_clear_site';return RIVAL_CAMP98;}
  const {x,z}=p,y=groundY(x,z),b=ibatch('scythia');Object.assign(RIVAL_CAMP98,{status:'ready',x,z});addFlat(x,z,20,15,y);
  // Open southern approach, asymmetric tents, fire, supply pen and raised lookout.
  campTent98(b,x-8,z-5,.35,hx(FACTIONS56.retainers.cloth));campTent98(b,x+7,z+4,-.65,hx(0x695a49));campTent98(b,x-7,z+7,2.35,hx(0x3f5360));
  b.cyl(x,y+.28,z,1.2,1.35,.55,8,K.stoneD).cyl(x,y+.92,z,0,.48,1.0,6,K.lava);
  for(const [a,d]of[[.2,4.2],[2.1,4.8],[4.2,3.8]]){const px=x+sin(a)*d,pz=z+cos(a)*d;b.box(px,y+.28,pz,2.8,.38,.42,K.woodD,{ry:a});}
  for(const [x1,z1,x2,z2]of[[x-16,z-12,x-5,z-12],[x+5,z-12,x+16,z-12],[x-16,z-12,x-16,z+13],[x+16,z-12,x+16,z+13],[x-16,z+13,x+16,z+13]])fortWall(b,x1,z1,x2,z2,2.4,K.woodD);
  const watch=RIGY(b,x+13,z+9,-.2);watch.box(0,2.2,0,3.5,.35,3.5,K.wood).box(-1.5,1.1,0,.18,2.2,.18,K.woodD).box(1.5,1.1,0,.18,2.2,.18,K.woodD);for(let i=0;i<5;i++)watch.box(-2.2,.35+i*.42,1.3-i*.45,1.2,.18,.35,K.wood);
  addRectRot(x-16,z+.5,.4,25,0);addRectRot(x+16,z+.5,.4,25,0);addRectRot(x,z+13,32,.4,0);OCC.push({x,z,r:3});
  const chest=makeChestMesh(hx(FACTIONS56.retainers.trim));chest.g.position.set(x+7,groundY(x+7,z-5),z-5);OVER.add(chest.g);RIVAL_CAMP98.chest=chest;
  INTS.push({x:x+7,z:z-5,r:2.8,vis:()=>rivalCampState98().cleared,label:()=> 'Search the Retainers’ field stores',act:rivalCampChest98});
  const state=rivalCampState98();if(!state.cleared)for(let i=0;i<roles98.length;i++){
   const a=i/roles98.length*TAU+.25,at=freeLandNear(x+sin(a)*10,z+cos(a)*9,2),e=spawnEnemy(factionKind56('retainers',roles98[i]),at.x,at.z,{area:'over',id:RIVAL_CAMP98.id+':'+i,onDie:rivalCampClear98});
   e.home={x:at.x,z:at.z};e.camp98=RIVAL_CAMP98.id;RIVAL_CAMP98.enemies.push(e);
  }
  else chest.lid.rotation.x=livingState().loot['camp:'+RIVAL_CAMP98.id+':stores']?.claimed?-1.3:0;
  DISCOVER('Lost Banner Field Camp',x,z,30,18);INT_GRID16.count=-1;return RIVAL_CAMP98;
 }
 const rivalCampPopulate98Before=populate;
 populate=async function(){await rivalCampPopulate98Before();buildRivalCamp98();};
 Object.assign(globalThis,{RIVAL_CAMP98,roles98,rivalCampState98,rivalCampClear98,buildRivalCamp98});
})();`;
