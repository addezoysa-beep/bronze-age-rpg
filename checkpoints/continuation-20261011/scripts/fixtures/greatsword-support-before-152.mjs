// Exact support function from published e91d8f3 greatsword-pose-patch.mjs.
export const originalSupport103=String.raw`
function greatswordSupport103(arm,source){
  if(!arm?.userData?.wrist||!source?.visible||!source.parent)return false;
  const wrist=arm.userData.wrist;source.updateWorldMatrix(true,false);
  const axis=DOWN_AXIS.clone().applyQuaternion(source.getWorldQuaternion(new THREE.Quaternion()));
  axis.applyQuaternion(wrist.parent.getWorldQuaternion(new THREE.Quaternion()).invert()).normalize();
  const wanted=new THREE.Quaternion().setFromUnitVectors(GRIP_X23,axis),neutral=new THREE.Quaternion(),angle=neutral.angleTo(wanted);
  wrist.quaternion.copy(neutral).slerp(wanted,angle?Math.min(1,(PI*65/180)/angle):1).normalize();
  gripCurl100(arm.userData.palm,'greatsword',arm.userData.side59||1);arm.userData.palm.userData.greatswordSupport103=true;return true;
 }
`;
