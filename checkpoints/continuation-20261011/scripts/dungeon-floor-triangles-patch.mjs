export const dungeonFloorTrianglesPatch=String.raw`
/* DUNGEON_FLOOR_TRIANGLES_257: native Batch.quad uses A-B-C / A-C-D.
   Match its planar triangles instead of the different bilinear surface.
   No field/mesh, player position, route, reward or checkpoint mutation. */
(function(){
 const before=floorSample26;floorSample26=function(dg,x,z){const f=dg?.terrain26;
  if(!f||!Number.isFinite(x)||!Number.isFinite(z)||!Number.isFinite(f.step)||f.step<=0||f.nx<2||f.nz<2)return before.apply(this,arguments);
  const gx=Math.max(0,Math.min(f.nx-1,(x-dg.ox)/f.step)),gz=Math.max(0,Math.min(f.nz-1,(z-dg.oz)/f.step)),ix=Math.min(f.nx-2,Math.floor(gx)),iz=Math.min(f.nz-2,Math.floor(gz)),tx=gx-ix,tz=gz-iz,a=f.h[iz*f.nx+ix],b=f.h[(iz+1)*f.nx+ix],c=f.h[(iz+1)*f.nx+ix+1],d=f.h[iz*f.nx+ix+1];
  return tz>=tx?a+(c-b)*tx+(b-a)*tz:a+(d-a)*tx+(c-d)*tz;
 };
})();
`;
