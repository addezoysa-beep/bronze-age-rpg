export const chargeFeintRuntime = `
/* A committed charge feint never enters a damage window. NPCs share this contract. */
const chargeFeint61Before=tacticalTick14;
tacticalTick14=function(a,dt,w,damage,speed,ranged=false){
 const q=a._tactical14,rig=a.hum||(a.h&&typeof a.h==='object'?a.h:null);
 const eligible=rig&&!a.spar22&&!a.friendly&&!a.trainingDummy&&!a.sleeping&&!a.recovery53?.phase&&!a.dead&&a.alive!==false&&!P.dead&&!(a.stun>0)&&a.area===AREA;
 if(!eligible){if(a.chargeFeint61){a.chargeFeint61=null;if(q){q.phase='close';q.t=0;q.cd=Math.max(q.cd||0,.35);}}return chargeFeint61Before(a,dt,w,damage,speed,ranged);}
 const d=hyp(P.x-a.x,P.z-a.z),reach=w==='spear'?3.8:2.2;
 if(!ranged&&!a.chargeFeint61&&q?.phase==='close'&&!(q.evadeTime>0)&&!(a.defense23)&&q.cd<=0&&d>reach+1&&d<reach+4&&T_NOW>=(a.chargeFeintReady61||0)&&enemySightLine({...a,h:typeof a.h==='number'?a.h:1.7})){
  a.chargeFeintReady61=T_NOW+5.5;
  if(hash2(a.x+a.z,T_NOW*.5)>.72){a.chargeFeint61={t:0,yaw:Math.atan2(P.x-a.x,P.z-a.z)};q.phase='charge_feint';q.t=0;q.hit=true;}
 }
 const f=a.chargeFeint61;if(!f)return chargeFeint61Before(a,dt,w,damage,speed,ranged);
 const step=clamp(dt,0,.06);f.t+=step;q.t=f.t;a.yaw=f.yaw;a._moving14=0;a._poseAttack14=null;rig._combatPose22=null;
 if(f.t<.28){const remaining=Math.max(0,d-reach-.65);if(remaining>0)groundRouteStep(a,a.x+sin(f.yaw)*remaining,a.z+cos(f.yaw)*remaining,speed*1.65,step);a.state='chase';}
 else if(f.t<.52){groundRouteStep(a,a.x-sin(f.yaw)*2,a.z-cos(f.yaw)*2,speed*.75,step);a.state='rec';}
 else{a.state='rec';}
 if(f.t>=.82){a.chargeFeint61=null;q.phase='close';q.t=0;q.cd=Math.max(q.cd||0,.4);}
};
`;

export function applyChargeFeintCheckpoint(html) {
 const anchor='/* END BUILD48 MODULES */';
 if(html.split(anchor).length!==2)throw new Error('Charge feint requires exactly one final module anchor');
 return html.replace(anchor,chargeFeintRuntime+'\n'+anchor);
}
