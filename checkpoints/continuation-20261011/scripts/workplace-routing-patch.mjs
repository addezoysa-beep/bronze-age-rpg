export const workplaceRoutingPatch=String.raw`
/* WORKPLACE_ROUTING_138: table service uses indoor walkable corridors, not wall shuffling. */
function tavernRoute138(dg,n,target){
 const key=dg.id+':'+target.x.toFixed(2)+','+target.z.toFixed(2),old=n.serviceRoute138;
 if(old&&old.key===key&&old.until>T_NOW)return old;
 const cell=(x,z)=>[Math.floor((x-dg.ox)/TS),Math.floor((z-dg.oz)/TS)],start=cell(n.x,n.z),end=cell(target.x,target.z);
 const valid=(a,b)=>a>=0&&b>=0&&a<dg.W&&b<dg.H&&!dg.grid[b*dg.W+a];
 const blocked=()=>n.serviceRoute138={key,points:[],i:0,until:T_NOW+2};
 if(!valid(...start)||!valid(...end)||!canStand(n,target.x,target.z,.35,false))return blocked();
 const queue=[start],parent=new Map([[start.join(','),null]]);let found=null;
 for(let i=0;i<queue.length&&i<dg.W*dg.H;i++){
  const p=queue[i];if(p[0]===end[0]&&p[1]===end[1]){found=p;break;}
  for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]]){const a=p[0]+dx,b=p[1]+dz,k=a+','+b;
   if(!valid(a,b)||parent.has(k)||!canStand(n,dg.ox+(a+.5)*TS,dg.oz+(b+.5)*TS,.35,false))continue;
   parent.set(k,p);queue.push([a,b]);
  }
 }
 if(!found)return blocked();const points=[];
 while(found&&parent.get(found.join(','))){points.unshift({x:dg.ox+(found[0]+.5)*TS,z:dg.oz+(found[1]+.5)*TS});found=parent.get(found.join(','));}
 points.push({x:target.x,z:target.z});return n.serviceRoute138={key,points,i:0,until:T_NOW+15};
}
tavernStep118=function(n,target,dt){
 if(STATE!=='play'||P.dead||n.dead||n.hostile||n._party||!DG||AREA!==DG.id)return false;
 const route=tavernRoute138(DG,n,target);if(!route.points.length)return false;
 while(route.i<route.points.length-1&&hyp(n.x-route.points[route.i].x,n.z-route.points[route.i].z)<.2)route.i++;
 const p=route.points[route.i],d=hyp(p.x-n.x,p.z-n.z);if(d<.1)return false;
 const yaw=Math.atan2(p.x-n.x,p.z-n.z),step=Math.min(d,1.3*Math.max(0,Math.min(dt,.06))),x=n.x+sin(yaw)*step,z=n.z+cos(yaw)*step;
 if(step<=0)return false;
 if(!canStand(n,x,z,.35,false)){route.until=Math.min(route.until,T_NOW+.75);return false;}
 n.x=x;n.z=z;n.yaw=n.a=yaw;return true;
};
const workplaceSchedule138Before=workplaceSchedule62;
function workplaceUnavailable138(n){return n.dead||n.hostile||n._party||(n.area||'over')!=='over'||n.spar22||n.enemyFlee119>T_NOW;}
workplaceSchedule62=function(n){
 if(n.workplace62&&workplaceUnavailable138(n)){
  workplaceRelease62(n);n.workDwell62=0;n.workBlocked62=0;return null;
 }
 return workplaceSchedule138Before(n);
};
function workplaceFrame138(before,dt){
 // Suspend both old arrival/facing code and late grain poses for unavailable actors.
 // Reuse actor fields: no per-frame filtered NPC array or world scan.
 for(const n of WORKPLACE62.workers)if(n.workplace62&&workplaceUnavailable138(n)){
  workplaceRelease62(n);n.suspendedWork138=n.workplace62;n.workplace62=null;n.workDwell62=0;n.workBlocked62=0;
  for(const m of Object.values(n.h?.grainProps62||{}))m.visible=false;
 }
 try{return before(dt);}finally{for(const n of WORKPLACE62.workers)if(n.suspendedWork138){n.workplace62=n.suspendedWork138;n.suspendedWork138=null;}}
}
const workplaceNPC138Before=updNPCs;updNPCs=function(dt){return workplaceFrame138(workplaceNPC138Before,dt);};
const workplaceVisual138Before=updVisuals;updVisuals=function(dt){return workplaceFrame138(workplaceVisual138Before,dt);};
const grainAllowed138Before=grainWorkAllowed62;grainWorkAllowed62=function(n){return !!n&&!workplaceUnavailable138(n)&&grainAllowed138Before(n);};
`;
