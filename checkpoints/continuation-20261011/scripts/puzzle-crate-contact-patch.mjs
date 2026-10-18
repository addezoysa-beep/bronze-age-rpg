export const puzzleCrateContactPatch=String.raw`
/* PUZZLE_CRATE_CONTACT_258: native push/collision and X/Z remain unchanged.
   A rigid horizontal crate rests on the highest actual triangle under its
   complete footprint. Height is derived, not another saved authoritative value. */
(function(){
 const cache=new WeakMap();
 function support258(dg,x0,x1,z0,z1){const f=dg.terrain26;if(!f||!Number.isFinite(f.step)||f.step<=0||!f.h)return NaN;
  const ix0=Math.max(0,Math.floor((x0-dg.ox)/f.step)),ix1=Math.min(f.nx-2,Math.floor((x1-dg.ox)/f.step)),iz0=Math.max(0,Math.floor((z0-dg.oz)/f.step)),iz1=Math.min(f.nz-2,Math.floor((z1-dg.oz)/f.step));
  if(ix1<ix0||iz1<iz0||(ix1-ix0+1)*(iz1-iz0+1)>64)return NaN;let high=-Infinity;
  const take=(x,z)=>{const y=floorSample26(dg,x,z);if(Number.isFinite(y))high=Math.max(high,y);};
  // A linear triangle clipped by the footprint has its maximum at a clipped
  // polygon vertex: rectangle corners or intersections with the A-C diagonal.
  for(let iz=iz0;iz<=iz1;iz++)for(let ix=ix0;ix<=ix1;ix++){const X=dg.ox+ix*f.step,Z=dg.oz+iz*f.step,a=Math.max(x0,X),b=Math.min(x1,X+f.step),c=Math.max(z0,Z),d=Math.min(z1,Z+f.step);take(a,c);take(a,d);take(b,c);take(b,d);
   const za=Z+a-X,zb=Z+b-X,xc=X+c-Z,xd=X+d-Z;if(za>=c&&za<=d)take(a,za);if(zb>=c&&zb<=d)take(b,zb);if(xc>=a&&xc<=b)take(xc,c);if(xd>=a&&xd<=b)take(xd,d);
  }return high;
 }
 function syncCrateContact258(dg){if(!dg?.terrain26||DGS[dg.id]!==dg||!Array.isArray(dg.crates))return false;const f=dg.terrain26,version=f.mesh?.geometry?.attributes?.position?.version||0;
  for(const c of dg.crates){const m=c.m,g=m?.geometry;if(!g||!Number.isFinite(c.x)||!Number.isFinite(c.z)||m.rotation.x!==0||m.rotation.y!==0||m.rotation.z!==0||m.scale.x!==1||m.scale.y!==1||m.scale.z!==1)continue;
   let q=cache.get(c);if(!q){q={};cache.set(c,q);}const pv=g.attributes?.position?.version||0;
   if(q.x!==c.x||q.z!==c.z||q.field!==f||q.heights!==f.h||q.version!==version||q.geometry!==g||q.propVersion!==pv||q.sampler!==floorSample26){g.computeBoundingBox();const box=g.boundingBox;if(!box)continue;const y=support258(dg,c.x+box.min.x,c.x+box.max.x,c.z+box.min.z,c.z+box.max.z)-box.min.y;if(!Number.isFinite(y))continue;
    Object.assign(q,{x:c.x,z:c.z,field:f,heights:f.h,version,geometry:g,propVersion:pv,sampler:floorSample26,y});}
   // Native dgUpdate resets Y every frame, so always reapply the cached height.
   m.position.y=q.y;
  }return true;
 }
 const buildBefore=buildDungeon;buildDungeon=function(id){const r=buildBefore.apply(this,arguments);syncCrateContact258(DGS[id]);return r;};
 const enterBefore=enterDungeon;enterDungeon=function(id){const r=enterBefore.apply(this,arguments);if(AREA===id&&DG===DGS[id])syncCrateContact258(DG);return r;};
 const continueBefore=continueGame;continueGame=function(){const r=continueBefore.apply(this,arguments);if(AREA!=='over'&&DG===DGS[AREA])syncCrateContact258(DG);return r;};
 const updateBefore=dgUpdate;dgUpdate=function(){const r=updateBefore.apply(this,arguments);syncCrateContact258(DG);return r;};
 for(const dg of Object.values(DGS))syncCrateContact258(dg);
 Object.assign(globalThis,{crateTerrainSupport258:support258,syncCrateContact258});
})();
`;
