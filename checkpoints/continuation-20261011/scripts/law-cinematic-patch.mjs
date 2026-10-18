export const lawCinematicPatch=String.raw`

/* Resume checkpoint 91: resumable cinematic law choices and settlement livestock law. */
let LAW_CINE91=false,WEAPON_NOTICE91=0;
function lawCinematic91(on=true){
 if(on){if(!$('law-cine91')){const s=document.createElement('style');s.id='law-cine91';s.textContent='body.lawcine91:before,body.lawcine91:after{content:"";position:fixed;left:0;right:0;height:8vh;background:#000;z-index:90;pointer-events:none}body.lawcine91:before{top:0}body.lawcine91:after{bottom:0}body.lawcine91 #dlg{z-index:100;bottom:9vh!important;background:rgba(8,9,12,.9)}body.lawcine91 #dchoices{display:flex!important}';document.head.appendChild(s);}LAW_CINE91=true;document.body.classList.add('lawcine91');try{document.exitPointerLock?.();}catch(_){}mouse.l=mouse.r=false;}
 else{LAW_CINE91=false;document.body.classList.remove('lawcine91');mouse.l=mouse.r=false;}
}
const lawClose91Before=closeDlg;closeDlg=function(...args){if(LAW_CINE91)lawCinematic91(false);return lawClose91Before(...args);};
const lawSettle91Before=lawSettle70;lawSettle70=function(...args){lawCinematic91(false);return lawSettle91Before(...args);};

lawOffer70=function(n){
 const q=lawState70();if(LAW_OFFER70||STATE!=='play')return;
 LAW_OFFER70={name:n.name,guard:n};q.phase='offered';n.lawManaged70=true;q.targets[lawKey70(n)]=true;n.hostile=false;
 P.melee=P.buffer22=null;P.draw=P.swing=0;P.guard=P.swordGuard22=0;mouse.l=mouse.r=false;lawCinematic91(true);
 say(n.name,['Enough. Put down your weapon. Answer to the watch, pay the fine, or resist us.',...(G.silver<G.law.bounty?['You lack the silver for the fine. You may still surrender.']:[])],()=>{},[
  {t:'Surrender and go to jail',go:()=>{if(!LAW_OFFER70)return;LAW_OFFER70=null;closeDlg();arrest();lawSettle70();}},
  {t:'Pay the fine · '+G.law.bounty+' silver',go:()=>{if(!LAW_OFFER70)return;const fine=G.law.bounty;if(G.silver<fine){LAW_OFFER70=null;closeDlg();q.phase='pursuit';q.reofferAt91=T_NOW+1.5;return toast('You do not have enough silver. Surrender or leave before the watch closes in.');}G.silver-=fine;LAW_OFFER70=null;closeDlg();lawSettle70();toast('The fine is paid. Keep the peace.');}},
  {t:'Refuse and fight',go:()=>{lawCinematic91(false);lawRefuse70();}}
 ]);
};
const lawCancel91Before=cancelDialogue;cancelDialogue=function(...args){
 const pending=LAW_OFFER70;if(pending){LAW_OFFER70=null;const q=lawState70();q.phase='pursuit';q.reofferAt91=T_NOW+2.0;}
 const r=lawCancel91Before(...args);if(pending){lawCinematic91(false);toast('The watch follows. Speak again to surrender or pay; draw away to escape.');}return r;
};
lawTick=function(dt){
 const q=lawState70();if(STATE!=='play'||P.dead||!(G.law.bounty>0))return;
 if(LAW_OFFER70)return;
 G.law.heat=Math.max(0,(G.law.heat||0)-dt);
 const realm=localRealm(P.x,P.z);if(G.law.jurisdiction&&G.law.jurisdiction!=='local'&&realm?.I.name!==G.law.jurisdiction)return;
 for(const n of NPCS){if(!lawGuard70(n))continue;const d=hyp(P.x-n.x,P.z-n.z);if(d>24)continue;
  n.lawManaged70=true;q.targets[lawKey70(n)]=true;if(q.phase==='refused'){n.hostile=true;continue;}
  n.hostile=false;n.action='approaching to demand surrender';
  if(d<=3.5&&T_NOW>=(q.reofferAt91||0)){lawOffer70(n);return;}
  groundRouteStep(n,P.x,P.z,3.8,dt,.4);
 }
};

function settlementCenter91(x,z){
 const candidates=[];for(const s of SERVICES48.values())if(Number.isFinite(s.x+s.z))candidates.push({x:s.x,z:s.z,r:85,id:s.key||s.id||s.name||'service'});
 for(const p of POLITIES36.values())if(Number.isFinite(p.x+p.z))candidates.push({x:p.x,z:p.z,r:95,id:p.id||p.name||'polity'});
 for(const o of PALACES16)candidates.push({x:o.x,z:o.z,r:90,id:o.id});
 return candidates.sort((a,b)=>hyp(x-a.x,z-a.z)-hyp(x-b.x,z-b.z)).find(c=>hyp(x-c.x,z-c.z)<=c.r)||null;
}
function domesticLivestock91(a){return !!(a&&!a.questProtected75&&!WILD_HORSES16.includes(a)&&(PASTORAL.includes(a)||SHEEP.includes(a))&&['sheep','goat','cattle','horse','pig','ram'].includes(a.kind));}
const livestockLaw91Before=damageAnimal;damageAnimal=function(a,d){
 const domestic=domesticLivestock91(a),city=domestic&&settlementCenter91(a.x,a.z),alive=!a.dead;
 const r=livestockLaw91Before(a,d);
 if(alive&&a.dead&&city&&!a.lawDeath91){a.lawDeath91=true;witnessCrime('killing household livestock',65);}
 return r;
};

function settlementWeaponStop91(dt){
 if(STATE!=='play'||AREA!=='over'||P.dead||P.mode!=='foot'||G.law.bounty>0||!courtWeaponsDrawn26())return;
 WEAPON_NOTICE91=Math.max(0,WEAPON_NOTICE91-dt);if(WEAPON_NOTICE91>0)return;
 const city=settlementCenter91(P.x,P.z);if(!city)return;
 const guard=NPCS.filter(n=>lawGuard70(n)&&hyp(P.x-n.x,P.z-n.z)<10).sort((a,b)=>hyp(P.x-a.x,P.z-a.z)-hyp(P.x-b.x,P.z-b.z))[0];if(!guard)return;
 WEAPON_NOTICE91=12;P.vx=P.vz=0;P.melee=P.buffer22=null;P.draw=P.swing=0;mouse.l=mouse.r=false;lawCinematic91(true);
 say(guard.name,['Hold. This is a settled place, not a battlefield. Keep steel and missiles put away around the households and court.'],()=>{},[
  {t:'Put my weapons away',go:()=>{if(courtWeaponsDrawn26())peaceful16();say(guard.name,['Your hands are clear. Go peacefully.']);}},
  {t:'Leave the settlement armed',go:()=>closeDlg()}
 ]);
}
const settlementLaw91Before=updatePlayer;updatePlayer=function(dt){const r=settlementLaw91Before(dt);settlementWeaponStop91(dt);return r;};
function immersiveGuardLabels91(){for(const o of PALACES16)if(o.entry26)o.entry26.label=()=>courtWeaponsDrawn26()?'Palace guards bar the armed approach':'Open doors · Enter '+o.name;}
const lawPopulate91Before=populate;populate=async function(){await lawPopulate91Before();immersiveGuardLabels91();};
`;
