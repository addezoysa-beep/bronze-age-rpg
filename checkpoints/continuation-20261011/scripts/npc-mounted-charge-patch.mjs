export const npcMountedChargePatch=String.raw`
/* CONTINUATION_NPC_MOUNTED_CHARGE_V1
   Two road raiders in each mounted-patrol encounter actually ride. Their swept
   impact can hurt the player once per contact window; friendly riders, walking
   contacts, races and royal tours cannot invoke this combat path. */
(function(){
 const impactUntil96=new WeakMap();
 function npcHorseChargeSweep96(e,ax,az,bx,bz,speed){
  if(!e?.mountedRaider96||!e.alive||e.friendly||e.area!==AREA||AREA!=='over'||P.dead||STATE!=='play'||speed<HORSE_CHARGE79.minSpeed)return false;
  const travel=hyp(bx-ax,bz-az);if(travel<.025||travel>1.45)return false;
  const mx=(bx-ax)/travel,mz=(bz-az)/travel;
  if(mx*sin(e.yaw)+mz*cos(e.yaw)<.5||segmentDistance79(P.x,P.z,ax,az,bx,bz)>1.3)return false;
  if((impactUntil96.get(e)||0)>T_NOW)return false;
  impactUntil96.set(e,T_NOW+HORSE_CHARGE79.cooldown);
  const damage=clamp(Math.round(horseChargeDamage79(speed)*.72),9,22);
  return hurt(damage,e.x,e.z,e)!==false;
 }
 function mountRoadRaider96(e,index){
  if(!e||e.mountedRaider96||!e.alive||e.d?.ship)return e;
  const q=makeHorse(hx(index%2?0x5b4030:0x8a6748));
  if(typeof horseBuild35==='function')horseBuild35(q,3+index%2);
  q.g.visible=false;OVER.add(q.g);
  e.mountedRaider96=q;
  e.d={...e.d,spd:Math.max(9.4,e.d.spd||0),reach:Math.max(2.2,e.d.reach||0)};
  return e;
 }
 const ensureMountedRaiders96Before=ensureMountedRaiders;
 ensureMountedRaiders=function(realm){
  const out=ensureMountedRaiders96Before.apply(this,arguments),eligible=ENEMIES.filter(e=>e.alive&&e.warRealm===realm&&!e.d?.ship);
  for(let i=0;i<Math.min(2,eligible.length);i++)mountRoadRaider96(eligible[i],i);
  return out;
 };
 const updMountedRaider96Before=updEnemy;
 updEnemy=function(e,dt){
  const mounted=e.mountedRaider96,ax=e.x,az=e.z,out=updMountedRaider96Before.apply(this,arguments);
  if(!mounted)return out;
  const speed=dt>0&&dt<.12?hyp(e.x-ax,e.z-az)/dt:0;
  npcHorseChargeSweep96(e,ax,az,e.x,e.z,speed);
  const y=groundY(e.x,e.z),visible=e.alive&&AREA==='over'&&hyp(P.x-e.x,P.z-e.z)<170;
  mounted.g.visible=visible;mounted.g.position.set(e.x,y,e.z);mounted.g.rotation.y=e.yaw;
  if(e.alive){quadrupedPose(mounted,speed,T_NOW);e.g.position.set(e.x,y+1.12,e.z);e.g.rotation.y=e.yaw;if(e.hum)mountedPose50(e.hum,mounted);}
  return out;
 };
 const continueMounted96Before=continueGame;
 continueGame=function(){impactUntil96.clear?.();return continueMounted96Before.apply(this,arguments);};
 Object.assign(globalThis,{npcHorseChargeSweep96,mountRoadRaider96});
})();`;
