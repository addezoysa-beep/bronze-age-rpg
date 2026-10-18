export const dogRestWakePatch=String.raw`
/* CONTINUATION_DOG_REST_WAKE_V1
 * Domestic dogs settle at night, permit a quiet crouched approach, and wake to
 * ordinary movement, combat, nearby enemies, touch or injury. */
function wakeDog107(a,reason='movement'){
 if(!a||a.kind!=='dog')return false;
 const was=!!a.sleeping107;a.sleeping107=false;a.dogWakeUntil107=T_NOW+12;
 a.mv=true;a.t=Math.min(a.t||1,.35);a.g.rotation.z=0;
 if(was&&reason==='injury')a.agitated=Math.max(a.agitated||0,9);
 return was;
}
const dogRestSheep107Before=updSheep;updSheep=function(dt){
 const resting=[];
 if(AREA==='over')for(const a of PASTORAL){
  if(a.kind!=='dog'||a.dead)continue;
  const night=G.time>=21||G.time<6,dist=hyp(P.x-a.x,P.z-a.z),speed=hyp(P.vx||0,P.vz||0);
  const noisy=!P.crouch||speed>1.25||P.draw>.15||!!P.melee||!!mouse.l;
  const threat=ENEMIES.some(e=>e.alive&&!e.friendly&&e.area==='over'&&hyp(e.x-a.x,e.z-a.z)<8);
  if(!night||threat||a.agitated>0||a.combat||dist<(noisy?5.5:1.45))wakeDog107(a,threat?'threat':'approach');
  else if(T_NOW>=(a.dogWakeUntil107||0)){a.sleeping107=true;a.mv=false;a.combat=null;resting.push({a,x:a.x,z:a.z});}
 }
 dogRestSheep107Before(dt);
 for(const {a,x,z}of resting){
  if(!a.sleeping107)continue;a.x=x;a.z=z;a.mv=false;a._moving14=0;
  poseRestDog107(a);
 }
};
function poseRestDog107(a){
 if(!a?.sleeping107||a.dead||!a.q)return;
 /* Keep the root upright: rotating the complete canine about its feet buries
  * half the torso. Lower the belly and fold articulated legs instead. */
 a.g.position.set(a.x,groundY(a.x,a.z)-.40,a.z);a.g.rotation.set(0,a.a||0,0);
 if(a.q.neck)a.q.neck.rotation.x=.28;if(a.q.head)a.q.head.rotation.x=.16;
 if(a.q.jaw)a.q.jaw.rotation.x=0;
 for(const [i,l]of(a.q.legs?.entries?.()||[])){l.rotation.x=i<2?-.72:.68;
  if(l.userData?.knee)l.userData.knee.rotation.x=1.18;
  if(l.userData?.hock)l.userData.hock.rotation.x=-.48;
 }
}
const dogRestVisual107Before=updVisuals;updVisuals=function(dt){dogRestVisual107Before(dt);if(AREA==='over')for(const a of PASTORAL)if(a.kind==='dog'&&a.g?.visible)poseRestDog107(a);};
const dogRestDamage107Before=damageAnimal;damageAnimal=function(a,d,...rest){if(a?.kind==='dog')wakeDog107(a,'injury');return dogRestDamage107Before(a,d,...rest);};
const dogRestVoice107Before=animalVoice26;animalVoice26=function(a,...rest){if(a?.kind==='dog')wakeDog107(a,'touch');return dogRestVoice107Before(a,...rest);};
globalThis.wakeDog107=wakeDog107;
`;
