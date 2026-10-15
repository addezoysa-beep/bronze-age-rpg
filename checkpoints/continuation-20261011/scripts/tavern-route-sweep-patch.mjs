export const tavernRouteSweepPatch=String.raw`
/* TAVERN_ROUTE_SWEEP_160: route around furniture, not merely between clear coarse tile centres. */
(function(){
 const owners160=new WeakMap(),plans162=new WeakMap(),directions160=[[1,0],[-1,0],[0,1],[0,-1]];
 function clear160(n,a,b){const d=hyp(b.x-a.x,b.z-a.z),steps=Math.max(1,Math.ceil(d/.20));for(let i=1;i<=steps;i++){const f=i/steps;if(!canStand(n,a.x+(b.x-a.x)*f,a.z+(b.z-a.z)*f,.35,false))return false;}return true;}
 /* TAVERN_PLAN_BUDGET_162: private resumable search, at most128 expanded nodes per simulation frame. */
 function* plan162(dg,n,target){
  if(!Number.isFinite(n.x+n.z+target.x+target.z)||!canStand(n,n.x,n.z,.35,false)||!canStand(n,target.x,target.z,.35,false))return [];
  const start={x:n.x,z:n.z};if(clear160(n,start,target))return [{x:target.x,z:target.z}];
  const step=TS/8,queue=[{ix:0,iz:0,x:n.x,z:n.z,parent:-1,cost:0,score:0}],open=[0],seen=new Set(['0,0']),limit=Math.ceil(dg.W*dg.H*64);let found=-1,visited=0;
  const less=(a,b)=>queue[a].score<queue[b].score||(queue[a].score===queue[b].score&&a<b);
  const push=index=>{open.push(index);let i=open.length-1;while(i>0){const p=(i-1)>>1;if(!less(open[i],open[p]))break;const temp=open[i];open[i]=open[p];open[p]=temp;i=p;}};
  const pop=()=>{const first=open[0],last=open.pop();if(open.length){open[0]=last;let i=0;for(;;){const a=i*2+1,b=a+1;if(a>=open.length)break;const c=b<open.length&&less(open[b],open[a])?b:a;if(!less(open[c],open[i]))break;const temp=open[i];open[i]=open[c];open[c]=temp;i=c;}}return first;};
  let batch=0;while(open.length&&visited++<limit){if(batch===128){batch=0;yield;}batch++;const at=pop();
   const p=queue[at];if(hyp(p.x-target.x,p.z-target.z)<=step*1.5&&clear160(n,p,target)){found=at;break;}
   for(const[dx,dz]of directions160){const ix=p.ix+dx,iz=p.iz+dz,key=ix+','+iz;if(seen.has(key))continue;const q={ix,iz,x:start.x+ix*step,z:start.z+iz*step,parent:at,cost:p.cost+1};q.score=q.cost+(Math.abs(q.x-target.x)+Math.abs(q.z-target.z))/step;
    if(q.x<dg.ox||q.z<dg.oz||q.x>=dg.ox+dg.W*TS||q.z>=dg.oz+dg.H*TS||!canStand(n,q.x,q.z,.35,false)||!clear160(n,p,q))continue;
    seen.add(key);queue.push(q);push(queue.length-1);
   }
  }
  if(found<0)return [];const points=[];while(found>0){const p=queue[found];points.push({x:p.x,z:p.z});found=p.parent;}points.reverse();points.push({x:target.x,z:target.z});return points;
 }
 tavernRoute138=function(dg,n,target){
  const key=dg.id+':'+target.x.toFixed(2)+','+target.z.toFixed(2),old=n.serviceRoute138;
  if(old&&old.key===key&&old.until>T_NOW&&owners160.get(n)?.dg===dg&&owners160.get(n).route===old)return old;
  let plan=plans162.get(n);
  if(!plan||plan.dg!==dg||plan.key!==key||plan.x!==n.x||plan.z!==n.z||old!==plan.pending){plan={dg,key,x:n.x,z:n.z,last:null,iterator:plan162(dg,n,{x:target.x,z:target.z}),pending:{key,points:[],i:0,until:T_NOW,pending:true}};plans162.set(n,plan);n.serviceRoute138=plan.pending;}
  if(plan.last===T_NOW)return plan.pending;plan.last=T_NOW;
  const next=plan.iterator.next();if(!next.done)return plan.pending;
  plans162.delete(n);const points=next.value,route={key,points,i:0,until:T_NOW+(points.length?15:.75)};owners160.set(n,{dg,route});return n.serviceRoute138=route;
 };
 tavernStep118=function(n,target,dt){
  if(STATE!=='play'||P.dead||n.dead||n.hostile||n._party||!DG||AREA!==DG.id)return false;
  const route=tavernRoute138(DG,n,target);if(!route.points.length)return false;
  while(route.i<route.points.length-1&&hyp(n.x-route.points[route.i].x,n.z-route.points[route.i].z)<.10)route.i++;
  const p=route.points[route.i],d=hyp(p.x-n.x,p.z-n.z);if(d<.1)return false;const yaw=Math.atan2(p.x-n.x,p.z-n.z),step=Math.min(d,1.3*Math.max(0,Math.min(dt,.06))),next={x:n.x+sin(yaw)*step,z:n.z+cos(yaw)*step};
  if(step<=0||!Number.isFinite(step))return false;
  if(!clear160(n,n,next)){route.until=T_NOW;return false;}
  n.x=next.x;n.z=next.z;n.yaw=n.a=yaw;return true;
 };
})();
`;
