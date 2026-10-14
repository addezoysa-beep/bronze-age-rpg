export const granaryServicePatch=String.raw`
/* GRANARY_SERVICE_142: regional buildings share existing conserved common-store stock. */
const GRANARIES142=new Map();
function granarySite142(p){
 // Validate the full footprint AND the outside doorway, not just its centre.
 for(const radius of[26,38,50,62,74])for(let i=0;i<12;i++){
  const a=i*Math.PI/6,x=p.x+Math.sin(a)*radius,z=p.z+Math.cos(a)*radius,y=groundY(x,z);
  if(y<3||nearestIsle(x,z)!==p.region||!occFree(x,z,9))continue;
  let safe=true;for(const dx of[-6,0,6])for(const dz of[-5,0,5,7]){
   if(nearestIsle(x+dx,z+dz)!==p.region||Math.abs(groundY(x+dx,z+dz)-y)>.45||colBlocked(x+dx,z+dz,3)){safe=false;break;}
  }if(safe)return{x,z,y};
 }return null;
}
function granaryKeeperUsable142(n){return !!n&&!P.dead&&P.mode==='foot'&&AREA===n.area&&!n.dead&&!n.hostile&&!n._party&&hyp(P.x-n.x,P.z-n.z)<=3;}
function granaryStockTalk142(n,p){
 if(!granaryKeeperUsable142(n))return toast('Approach the storekeeper on foot.');
 const s=polityState36(p.id).stock;
 say(n.name,['These jars and bins hold the households’ provisions. I measure what comes in and what leaves.',
  'Our account shows '+Math.floor(s.grain||0)+' measures of grain, '+Math.floor(s.wool||0)+' wool and '+Math.floor(s.wood||0)+' timber. Cargo is counted only when it arrives.'],null,[
  {t:'Buy or sell provisions and materials',go:()=>granaryTrade142(n,p)},
  {t:'Leave the conversation',go:()=>closeDlg()}
 ]);
}
const granaryStoreTrade142Before=storeTrade36;
function granaryTrade142(n,p){
 if(!granaryKeeperUsable142(n))return toast('Approach the storekeeper on foot.');
 // Preserve inspected prices, insufficient-funds checks, single-item conservation,
 // stock limits and shipment production. Guard every ordinary menu transaction.
 const oldSay=say,oldTrade=granaryStoreTrade142Before;
 say=function(name,lines,done,choices){
  if(name===p.name+' Storekeeper'&&choices)choices=choices.map(o=>({...o,go:()=>{
   if(!granaryKeeperUsable142(n))return toast('The storekeeper is no longer within reach.');
   const recursive=storeTrade36;storeTrade36=q=>q===p?granaryTrade142(n,p):recursive(q);
   try{return o.go();}finally{storeTrade36=recursive;}
  }}));return oldSay(name,lines,done,choices);
 };
 try{return oldTrade(p);}finally{say=oldSay;}
}
function installGranaries142(){
 for(const[id,index]of[['egypt',0],['mesopotamia',1],['troy',2]]){
  const p=POLITIES36.get(id);if(!p||GRANARIES142.has(id))continue;
  const site=granarySite142(p);if(!site)continue;
  const did='granary142_'+id,ox=900000+index*300;if(DUN[did]||Object.values(DUN).some(d=>Math.abs(d.ox-ox)<100))continue;
  const q={...site,id:did,polity:p},b=ibatch(id),col=id==='troy'?K.stoneL:K.mud;
  b.box(q.x-5.7,q.y+2,q.z,.6,4,9.6,col).box(q.x+5.7,q.y+2,q.z,.6,4,9.6,col).box(q.x,q.y+2,q.z-4.5,12,4,.6,col);
  for(const side of[-1,1])b.box(q.x+side*3.75,q.y+2,q.z+4.5,4.5,4,.6,col);
  b.box(q.x,q.y+3.8,q.z+4.5,3, .4,.65,K.woodD);
  if(id==='troy')b.roof(q.x,q.y+4,q.z,12.6,2,10.2,K.terra);else{
   b.box(q.x,q.y+4.1,q.z,12.6,.3,10.2,K.mud);
   if(id==='egypt')for(const sx of[-1,1])for(const sz of[-1,1])b.box(q.x+sx*5.7,q.y+4.5,q.z+sz*4.5,.6,.8,.6,K.mud);
  }
  addRect(q.x,q.z,6,4.8);OCC.push({x:q.x,z:q.z,r:8});
  DUN[did]={name:p.name+' Granary and Common Stores',ox,W:12,H:12,rects:[[1,1,10,10]],objs:[[6,10,'S']],theme:{wall:col,floor:K.stoneD,fog:[0x19150f,10,55],acc:[K.terra,K.woodD]},granary142:id};
  GRANARIES142.set(id,q);
  INTS.push({x:q.x,z:q.z+6.3,r:2.5,vis:()=>AREA==='over',label:()=> 'Enter '+p.name+' granary',act:()=>{
   if(P.dead||P.mode!=='foot'||AREA!=='over'||hyp(P.x-q.x,P.z-(q.z+6.3))>3||Math.abs(P.y-groundY(P.x,P.z))>.8)return toast('Reach the granary doorway on foot.');
   closeDlg();return enterDungeon(did,{x:q.x,z:q.z+6.3,yaw:Math.PI});
  }});
 }INT_GRID16.count=-1;
}
const granaryPopulate142Before=populate;populate=async function(){await granaryPopulate142Before();installGranaries142();};
const granaryPolityTalk142Before=polityTalk36;polityTalk36=function(n){
 const q=GRANARIES142.get(n.polity36);if(!q)return granaryPolityTalk142Before(n);
 const old=say;say=function(name,lines,done,choices){
  if(name===q.polity.name&&!done&&choices)choices=choices.concat([{t:'Where is the granary?',go:()=>{
   if(GRANARIES142.get(n.polity36)!==q)return toast('The granary is unavailable.');
   return npcMapHints13(n,{x:q.x,z:q.z+6.3,area:'over'},q.polity.name+' granary');
  }}]);return old(name,lines,done,choices);
 };try{return granaryPolityTalk142Before(n);}finally{say=old;}
};
const granaryBuild142Before=buildDungeon;buildDungeon=function(id){
 const r=granaryBuild142Before(id),dg=DGS[id],region=dg?.def.granary142,q=GRANARIES142.get(region);if(!q||!dg||dg.granary142)return r;dg.granary142=true;
 const b=new Batch();for(const side of[2.5,9.5])for(const row of[2.5,4.5,6.5]){
  const x=dg.ox+side*TS,z=dg.oz+row*TS;
  if(region==='troy')vessel(b,x,0,z,.7,1.65,K.terra);else b.box(x,.6,z,1.8,1.2,1.8,K.mud).box(x,1.22,z,1.9,.08,1.9,K.woodD);
  dg.solids.push({x,z,halfX:1,halfZ:1,solid:true});
 }
 // Separate accounting table and clear centre/exit aisle; containers are not loot.
 const tx=dg.ox+6.5*TS,tz=dg.oz+3*TS;b.box(tx,.7,tz,2.5,.15,1.2,K.wood);
 for(const side of[-1,1])b.box(tx+side,.35,tz,.16,.7,.8,K.woodD);
 b.box(tx,.81,tz,.7,.06,.45,region==='egypt'?K.linen:K.terra);
 dg.solids.push({x:tx,z:tz,halfX:1.25,halfZ:.6,solid:true});dg.group.add(b.mesh(ACTOR_MAT));
 const pos={x:dg.ox+6.5*TS,z:dg.oz+4.5*TS},n=addNPC({name:q.polity.name+' Granary Keeper',...pos,area:id,group:dg.group,noInt:true,role:'trade',culture:holdCulture20(region),look:{tunic:K.linen,kilt:K.ochre},talk:a=>granaryStockTalk142(a,q.polity)});
 n.home=n.work=n.social={...pos};n.y=0;dg.granaryKeeper142=n;
 dg.ints.push({x:pos.x,z:pos.z,r:2.8,label:()=> 'Speak to '+n.name,vis:()=>!n.dead&&n.area===AREA,act:()=>n.talk(n)});
 return r;
};
`;
