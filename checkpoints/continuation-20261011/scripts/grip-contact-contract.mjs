// Self-contained for page.evaluate; use the inspected palm crease and parent-space
// shaft seat. Never increase the existing epsilon or infer visual acceptance.
export function measureStickGripContact({firstPerson=false}={}){
 const root=firstPerson?VIEW_ROOT:PH.g,item=firstPerson?VIEW.weapons.stick:PH.W.stick,arm=firstPerson?VIEW.right:PH.armR,wrist=arm.userData.wrist;
 root.updateWorldMatrix(true,true);
 const crease=wrist.localToWorld(new THREE.Vector3(0,-.098,.034));
 const local=item.parent.worldToLocal(crease.clone()).add(new THREE.Vector3(0,0,-.014).applyQuaternion(item.quaternion));
 const seat=item.parent.localToWorld(local),origin=item.localToWorld(new THREE.Vector3());
 return{angle:new THREE.Quaternion().angleTo(wrist.quaternion)*180/Math.PI,
  distance:origin.distanceTo(seat),legacyWristDistance:origin.distanceTo(crease),expectedSeat:-.014,recordedSeat:item.userData.gripSeat100,
  visible:item.visible,firstPerson:FIRST_PERSON,drawn:!G.peaceful16,weapon:G.hands.right,rootVisible:root.visible};
}
