export const handGripPatch=String.raw`
/* CONTINUATION_ANATOMICAL_SHAFT_GRIP_V1
   Final active-wrapper correction for stick/staff and ordinary weapon handles.
   The handle stays on the palm crease while four fingers close with distinct
   flexion and the thumb opposes the shaft. It applies to actor and view rigs. */
(function(){
 const SEAT_VECTOR100=new THREE.Vector3();
 const GRIP_KIND100=['stick','staff','spear','pole','sword','dagger','axe','greatsword','sling','bow'];
 function tagGripRig100(h){if(!h)return h;for(const [kind,item]of Object.entries(h.W||{}))if(item?.userData)item.userData.gripKind100=kind;return h;}
 function gripCurl100(palm,kind='stick',side=1){
  if(!palm?.userData?.fingers)return false;
  const long=/^(stick|staff|spear|pole)$/.test(kind),curve=long?[.88,1,.98,.90]:[.82,.96,1,.94];
  for(let i=0;i<palm.userData.fingers.length;i++){const {f,m,tip}=palm.userData.fingers[i],c=curve[i]||.9;f.rotation.x=-.92*c;m.rotation.x=-1.22*c;tip.rotation.x=-.62*c;f.rotation.z=(i-1.5)*side*.035;}
  const thumb=palm.userData.thumb;if(thumb){thumb.rotation.x=-.92;thumb.rotation.y=side*.34;thumb.rotation.z=side*.46;}
  palm.userData.gripKind100=kind;return true;
 }
 function gripKind100(source){return source?.userData?.gripKind100||'stick';}
 const shaftGrip100Before=closeGrip23;
 closeGrip23=function(arm,source,handle=0){
  shaftGrip100Before(arm,source,handle);if(!arm?.userData?.palm||!arm.userData.wrist||!source?.visible)return;
  const kind=gripKind100(source),side=arm.userData.side59||1,palm=arm.userData.palm;
  // The original anchor is at the wrist. Shift the handle into the palm crease,
  // with a slightly deeper seat for long shafts so bending cannot detach it.
  const seat=/^(stick|staff|spear|pole)$/.test(kind)?-.014:-.008;
  source.position.add(SEAT_VECTOR100.set(0,0,seat).applyQuaternion(source.quaternion));
  source.userData.gripSeat100=seat;gripCurl100(palm,kind,side);
 };
 const setWeapon100Before=setWeapon;setWeapon=function(h,kind){tagGripRig100(h);return setWeapon100Before(h,kind);};
 const refreshGrip100Before=refreshWeapon;refreshWeapon=function(){tagGripRig100(PH);const r=refreshGrip100Before();if(VIEW?.weapons)for(const [kind,item]of Object.entries(VIEW.weapons))item.userData.gripKind100=kind;if(LEFT_RIG)LEFT_RIG.userData.gripKind100=G.hands?.left||'fists';if(LEFT_VIEW)LEFT_VIEW.userData.gripKind100=G.hands?.left||'fists';return r;};
 const leftGrip100Before=syncLeftHand;syncLeftHand=function(){const r=leftGrip100Before();if(LEFT_RIG)LEFT_RIG.userData.gripKind100=G.hands?.left||'fists';if(LEFT_VIEW)LEFT_VIEW.userData.gripKind100=G.hands?.left||'fists';return r;};
 const gripPopulate100Before=populate;populate=async function(){await gripPopulate100Before();tagGripRig100(PH);for(const n of NPCS)tagGripRig100(n.h);for(const e of ENEMIES)tagGripRig100(e.hum||e.q?.h);refreshWeapon();};
 tagGripRig100(PH);
 Object.assign(globalThis,{GRIP_KIND100,tagGripRig100,gripCurl100,gripKind100});
})();`;

