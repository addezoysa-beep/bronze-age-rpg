export const siteProvisionsPatch=String.raw`
/* SITE_PROVISIONS_211: finite mundane stores in existing faction sites.
   No quest flags, extra defenders, XP, loot respawn or automatic Save added. */
(function(){
 const supplies211={bread:2,stone:8,arrow_wood:6};
 function eligibleSite211(dg){return !!(dg?.def?.faction56&&/^(site56_|hideout56_)/.test(dg.id)&&dg.spawn&&dg.grid&&dg.group);}
 function siteSupplyPoint211(dg){if(!eligibleSite211(dg))return null;const sx=Math.floor((dg.spawn[0]-dg.ox)/TS),sz=Math.floor((dg.spawn[1]-(dg.oz||0))/TS),open=(x,z)=>x>=0&&z>=0&&x<dg.W&&z<dg.H&&dg.grid[z*dg.W+x]===0,queue=[[sx,sz,0]],seen=new Set();
  for(let i=0;i<queue.length&&i<64;i++){const[x,z,d]=queue[i],key=x+','+z;if(seen.has(key)||!open(x,z))continue;seen.add(key);const X=dg.ox+(x+.5)*TS,Z=(dg.oz||0)+(z+.5)*TS;
   // Stay in the entry's connected open cells, never behind an unopened door.
   const reserved=(dg.def.objs||[]).some(o=>o[0]===x&&o[1]===z)||(dg.ints||[]).some(p=>typeof p.x==='number'&&typeof p.z==='number'&&hyp(X-p.x,Z-p.z)<2)||(dg.solids||[]).some(p=>Math.abs(X-p.x)<(p.halfX||p.r||.5)+1.1&&Math.abs(Z-p.z)<(p.halfZ||p.r||.5)+1.1)||(dg.doors||[]).some(p=>hyp(X-p.x,Z-p.z)<TS);
   if(reserved)continue;const y=dg.terrain26?floorSample26(dg,X,Z):0,rim=dg.terrain26?[[.65,.45],[-.65,.45],[.65,-.45],[-.65,-.45]].map(([a,b])=>floorSample26(dg,X+a,Z+b)):[0];
   if(d>=1&&!reserved&&Number.isFinite(y)&&rim.every(v=>Number.isFinite(v)&&Math.abs(v-y)<.12))return{x:X,z:Z,y};
   if(d<3)for(const[a,b]of[[1,0],[0,1],[-1,0],[0,-1]]){const nx=x+a,nz=z+b,NX=dg.ox+(nx+.5)*TS,NZ=(dg.oz||0)+(nz+.5)*TS;if((dg.doors||[]).some(p=>hyp(NX-p.x,NZ-p.z)<TS))continue;queue.push([nx,nz,d+1]);}
  }return null;
 }
 function supplyState211(dg){const w=livingState();w.siteSupplies211||={};return w.siteSupplies211[dg.id]||=( {items:{...supplies211}} );}
 function nearSupply211(dg,p){return DGS[dg.id]===dg&&DG===dg&&AREA===dg.id&&['play','loot'].includes(STATE)&&!P.dead&&P.mode==='foot'&&Number.isFinite(P.x)&&Number.isFinite(P.z)&&hyp(P.x-p.x,P.z-p.z)<=3.1;}
 function openSiteSupplies211(dg){const p=dg?.siteSupplies211;if(!p||!nearSupply211(dg,p))return false;const game=G,q=supplyState211(dg),items=q.items;if(!items||typeof items!=='object'||!Object.values(items).some(n=>Number.isSafeInteger(n)&&n>0))return toast('The provision chest is empty.'),false;
  const take=function(k,n){if(G!==game||!nearSupply211(dg,p)||STATE!=='loot'||LOOT_CONTEXT?.take!==take||LOOT_CONTEXT.items!==items||livingState().siteSupplies211?.[dg.id]!==q||q.items!==items||!Object.hasOwn(supplies211,k)||!Number.isSafeInteger(n)||n<1||!Number.isSafeInteger(items[k])||items[k]<n)return false;lootEquipment({[k]:n});return true;};
  p.chest.lid.rotation.x=-1.3;showLoot('Bread and ammunition',items,take);return true;
 }
 function installSiteSupplies211(dg){if(!eligibleSite211(dg)||dg.siteSupplies211)return false;const p=siteSupplyPoint211(dg);if(!p)return false;const chest=makeChestMesh(K.woodD);chest.g.position.set(p.x,p.y,p.z);dg.group.add(chest.g);dg.siteSupplies211={...p,chest};dg.ints.push({x:p.x,z:p.z,r:2.6,label:()=> 'Search the provision chest',act:()=>openSiteSupplies211(dg)});return true;}
 const build211Before=buildDungeon;buildDungeon=function(id){const r=build211Before.apply(this,arguments);installSiteSupplies211(DGS[id]);return r;};for(const dg of Object.values(DGS))installSiteSupplies211(dg);
 Object.assign(globalThis,{siteSupplyPoint211,supplyState211,openSiteSupplies211,installSiteSupplies211});
})();`;
