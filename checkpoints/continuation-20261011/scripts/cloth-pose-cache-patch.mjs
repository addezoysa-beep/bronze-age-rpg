export const clothPoseCachePatch=String.raw`
/* CLOTH_POSE_CACHE_148: unchanged cloth inputs reuse exact previous vertices/normals. */
const CLOTH_POSE_CACHE148=new WeakMap();
const clothFit148Before=fitPlayerCloth38;fitPlayerCloth38=function(mesh){
 if(!mesh?.geometry||mesh.parent!==PH.spine)return clothFit148Before(mesh);
 PH.spine.updateMatrix();const matrix=PH.spine.matrix.elements;
 const stride=Math.max(Math.abs(Math.sin(PH.legL.rotation.x)),Math.abs(Math.sin(PH.legR.rotation.x)));
 const geometry=mesh.geometry,position=geometry.attributes.position,normal=geometry.attributes.normal,index=geometry.index;
 const old=CLOTH_POSE_CACHE148.get(mesh);let same=!!old&&old.geometry===geometry&&old.position===position&&old.positionVersion===position?.version&&old.normal===normal&&old.normalVersion===normal?.version&&old.index===index&&old.indexVersion===index?.version&&old.stride===stride&&old.data===mesh.userData.cloth38&&old.rows===mesh.userData.cloth38?.rows;
 if(same)for(let i=0;i<16;i++)if(old.matrix[i]!==matrix[i]){same=false;break;}
 if(same)return;
 const result=clothFit148Before(mesh),g=mesh.geometry,p=g.attributes.position,n=g.attributes.normal,j=g.index;
 const state=old||{matrix:new Float64Array(16)};state.matrix.set(PH.spine.matrix.elements);state.geometry=g;state.position=p;state.positionVersion=p?.version;state.normal=n;state.normalVersion=n?.version;state.index=j;state.indexVersion=j?.version;state.stride=stride;state.data=mesh.userData.cloth38;state.rows=state.data?.rows;CLOTH_POSE_CACHE148.set(mesh,state);return result;
};
`;
