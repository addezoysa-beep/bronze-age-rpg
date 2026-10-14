export const troyWallAccessPatch=String.raw`
/* TROY_WALL_ACCESS_141: interior stairs and real wall-top footing, no gate/quest mutation. */
const TROY_ACCESS141={stairs:[],built:false,parapets:[],wallIndex:new Map(),cell:16};
const troySection141Before=cityWallSection23;cityWallSection23=function(b,...args){
 const box=b.box;b.box=function(x,y,z,w,h,d,...rest){const start=this.p?.length;const r=box.call(this,x,y,z,w,h,d,...rest);
  if(w===.75&&h===.72&&d===.8&&Math.abs(y-21.36)<.001&&start!=null)TROY_ACCESS141.parapets.push({b,start,end:this.p.length,x,z});return r;
 };try{return troySection141Before(b,...args);}finally{b.box=box;}
};
function openStairParapets141(){const q=TROY_ACCESS141,remove=q.parapets.filter(p=>q.stairs.some(s=>{const a=stairSample141(s,p.x,p.z);return a&&a.height>19&&a.side<s.half+.4;}));
 remove.sort((a,b)=>b.start-a.start);for(const p of remove){const count=p.end-p.start;for(const values of[p.b.p,p.b.n,p.b.c])values.splice(p.start,count);}
 // Construction-only ranges are invalid after the cut and are never used per frame.
 q.parapets.length=0;
}
function stairSample141(s,x,z){const dx=x-s.x,dz=z-s.z,t=dx*s.ux+dz*s.uz,side=Math.abs(dx*s.uz-dz*s.ux);if(t<0||t>s.length+.1||side>s.half)return null;return{height:s.base+Math.min(s.steps,Math.ceil(t/s.run))*s.rise,side};}
function troyWallSurface141(x,z){
 const q=TROY_ACCESS141;if(!q.built)return null;
 for(const s of q.stairs){const p=stairSample141(s,x,z);if(p)return p.height;}
 const I=IS.troy;if(!I||hyp(x-I.cx,z-I.cz)>235)return null;
 const candidates=q.wallIndex.get(Math.floor(x/q.cell)+','+Math.floor(z/q.cell));if(!candidates)return null;
 for(const s of candidates){const dx=s.c.x-s.a.x,dz=s.c.z-s.a.z,L=dx*dx+dz*dz;if(!L)continue;const t=((x-s.a.x)*dx+(z-s.a.z)*dz)/L;if(t<0||t>1)continue;if(hyp(x-s.a.x-t*dx,z-s.a.z-t*dz)<=s.half-.15)return s.top;}
 return null;
}
const troyHeight141Before=heightAt;heightAt=function(x,z){const h=troyHeight141Before(x,z),surface=troyWallSurface141(x,z);return surface==null?h:Math.max(h,surface);};
const troyCollision141Before=colBlocked;colBlocked=function(x,z,r){
 const actor=COLLISION_ACTOR15;if(AREA==='over'&&actor)for(const s of TROY_ACCESS141.stairs){const p=stairSample141(s,x,z);if(p&&p.side+r<=s.half&&actor.y>=p.height-.65&&actor.y<=p.height+2.2){
  // The inspected pre-wall-body collision still checks every gate and CG prop.
  // Skip only sealed wall-body collision while entering from this interior stair.
  return sealedCollision23Before(x,z,r);
 }}return troyCollision141Before(x,z,r);
};
function installTroyWallAccess141(){
 const q=TROY_ACCESS141,I=IS.troy;if(q.built||!I||!TROY23.arcs.length)return false;
 const b=ibatch('troy');for(const arc of TROY23.arcs){let chosen=null;
  for(const j of[17,9,22]){const a=arc[j],c=arc[j+1];if(!a||!c)continue;const tx=(a.x+c.x)/2,tz=(a.z+c.z)/2,nx=(tx-I.cx)/(185*185),nz=(tz-I.cz)/(145*145),norm=hyp(nx,nz)||1,ux=nx/norm,uz=nz/norm,length=34,x=tx-ux*length,z=tz-uz*length,base=troyHeight141Before(x,z);
   if(base<3||base>12)continue;let clear=true;for(let t=0;t<=length-4.5;t+=1)if(troyCollision141Before(x+ux*t,z+uz*t,1.65)){clear=false;break;}if(!clear)continue;
   const steps=Math.ceil((21-base)/.2);chosen={x,z,ux,uz,length,half:1.6,base,steps,run:length/steps,rise:(21-base)/steps};break;
  }
  if(!chosen)continue;const s=chosen,yaw=Math.atan2(s.ux,s.uz);
  for(let i=0;i<s.steps;i++){const t=(i+.5)*s.run,top=s.base+(i+1)*s.rise;b.box(s.x+s.ux*t,top-.14,s.z+s.uz*t,s.half*2,.28,s.run+.02,K.stoneL,{ry:yaw});}
  q.stairs.push(s);
 }
 q.built=q.stairs.length>0;if(q.built){
  for(const s of TROY23.segments)for(let a=Math.floor((Math.min(s.a.x,s.c.x)-s.half)/q.cell);a<=Math.floor((Math.max(s.a.x,s.c.x)+s.half)/q.cell);a++)for(let c=Math.floor((Math.min(s.a.z,s.c.z)-s.half)/q.cell);c<=Math.floor((Math.max(s.a.z,s.c.z)+s.half)/q.cell);c++){
   const key=a+','+c;let list=q.wallIndex.get(key);if(!list)q.wallIndex.set(key,list=[]);list.push(s);
  }openStairParapets141();
 }return q.built;
}
const troyPopulate141Before=populate;populate=async function(){await troyPopulate141Before();installTroyWallAccess141();};
`;
