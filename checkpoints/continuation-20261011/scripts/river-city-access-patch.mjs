export const riverCityAccessFunctions=String.raw`
 /* RIVER_PUBLIC_HALLS_269: simplified public rooms, not archaeological reconstructions. */
 function riverPortal269(id,point,y,label){const def=DUN[id],out={x:point.x,z:point.z,yaw:Math.PI};
  const ready=()=>DUN[id]===def&&!!def&&AREA==='over'&&STATE==='play'&&!P.dead&&P.mode==='foot'&&P.grounded!==false&&Number.isFinite(P.x+P.y+P.z)&&Math.hypot(P.x-out.x,P.z-out.z)<=2.8&&Math.abs(P.y-y)<.8;
  return{x:out.x,z:out.z,r:2.8,riverEntry269:id,label:()=>label,vis:ready,act:()=>{if(!ready())return toast('Reach this doorway on foot.');return enterDungeon(id,{...out});}};
 }
 function riverHallOriginFree269(ox,width){for(const d of Object.values(DUN)){if(!Number.isFinite(d?.ox)||!Number.isFinite(d?.W))continue;if(ox+width*TS+20>d.ox&&ox-20<d.ox+d.W*TS)return false;}return true;}
 function installRiverHalls269(){const b=ibatch('mesopotamia');for(const [i,c]of cities264.entries()){
  if(!c.palaceBuilt268||c.hall269)continue;const id='palace_river269_'+c.id,ox=90400+i*160;
  // Stable room coordinates: never overwrite an older room or relocate a saved one.
  if(DUN[id]||DGS[id]||!riverHallOriginFree269(ox,14)){c.hallPlacement269='room_conflict';continue;}
  const out={x:c.palaceX,z:c.palaceZ+17.4},y=heightAt(out.x,out.z);
  if(!Number.isFinite(y)||y<2.5||colBlocked(out.x,out.z,.6)){c.hallPlacement269='blocked_door';continue;}
  DUN[id]={name:c.name+' Public Palace Hall',ox,W:14,H:11,rects:[[1,1,12,9]],objs:[[7,9,'S'],[2,2,'i']],signs:['Clay tablets and sealed jars stand beside the steward’s table. Visitors wait in this public hall; the private chambers lie beyond.'],theme:{wall:K.mud,floor:K.stoneL,fog:[0x17120d,12,65],acc:[K.blue,K.ochre]},riverHall269:c.id};
  c.hall269=id;c.hallDoor269={...out,y};LOC[id]={...out};
  // A clearly visible front portal, outside the native compound collider.
  b.box(out.x,y+1.7,c.palaceZ+14.58,4,3.4,.10,K.dark).box(out.x-2.2,y+1.8,c.palaceZ+14.7,.35,3.6,.35,K.plaster).box(out.x+2.2,y+1.8,c.palaceZ+14.7,.35,3.6,.35,K.plaster).box(out.x,y+3.7,c.palaceZ+14.7,4.8,.35,.4,K.blue).box(out.x,y+.035,c.palaceZ+16.8,5,.07,4.2,K.stoneL);
  for(const side of[-1,1])b.box(out.x+side*10.35,y+1.7,c.palaceZ+14.5,16.3,3.4,.3,K.mudD);
  INTS.push(riverPortal269(id,out,y,'Enter the '+c.name+' public palace hall'));
 }}
 function decorateRiverHall269(id,dg){const city=cities264.find(c=>c.hall269===id);if(!city||dg.def!==DUN[id]||!dg.def.riverHall269||dg.riverHall269)return dg;dg.riverHall269=true;
  const b=new Batch(),x=dg.ox,z=dg.oz||0;
  for(const col of[3,10])for(const row of[3,6]){const X=x+(col+.5)*TS,Z=z+(row+.5)*TS;b.cyl(X,2.2,Z,.43,.57,4.4,10,K.stoneL).box(X,4.55,Z,1.3,.3,1.3,K.blue);dg.solids.push({x:X,z:Z,halfX:.6,halfZ:.6,solid:true,riverHall269:true});}
  const table={x:x+7.5*TS,z:z+3.5*TS};b.box(table.x,.75,table.z,4,1.5,1.8,K.woodD);
  for(let j=0;j<4;j++){const X=table.x-1.25+j*.75;b.box(X,1.54,table.z,.5,.08,.65,K.mud);for(let k=0;k<3;k++)b.box(X-.14+k*.13,1.59,table.z,.045,.025,.36,K.ochre);}
  for(const side of[-1,1])b.cyl(table.x+side*3,.7,table.z-.4,.5,.35,1.4,12,K.terra).cyl(table.x+side*3,1.5,table.z-.4,.24,.4,.2,12,K.mudD);
  dg.solids.push({x:table.x,z:table.z,halfX:2,halfZ:.9,solid:true,riverHall269:true});for(const side of[-1,1])dg.solids.push({x:table.x+side*3,z:table.z-.4,halfX:.5,halfZ:.5,solid:true,riverHall269:true});dg.group.add(b.mesh(ACTOR_MAT));
  const roles=[{title:'Palace Steward',col:6,row:4.5,line:'You are in the public audience hall of '+city.name+'. Our scribes receive petitions here. The same doorway returns you to the city streets.'},{title:'Record Keeper',col:9,row:4.5,line:'These clay tablets hold the accounts of jars and grain. The blue-fronted doorway outside leads here; the high stair belongs to the summit sanctuary, not this palace.'}];
  for(const r of roles){const n=addNPC({name:city.name+' '+r.title,x:x+r.col*TS,z:z+r.row*TS,area:id,group:dg.group,noInt:true,role:'priest',culture:'mesopotamia',status:'high',look:{tunic:K.blue,kilt:K.cream,cape:K.ochre,helm:'hood'},talk:q=>say(q.name,[r.line])});n.home=n.work=n.social={x:n.x,z:n.z};n.y=0;
   const ready=()=>DGS[id]===dg&&DG===dg&&AREA===id&&['play','talk'].includes(STATE)&&!P.dead&&P.mode==='foot'&&!n.dead&&!n.hostile&&n.area===id&&Math.hypot(P.x-n.x,P.z-n.z)<=2.8&&Math.abs(P.y)<1;
   dg.ints.push({x:()=>n.x,z:()=>n.z,r:2.8,label:()=>'Speak to '+n.name,vis:ready,act:()=>{if(ready())return n.talk(n);}});
  }return dg;
 }
`;
export function repairRiverCityAccess(source){
 const edits=[
  [' function addPalace264(b,c){',riverCityAccessFunctions+'\n function addPalace264(b,c){'],
  ["const label='Enter the '+c.name+' summit sanctuary';INTS.push({x:q.zigX,z:q.endZ-1,r:2.8,vis:()=>AREA==='over'&&Math.abs(P.y-q.top)<1.1,label:()=>label,act:()=>enterDungeon('zig_'+c.id,{x:q.zigX,z:q.endZ-1,yaw:Math.PI})});","const label='Enter the '+c.name+' summit sanctuary';INTS.push(riverPortal269('zig_'+c.id,{x:q.zigX,z:q.endZ-1},q.top,label));"],
  ["INTS.push({x:c.zigX,z:c.endZ-1,r:2.8,vis:()=>AREA==='over'&&Math.abs(P.y-c.top)<1.1,label:()=> 'Enter Ur’s summit sanctuary',act:()=>enterDungeon('zig_ur',{x:c.zigX,z:c.endZ-1,yaw:Math.PI})});","INTS.push(riverPortal269('zig_ur',{x:c.zigX,z:c.endZ-1},c.top,'Enter Ur’s summit sanctuary'));"],
  ['INT_GRID16.count=-1;globalThis.__riverCitiesBuilt268=true;','installRiverHalls269();INT_GRID16.count=-1;globalThis.__riverCitiesBuilt268=true;'],
  ["name:'Kurigalzu Palace Steward',x:c.palaceX,z:c.palaceZ,role:","name:'Kurigalzu Palace Steward',x:c.palaceX,z:c.palaceZ+18.2,role:"],
  ["buildDungeon=function(id){const dg=build264Before(id);if(!id.startsWith('zig_')","buildDungeon=function(id){const dg=build264Before(id);decorateRiverHall269(id,dg);if(!id.startsWith('zig_')"],
  ['riverVillage268});','riverVillage268,riverPortal269,riverHallOriginFree269,installRiverHalls269,decorateRiverHall269});']
 ];
 for(const[a,b]of edits){if(source.split(a).length!==2)throw Error('River-city access anchor changed: '+a);source=source.replace(a,b);}return source;
}
