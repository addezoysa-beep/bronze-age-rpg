// Extend the attachment's material policy through the FINAL native build boundary.
// Original materials/userData remain untouched so outdoor actors retain their style.
export const matteLifecycle273=String.raw`
/* DUNGEON_MATTE_LIFECYCLE_273: late props/actors, no new render passes or meshes. */
(function(){
 const before273=buildDungeon;
 buildDungeon=function(id){const result=before273.apply(this,arguments),dg=DGS[id];
  if(dg&&dg.def===DUN[id])matteGroup262(dg.group);return result;
 };
})();
`;
export function repairDungeonMatteLifecycle(source){
 const edits=[
  ['const matteCache262=new WeakMap();','const matteCache262=new WeakMap(),matteClones273=new WeakSet(),matteMeshes273=new WeakSet();'],
  ['if(!m||!m.isMeshStandardMaterial)return m;','if(!m||!m.isMeshStandardMaterial||matteClones273.has(m))return m;'],
  ['matteCache262.set(m,n);return n;','matteCache262.set(m,n);matteClones273.add(n);return n;'],
  ['function matteGroup262(root){root?.traverse?.(o=>{if(!o.isMesh||!o.material)return;o.material=Array.isArray(o.material)?o.material.map(matteMaterial262):matteMaterial262(o.material);});}',String.raw`function matteMesh273(o){if(!o.isMesh||!o.material)return;const before=o.material;let standard=false;
   if(Array.isArray(before)){let after=null;for(let i=0;i<before.length;i++){const m=matteMaterial262(before[i]);if(m!==before[i]){after||=before.slice();after[i]=m;}if(m?.isMeshStandardMaterial)standard=true;}if(after)o.material=after;}
   else{ o.material=matteMaterial262(before);standard=!!o.material?.isMeshStandardMaterial; }
   if(standard)matteMeshes273.add(o);
  }
 function matteGroup262(root){root?.traverse?.(matteMesh273);}
 // Native damage flashes restore userData.mat or MAT. Reapply only to meshes
 // already treated in a dungeon; never rewrite the shared outdoor originals.
 if(typeof flashAll==='function'){const beforeFlash273=flashAll;flashAll=function(root,on){const r=beforeFlash273.apply(this,arguments);if(!on)root?.traverse?.(o=>{if(matteMeshes273.has(o))matteMesh273(o);});return r;};}`]
 ];
 for(const[a,b]of edits){if(source.split(a).length!==2)throw Error('Dungeon matte lifecycle anchor changed: '+a);source=source.replace(a,b);}
 const at=source.lastIndexOf('</script>');if(at<0)throw Error('Missing game script boundary');return source.slice(0,at)+matteLifecycle273+source.slice(at);
}
