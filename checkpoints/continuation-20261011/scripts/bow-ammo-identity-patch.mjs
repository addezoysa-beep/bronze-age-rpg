export const bowAmmoIdentityPatch=String.raw`
/* CONTINUATION_BOW_AMMO_IDENTITY_V1
   Projectile and recovered-arrow meshes already follow ammo identity. Apply the
   same geometry to the nocked arrow in actor and view bows, including NPC stock. */
(function(){
 /* NPC_ARROW_EMISSION_161: carry the real finite-fort firing material through release/recovery. */
 let firing104=null;
 function bowOwner104(h){if(h===PH)return null;const old=h._bowOwner104;if(old&&(old.hum===h||old.q?.h===h||old.h===h))return old;const owner=ENEMIES.find(e=>e.hum===h||e.q?.h===h)||NPCS.find(n=>n.h===h)||null;if(owner)h._bowOwner104=owner;return owner;}
 function npcArrowMaterial104(owner){const stock=owner?.inventory||{};for(const key in stock)if(Object.prototype.hasOwnProperty.call(stock,key)&&key.startsWith('arrow_')&&Number.isFinite(stock[key])&&stock[key]>0&&(typeof MATERIAL30==='undefined'||MATERIAL30[key.slice(6)]))return key.slice(6);return 'bronze';}
 function bowAmmoMaterial104(h){
  if(h===PH)return G.arrowMaterial30||'wood';if(firing104?.h===h)return firing104.material;return npcArrowMaterial104(bowOwner104(h));
 }
 function applyBowAmmo104(g,material){const arrow=g?.userData?.bowRig?.arrow;if(!arrow)return false;material=material||'wood';if(arrow.userData.arrowMaterial104!==material){arrow.geometry=arrowGeometry30(material);arrow.userData.arrowMaterial104=material;}g.userData.arrowMaterial104=material;return true;}
 const actorBow104Before=actorBow27;actorBow27=function(h){const b=actorBow104Before(h);applyBowAmmo104(b,bowAmmoMaterial104(h));return b;};
 const drawBow104Before=poseDrawBow;poseDrawBow=function(g,charge,loaded=true){drawBow104Before(g,charge,loaded);const player=g===VIEW?.bow||g===PH?.bow27;applyBowAmmo104(g,player?(G.arrowMaterial30||'wood'):(g?.userData?.arrowMaterial104||'wood'));};
 // Capture before the fort wrapper consumes its last arrow. Keep the original
 // finite stock/range/LOS rules; no second deduction or fallback ammunition.
 if(typeof enemyAttack==='function'){const attack104Before=enemyAttack;enemyAttack=function(e){const before=firing104;firing104=e?.d?.w==='bow'?{h:e.hum||e.q?.h,material:npcArrowMaterial104(e)}:null;try{return attack104Before(e);}finally{firing104=before;}};}
 if(typeof companionCombat==='function'){const companion104Before=companionCombat;companionCombat=function(n,...args){const before=firing104;firing104=n?.weapon==='bow'?{h:n.h,material:npcArrowMaterial104(n)}:null;try{return companion104Before(n,...args);}finally{firing104=before;}};}
 if(typeof spawnProj==='function'){const projectile104Before=spawnProj;spawnProj=function(kind,x,y,z,dx,dy,dz,speed,dmg,from,life){const previous=PROJ.at(-1),result=projectile104Before(kind,x,y,z,dx,dy,dz,speed,dmg,from,life),p=PROJ.at(-1);if(kind==='arrow'&&from!=='p'&&firing104&&p&&p!==previous){p.arrowMaterial30=firing104.material;p.m.geometry=arrowGeometry30(p.arrowMaterial30);}return result;};}
 Object.assign(globalThis,{bowOwner104,bowAmmoMaterial104,applyBowAmmo104});
})();`;

