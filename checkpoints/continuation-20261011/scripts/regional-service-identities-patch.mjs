export const regionalServiceIdentitiesPatch=String.raw`
/* REGIONAL_SERVICE_IDENTITIES_180: local display cast, stable legacy save names.
   In particular, never rename an actor used by death/cargo/commission records. */
(function(){
 const SERVICE_CAST180={
  ikaria:['Melitta','Damon','Simos'],ithaca:['Doris','Polymede','Eurytos'],
  naxos:['Chryse','Phaino','Aristion'],krete:['Kydippe','Ione','Pelas'],
  mycenae:['Alkmene','Chloris','Periphas'],sparta:['Leda','Aigle','Oibalos'],
  troy:['Kallianeira','Theano','Dolon'],egypt:['Henut','Satiah','Paser'],
  pharos:['Taket','Merit','Panehsy'],tyre:['Abira','Amat','Azar'],
  phoenicia:['Zimra','Ilati','Yakin'],philistia:['Tamar','Adina','Asher'],
  alashiya:['Koria','Amara','Enkom'],mesopotamia:['Beli','Ninsun','Naram'],
  scythia:['Issa','Arima','Targ'],northmountains:['Myrrine','Manto','Alkanor'],
  athens:['Praxithea','Aglaia','Erethos'],phthia:['Eudora','Klearete','Actor'],
  'egypt:memphis44':['Iset','Nebet','Ptahmose'],
  'egypt:lowerEgypt26':['Tamit','Renpet','Khonsu'],
  'egypt:upperEgypt26':['Senet','Mutemwia','User'],
  'mesopotamia:ur':['Ningal','Shala','Urnu'],
  'mesopotamia:akkad48':['Kubaba','Tashmet','Iddin'],
  luxor58:['Hent','Neferet','Pahem'],valley58:['Baket','Meryt','Kha']
 };
 let context180=null,dialogue180=[];
 function serviceDisplayName180(n){return n?.serviceDisplay180||n?.name||'';}
 function serviceHub180(s){for(const[k,v]of SERVICES48)if(v===s)return k;return s.key||s.city58||s.id;}
 function servicePlace180(s){return s.name||(s.city58&&EGYPT58.cities.find(c=>c.id===s.city58)?.name)||IS[s.id]?.name||s.id;}
 function serviceAliasText180(value,actors=context180){
  if(typeof value!=='string')return value;
  const list=actors||NPCS.filter(n=>n.serviceDisplay180&&(n.area||'over')===AREA&&hyp(n.x-P.x,n.z-P.z)<=8);
  // A contextual actor resolves the legacy Egypt/Luxor/Valley shared names.
  // Unresolved references retain their original label rather than invent a person.
  let text=value;
  for(let i=0;i<list.length;i++){const n=list[i];if(!n.serviceDisplay180||list.some((a,j)=>j<i&&a.name===n.name))continue;text=text.split(n.name).join(n.serviceDisplay180);}
  return text;
 }
 function withServiceNames180(actors,action){const old=context180;context180=actors;try{return action();}finally{context180=old;}}
 function paintServiceDialogue180(){if(STATE!=='talk')return;for(const id of['dname','dtext']){const el=$(id);if(el)el.textContent=serviceAliasText180(el.textContent,dialogue180);}
  const choices=$('dchoices');if(choices)for(const b of choices.children)b.textContent=serviceAliasText180(b.textContent,dialogue180);
 }
 function bindServiceNames180(s){const names=SERVICE_CAST180[serviceHub180(s)];if(!names)return 0;let count=0;
  for(const n of s.cast||[]){const i=['cloth','heal','arms'].indexOf(n.service48);if(i<0)continue;
   const culture=n.culture||holdCulture20(s.id),legacy={egypt:['Tia the Cloth Seller','Hori the Healer','Paser the Arms Seller'],mesopotamia:['Beli the Weaver','Ilu the Healer','Naram the Smith'],scythian:['Issa the Cloth Seller','Arima the Healer','Targ the Bowyer']}[culture]||['Melitta the Cloth Seller','Damon the Healer','Simos the Arms Seller'];
   if(n.name!==legacy[i]+' · '+(s.name||IS[s.id]?.name))continue;
   const role=i===0?'Cloth Seller':i===1?'Healer':culture==='scythian'?'Bowyer':'Arms Seller';
   n.serviceDisplay180=names[i]+' the '+role+' · '+servicePlace180(s);count++;
   if(n.talk!==n.serviceGuard181?.wrapped&&(!n.serviceNameTalk180||n.talk!==n.serviceNameTalk180.wrapped)){const original=n.talk;const wrapped=function(){return withServiceNames180([n],()=>original.apply(this,arguments));};n.serviceNameTalk180={original,wrapped};n.talk=wrapped;}
  }
  // Display labels can differ; IDs and discovered flags remain the original keys.
  for(const d of DISC){const n=(s.cast||[]).find(n=>n.serviceDisplay180&&d.id===n.name&&hyp(d.x-(n.work?.x??n.x),d.z-(n.work?.z??n.z))<.1);if(n)d.name=serviceDisplayName180(n);}
  return count;
 }
 const create180Before=createServices48;createServices48=function(s){const captures=[],old=addNPC;addNPC=function(){const start=INTS.length,n=old.apply(this,arguments);captures.push({n,ints:INTS.slice(start)});return n;};let r;try{r=create180Before.apply(this,arguments);}finally{addNPC=old;}
  bindServiceNames180(s);for(const{n,ints}of captures)if(n.serviceDisplay180){const owner=[n];for(const int of ints)if(typeof int.label==='function'){const label=int.label;int.label=function(){return serviceAliasText180(label.apply(this,arguments),owner);};}}return r;
 };
 const say180Before=say;say=function(name){dialogue180=context180||NPCS.filter(n=>n.serviceDisplay180&&n.name===name&&(n.area||'over')===AREA&&hyp(n.x-P.x,n.z-P.z)<=8).sort((a,b)=>hyp(a.x-P.x,a.z-P.z)-hyp(b.x-P.x,b.z-P.z));const r=say180Before.apply(this,arguments);paintServiceDialogue180();return r;};
 const line180Before=dlgLine;dlgLine=function(){const r=line180Before.apply(this,arguments);paintServiceDialogue180();return r;};
 const toast180Before=toast;toast=function(message){return toast180Before.call(this,serviceAliasText180(message));};
 const serviceTalk180Before=serviceTalk48;serviceTalk48=function(n){return withServiceNames180([n],()=>serviceTalk180Before(n));};
 const directions180Before=serviceDirections48;serviceDirections48=function(n,id){return withServiceNames180(SERVICES48.get(id)?.cast||[],()=>directions180Before(n,id));};
 const hint180Before=npcMapHints13;npcMapHints13=function(n,p,name){const r=hint180Before.apply(this,arguments);if(p?.serviceDisplay180){const q=odyssey13State().chart.rumours[name];if(q)q.name=serviceDisplayName180(p);}return r;};
 const targets180Before=regionalResourceTargets137;regionalResourceTargets137=function(){const r=targets180Before.apply(this,arguments);for(const e of r)if(e.actor?.serviceDisplay180)e.name=serviceDisplayName180(e.actor);return r;};
 const populate180Before=populate;populate=async function(){await populate180Before();for(const s of SERVICES48.values())bindServiceNames180(s);};
 Object.assign(globalThis,{SERVICE_CAST180,serviceDisplayName180,serviceAliasText180,bindServiceNames180});
})();`;
