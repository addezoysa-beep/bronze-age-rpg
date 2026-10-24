export function burialContactReconciliationPatch(seed){
 const original=seed.split('\n').find(l=>l.startsWith('function addBurialChambers('));
 if(!original||original.split('const ry=wall[0]?PI/2:0,').length!==2||!original.includes('halfX:wall[0]?1.3:.63,halfZ:wall[0]?.63:1.3'))throw Error('Native burial construction changed');
 const fixed=original.replace('function addBurialChambers(', 'addBurialChambers=function(').replace('const ry=wall[0]?PI/2:0,','const ry=wall[0]?0:PI/2,').replace('halfX:wall[0]?1.3:.63,halfZ:wall[0]?.63:1.3','halfX:wall[0]?.63:1.3,halfZ:wall[0]?1.3:.63');
 return '\n/* BURIAL_CONTACT_265: wall-tangent tombs, actual native terrain after floor creation. */\n'+fixed+';\n'+String.raw`
(function(){
 function syncBurialContact265(dg){
  if(!dg?.terrain26||typeof crateTerrainSupport258!=='function')return false;
  for(const t of dg.solids||[]){if(!t.tomb)continue;
   const m=t.visual41?.g||dg.group.children.find(o=>o.isMesh&&Math.abs(o.position.x-t.x)<.01&&Math.abs(o.position.z-t.z)<.01);
   if(!m)continue;const prior=m.position.y;m.position.y=0;m.updateWorldMatrix(true,true);
   const box=new THREE.Box3().setFromObject(m),y=crateTerrainSupport258(dg,box.min.x,box.max.x,box.min.z,box.max.z)-box.min.y;
   m.position.y=Number.isFinite(y)?y:prior;m.updateWorldMatrix(true,true);
  }return true;
 }
 const floorBefore=naturalFloorBuild26;naturalFloorBuild26=function(dg){const r=floorBefore.apply(this,arguments);syncBurialContact265(dg);return r;};
 const burialBefore=addBurialChambers;addBurialChambers=function(dg){const r=burialBefore.apply(this,arguments);syncBurialContact265(dg);return r;};
 const buildBefore=buildDungeon;buildDungeon=function(id){const r=buildBefore.apply(this,arguments);syncBurialContact265(DGS[id]);return r;};
 for(const dg of Object.values(DGS))syncBurialContact265(dg);
 Object.assign(globalThis,{syncBurialContact265});
})();
`;
}
