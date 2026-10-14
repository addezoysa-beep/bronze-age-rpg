export const clothingMenuPatch=String.raw`
/* CLOTHING_MENU_133: physical garments purchased/crafted/looted become wearable. */
function garmentIdentity133(k){
 if(k==='wool_tunic')return 'wool';if(k==='linen_tunic')return 'linen';
 if(k==='dyed_tunic36')return 'wool';
 return Object.values(CULTURE_DRESS13).some(d=>d.id===k)?k:null;
}
function syncGarments133(){
 const owned=G.clothes.owned,physical=G.clothes.physical133||={},available=new Set();
 for(const[k,n]of Object.entries(G.inv||{})){const id=garmentIdentity133(k);if(n>0&&id){owned[id]=1;physical[id]=true;available.add(id);}}
 for(const id of Object.keys(physical))if(!available.has(id)){delete owned[id];delete physical[id];if(G.clothes.worn===id){G.clothes.worn='rags';applyOutfit();}}
 return owned;
}
const garmentWear133Before=equipRecoveredGear;equipRecoveredGear=function(k){
 roleState();syncGarments133();const id=garmentIdentity133(k);
 if(id){if(!(G.inv?.[k]>0))return false;G.clothes.worn=id;
  if(k==='dyed_tunic36')G.clothes.dye='#994238';
  applyOutfit();hudAll();renderBag();save();return true;}
 const r=garmentWear133Before.apply(this,arguments);
 if((LAYERS36[k]||k==='royal_cape48')&&G.inv?.[k]>0){renderBag();save();}
 return r;
};
const garmentBag133Before=renderBag;renderBag=function(){
 roleState();syncGarments133();const r=garmentBag133Before.apply(this,arguments);
 if(BAG_TAB!=='clothing')return r;const root=$('bagbody');if(!root)return r;
 for(const row of root.querySelectorAll('.inventory-item[data-select]')){
  const k=row.dataset.select;if(!(G.inv?.[k]>0)||!(garmentIdentity133(k)||LAYERS36[k]||k==='royal_cape48'))continue;
  if(row.querySelector('[data-wear]'))continue;
  const button=document.createElement('button');button.dataset.wear=k;button.textContent=LAYERS36[k]?'Wear / remove layer':'Wear';
  button.onclick=e=>{e.stopPropagation();equipRecoveredGear(k);};
  (row.querySelector('.item-actions')||row).appendChild(button);
 }
 return r;
};
`;
