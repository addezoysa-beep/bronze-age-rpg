export const rangedConstructionPatch=String.raw`
/* RANGED_CONSTRUCTION_208: old material suffixes remain stable save/loot keys,
   not claims that a bow limb is flint or a sling is a wooden stick. */
(function(){
 const bow208={wood:['Wooden self bow',1,false],flint:['Wooden hunting bow',1,false],copper:['Reinforced wooden bow · copper fittings',1,false],bronze:['Horn-and-wood composite bow',2,true],silver:['Composite bow · silver fittings',2,true],gold:['Composite bow · gold fittings',2,true],iron:['Composite bow · iron fittings',3,true],orichalcum:['Composite bow · orichalcum fittings',3,true],adamantine:['Composite bow · adamantine fittings',3,true]};
 const sling208={wood:'Braided-fiber sling',flint:'Tightly braided sling',leather:'Leather-pouch sling',copper:'Reinforced-pouch sling',bronze:'Fine woven sling',silver:'Decorated woven sling',gold:'Gilded-pouch sling',iron:'Masterwork woven sling',orichalcum:'Orichalcum-adorned sling',adamantine:'Adamantine-adorned sling'};
 function rangedConstruction208(key){const m=/^(bow|sling)_([^_]+)$/.exec(key||'');if(!m)return null;const kind=m[1],material=m[2];if(kind==='bow'){const p=bow208[material];return p?{kind,material,name:p[0],rank:p[1],composite:p[2],key}:null;}return sling208[material]?{kind,material,name:sling208[material],key}:null;}
 const label208Before=itemLabel;itemLabel=function(k){return rangedConstruction208(k)?.name||label208Before.apply(this,arguments);};
 // Native ownership is also the bow's draw-power index. A tracked physical
 // wooden bow must not inherit the last composite's tier, even after looting.
 // Untracked legacy ownership is retained until an actual item is selected.
 let equipping208=false;
 const equip208Before=equipHand;equipHand=function(key,side){const p=rangedConstruction208(key);if(!p||p.kind!=='bow'||side!=='right'||!(playerItems()[key]>0))return equip208Before.apply(this,arguments);const previous=G.own.bow,was=equipping208;G.own.bow=p.rank;equipping208=true;try{const r=equip208Before.apply(this,arguments);if(G.hands?.right!=='bow'||G.handItems?.right!==key)G.own.bow=previous;return r;}catch(e){G.own.bow=previous;throw e;}finally{equipping208=was;}};
 const refresh208Before=refreshWeapon;refreshWeapon=function(){if(!equipping208&&G.hands?.right==='bow'){const key=G.handItems?.right,p=rangedConstruction208(key);if(p?.kind==='bow'&&G.inv[key]>0){G.own.bow=p.rank;G.weaponMaterials||={};G.weaponMaterials.bow=p.material;}}return refresh208Before.apply(this,arguments);};
 Object.assign(globalThis,{rangedConstruction208});
})();`;

