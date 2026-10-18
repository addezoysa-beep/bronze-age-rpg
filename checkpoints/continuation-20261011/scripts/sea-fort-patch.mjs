export const seaFortPatch=String.raw`
/* CONTINUATION_WATCHTOWER_SEA_FORT_V1
   Reworks Watchtower Isle into a boat-reachable, climbable coastal fort. It
   reuses surviving legacy raiders, tops the garrison up to eight combatants,
   gives ranged defenders finite ammunition and gates the command chest on a
   persistent clear condition. */
(function(){
 const SEA_FORT99={id:'watchtower_sea_fort99',status:'unbuilt',x:0,z:0,enemies:[],chest:null,dock:null,nextCheck:0};
 const roles99=['spear','bow','sword','axe','greatsword','sling','spear','bow'];
 function seaFortState99(){const w=livingState();return w.seaFort99||=( {cleared:false,announced:false} );}
 function seaFortClear99(){
  const q=seaFortState99();if(q.cleared)return true;
  if(SEA_FORT99.enemies.some(e=>e.alive))return false;
  q.cleared=true;if(!q.announced){q.announced=true;banner('Watchtower Fort Cleared','The island command chest is no longer defended.');}
  save();hudQuest();return true;
 }
 function seaFortChest99(){
  if(!seaFortState99().cleared)return toast('The watchtower garrison still holds the command court.');
  const id='fort:'+SEA_FORT99.id+':command';
  if(!livingState().loot[id])putLoot(id,SEA_FORT99.x-5,SEA_FORT99.z+5,'over',{silver:115,arrow_flint:16,stone:10,bandage:2},'Watchtower command chest');
  SEA_FORT99.chest.lid.rotation.x=-1.3;takeWorldLoot(id);
 }
 function buildSeaFort99(){
  if(SEA_FORT99.status!=='unbuilt')return SEA_FORT99;
  const I=IS.i7,x=I.cx,z=I.cz,y=addFlat(x,z,22,12,Math.max(3,heightAt(x,z))),b=ibatch('i7');
  Object.assign(SEA_FORT99,{status:'ready',x,z});
  // Boat berth, broad southern landing, and a six-step ascent through the gate.
  SEA_FORT99.dock=mkDock('i7','Watchtower Fort Landing',x,z+18,90,15);
  for(let i=0;i<6;i++){const sy=y-1.05+i*.22,sz=z+18-i*1.55;b.box(x,sy,sz,5.2,.42,1.8,K.stoneD);}
  addBridge(x,z+20,x,z+8,2.7,y+.15,.55);
  // An open south gate and offset inner court create two readable firing lanes.
  fortWall(b,x-15,z-12,x-4,z-12,3.4,K.stoneD);fortWall(b,x+4,z-12,x+15,z-12,3.4,K.stoneD);
  // WATCHTOWER_SOUTH_GATE_178: the landing is south, so its causeway needs a
  // matching six-metre gap in BOTH the rendered wall and collision footprint.
  fortWall(b,x-15,z-12,x-15,z+13,3.4,K.stoneD);fortWall(b,x+15,z-12,x+15,z+13,3.4,K.stoneD);fortWall(b,x-15,z+13,x-3,z+13,3.4,K.stoneD);fortWall(b,x+3,z+13,x+15,z+13,3.4,K.stoneD);
  fortWall(b,x-4,z-2,x+8,z-2,2.1,K.woodD);
  for(const side of[-1,1]){const tx=x+side*11,tz=z+8;b.box(tx,y+1.8,tz,5,.55,5,K.stone).box(tx,y+.75,tz,4,1.5,4,K.stoneD);for(let i=0;i<5;i++)b.box(tx-side*3.2,y+.3+i*.36,tz-2+i*.62,1.25,.22,.7,K.wood);}
  addRectRot(x-15,z+.5,.45,25,0);addRectRot(x+15,z+.5,.45,25,0);addRectRot(x-9,z+13,12,.45,0);addRectRot(x+9,z+13,12,.45,0);addRectRot(x-9,z-2,10,.35,0);addRectRot(x+9,z-2,10,.35,0);
  const chest=makeChestMesh(K.gold);chest.g.position.set(x-5,groundY(x-5,z+5),z+5);OVER.add(chest.g);SEA_FORT99.chest=chest;
  INTS.push({x:x-5,z:z+5,r:2.8,vis:()=>seaFortState99().cleared,label:()=> 'Search the watchtower command chest',act:seaFortChest99});
  const state=seaFortState99();if(!state.cleared){
   const legacy=ENEMIES.filter(e=>e.alive&&e.area==='over'&&hyp(e.x-x,e.z-z)<30).slice(0,8);
   for(const e of legacy){e.seaFort99=SEA_FORT99.id;e.inventory||={};if(e.d.ranged){if(e.d.w==='sling')e.inventory.stone??=12;else e.inventory.arrow_flint??=14;}SEA_FORT99.enemies.push(e);}
   for(let i=legacy.length;i<8;i++){const a=(i/8)*TAU+.2,px=x+sin(a)*(i%2?9:12),pz=z+cos(a)*(i%2?8:10),e=spawnEnemy(factionKind56('retainers',roles99[i]),px,pz,{area:'over',id:SEA_FORT99.id+':'+i,onDie:seaFortClear99});e.home={x:px,z:pz};e.seaFort99=SEA_FORT99.id;SEA_FORT99.enemies.push(e);}
  }else chest.lid.rotation.x=livingState().loot['fort:'+SEA_FORT99.id+':command']?.claimed?-1.3:0;
  DISCOVER('Watchtower Sea Fort',x,z,48,28);INT_GRID16.count=-1;return SEA_FORT99;
 }
 const seaFortAttack99Before=enemyAttack;
 enemyAttack=function(e){
  if(e?.seaFort99&&e.d.ranged){const d=hyp(P.x-e.x,P.z-e.z);if(d>(e.d.range||28)||!enemySightLine(e))return;e.inventory||={};if(e.d.w==='bow'){e.inventory.arrow_flint??=14;if(e.inventory.arrow_flint<=0)return;e.inventory.arrow_flint--;}else if((e.inventory.stone||0)<=0)return;}
  return seaFortAttack99Before(e);
 };
 const seaFortPopulate99Before=populate;populate=async function(){await seaFortPopulate99Before();buildSeaFort99();};
 const seaFortFrame99Before=frame;frame=function(t){if(SEA_FORT99.status==='ready'&&!seaFortState99().cleared&&T_NOW>=SEA_FORT99.nextCheck){SEA_FORT99.nextCheck=T_NOW+.5;seaFortClear99();}return seaFortFrame99Before(t);};
 Object.assign(globalThis,{SEA_FORT99,roles99,seaFortState99,seaFortClear99,buildSeaFort99});
})();`;

