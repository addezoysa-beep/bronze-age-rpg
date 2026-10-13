export const spearShieldPatch=String.raw`
/* CONTINUATION_SPEAR_SHIELD_POSE_V1
   Final shared-rig spear stance: the shield stays between the body and threat,
   the free hand braces the shaft, and wind/extension/recovery use one envelope. */
(function(){
 function spearEase101(a,b,x){x=clamp((x-a)/(b-a),0,1);return x*x*(3-2*x);}
 function spearPose101(m,shield=false){
  const p=m?clamp(m.t/Math.max(.001,m.duration),0,1):0;
  const wind=m?spearEase101(0,.28,p):0,hit=m?spearEase101(.28,.52,p):0,recover=m?spearEase101(.58,1,p):0;
  const brace=wind*(1-recover),drive=hit*(1-recover),variant=m?.variant||0;
  const right=[.29-brace*.045,1.055+brace*.075,.09-brace*.18+drive*.53];
  const direction=m?[(variant-1)*.065,.025+(variant===2?.045:0),1]:[.018,.985,.17];
  const left=shield?[-.205,1.235,.39+brace*.055]:[-.13-brace*.035,1.075+brace*.045,.265-brace*.08+drive*.39];
  return{p,wind,hit,recover,brace,drive,right,left,direction,shield,torsoPitch:drive*.055-brace*.025,torsoYaw:(variant-1)*drive*.055};
 }
 function applySpearPose101(h,o={}){
  if(!h?._rig13||!h.g?.visible)return false;
  const source=h.W?.spear;if(!source?.visible)return false;
  const m=o.m||h._combatPose22||h._poseAttack14||null,shield=o.left==='shield'||!!h.shield?.visible,q=spearPose101(m,shield);
  const right=new THREE.Vector3(...q.right),left=new THREE.Vector3(...q.left),direction=new THREE.Vector3(...q.direction).normalize();
  armIK(h.armR,right,new THREE.Vector3(.61,1.03,-.20));
  armIK(h.armL,left,new THREE.Vector3(-.61,1.02,-.18));
  orientHeldWeapon(h,source,direction);
  closeGrip23(h.armR,source,0);
  if(!shield){gripCurl100(h.armL.userData.palm,'spear',h.armL.userData.side59||1);h.armL.userData.palm.userData.bracingSpear101=true;}
  else{
   h.armL.userData.palm.userData.bracingSpear101=false;
   if(h.shield){h.shield.position.set(0,-.022,.092);h.shield.rotation.set(-PI/2,-.08,.035);}
  }
  h.spine.rotation.x+=q.torsoPitch;h.spine.rotation.y+=q.torsoYaw;
  h.userData=h.userData||{};h.userData.spearPose101={phase:q.p,extension:q.drive,shield};return true;
 }
 const spearPose101Before=poseHuman13;
 poseHuman13=function(h,o={}){spearPose101Before(h,o);if((o.w||h?._combatPose22?.w||h?._poseAttack14?.w)==='spear')applySpearPose101(h,o);};
 Object.assign(globalThis,{spearPose101,applySpearPose101});
})();`;
