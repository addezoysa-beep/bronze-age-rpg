export const resourceDirectionsPatch=String.raw`
/* RESOURCE_DIRECTIONS_137: refer to real regional service actors and entrances. */
function resourceOrigin137(n){
 if((n.area||'over')==='over')return{x:n.x,z:n.z};
 return n.tavern15||n.inn48||n.house||n.home||{x:n.x,z:n.z};
}
function resourceStaff137(n){return n&&!n.dead&&!n.hostile&&!n._party;}
function regionalResourceTargets137(n,kind){
 const origin=resourceOrigin137(n),region=nearestIsle(origin.x,origin.z),out=[];
 const add=(p,name,actor=null)=>{if(p&&Number.isFinite(p.x+p.z)&&nearestIsle(p.x,p.z)===region)out.push({x:p.x,z:p.z,name,actor,source:p});};
 if(kind==='food'){
  for(const o of TAVERNS15){const server=(o.cast||[]).find(a=>resourceStaff137(a)&&a.job15==='server');if(server)add(o,(o.name||'The tavern')+' · '+server.name,server);}
  for(const o of INNS48.values()){const keeper=NPCS.find(a=>a.inn48===o&&resourceStaff137(a));if(keeper)add(o,(o.name||'The inn')+' · '+keeper.name,keeper);}
 }else if(kind==='water'){
  for(const w of WELLS36)if(existingWellUsable76(region,w))add(w,(IS[region]?.name||region)+' well');
 }else if(kind==='healing'){
  for(const a of NPCS)if(a.service48==='heal'&&resourceStaff137(a))add(resourceOrigin137(a),a.name,a);
 }
 out.sort((a,b)=>hyp(a.x-origin.x,a.z-origin.z)-hyp(b.x-origin.x,b.z-origin.z));return out.slice(0,3);
}
function resourceDirections137(n,kind){
 if(!resourceStaff137(n)||P.dead)return false;
 const entries=regionalResourceTargets137(n,kind);
 if(!entries.length){say(n.name,['I cannot point you to an available '+({food:'food seller',water:'usable well',healing:'healer'}[kind]||'service')+' here at present.']);return false;}
 const descriptions={food:'These local tables serve meals. Ask at the counter about carrying food or eating there; meals cost silver.',water:'These wells provide drinking water. Bring your waterskin if you want to fill it for the road.',healing:'These healers treat wounds and offer remedies. Ask about the price before buying or requesting treatment.'};
 say(n.name,[descriptions[kind],entries.map(e=>e.name).join('; ')],null,entries.map(e=>({t:'Directions to '+e.name,go:()=>{
  // Staff can die, join a party or turn hostile after the menu was opened.
  if(e.actor&&!resourceStaff137(e.actor))return toast('That person is no longer available. Ask for another local service.');
  if(kind==='water'&&!existingWellUsable76(nearestIsle(e.x,e.z),e.source))return toast('That well is no longer accessible.');
  npcMapHints13(n,e,e.name);
 }})).concat([{t:'Back to food, water and healing',go:()=>resourceHelp137(n)}]));return true;
}
function resourceHelp137(n){
 if(!resourceStaff137(n)||P.dead)return false;
 say(n.name,['What do you need for the road?'],null,[{t:'Food and a warm meal',go:()=>resourceDirections137(n,'food')},{t:'Drinking water',go:()=>resourceDirections137(n,'water')},{t:'Healing and remedies',go:()=>resourceDirections137(n,'healing')},{t:'Leave',go:()=>closeDlg()}]);return true;
}
const resourceSay137Before=say;say=function(name,lines,done,choices){
 // Add a secondary choice only; never intercept callback-driven tutorials/scenes.
 if(!done&&Array.isArray(choices)&&choices.length&& !choices.some(c=>/food, water or healing|Back to food, water and healing|Food and a warm meal/.test(c.t||''))){
  const n=NPCS.find(a=>a.name===name&&resourceStaff137(a)&&(a.area||'over')===AREA&&hyp(P.x-a.x,P.z-a.z)<8);
  if(n)choices=choices.concat([{t:'Where can I find food, water or healing?',go:()=>resourceHelp137(n)}]);
 }
 return resourceSay137Before(name,lines,done,choices);
};
`;
