export const regionalStableCoverageRuntime=`
/* Major-settlement stable coverage: reuse existing services and ground only missing yards. */
const REGIONAL_STABLE_COVERAGE81=[];
function stableCoverageHubs81(){const palace=k=>PALACES16.find(o=>o.key===k),steppe=NPCS.find(n=>n.steppeMaster75);return[
 {id:'ikaria',name:'Ikaria village',region:'ikaria',at:LOC.stable||LOC.ikaVillage||LOC.start,r:95},
 {id:'naxos',name:'Naxos town',region:'naxos',at:IS.naxos&&{x:IS.naxos.cx,z:IS.naxos.cz},r:105},
 {id:'krete',name:'Knossos',region:'krete',at:palace('minos')||IS.krete&&{x:IS.krete.cx,z:IS.krete.cz},r:120},
 {id:'troy',name:'Troy',region:'troy',at:palace('priam')||IS.troy&&{x:IS.troy.cx,z:IS.troy.cz},r:120},
 {id:'mycenae',name:'Mycenae',region:'mycenae',at:palace('agamemnon')||IS.mycenae&&{x:IS.mycenae.cx,z:IS.mycenae.cz},r:120},
 {id:'ithaca',name:'Ithaca',region:'ithaca',at:palace('odysseus')||IS.ithaca&&{x:IS.ithaca.cx,z:IS.ithaca.cz},r:120},
 {id:'sparta',name:'Sparta',region:'sparta',at:palace('menelaus')||IS.sparta&&{x:IS.sparta.cx,z:IS.sparta.cz},r:120},
 {id:'athens',name:'Athens',region:'athens',at:palace('theseus')||IS.athens&&{x:IS.athens.cx,z:IS.athens.cz},r:120},
 {id:'pharos',name:'Pharos harbour',region:'pharos',at:IS.pharos&&{x:IS.pharos.cx,z:IS.pharos.cz},r:105},
 {id:'philistia',name:'Philistia hold',region:'philistia',at:palace('philistia')||IS.philistia&&{x:IS.philistia.cx,z:IS.philistia.cz},r:120},
 {id:'tyre',name:'Tyre',region:'tyre',at:LOC.kadmos||IS.tyre&&{x:IS.tyre.cx,z:IS.tyre.cz},r:105},
 {id:'phoenicia',name:'Phoenician inland market',region:'phoenicia',at:IS.phoenicia&&{x:IS.phoenicia.cx,z:IS.phoenicia.cz},r:105},
 {id:'alashiya',name:'Alashiya copper port',region:'alashiya',at:IS.alashiya&&{x:IS.alashiya.cx,z:IS.alashiya.cz},r:105},
 {id:'ur',name:'Ur',region:'mesopotamia',at:LOC.ur,r:105},
 {id:'avaris',name:'Avaris',region:'egypt',at:LOC.avaris,r:105},
 {id:'memphis',name:'Memphis',region:'egypt',at:LOC.memphis44,r:105},
 {id:'steppe',name:'Northern Steppe horse grounds',region:'scythia',at:steppe||IS.scythia&&{x:IS.scythia.cx,z:IS.scythia.cz},r:105}
 ].filter(h=>h.at&&Number.isFinite(h.at.x+h.at.z));}
function keeperNearHub81(h){return STABLE_KEEPERS20.filter(n=>!n.dead&&(n.area||'over')==='over').sort((a,b)=>hyp(a.x-h.at.x,a.z-h.at.z)-hyp(b.x-h.at.x,b.z-h.at.z)).find(n=>hyp(n.x-h.at.x,n.z-h.at.z)<=h.r);}
function stableSite81(h){for(let i=0;i<28;i++){const a=i*2.399963,d=16+floor(i/7)*8,p=landPoint15(h.at.x+sin(a)*d,h.at.z+cos(a)*d,3.6);if(!p||groundY(p.x,p.z)<2||colBlocked(p.x,p.z,3.5)||nearestIsle(p.x,p.z)!==h.region)continue;return p;}return null;}
function addRegionalStable81(h){const p=stableSite81(h);if(!p)return null;const b=ibatch(h.region),y=groundY(p.x,p.z);b.box(p.x,y+2.65,p.z,6.4,.16,4.4,K.thatch);for(const sx of[-2.7,2.7])for(const sz of[-1.7,1.7])b.cyl(p.x+sx,y+1.32,p.z+sz,.09,.12,2.64,8,K.woodD);b.box(p.x-1.5,y+.38,p.z-1.35,1.8,.72,.58,K.wood);b.box(p.x+1.55,y+.31,p.z-1.35,1.45,.50,.52,K.stoneD);const at=landPoint15(p.x+4.2,p.z+1.1,1.3)||p,n=addNPC({name:h.name+' Stable Keeper',x:at.x,z:at.z,culture:h.region==='mesopotamia'?'mesopotamia':h.region==='egypt'?'egypt':h.region==='scythia'?'scythian':h.region==='tyre'?'phoenicia':'aegean',role:'trade',look:{tunic:K.ochre,kilt:K.cream},talk:n=>stableBuy20(n,p)});n.stableKeeper20=true;n.stableHub81=h.id;n.home={...at};n.work={x:p.x,z:p.z};n.social={...at};STABLE_KEEPERS20.push(n);INTS.push({...at,r:3,label:()=>h.name+' stable · owned mounts and registration',act:()=>stableBuy20(n,p)});DISCOVER(h.name+' Stable',p.x,p.z,24,10);return n;}
function regionalStableCoverage81(){if(REGIONAL_STABLE_COVERAGE81.length)return REGIONAL_STABLE_COVERAGE81;for(const h of stableCoverageHubs81()){const existing=keeperNearHub81(h),keeper=existing||addRegionalStable81(h);REGIONAL_STABLE_COVERAGE81.push({id:h.id,name:h.name,region:h.region,status:keeper?(existing?'existing':'added'):'blocked',keeper:keeper?.name||null,x:keeper?.x??null,z:keeper?.z??null});}INT_GRID16.count=-1;return REGIONAL_STABLE_COVERAGE81;}
const regionalStablePopulate81Before=populate;populate=async function(){await regionalStablePopulate81Before();regionalStableCoverage81();};
`;

export function applyRegionalStableCoverageCheckpoint(html){const marker='window.WDS_READY33=true;';if(html.includes('function regionalStableCoverage81(')||html.split(marker).length!==2)throw new Error('Unexpected regional stable coverage source');return html.replace(marker,regionalStableCoverageRuntime+'\n'+marker);}
