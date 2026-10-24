export const riverCityPlacementFunctions=String.raw`
 /* RIVER_CITY_PLOTS_268: complete palace/approach plots, bounded by actual walls. */
 function riverBounds268(c){return c.id==='ur'?{rx:120,rz:108}:c.id==='dur'?{rx:150,rz:145}:{rx:126,rz:116};}
 function riverPlotClear268(c,x,z){
  const wall=riverBounds268(c),x0=x-20.5,x1=x+20.5,z0=z-15.5,z1=z+22.5;
  if(!Number.isFinite(x)||!Number.isFinite(z)||x0<c.x-wall.rx+6||x1>c.x+wall.rx-6||z0<c.z-wall.rz+6||z1>c.z+wall.rz-6||Math.abs(x-c.x)<32)return false;
  // The monument body and its whole southern approach stay reserved too.
  if(x1>c.zigX-37&&x0<c.zigX+37&&z1>c.zigZ-30&&z0<c.startZ+8)return false;
  if(typeof OCC!=='undefined')for(const o of OCC){if(o===c.palacePlot268?.reservation)continue;const dx=Math.max(x0-o.x,0,o.x-x1),dz=Math.max(z0-o.z,0,o.z-z1);if(dx*dx+dz*dz<(o.r+2)*(o.r+2))return false;}
  // Inspect exact collider footprints, not only one center/radius sample.
  const seen=new Set(),colliders=[];
  if(typeof CSZ==='number'&&typeof ckey==='function'){for(let a=Math.floor(x0/CSZ);a<=Math.floor(x1/CSZ);a++)for(let b=Math.floor(z0/CSZ);b<=Math.floor(z1/CSZ);b++)for(const o of CG.get(ckey(a,b))||[])if(!seen.has(o)){seen.add(o);colliders.push(o);}}
  else for(const list of CG.values())for(const o of list)if(!seen.has(o)){seen.add(o);colliders.push(o);}
  for(const o of colliders){if(o.hw!==undefined){if(x1+1>o.x-o.hw&&x0-1<o.x+o.hw&&z1+1>o.z-o.hd&&z0-1<o.z+o.hd)return false;}
   else{const dx=Math.max(x0-o.x,0,o.x-x1),dz=Math.max(z0-o.z,0,o.z-z1);if(dx*dx+dz*dz<(o.r+1)*(o.r+1))return false;}}
  let low=Infinity,high=-Infinity;const sample=typeof terrainSurface==='function'?terrainSurface:heightAt;
  for(let a=0;a<=8;a++)for(let b=0;b<=8;b++){const y=sample(x0+(x1-x0)*a/8,z0+(z1-z0)*b/8);if(!Number.isFinite(y)||y<2.5)return false;low=Math.min(low,y);high=Math.max(high,y);if(high-low>.45)return false;}
  return true;
 }
 function reserveRiverPalace268(c){if(c.palacePlot268)return c.palacePlot268;
  for(let radius=0;radius<=110;radius+=10){const n=radius?24:1;for(let i=0;i<n;i++){const a=i*Math.PI*2/n,x=c.palaceX+Math.cos(a)*radius,z=c.palaceZ+Math.sin(a)*radius;if(!riverPlotClear268(c,x,z))continue;
   const reservation={x,z,r:32.6,palace268:c.id},p={x,z,reservation};if(typeof OCC!=='undefined')OCC.push(reservation);c.palaceX=x;c.palaceZ=z;c.palacePlot268=p;return p;
  }}c.palacePlacement268='no_valid_plot';return null;
 }
 function reserveRiverZiggurat268(c){if(c.zigguratPlot268||c.existing)return;const low=c.zigZ-30,high=c.startZ+8,z=(low+high)/2,p={x:c.zigX,z,r:Math.hypot(37,(high-low)/2),ziggurat268:c.id};if(typeof OCC!=='undefined')OCC.push(p);c.zigguratPlot268=p;}
 function riverVillage268(c){const original=occFree,wall=riverBounds268(c);
  occFree=function(x,z,pad){const r=Math.max(9,pad||0);return Math.abs(x-c.x)+r<wall.rx-6&&Math.abs(z-c.z)+r<wall.rz-6&&original.apply(this,arguments);};
  try{return village('mesopotamia',c.x,c.z+23,7,60,'egypt');}finally{occFree=original;}
 }
`;
export function repairRiverCityPlacement(source){
 const marker=' function addPalace264(b,c){';
 if(source.split(marker).length!==2)throw Error('Palace helper anchor changed');
 source=source.replace(marker,riverCityPlacementFunctions+'\n'+marker);
 const edits=[
  ["function installCities264(){if(!IS.mesopotamia)return false;","function installCities264(){if(!IS.mesopotamia||globalThis.__riverCitiesBuilt268)return false;"],
  ["for(const c of spec){addFlat(c.x,c.z,148,26,7);riverCityWalls(b,c.x,c.z,126,116);village('mesopotamia',c.x,c.z+23,7,60,'egypt');","for(const c of spec){addFlat(c.x,c.z,148,26,7);reserveRiverZiggurat268(c);reserveRiverPalace268(c);riverCityWalls(b,c.x,c.z,126,116);riverVillage268(c);"],
  ["const palaceSite=freeLandNear(c.palaceX,c.palaceZ,14);addPalace264(b,{...c,palaceX:palaceSite.x,palaceZ:palaceSite.z});","if(c.palacePlot268){addPalace264(b,c);c.palaceBuilt268=true;}"],
  ["for(const c of cities264.filter(c=>c.existing)){addPalace264(b,c);","for(const c of cities264.filter(c=>c.existing)){if(reserveRiverPalace268(c)){addPalace264(b,c);c.palaceBuilt268=true;}"],
  ["else{const z=ZIGGURAT140;addNPC({name:'Kurigalzu Palace Steward'","else{const z=ZIGGURAT140;if(c.palaceBuilt268)addNPC({name:'Kurigalzu Palace Steward'"],
  ["DISCOVER('Ur Ziggurat',3805,1137,38,20);DISCOVER('Dur-Kurigalzu Ziggurat',3800,335,38,20);INT_GRID16.count=-1;","DISCOVER('Ur Ziggurat',3805,1137,38,20);DISCOVER('Dur-Kurigalzu Ziggurat',3800,335,38,20);INT_GRID16.count=-1;globalThis.__riverCitiesBuilt268=true;"],
  ["Object.assign(globalThis,{cities264,newZigg264,stairHeight264,installCities264,installAllMesopotamia264});","Object.assign(globalThis,{cities264,newZigg264,stairHeight264,installCities264,installAllMesopotamia264,riverBounds268,riverPlotClear268,reserveRiverPalace268,reserveRiverZiggurat268,riverVillage268});"]
 ];
 for(const[a,b]of edits){if(source.split(a).length!==2)throw Error('River-city placement anchor changed: '+a);source=source.replace(a,b);}return source;
}