export const rangedCraftingPatch=String.raw`
/* RANGED_CRAFTING_209: physical basic tools, separate advanced plan and
   conservative known-plan migration. No new-game inventory or recipe grant. */
(function(){
 const outputs209={bow:'bow_wood',sling:'sling_wood',bow_composite209:'bow_bronze'};
 function addTool209(key){G.inv[key]=(G.inv[key]||0)+1;const p=rangedConstruction208(key);G.own[p.kind]=Math.max(1,G.own[p.kind]||0);}
 RECIPES.bow={n:'Wooden self bow',need:{wood:3,fiber:4},kind:'weapon30',make:()=>addTool209('bow_wood')};
 RECIPES.sling={n:'Braided-fiber sling with leather pouch',need:{fiber:4,leather:1},kind:'weapon30',make:()=>addTool209('sling_wood')};
 RECIPES.bow_composite209={n:'Horn-and-wood composite bow',need:{wood:4,horn:2,fiber:6,hide:2},kind:'weapon30',make:()=>addTool209('bow_bronze')};
 function migrateRanged209(fresh=false){G.world||={};if(G.world.rangedConstruction209===1)return false;
  // The former single bow plan required horn. Retain that paid/learned plan,
  // but do not turn basic-bow lessons in a fresh game into advanced knowledge.
  if(!fresh&&G.knownRecipes30?.bow){G.knownRecipes30.bow_composite209=true;const f=frontier36();f.blueprints||={};f.blueprints.bow_composite209=true;}
  G.world.rangedConstruction209=1;return true;
 }
 let fresh209=false;
 const new209Before=newGame;newGame=function(){fresh209=true;try{const r=new209Before.apply(this,arguments);migrateRanged209(true);return r;}finally{fresh209=false;}};
 const restore209Before=restoreLivingWorld;restoreLivingWorld=function(){const r=restore209Before.apply(this,arguments);migrateRanged209(fresh209);return r;};
 const craft209Before=craft;craft=function(k){const key=outputs209[k];if(!key)return craft209Before.apply(this,arguments);if(!['play','bag'].includes(STATE)||P.dead||P.mode!=='foot'||P.grounded===false||P.melee||P.rollT>0||P.draw>0||P.guard>0)return toast('Set your weapons at rest and stand on foot at a workbench.');if(!Object.entries(RECIPES[k].need).every(([a,n])=>Number.isFinite(G.inv[a])&&G.inv[a]>=n))return toast('You lack the materials.');const kind=key.split('_')[0],before=G.inv[key]||0;if(!Number.isSafeInteger(before)||before<0||before>=Number.MAX_SAFE_INTEGER)return toast('The stored tool count is invalid. No materials were taken.');const own=G.own[kind]||0,material=G.weaponMaterials?.[kind],r=craft209Before.apply(this,arguments);
  if((G.inv[key]||0)>before){G.weaponMaterials||={};if(own>0){G.own[kind]=own;if(material!==undefined)G.weaponMaterials[kind]=material;else delete G.weaponMaterials[kind];}else{const p=rangedConstruction208(key);G.weaponMaterials[kind]=p.material;G.own[kind]=p.rank||1;}refreshWeapon();}return r;
 };
 function advancedBowyer209(n){const s=SERVICES48.get(n?.serviceRegion48);return n?.service48==='arms'&&!!s&&(!!s.key||!!s.city58||GREAT_CITIES71.has(s.id));}
 let lesson209=null;
 function lessonCurrent209(q,button=false){return lesson209===q&&G===q.game&&DLG.lines===q.lines&&DLG.choices===q.choices&&(!button||STATE==='talk')&&serviceReachable181(q.n)&&advancedBowyer209(q.n)&&!recipeKnown30('bow_composite209')&&Number.isFinite(G.silver)&&G.silver>=18;}
 function guardLesson209(){const q=lesson209;if(!q||DLG.lines!==q.lines||DLG.choices!==q.choices)return;for(const b of $('dchoices').children){if(b.rangedLesson209||!String(b.textContent).includes(RECIPES.bow_composite209.n)||typeof b.onclick!=='function')continue;const click=b.onclick;b.rangedLesson209=true;b.onclick=function(e){if(!lessonCurrent209(q,true))return toast('Ask the available bowyer for a current lesson quote.'),false;return click.call(this,e);};}}
 const line209Before=dlgLine;dlgLine=function(){const r=line209Before.apply(this,arguments);guardLesson209();return r;};
 const lesson209Before=lesson48;lesson48=function(n,type){if(type!=='smith')return lesson209Before.apply(this,arguments);if(!advancedBowyer209(n)){const before=recipeKnown30;recipeKnown30=function(k){return k==='bow_composite209'||before.apply(this,arguments);};try{return lesson209Before.apply(this,arguments);}finally{recipeKnown30=before;}}
  const before=say;say=function(name,lines,done,choices){if(!choices?.some(c=>String(c.t).includes(RECIPES.bow_composite209.n)))return before.apply(this,arguments);const q={game:G,n,lines:null,choices:null},list=choices.map(c=>String(c.t).includes(RECIPES.bow_composite209.n)?{...c,go:()=>{if(!lessonCurrent209(q))return false;return c.go();}}:c),r=before(name,lines,done,list);q.lines=DLG.lines;q.choices=DLG.choices;lesson209=q;guardLesson209();return r;};
  try{return lesson209Before.apply(this,arguments);}finally{say=before;}
 };
 Object.assign(globalThis,{migrateRanged209,advancedBowyer209});
})();`;

