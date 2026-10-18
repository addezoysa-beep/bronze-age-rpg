export const serviceSaveIdentityPatch=String.raw`
/* SERVICE_SAVE_IDENTITY_222 / LEGACY_IDENTITY_BOUNDARY_223:
   Fresh voyages use distinct native Luxor/Valley keys. Unmarked or mixed legacy
   state retains its original ambiguous keys: never fan out cargo/orders. */
(function(){
 const regions222=['luxor58','valley58'];
 let freshBoundary222=null;
 function descriptors222(){const result=[];for(const key of regions222){const s=SERVICES48.get(key);if(!s||s.id!=='egypt'||s.city58!==key)continue;
  const place=s.name||EGYPT58.cities.find(c=>c.id===key)?.name;if(typeof place!=='string'||!place)continue;
  for(const n of s.cast||[]){if(!NPCS.includes(n)||!['cloth','heal','arms'].includes(n.service48))continue;
   let q=n.serviceIdentity222;if(!q){const prefix={cloth:'Tia the Cloth Seller',heal:'Hori the Healer',arms:'Paser the Arms Seller'}[n.service48],legacy=prefix+' · '+IS.egypt.name;
    if(n.name!==legacy)continue;q={legacy,stable:prefix+' · '+place,legacyRegion:n.serviceRegion48,region:key};n.serviceIdentity222=q;
   }if(n.name===q.legacy||n.name===q.stable)result.push({n,q});
  }}return result;}
 function hasLegacy222(entries){const saved=G.checkpoint21?.npcs;if(!Array.isArray(saved))return false;
  // The primary Egypt cast legitimately keeps these old names even in fresh
  // voyages. Only the actual Luxor/Valley ordinal can signal a mixed snapshot.
  return entries.some(({n,q})=>saved[NPCS.indexOf(n)]?.name===q.legacy);
 }
 function bindServiceSaveIdentity222(){if(freshBoundary222&&G!==freshBoundary222.game){G.world||={};G.world.serviceKeys222={version:1};}
  const entries=descriptors222(),fresh=G.world?.serviceKeys222?.version===1&&!hasLegacy222(entries);
  for(const{n,q}of entries){const old=n.name,name=fresh?q.stable:q.legacy;n.name=name;n.serviceRegion48=fresh?q.region:q.legacyRegion;
   if(old!==name)for(const d of DISC)if(d.id===old&&Number.isFinite(d.x+d.z)&&hyp(d.x-(n.work?.x??n.x),d.z-(n.work?.z??n.z))<.1)d.id=name;
  }return fresh;
 }
 const create222Before=createServices48;createServices48=function(){const r=create222Before.apply(this,arguments);bindServiceSaveIdentity222();return r;};
 const restore222Before=restoreLivingWorld;restoreLivingWorld=function(){bindServiceSaveIdentity222();return restore222Before.apply(this,arguments);};
 const continue222Before=continueGame;continueGame=function(){bindServiceSaveIdentity222();return continue222Before.apply(this,arguments);};
 const snapshot222Before=snapshot;snapshot=function(){bindServiceSaveIdentity222();return snapshot222Before.apply(this,arguments);};
 const new222Before=newGame;newGame=function(){const old=freshBoundary222;freshBoundary222={game:G};try{const r=new222Before.apply(this,arguments);bindServiceSaveIdentity222();return r;}finally{freshBoundary222=old;}};
 const populate222Before=populate;populate=async function(){await populate222Before.apply(this,arguments);bindServiceSaveIdentity222();};
 Object.assign(globalThis,{bindServiceSaveIdentity222});
})();`;
