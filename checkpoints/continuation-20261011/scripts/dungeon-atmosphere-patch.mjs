export const dungeonAtmospherePatch=String.raw`
/* CONTINUATION_DUNGEON_ATMOSPHERE_V1
   Bounded static batches at chamber edges; no actor throttling or gameplay
   collider/puzzle changes. Terrain/roof samples anchor every natural formation. */
(function(){
 function atmosphereKind108(dg){
  if(!dg?.def||dg.def.palace16||dg.def.home46||dg.def.inn48||/^(home_|tavern_|jail_|palace_)/.test(dg.id))return null;
  return dg.def.mine36?'mine':/cave|grotto|lair|cavern/i.test(dg.id+' '+dg.def.name)?'cave':'dungeon';
 }
 function atmospherePlan108(dg){
  const kind=atmosphereKind108(dg);if(!kind||!dg.grid||!Number.isInteger(dg.W)||!Number.isInteger(dg.H))return[];
  const seed=faceHash(dg.id)>>>0,sites=[],open=(x,z)=>x>=0&&z>=0&&x<dg.W&&z<dg.H&&dg.grid[z*dg.W+x]===0;
  const reserved=(dg.def.objs||[]).map(o=>({x:dg.ox+(o[0]+.5)*TS,z:(dg.oz||0)+(o[1]+.5)*TS}));
  if(dg.spawn)reserved.push({x:dg.spawn[0],z:dg.spawn[1]});if(dg.bossPos)reserved.push(dg.bossPos);
  for(let z=1;z<dg.H-1&&sites.length<12;z++)for(let x=1;x<dg.W-1&&sites.length<12;x++){
   if(!open(x,z)||((x*13+z*7+seed)%5)!==0)continue;
   const wall=[[1,0],[-1,0],[0,1],[0,-1]].find(([dx,dz])=>!open(x+dx,z+dz));if(!wall)continue;
   const [dx,dz]=wall,X=dg.ox+(x+.5)*TS+dx*(TS*.5-.55),Z=(dg.oz||0)+(z+.5)*TS+dz*(TS*.5-.55);
   if(reserved.some(p=>hyp(X-p.x,Z-p.z)<TS*1.25)||sites.some(p=>hyp(X-p.x,Z-p.z)<TS*1.5))continue;
   if((dg.solids||[]).some(p=>hyp(X-p.x,Z-p.z)<Math.max(p.halfX||p.r||.5,p.halfZ||p.r||.5)+1.2))continue;
   if([...(dg.routes||[]),...(dg.earthRoutes41||[])].some(r=>X>r.x0-2&&X<r.x1+2&&Math.abs(Z-r.z)<(r.width||4)/2+1))continue;
   const y=dg.terrain26?floorSample26(dg,X,Z):0,roof=dg.cavern40?.roof?dg.cavern40.roof(X,Z):6.4;
   if(!Number.isFinite(y)||!Number.isFinite(roof)||roof-y<3.3)continue;
   sites.push({x:X,z:Z,y,roof,dx,dz,kind,variant:(x*17+z*11+seed)%4});
  }
  return sites;
 }
 function chainLinks108(b,p){
  const bottom=Math.max(p.y+2.6,p.roof-1.9),count=Math.min(9,Math.floor((p.roof-bottom)/.17));
  b.box(p.x,p.roof-.08,p.z,.2,.16,.2,K.stoneD);
  for(let i=0;i<count;i++)for(let j=0;j<8;j++){
   const a=j*Math.PI/4,A=(j+1)*Math.PI/4,ax=Math.cos(a)*.085,ay=Math.sin(a)*.11,bx=Math.cos(A)*.085,by=Math.sin(A)*.11,cy=p.roof-.22-i*.17;
   if(i%2)b.cyl(p.x,cy+(ay+by)/2,p.z+(ax+bx)/2,.014,.014,hyp(bx-ax,by-ay),5,K.iron||K.bronze,{rx:Math.atan2(bx-ax,by-ay)});
   else b.cyl(p.x+(ax+bx)/2,cy+(ay+by)/2,p.z,.014,.014,hyp(bx-ax,by-ay),5,K.iron||K.bronze,{rz:-Math.atan2(bx-ax,by-ay)});
  }
 }
 function installAtmosphere108(dg){
  if(!dg||dg.atmosphere108)return dg?.atmosphere108;const sites=atmospherePlan108(dg);if(!sites.length)return null;
  const rock=new Batch(),wet=new Batch(),metal=new Batch();let formations=0,puddles=0,chains=0;
  for(const p of sites){
   if(p.kind!=='dungeon'){
    const radius=.21+p.variant*.045,height=.65+p.variant*.19,col=dg.def.theme?.wall||K.stoneD;
    rock.cyl(p.x,p.y+height/2,p.z,.025,radius,height,7,col);formations++;
    rock.cyl(p.x,p.roof-height/2,p.z,radius,.018,height,7,col);formations++;
    const px=p.x-p.dx*.45,pz=p.z-p.dz*.45,py=dg.terrain26?floorSample26(dg,px,pz):0;
    const rim=dg.terrain26?[floorSample26(dg,px-.55,pz),floorSample26(dg,px+.55,pz),floorSample26(dg,px,pz-.55),floorSample26(dg,px,pz+.55)]:[0,0,0,0];
    if(Number.isFinite(py)&&rim.every(v=>Number.isFinite(v)&&Math.abs(v-py)<.06)){
     wet.ball(px,py+.012,pz,.57,hx(0x28454b),null,.007,.40);
     wet.ball(px-.07,py+.020,pz+.07,.30,hx(0x557071),null,.004,.035);puddles++;
    }
   }else if(chains<4){chainLinks108(metal,p);chains++;}
  }
  const root=new THREE.Group(),meshes=[];root.userData.atmosphere108=true;
  for(const b of [rock,wet,metal])if(b.p.length){const m=b.mesh();m.userData.atmosphere108=true;root.add(m);meshes.push(m);}
  dg.group.add(root);dg.atmosphere108={root,meshes,sites,formations,puddles,chains,nextCull:0};return dg.atmosphere108;
 }
 const atmosphereBuild108Before=buildDungeon;buildDungeon=function(id){const r=atmosphereBuild108Before(id);installAtmosphere108(DGS[id]);return r;};
 const atmosphereUpdate108Before=dgUpdate;dgUpdate=function(dt){const r=atmosphereUpdate108Before(dt),q=DG?.atmosphere108;if(q&&T_NOW>=q.nextCull){q.nextCull=T_NOW+.25;const range=typeof veryLow28==='function'&&veryLow28()?28:typeof GRAPHICS28!=='undefined'&&GRAPHICS28.preset==='low'?42:68;q.root.visible=q.sites.some(p=>(p.x-P.x)**2+(p.z-P.z)**2<range*range);}return r;};
 for(const dg of Object.values(DGS))installAtmosphere108(dg);
 Object.assign(globalThis,{atmosphereKind108,atmospherePlan108,installAtmosphere108});
})();`;