export const rangedPresentationPatch=String.raw`
/* RANGED_PRESENTATION_210: actual existing bow limbs carry horn laminations;
   previews use the same animated construction, not the held item's old mesh. */
(function(){
 function playerBowKey210(){for(const key of[G.handItems48?.right,G.handItems?.right])if(/^bow_/.test(key||''))return key;return 'bow_'+(G.weaponMaterials?.bow||'wood');}
 function bowKey210(h){if(h===PH)return playerBowKey210();const n=bowOwner104(h),cargo=n&&(n._party||G.world?.followers?.includes(n.name))&&G.logistics?.followers?.[n.name],equipped=cargo?.weapon;if(/^bow_/.test(equipped||'')&&cargo.items?.[equipped]>0)return equipped;const stock=n?.inventory||{},material=n?.weaponMaterial&&'bow_'+n.weaponMaterial;if(material&&stock[material]>0)return material;const k=Object.keys(stock).find(k=>k.startsWith('bow_')&&stock[k]>0);return k||'bow_'+(n?.weaponMaterial||'wood');}
 function applyBowConstruction210(g,key){const rig=g?.userData?.bowRig,p=rangedConstruction208(key)||rangedConstruction208('bow_wood');if(!rig||g.userData.bowConstructionKey210===p.key)return false;
  if(p.composite&&!rig.horn210)rig.horn210=rig.segments.map(({sign,limb})=>{const m=animalPart(b=>anatomyLoft(b,[[0,0,.027,.022,.006],[0,sign*.19,.009,.020,.006],[0,sign*.4,-.037,.014,.005],[0,sign*.58,-.100,.006,.004]],'y',K.bone,12));limb.add(m);return m;});
  for(const m of rig.horn210||[])m.visible=p.composite;g.userData.bowConstructionKey210=p.key;g.userData.bowConstruction210=p.composite?'wood-and-horn':'wood';return true;
 }
 const actor210Before=actorBow27;actorBow27=function(h){const b=actor210Before.apply(this,arguments);applyBowConstruction210(b,bowKey210(h));return b;};
 const draw210Before=poseDrawBow;poseDrawBow=function(g){const r=draw210Before.apply(this,arguments);applyBowConstruction210(g,g===VIEW?.bow||g===PH?.bow27?playerBowKey210():g?.userData?.bowConstructionKey210||'bow_wood');return r;};
 for(const key of ITEM_MODELS55.keys())if(rangedConstruction208(key))ITEM_MODELS55.delete(key);
 const model210Before=itemModel55;itemModel55=function(key){const p=rangedConstruction208(key);if(!p)return model210Before.apply(this,arguments);if(ITEM_MODELS55.has(key))return ITEM_MODELS55.get(key).clone(true);const g=new THREE.Group();
  if(p.kind==='bow'){const b=makeDrawBow();g.add(b);applyBowConstruction210(b,key);poseDrawBow(b,0,false);b.userData.bowRig.arrow.visible=false;delete b.userData.bowRig;}
  else{const r=makeSlingRig85(g);r.pouch.position.set(0,-.24,0);r.stone.visible=false;for(let i=0;i<2;i++){const a=r.lines[i].geometry.attributes.position,s=i?1:-1;a.setXYZ(0,s*.055,.50,0);a.setXYZ(1,s*.04,.12,0);a.setXYZ(2,s*.055,-.24,0);a.needsUpdate=true;}}
  g.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(g),center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());g.position.sub(center);const root=new THREE.Group();root.add(g);root.scale.setScalar(1.8/Math.max(size.x,size.y,size.z,.1));root.userData.item55=key;root.userData.rangedConstruction210=p.kind==='sling'?'fiber-and-leather':p.composite?'wood-and-horn':'wood';ITEM_MODELS55.set(key,root);while(ITEM_MODELS55.size>48)ITEM_MODELS55.delete(ITEM_MODELS55.keys().next().value);return root.clone(true);
 };
 Object.assign(globalThis,{applyBowConstruction210,bowKey210,playerBowKey210});
})();`;
