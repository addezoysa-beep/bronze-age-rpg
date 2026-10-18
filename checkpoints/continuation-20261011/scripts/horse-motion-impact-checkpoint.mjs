export const horseMotionImpactRuntime = `
/* Horse motion/impact checkpoint: swept charges, articulated gait, and saddle-free taming registration. */
const HORSE_CHARGE79={enemy:new Map(),npc:new WeakMap(),minSpeed:8.5,cooldown:1.15};
function segmentDistance79(px,pz,ax,az,bx,bz){const dx=bx-ax,dz=bz-az,l2=dx*dx+dz*dz;if(l2<.0001)return hyp(px-ax,pz-az);const t=clamp(((px-ax)*dx+(pz-az)*dz)/l2,0,1);return hyp(px-(ax+dx*t),pz-(az+dz*t));}
function horseChargeReady79(target,enemy){if(enemy){const k=mobKey(target),until=HORSE_CHARGE79.enemy.get(k)||0;if(until>T_NOW)return false;HORSE_CHARGE79.enemy.set(k,T_NOW+HORSE_CHARGE79.cooldown);return true;}const until=HORSE_CHARGE79.npc.get(target)||0;if(until>T_NOW)return false;HORSE_CHARGE79.npc.set(target,T_NOW+HORSE_CHARGE79.cooldown);return true;}
function horseChargeDamage79(speed){return clamp(Math.round(8+(speed-HORSE_CHARGE79.minSpeed)*2.2),12,30);}
function horseChargePass79(ax,az,bx,bz,speed){if(P.mode!=='horse'||P.dead||AREA!=='over'||speed<HORSE_CHARGE79.minSpeed)return;const travel=hyp(bx-ax,bz-az);if(travel<.025||travel>1.35)return;const mx=(bx-ax)/travel,mz=(bz-az)/travel,forward=mx*sin(P.yaw)+mz*cos(P.yaw);if(forward<.55)return;const damage=horseChargeDamage79(speed);
 for(const e of ENEMIES){if(!e.alive||e.area!==AREA||e.friendly||e.d.ship||segmentDistance79(e.x,e.z,ax,az,bx,bz)>1.15+(e.r||.5)||!horseChargeReady79(e,true))continue;dmgEnemy(e,damage,mx,mz,clamp(speed*.38,3.2,6));CAM.shake=Math.max(CAM.shake,.25);}
 for(const n of NPCS){if(n.dead||(n.area||'over')!==AREA||segmentDistance79(n.x,n.z,ax,az,bx,bz)>1.05||!horseChargeReady79(n,false))continue;assaultNPC(n,damage);CAM.shake=Math.max(CAM.shake,.25);}
}
const horseChargePlayer79Before=updatePlayer;updatePlayer=function(dt){const ax=P.x,az=P.z;horseChargePlayer79Before(dt);if(dt>0&&dt<.12)horseChargePass79(ax,az,P.x,P.z,hyp(P.vx,P.vz));};

const horseGait79Before=quadrupedPose;quadrupedPose=function(q,speed=0,clock=T_NOW,attack=null){horseGait79Before(q,speed,clock,attack);if(q?.kind!=='horse'||!q.legs)return;const pace=speed<.15?'stand':speed<2.7?'walk':speed<6.2?'trot':'gallop',rate=pace==='stand'?.8:pace==='walk'?3.2:pace==='trot'?6.4:9.2,phase=clock*rate,offsets=pace==='gallop'?[0,.32,PI+.22,PI+.50]:pace==='trot'?[0,PI,PI,0]:[0,PI,PI*.58,PI*1.58];q.legs.forEach((leg,i)=>{const hind=i>1,p=phase+offsets[i],s=sin(p),flight=Math.max(0,s),stance=Math.max(0,-s),stride=pace==='stand'?.025:pace==='walk'?.34:pace==='trot'?.54:.68;leg.rotation.x=s*stride+(hind?-.035:.025);const knee=leg.userData.knee,hock=leg.userData.hock;if(knee)knee.rotation.x=(flight*(pace==='gallop'?1.10:.78)+stance*.10)*(hind?1.08:.88);if(hock)hock.rotation.x=-flight*(hind?.72:.50)+stance*.12;const hoof=hock?.children?.at(-1);if(hoof)hoof.rotation.x=-leg.rotation.x-(knee?.rotation.x||0)-(hock.rotation.x||0)*.55;});if(q.neck)q.neck.rotation.x+=(pace==='stand'?sin(clock*.75)*.018:-Math.abs(sin(phase))*clamp(speed/10,0,.12));q.g.userData.gait79=pace;};

function mountRegistration79(){livingState();const r=G.world.mountRegistration79||={pending:false,registered:!!F().horse&&!!G.inv?.riding_quilt};r.pending??=false;r.registered??=!!G.inv?.riding_quilt;return r;}
const acquireHorse79Before=acquireHorse16;acquireHorse16=function(a){const wild=WILD_HORSES16.includes(a),r=acquireHorse79Before(a);if(wild){const s=mountRegistration79();s.pending=true;s.registered=false;s.horseId=a.id;s.name=a.name;toast(a.name+' is rideable bareback · register at a stable for ownership and a riding quilt.');}return r;};
const stable79Before=stableBuy20;stableBuy20=function(n,s){const r=mountRegistration79();if(r.pending&&!r.registered)return say(n.name,['You calmed this horse yourself. I can enter the ownership mark and fit a woven riding quilt; no saddle was needed to tame or ride it.'],()=>{},[{t:'Register '+(r.name||'horse')+' · 40 silver',go:()=>{if(!r.pending||r.registered)return toast('This horse is already registered.');if(G.silver<40)return toast('You need 40 silver.');G.silver-=40;r.pending=false;r.registered=true;G.inv.riding_quilt=Math.max(1,G.inv.riding_quilt||0);WEIGHT.riding_quilt=.9;hudAll();save();toast('Horse registered · Riding quilt received.');}},{t:'Stable services',go:()=>{const pending=r.pending;r.pending=false;try{stable79Before(n,s);}finally{r.pending=pending;}}},{t:'Leave',go:()=>closeDlg()}]);return stable79Before(n,s);};
const saddleVisual79Before=updVisuals;updVisuals=function(dt){saddleVisual79Before(dt);if(HORSE.q?.saddle16)HORSE.q.saddle16.visible=!!(G.inv.saddle||G.inv.riding_quilt);};
const continueHorse79Before=continueGame;continueGame=function(...args){const value=continueHorse79Before(...args);mountRegistration79();WEIGHT.riding_quilt=.9;HORSE_CHARGE79.enemy.clear();return value;};
`;

export function applyHorseMotionImpactCheckpoint(html){
  const marker='window.WDS_READY33=true;';
  const saddleChecks=[
    "if(!G.inv.saddle)return toast('Bring a saddle before taming a wild horse.');",
    "if(!G.inv.saddle)return toast('Bring a saddle before taming this horse.');"
  ];
  if(html.includes('const HORSE_CHARGE79=')||html.split(marker).length!==2)throw new Error('Unexpected horse checkpoint source');
  for(const check of saddleChecks){if(html.split(check).length!==2)throw new Error('Expected one saddle-first taming gate');html=html.replace(check,'');}
  return html.replace(marker,horseMotionImpactRuntime+'\n'+marker);
}
