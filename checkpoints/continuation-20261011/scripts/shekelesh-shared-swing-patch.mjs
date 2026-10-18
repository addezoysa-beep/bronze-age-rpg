export const shekeleshSharedSwingPatch=String.raw`
/* SHEKELESH_SHARED_SWING_182: existing player axe forms follow native boss
   wind/contact/recovery. No hit, throw, ward, timing or movement replacement. */
(function(){
 const owners182=new WeakMap();
 function registerShekeleshSwing182(e){if(e?.kind==='warlord'&&e.hum&&typeof e.hum==='object'&&!owners182.has(e.hum))owners182.set(e.hum,{e,m:{w:'axe',side:'right',duration:1,t:0,variant:0,form54:3}});return e;}
 function shekeleshAxePose182(e){
  const q=e?.hum&&owners182.get(e.hum);
  if(!q||q.e!==e||e.kind!=='warlord'||!e.alive||e.area!==AREA||!ENEMIES.includes(e)||!e.g?.visible||!e.hum._rig13||P.dead||STATE!=='play'||e.stun>0||e._tactical14||e.d?.w!=='axe'||!Number.isInteger(e.phase)||e.phase<0||!Number.isFinite(e.t))return null;
  let p;if(e.state==='wind'){
   if(e.d.throw&&e.phase%2===1)return null;
   const wind=e.d.wind;if(!Number.isFinite(wind)||wind<=0)return null;
   p=.52*clamp((wind-e.t)/wind,0,1);
  }else if(e.state==='rec'){
   // Native enemyAttack increments phase: odd is a completed axe blow,
   // even is the existing projectile burst. Never animate that burst as a cut.
   if(e.d.throw&&e.phase%2===0)return null;
   p=.52+.48*clamp((.5-e.t)/.5,0,1);
  }else return null;
  const form=3+(Math.floor(e.phase/2)%2)*2,m=q.m;
  m.t=p;m.form54=form;m.variant=form===3?0:2;m.move54=COMBAT_FORMS54[form];return m;
 }
 const spawn182Before=spawnEnemy;spawnEnemy=function(){return registerShekeleshSwing182(spawn182Before.apply(this,arguments));};
 for(const e of ENEMIES)registerShekeleshSwing182(e);
 const pose182Before=poseHuman13;poseHuman13=function(h,o={}){const e=owners182.get(h)?.e,m=!o.rest&&shekeleshAxePose182(e);if(!m||o.w&&o.w!=='axe')return pose182Before.apply(this,arguments);
  return pose182Before.call(this,h,{...o,w:'axe',m});
 };
 Object.assign(globalThis,{registerShekeleshSwing182,shekeleshAxePose182});
})();`;
