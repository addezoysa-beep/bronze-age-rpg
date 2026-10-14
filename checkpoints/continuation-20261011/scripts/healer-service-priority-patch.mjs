export const healerServicePriorityPatch=String.raw`
/* HEALER_SERVICE_PRIORITY_132: essential medical trade is not an optional village errand. */
function bindHealers132(actors=NPCS){let count=0;for(const n of actors){if(n.service48!=='heal')continue;if(!n.medicalTalk132||n.talk!==n.medicalTalk132)n.medicalTalk132=n.talk=()=>{if(n.dead||n.hostile||n._party)return false;return serviceTalk48(n);};n.medicalService132=true;count++;}return count;}
const healerCreate132Before=createServices48;createServices48=function(...args){const r=healerCreate132Before(...args);bindHealers132(args[0]?.cast||NPCS);return r;};
const healerPopulate132Before=populate;populate=async function(){await healerPopulate132Before();bindHealers132();};
const healerRestore132Before=restoreLivingWorld;restoreLivingWorld=function(...args){const r=healerRestore132Before(...args);bindHealers132();return r;};
const healerInts132Before=currentInts;currentInts=function(){const list=healerInts132Before();if(P.dead||P.mode!=='foot')return list;const n=NPCS.find(n=>n.medicalService132&&!n.dead&&!n.hostile&&!n._party&&(n.area||'over')===AREA&&hyp(n.x-P.x,n.z-P.z)<3);if(n)list.unshift({x:n.x,z:n.z,r:3,label:()=> 'Speak to '+n.name+' · medical treatment and supplies',act:()=>serviceTalk48(n)});return list;};
`;
