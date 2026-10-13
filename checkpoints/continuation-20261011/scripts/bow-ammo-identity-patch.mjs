export const bowAmmoIdentityPatch=String.raw`
/* CONTINUATION_BOW_AMMO_IDENTITY_V1
   Projectile and recovered-arrow meshes already follow ammo identity. Apply the
   same geometry to the nocked arrow in actor and view bows, including NPC stock. */
(function(){
 function bowOwner104(h){if(h===PH)return null;if(h._bowOwner104!==undefined)return h._bowOwner104;return h._bowOwner104=ENEMIES.find(e=>e.hum===h||e.q?.h===h)||NPCS.find(n=>n.h===h)||null;}
 function bowAmmoMaterial104(h){
  if(h===PH)return G.arrowMaterial30||'wood';const owner=bowOwner104(h),stock=owner?.inventory||{};
  const key=Object.keys(stock).find(k=>k.startsWith('arrow_')&&stock[k]>0);return key?key.slice(6):(owner?.arrowMaterial30||'wood');
 }
 function applyBowAmmo104(g,material){const arrow=g?.userData?.bowRig?.arrow;if(!arrow)return false;material=material||'wood';if(arrow.userData.arrowMaterial104!==material){arrow.geometry=arrowGeometry30(material);arrow.userData.arrowMaterial104=material;}g.userData.arrowMaterial104=material;return true;}
 const actorBow104Before=actorBow27;actorBow27=function(h){const b=actorBow104Before(h);applyBowAmmo104(b,bowAmmoMaterial104(h));return b;};
 const drawBow104Before=poseDrawBow;poseDrawBow=function(g,charge,loaded=true){drawBow104Before(g,charge,loaded);const player=g===VIEW?.bow||g===PH?.bow27;applyBowAmmo104(g,player?(G.arrowMaterial30||'wood'):(g?.userData?.arrowMaterial104||'wood'));};
 Object.assign(globalThis,{bowOwner104,bowAmmoMaterial104,applyBowAmmo104});
})();`;
