export const arrowRuntime = `
/* Ammo head identity follows previews, bow nocks, projectiles and recovered arrows. */
function arrowDamageMultiplier63(mat){return mat==='wood'?.55:(MATERIAL30[mat]||1);}
Object.assign(arrowPrices48,{wood:6,flint:32,copper:64,bronze:96,iron:180});
for(const [mat,price]of Object.entries(arrowPrices48)){const item=ITEMS['arrows48_'+mat];if(item){item.p=price;item.d=mat==='wood'?'Sharpened wooden points · low damage':'Tipped arrows · recoverable ammunition';}}
const arrowPreview63Before=itemModel55;itemModel55=function(key){
 if(!/^arrow_/.test(key))return arrowPreview63Before(key);
 const mat=key.slice(6),g=new THREE.Group();for(let i=-1;i<=1;i++){const m=new THREE.Mesh(arrowGeometry30(mat),ACTOR_MAT);m.rotation.x=-Math.PI/2;m.position.set(i*.06,.45,0);g.add(m);}return g;
};
const nockMaterial63Before=poseDrawBow;poseDrawBow=function(g,charge,loaded=true){
 nockMaterial63Before(g,charge,loaded);const q=g?.userData.bowRig;if(!q)return;
 const player=g===VIEW.bow||g===PH.bow27;const mat=player?(G.arrowMaterial30||'wood'):(g.userData.arrowMaterial63||'bronze');
 q.arrow.geometry=arrowGeometry30(mat);q.arrow.userData.arrowMaterial63=mat;
};
let ARROW_ACTOR63=null;
const arrowActorTick63Before=tacticalTick14;tacticalTick14=function(a,...args){
 const previous=ARROW_ACTOR63;ARROW_ACTOR63=a;
 const h=a.hum||(a.h&&typeof a.h==='object'?a.h:null);if(h)h.arrowMaterial63=a.arrowMaterial30||'bronze';
 try{return arrowActorTick63Before(a,...args);}finally{ARROW_ACTOR63=previous;}
};
const arrowActorPose63Before=poseHuman13;poseHuman13=function(h,o={}){const result=arrowActorPose63Before(h,o);if(h!==PH&&h.bow27){h.bow27.userData.arrowMaterial63=h.arrowMaterial63||'bronze';const q=h.bow27.userData.bowRig;if(q){q.arrow.geometry=arrowGeometry30(h.bow27.userData.arrowMaterial63);q.arrow.userData.arrowMaterial63=h.bow27.userData.arrowMaterial63;}}return result;};
const arrowNpcSpawn63Before=spawnProj;spawnProj=function(...args){
 const before=PROJ.length,result=arrowNpcSpawn63Before(...args),p=PROJ.length>before?PROJ.at(-1):null;
 if(p?.kind==='arrow'&&p.from!=='p'){
  const mat=ARROW_ACTOR63?.arrowMaterial30||'bronze';p.arrowMaterial30=mat;p.m.geometry=arrowGeometry30(mat);if(mat==='wood')p.dmg*=.55;
 }
 return result;
};
`;
export function applyArrowsCheckpoint(html){
 const before="const b=new Batch(),c=METAL_COLORS[mat]||K.bronze;b.cyl(0,0,0,.009,.009,.85,8,K.wood,{rx:PI/2});b.cyl(0,0,.48,0,.025,.12,8,c,{rx:PI/2});";
 const after="const b=new Batch(),c=mat==='wood'?K.wood:mat==='flint'?K.stoneD:(METAL_COLORS[mat]||K.bronze);b.cyl(0,0,0,.009,.009,.85,8,K.wood,{rx:PI/2});b.cyl(0,0,mat==='wood'?.46:.48,0,mat==='wood'?.009:.025,mat==='wood'?.10:.12,8,c,{rx:PI/2});";
 const damage='dmg*(mat?MATERIAL30[mat]||1:1)',anchor='/* END BUILD48 MODULES */';
 for(const text of [before,damage,anchor])if(html.split(text).length!==2)throw new Error('Arrow patch requires one active source match');
 return html.replace(before,after).replace(damage,'dmg*(mat?arrowDamageMultiplier63(mat):1)').replace(anchor,arrowRuntime+'\n'+anchor);
}
