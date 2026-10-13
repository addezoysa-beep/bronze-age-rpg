export const greatswordPosePatch=String.raw`
/* CONTINUATION_GREATSWORD_TWO_HAND_POSE_V1
   The active greatsword already owns both hands and six shared attacks. Re-seat
   the primary palm at the final pose boundary, then orient and close the support
   wrist on the same handle without moving the weapon a second time. */
(function(){
 function greatswordSupport103(arm,source){
  if(!arm?.userData?.wrist||!source?.visible||!source.parent)return false;
  const wrist=arm.userData.wrist;source.updateWorldMatrix(true,false);
  const axis=DOWN_AXIS.clone().applyQuaternion(source.getWorldQuaternion(new THREE.Quaternion()));
  axis.applyQuaternion(wrist.parent.getWorldQuaternion(new THREE.Quaternion()).invert()).normalize();
  const wanted=new THREE.Quaternion().setFromUnitVectors(GRIP_X23,axis),neutral=new THREE.Quaternion(),angle=neutral.angleTo(wanted);
  wrist.quaternion.copy(neutral).slerp(wanted,angle?Math.min(1,(PI*65/180)/angle):1).normalize();
  gripCurl100(arm.userData.palm,'greatsword',arm.userData.side59||1);arm.userData.palm.userData.greatswordSupport103=true;return true;
 }
 function finalGreatswordGrip103(right,left,source){
  if(!source?.visible)return false;closeGrip23(right,source,-.08);gripCurl100(right.userData?.palm,'greatsword',right.userData?.side59||1);return greatswordSupport103(left,source);
 }
 const greatPose103Before=poseHuman13;
 poseHuman13=function(h,o={}){greatPose103Before(h,o);const m=o.m||h?._combatPose22||h?._poseAttack14,w=o.w||m?.w;if(w==='greatsword'&&h?._rig13&&h.g?.visible&&finalGreatswordGrip103(h.armR,h.armL,h.W?.greatsword)){h.userData=h.userData||{};h.userData.greatswordPose103={form:m?.form54??m?.variant??null,twoHand:true};}};
 const greatView103Before=updateViewPose;
 updateViewPose=function(dt){greatView103Before(dt);if(P.mode!=='swim'&&VIEW?.right&&(G.hands?.right||G.weapon)==='greatsword')finalGreatswordGrip103(VIEW.right,VIEW.left,VIEW.weapons?.greatsword);};
 Object.assign(globalThis,{greatswordSupport103,finalGreatswordGrip103});
})();`;
