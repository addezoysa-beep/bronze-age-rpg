export const lockCameraPatch = String.raw`
/* Resume checkpoint 89: FP lock follows the target; roll keeps valid target ownership. */
function resetCombatInput89(){
 for(const k of ['KeyQ','Numpad0','KeyC','AltLeft','AltRight','CapsLock']){keys[k]=false;delete once[k];}
 mouse.l=mouse.r=false;P.dodgeBuffer62=0;P._jumpBuffer=0;
 clearCombatLock62();
}
const lockCamera89Before=updateCamera;updateCamera=function(dt){
 validateCombatLock62();
 if(FIRST_PERSON&&LOCK&&STATE==='play'&&!P.dead&&['foot','horse','chariot','boat'].includes(P.mode)){
  const eye=P.y+(P.mode==='horse'?2.42:P.mode==='chariot'?2.47:P.crouch?1.03:1.69);
  const dx=LOCK.x-P.x,dz=LOCK.z-P.z,distance=Math.max(.01,Math.hypot(dx,dz));
  const height=(Number.isFinite(LOCK.y)?LOCK.y:groundY(LOCK.x,LOCK.z))+(LOCK.h||1.6)*.55;
  const alpha=1-Math.exp(-Math.min(Math.max(dt,0),.05)*8);
  CAM.yaw+=angDiff(Math.atan2(dx,dz),CAM.yaw)*alpha;
  const pitch=clamp(.34-Math.atan2(height-eye,distance),-1.12,1.78);
  CAM.pitch+=(pitch-CAM.pitch)*alpha;CAM.manual=0;
 }
 return lockCamera89Before(dt);
};
const lockPause89Before=openPause;openPause=function(...args){resetCombatInput89();return lockPause89Before(...args);};
addEventListener('blur',resetCombatInput89);
addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')resetCombatInput89();});

/* HUD selection scans once and allocates no candidate array or sort comparator. */
healthBarTarget72=function(){
 if(STATE!=='play'||P.dead){BOSS=null;return null;}
 if(BOSS&&!healthTargetEngaged72(BOSS))BOSS=null;
 if(LOCK&&healthTargetEligible72(LOCK))return LOCK;
 let best=null,bestDistance=Infinity;
 for(const e of ENEMIES){
  const dx=e.x-P.x,dz=e.z-P.z,distance=dx*dx+dz*dz;
  if(distance>=bestDistance||!healthTargetEngaged72(e))continue;
  best=e;bestDistance=distance;
 }
 return best||BOSS||null;
};
`;
