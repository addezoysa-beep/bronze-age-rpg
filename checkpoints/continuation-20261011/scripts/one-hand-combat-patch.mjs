export const oneHandCombatPatch=String.raw`
/* CONTINUATION_ONE_HAND_COMBAT_POSE_V1
   Final-boundary palm seating for sword, dagger and axe. Existing six-form
   attacks keep their timing and targets; this adds only weapon-weighted body
   load and reapplies the anatomical grip after every later shared pose. */
(function(){
 const ONE_HAND102=new Set(['sword','dagger','axe']);
 function oneHandLoad102(w,m){
  const handle=w==='sword'?-.08:w==='dagger'?.03:-.035;
  if(!m||!ONE_HAND102.has(w))return{handle,load:0,pitch:0,yaw:0};
  const p=clamp(m.t/Math.max(.001,m.duration),0,1),load=sin(p*PI),weight=w==='axe'?.095:w==='sword'?.055:.025,side=m.side==='left'?-1:1,variant=clamp(m.variant??1,0,2)-1;
  return{handle,load,pitch:load*weight,yaw:load*weight*(variant*.72+side*.18)};
 }
 function finalOneHandGrip102(arm,source,w){
  if(!arm||!source?.visible||!ONE_HAND102.has(w))return false;
  const q=oneHandLoad102(w,null);closeGrip23(arm,source,q.handle);gripCurl100(arm.userData?.palm,w,arm.userData?.side59||1);return true;
 }
 const oneHandPose102Before=poseHuman13;
 poseHuman13=function(h,o={}){
  oneHandPose102Before(h,o);if(!h?._rig13||!h.g?.visible)return;
  const m=o.m||h._combatPose22||h._poseAttack14||null,w=o.w||m?.w;
  if(!ONE_HAND102.has(w))return;
  const source=h.W?.[w];finalOneHandGrip102(h.armR,source,w);
  if(h===PH&&LEFT_RIG?.visible&&ONE_HAND102.has(G.hands?.left))finalOneHandGrip102(h.armL,LEFT_RIG,G.hands.left);
  const q=oneHandLoad102(w,m);if(m&&!o.rest){h.spine.rotation.x+=q.pitch;h.spine.rotation.y+=q.yaw;}
  h.userData=h.userData||{};h.userData.oneHandPose102={weapon:w,form:m?.form54??m?.variant??null,load:q.load};
 };
 const oneHandView102Before=updateViewPose;
 updateViewPose=function(dt){
  oneHandView102Before(dt);if(P.mode==='swim'||!VIEW?.right)return;
  const right=G.hands?.right||G.weapon;if(ONE_HAND102.has(right))finalOneHandGrip102(VIEW.right,VIEW.weapons?.[right],right);
  const left=G.hands?.left;if(ONE_HAND102.has(left)&&LEFT_VIEW?.visible)finalOneHandGrip102(VIEW.left,LEFT_VIEW,left);
 };
 Object.assign(globalThis,{ONE_HAND102,oneHandLoad102,finalOneHandGrip102});
})();`;
