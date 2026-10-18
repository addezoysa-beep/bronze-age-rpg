export const arrowSilhouettePricePatch=String.raw`
/* CONTINUATION_ARROW_SILHOUETTE_PRICE_V1
   One shared material-aware mesh now serves previews, nocked arrows,
   projectiles and recoveries. Wood ends in its own sharpened shaft; only
   tipped ammunition receives a distinct stone or metal head. */
(function(){
 const ARROW_PRICE105={wood:6,flint:18,copper:32,bronze:52,iron:90};
 const arrowProfile105=mat=>({material:mat||'wood',wooden:(mat||'wood')==='wood',damage:MATERIAL30[mat||'wood']||1,price:ARROW_PRICE105[mat||'wood']||0});
 ARROW_GEOMETRY30.clear();
 arrowGeometry30=function(mat){
  mat=MATERIAL30[mat]?mat:'wood';if(ARROW_GEOMETRY30.has(mat))return ARROW_GEOMETRY30.get(mat);
  const b=new Batch(),wood=mat==='wood',tip=METAL_COLORS[mat]||K.stoneD;
  b.cyl(0,0,.035,.009,.009,.93,8,K.wood,{rx:PI/2});
  b.cyl(0,0,.55,0,.009,.10,8,wood?K.wood:tip,{rx:PI/2});
  if(!wood)b.cyl(0,0,.49,.009,.029,.055,8,tip,{rx:PI/2});
  for(const s of[-1,1])b.dquad([0,0,-.38],[s*.037,0,-.31],[s*.037,0,-.20],[0,0,-.23],K.cream);
  const geom=b.mesh(ACTOR_MAT).geometry;geom.userData={...(geom.userData||{}),arrowMaterial105:mat,woodenPoint105:wood,separateTip105:!wood};ARROW_GEOMETRY30.set(mat,geom);return geom;
 };
 Object.assign(arrowPrices48,ARROW_PRICE105);
 for(const[mat,price]of Object.entries(ARROW_PRICE105)){const item=ITEMS['arrows48_'+mat];if(item){item.p=price;item.d=mat==='wood'?'Eight affordable shafts, each ending in its own sharpened wooden point.':'Eight recoverable arrows with a distinct '+mat+' head.';}}
 const itemModel105Before=itemModel55;itemModel55=function(key){
  if(!/^arrow_/.test(key)&&key!=='arrows')return itemModel105Before(key);
  const mat=key==='arrows'?'wood':key.slice(6),g=new THREE.Group();
  for(let i=-1;i<=1;i++){const m=new THREE.Mesh(arrowGeometry30(mat),ACTOR_MAT);m.position.x=i*.055;g.add(m);}
  const root=new THREE.Group();root.add(g);root.scale.setScalar(2.65);root.userData.item55=key;root.userData.arrowMaterial105=mat;return root;
 };
 Object.assign(globalThis,{ARROW_PRICE105,arrowProfile105});
})();`;
