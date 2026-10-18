export function applyGroundContactCheckpoint(html){
 const before="function keepPoseAboveFloor(h,area){h.g.updateWorldMatrix(true,false);let lift=0;h.g.traverse(m=>{if(!m.isMesh||!m.visible||m.userData.noflash||Object.values(h.W).includes(m))return;";
 const after="function keepPoseAboveFloor(h,area){h.g.updateWorldMatrix(true,true);let lift=0;const weapons=Object.values(h.W||{});h.g.traverse(m=>{if(!m.isMesh)return;for(let p=m;p&&p!==h.g;p=p.parent)if(p.visible===false||p.userData.noflash||weapons.includes(p))return;";
 if(html.split(before).length!==2)throw Error('Ground contact helper anchor changed');
 return html.replace(before,after);
}
