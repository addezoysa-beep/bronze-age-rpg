export const terrainPhaseParityPatch=String.raw`
/* TERRAIN_PHASE_PARITY_167: streamed/worker terrain must match asset-placement terrain. */
indexedHeight=function(x,z){let h=rawH(x,z);for(const f of FLAT_INDEX.get(streamKey(floor(x/HEIGHT_CELL),floor(z/HEIGHT_CELL)))||[]){const dd=hyp(x-f.x,z-f.z);if(dd<f.r+f.b)h=lerp(f.h,h,sstep(f.r,f.r+f.b,dd));}h=riverlandsHeight(IS.mesopotamia,x,z,h);const br=bridgeBlend(x,z);return br?lerp(h,br.h,br.w):h;};
// This function is self-contained over the existing worker names/data. Do not
// wrap it in a closure that startStreamWorker cannot serialize.
`;
