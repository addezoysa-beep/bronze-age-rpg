// Next checkpoint: kept separate from the immutable 483034b8 playtest candidate.
export const arrowStealthSearchPatch=String.raw`
/* CONTINUATION_ARROW_SEARCH_V1: a hidden missile gives direction, not coordinates. */
function shotVisible115(e){
 const distance=hyp(P.x-e.x,P.z-e.z),faced=abs(angDiff(Math.atan2(P.x-e.x,P.z-e.z),e.yaw||0))<1.18;
 const night=AREA==='over'&&(G.time<6||G.time>20),cover=P.crouch&&stealthCover();
 const range=(e.d.aggro||20)*(P.crouch?.55:1)*(cover?.5:1)*(night?.72:1);
 return (faced&&distance<range||distance<(P.crouch?1.4:5))&&enemySightLine(e);
}
const revealPerception115Before=enemyPerception;enemyPerception=function(e,distance,dt){
 const reveal=P.reveal,faced=abs(angDiff(Math.atan2(P.x-e.x,P.z-e.z),e.yaw||0))<1.18;
 if(!faced||distance>8)P.reveal=0;
 try{return revealPerception115Before(e,distance,dt);}finally{P.reveal=reveal;}
};
const hiddenArrow115Before=arrowImpact27;arrowImpact27=function(p,hit){
 const e=hit.c?.type==='enemy'?hit.c.a:null,unaware=e&&p.from==='p'&&!e.boss&&!e.trainingDummy&&(e._arrowSearch115||e.state==='idle'&&(e.suspicion||0)<1)&&!shotVisible115(e);
 const result=hiddenArrow115Before(p,hit);
 if(unaware&&e.alive&&!e.friendly){const length=hyp(p.vx,p.vz)||1,goal={x:e.x-p.vx/length*12,z:e.z-p.vz/length*12};e._arrowSearch115={...goal,until:T_NOW+8};e._lastSeen={...goal};e.state='chase';e.suspicion=.65;e._unseen=6;e.combat=e.howl25=e.dash26=null;e._tactical14=null;e.packAlert25=0;}
 return result;
};
const searchEnemy115Before=updEnemy;updEnemy=function(e,dt){
 const search=e._arrowSearch115;if(!search)return searchEnemy115Before(e,dt);
 if(!e.alive||e.friendly||P.dead||e.area!==AREA){delete e._arrowSearch115;return searchEnemy115Before(e,dt);}
 if(STATE!=='play')return;
 if(enemyPerception(e,hyp(P.x-e.x,P.z-e.z),dt)){delete e._arrowSearch115;e.suspicion=1;e._lastSeen={x:P.x,z:P.z};return searchEnemy115Before(e,dt);}
 if(T_NOW>=search.until){delete e._arrowSearch115;e.state='idle';e.suspicion=.2;e._unseen=10;return searchEnemy115Before(e,dt);}
 dt=Math.max(0,Math.min(dt,.06));e.yaw=Math.atan2(search.x-e.x,search.z-e.z);const speed=e.stun>0?0:Math.min(3,Math.max(0,e.d.spd??3));e.stun=Math.max(0,(e.stun||0)-dt);
 let moving=0;
 if(hyp(search.x-e.x,search.z-e.z)>1.2&&speed>0){
  const ax=e.x,az=e.z;
  if(e.area==='over')groundRouteStep(e,search.x,search.z,speed,dt,e.r);
  else{const step=Math.min(hyp(search.x-e.x,search.z-e.z),dt*speed),nx=e.x+Math.sin(e.yaw)*step,nz=e.z+Math.cos(e.yaw)*step;
   if(!dgBlocked(nx,nz,e.r||.45,e,false)){e.x=nx;e.z=nz;}
  }
  moving=dt>0?hyp(e.x-ax,e.z-az)/dt:0;
 }
 e.y=e.area==='over'?groundY(e.x,e.z):dungeonFloor(e.x,e.z,e);e.g.position.set(e.x,e.y,e.z);e.g.rotation.y=e.yaw;
 if(e.flash>0){e.flash=Math.max(0,e.flash-dt);if(!e.flash)flashAll(e.g,false);}
 if(e.hum)poseHuman13(e.hum,{w:e.d.w||'fists',speed:moving,phase:T_NOW*4,dt});else if(e.q)quadrupedPose(e.q,moving,T_NOW,null);
};
`;
