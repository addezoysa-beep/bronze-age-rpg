export const hipposLeadRoutePatch=String.raw`
/* HIPPOS_LEAD_ROUTE_121: route around yard fences; no distance cutoff freeze. */
let HIPPOS_ROUTE121=null,HIPPOS_WARN121=0;
function hipposFollow121(dt){const q=hipposQuest75(),h=ensureHippos84();if(!q.leading||![3,4].includes(q.stage)||STATE!=='play'||P.dead||AREA!=='over'||P.mode!=='foot')return false;const d=hyp(P.x-h.x,P.z-h.z);if(d<2.5)return false;dt=Math.min(Math.max(dt,0),.06);
 let nav=HIPPOS_ROUTE121;if(!nav||hyp(nav.goal.x-P.x,nav.goal.z-P.z)>4||nav.at<T_NOW){const result=walkPath15(h,P,650,1.5);nav=HIPPOS_ROUTE121={goal:{x:P.x,z:P.z},path:result.path,index:0,at:T_NOW+2,done:result.done};}
 while(nav.index<nav.path.length&&hyp(nav.path[nav.index].x-h.x,nav.path[nav.index].z-h.z)<.65)nav.index++;
 const target=nav.path[nav.index]||nav.goal,before={x:h.x,z:h.z},moved=groundRouteStep(h,target.x,target.z,3.5,dt,.75);
 if(!moved&&T_NOW>=HIPPOS_WARN121){HIPPOS_WARN121=T_NOW+6;toast('Hippos needs room on the path. Walk through the stable gate and wait for her.');nav.at=Math.min(nav.at,T_NOW+.75);}
 const speed=dt>0?hyp(h.x-before.x,h.z-before.z)/dt:0;h.q.g.position.set(h.x,groundY(h.x,h.z),h.z);h.q.g.rotation.y=h.a;quadrupedPose(h.q,speed,T_NOW);return moved;
}
const hipposVisual121Before=updVisuals;updVisuals=function(dt){const q=hipposQuest75(),leading=q.leading;q.leading=false;try{hipposVisual121Before(dt);}finally{q.leading=leading;}hipposFollow121(dt);};
const hipposAction121Before=hipposAction75;hipposAction75=function(kind){const q=hipposQuest75(),h=ensureHippos84(),pasture=hipposPoint75('pasture');if(kind==='pasture'&&q.stage===3&&q.leading){if(STATE!=='play'||P.dead||AREA!=='over'||P.mode!=='foot'||hyp(P.x-pasture.x,P.z-pasture.z)>10||hyp(h.x-pasture.x,h.z-pasture.z)>10||hyp(P.x-h.x,P.z-h.z)>8)return toast('Bring Hippos herself into the pasture before letting her graze.'),false;q.stage=4;HIPPOS_ROUTE121=null;hudQuest();save();toast('Hippos grazes calmly. Lead her back to Timaios at the stable.');return true;}const r=hipposAction121Before(kind);if(kind==='lead')HIPPOS_ROUTE121=null;return r;};
const hipposReceive121Before=finishHippos75;finishHippos75=function(n){const q=hipposQuest75(),h=ensureHippos84();if(q.stage===4&&hyp(h.x-n.x,h.z-n.z)>8)return toast('Lead Hippos herself back to Timaios before receiving her reins.'),false;const r=hipposReceive121Before(n);if(q.stage>=5){q.leading=false;HIPPOS_ROUTE121=null;}return r;};
const hipposRestore121Before=restoreLivingWorld;restoreLivingWorld=function(...args){HIPPOS_ROUTE121=null;return hipposRestore121Before(...args);};
`;
