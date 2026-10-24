// Replaces the attachment's proximity-only key chest search, retaining its native
// chest ID and saved loot identity. No lock/puzzle bypass or free carried key.
export const reachableDungeonKeyFunctions=String.raw`
 function dungeonKeyPoint266(dg){
  if(!dg?.spawn||!dg.grid||!Number.isInteger(dg.W)||!Number.isInteger(dg.H))return null;
  const step=typeof TS==='number'?TS:4,oz=dg.oz||0,r=.42,sx=dg.spawn[0],sz=dg.spawn[1];
  if(!Number.isFinite(sx)||!Number.isFinite(sz)||step<=0)return null;
  const terrain=(x,z)=>dg.terrain26?floorSample26(dg,x,z):0;
  const clear=(x,z)=>{
   for(const[a,b]of[[r,0],[-r,0],[0,r],[0,-r],[r*.72,r*.72],[-r*.72,r*.72],[r*.72,-r*.72],[-r*.72,-r*.72]]){const ix=Math.floor((x+a-dg.ox)/step),iz=Math.floor((z+b-oz)/step);if(ix<0||iz<0||ix>=dg.W||iz>=dg.H||dg.grid[iz*dg.W+ix]!==0)return false;}
   for(const o of dg.solids||[])if(o.solid&&Math.abs(x-o.x)<(o.halfX||2)+r&&Math.abs(z-o.z)<(o.halfZ||2)+r)return false;
   for(const o of dg.doors||[])if(!o.open&&Math.abs(x-o.x)<(o.halfX||2)+r&&Math.abs(z-o.z)<(o.halfZ||2)+r)return false;
   for(const o of dg.crates||[])if(Math.abs(x-o.x)<1+r&&Math.abs(z-o.z)<1+r)return false;
   return Number.isFinite(terrain(x,z));
  };
  const path=(x,z,X,Z)=>{const n=Math.max(1,Math.ceil(Math.hypot(X-x,Z-z)/.3));let y=terrain(x,z);
   for(let i=0;i<=n;i++){const a=x+(X-x)*i/n,b=z+(Z-z)*i/n,Y=terrain(a,b);if(!clear(a,b)||!Number.isFinite(Y)||Math.abs(Y-y)>.45)return false;y=Y;}return true;};
  const tx=Math.floor((sx-dg.ox)/step),tz=Math.floor((sz-oz)/step),cx=dg.ox+(tx+.5)*step,cz=oz+(tz+.5)*step;
  if(!path(sx,sz,cx,cz))return null;
  const queue=[[tx,tz,0]],seen=new Set([tx+','+tz]);
  for(let i=0;i<queue.length&&i<192;i++){const[x,z,d]=queue[i],X=dg.ox+(x+.5)*step,Z=oz+(z+.5)*step,Y=terrain(X,Z),distance=Math.hypot(X-sx,Z-sz);
   const free=distance>=3&&distance<=19&&!(dg.chests||[]).some(p=>Math.hypot(X-p.x,Z-p.z)<3)&&!(dg.ints||[]).some(p=>typeof p.x==='number'&&typeof p.z==='number'&&Math.hypot(X-p.x,Z-p.z)<2)&&!(dg.spawns||[]).some(p=>Math.hypot(X-p.x,Z-p.z)<3)&&!(dg.def?.objs||[]).some(p=>p[0]===x&&p[1]===z);
   const flat=[[-.8,-.55],[-.8,.55],[.8,-.55],[.8,.55]].every(([a,b])=>clear(X+a,Z+b)&&Math.abs(terrain(X+a,Z+b)-Y)<.14);
   if(free&&flat)return{x:X,z:Z,y:Y};
   if(d>=7)continue;for(const[a,b]of[[1,0],[0,1],[-1,0],[0,-1]]){const nx=x+a,nz=z+b,key=nx+','+nz;if(nx<0||nz<0||nx>=dg.W||nz>=dg.H||seen.has(key))continue;seen.add(key);const NX=dg.ox+(nx+.5)*step,NZ=oz+(nz+.5)*step;if(Math.hypot(NX-sx,NZ-sz)>24||!path(X,Z,NX,NZ))continue;queue.push([nx,nz,d+1]);}
  }return null;
 }
 function ensureDungeonKey262(dg){
  if(!dg||dg.keySource262||!dg.doors?.some(d=>!d.open))return dg;
  const p=dungeonKeyPoint266(dg);if(!p)return dg;
  const idx=260,st=gstate(dg.id),c=makeChestMesh();c.g.position.set(p.x,p.y,p.z);dg.group.add(c.g);
  const ch={idx,x:p.x,z:p.z,item:'key',open:!!st.chests[idx],lid:c.lid,m:c.g};
  if(ch.open)c.lid.rotation.x=-1.35;dg.chests.push(ch);dg.keySource262=true;
  dg.ints.push({x:ch.x,z:ch.z,r:2.6,vis:()=>!ch.open||lootRemaining15('chest:'+dg.id+':'+idx),label:()=>'Open the entrance chest · bronze key',act:()=>{
   if(DG!==dg||DGS[dg.id]!==dg||AREA!==dg.id||!['play','loot'].includes(STATE)||P.dead||P.mode!=='foot'||!Number.isFinite(P.x)||!Number.isFinite(P.z)||Math.hypot(P.x-ch.x,P.z-ch.z)>3.1||ch.open&&!lootRemaining15('chest:'+dg.id+':'+idx))return false;
   return openChest(dg,ch);
  }});
  return dg;
 }
`;
export function repairDungeonKeySource(source){
 const start=source.indexOf(' function ensureDungeonKey262(dg){'),end=source.indexOf(' // A dark limestone palette distinguishes Knossos',start);
 if(start<0||end<start||source.indexOf(' function ensureDungeonKey262(dg){',start+1)>=0)throw Error('Key-source reconciliation boundary changed');
 source=source.slice(0,start)+' /* REACHABLE_DUNGEON_KEY_266: native collision/terrain-connected entrance chest. */\n'+reachableDungeonKeyFunctions+source.slice(end);
 const anchor='Object.assign(globalThis,{ensureDungeonKey262,matteGroup262});';
 if(source.split(anchor).length!==2)throw Error('Key-source export anchor changed');
 return source.replace(anchor,'Object.assign(globalThis,{ensureDungeonKey262,dungeonKeyPoint266,matteGroup262});');
}
