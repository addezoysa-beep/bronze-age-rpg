export const mainRouteDirectionsPatch=String.raw`
/* MAIN_ROUTE_DIRECTIONS_214: read-only, current-area markers for known main leads.
   Do not replace optional work/lessons, reveal maze solutions or finish quests. */
(function(){
 const point=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.z)?{x:p.x,z:p.z}:{x:null,z:null};
 const routes=[
  [/^(?:Bring the captain’s cargo tablet back to King Ikarios|Climb to the Palace of Ikarios and speak to the King)$/, 'king', /^King Ikarios(?:\b|,)/],
  [/^(?:Speak to Lykos in the pasture|Return to Lykos)$/, 'lykos', /^Lykos(?:\b|,)/],
  [/^(?:Ask Daedalus about Shekelesh and the four relics|Sail to Crete and show the cargo tablet to Daedalus the Inventor|Sail to Krete and find Daedalus at Knossos)$/, 'daedalus', /^Daedalus(?:\b|,)/],
  [/^(?:Travel to Delphi; hear the Pythia reveal all four relic locations|Ask the Pythia at Delphi where to find Shekelesh’s four ward-breaking relics)$/, 'delphi', /^Pythia(?:\b|,)/],
  [/^Sail to Egypt and find Proteus on Pharos$/, 'proteus', /^Proteus(?:\b|,)/],
  [/^Sail to Tyre and speak to Kadmos$/, 'kadmos', /^Kadmos(?:\b|,)/],
  [/^(?:Follow the raiders’ trail into the Cave of Pan|Clear the remaining bandits from Pan’s cave|Return to Pan’s cave for the captain’s cargo tablet)$/, 'cave', null],
  [/^Find the Labyrinth key, unlock the inner door and defeat the Minotaur$/, 'laby', null],
  [/^(?:Storm the Sea Peoples’ fortress on Alashiya|Return to the Alashiya fortress and speak to Erigone beyond the upper hall)$/, 'fort', null]
 ];
 function routeObjective214(q){
  if(!q||typeof q.t!=='string')return null;const route=routes.find(r=>r[0].test(q.t));if(!route)return null;
  const [,id,identity]=route,n=identity&&NPCS.find(n=>identity.test(n.name||'')&&!n.dead&&!n.hostile&&!n._party&&Number.isFinite(n.x)&&Number.isFinite(n.z)),targetArea=identity?(n?.area||'over'):id;
  if(AREA!=='over'&&AREA!==targetArea){const exit=DG&&DGS[AREA]===DG?point(DG.start):point(null);return{...q,t:'Leave this place, then '+q.t.charAt(0).toLowerCase()+q.t.slice(1),...exit};}
  if(n&&AREA===targetArea)return{...q,...point(n)};
  if(AREA===targetArea&&AREA!=='over'){
   // Pan already has actual enemy/tablet markers. The maze's exterior entrance
   // is not an interior target; keep its readable objective without a false arrow.
   return id==='laby'?{...q,...point(null)}:q;
  }
  const entrance=n&&(n.house||n.tavern15||n.inn48)||DGS[targetArea]?.out||LOC[id];
  return{...q,...point(entrance)};
 }
 const objective214Before=mainObjective13;mainObjective13=function(){const q=objective214Before.apply(this,arguments);return routeObjective214(q)||q;};
 const hint214Before=hintLine;hintLine=function(){const q=routeObjective214(objective214Before());return q?q.t:hint214Before.apply(this,arguments);};
 Object.assign(globalThis,{routeObjective214});
})();`;

export const liveResourceDirectionsPatch=String.raw`
/* LIVE_RESOURCE_DIRECTIONS_215: actual speaker and service at the moment of choice. */
(function(){
 const staff215Before=resourceStaff137;resourceStaff137=function(n){return NPCS.includes(n)&&staff215Before(n);};
 const help215Before=resourceHelp137;resourceHelp137=function(n){return invokeStory189(n,()=>help215Before.apply(this,arguments));};
 resourceDirections137=function(n,kind){return invokeStory189(n,()=>{
  if(!['food','water','healing'].includes(kind))return false;
  const entries=regionalResourceTargets137(n,kind);
  if(!entries.length){say(n.name,['I cannot point you to an available '+({food:'food seller',water:'usable well',healing:'healer'}[kind])+' here at present.']);return false;}
  const descriptions={food:'These local tables serve meals. Ask at the counter about carrying food or eating there; meals cost silver.',water:'These wells provide drinking water. Bring your waterskin if you want to fill it for the road.',healing:'These healers treat wounds and offer remedies. Ask about the price before buying or requesting treatment.'};
  let menu=null,used=false;const currentMenu=()=>!used&&menu&&DLG.lines===menu.lines&&DLG.choices===menu.choices;
  say(n.name,[descriptions[kind],entries.map(e=>e.name).join('; ')],null,entries.map(e=>({t:'Directions to '+e.name,go:()=>{
   // Re-query actual stock/service registrations, actor membership and live
   // entrances. A quote is not permission to mark a removed/moved service.
   if(!currentMenu())return false;const current=regionalResourceTargets137(n,kind).find(a=>e.actor?a.actor===e.actor:a.source===e.source);
   if(!current)return toast(kind==='water'?'That well is no longer accessible.':'That person is no longer available. Ask for another local service.'),false;
   used=true;npcMapHints13(n,current,current.name);return true;
  }})).concat([{t:'Back to food, water and healing',go:()=>currentMenu()&&resourceHelp137(n)}]));menu={lines:DLG.lines,choices:DLG.choices};return true;
 });};
})();`;
