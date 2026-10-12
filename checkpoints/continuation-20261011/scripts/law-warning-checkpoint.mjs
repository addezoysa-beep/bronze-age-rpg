export const lawWarningRuntime=`
/* Accidental contact warns; continued assault escalates; guards demand a choice. */
let LAW_OFFER70=null;
function lawState70(){ensureCineState();livingState();const q=G.world.law70||={warnings:{},phase:'pursuit',targets:{}};q.targets||={};return q;}
function lawKey70(n){return(n.area||'over')+':'+n.name;}
function lawGuard70(n){return !n.dead&&isGuard(n)&&(n.area||'over')===AREA&&n.h.g.visible;}
function nearbyLawGuard70(){return NPCS.find(n=>lawGuard70(n)&&hyp(P.x-n.x,P.z-n.z)<12);}
function lawSettle70(){G.law.bounty=0;G.law.heat=0;const q=lawState70();q.phase='pursuit';q.warnings={};LAW_OFFER70=null;for(const n of NPCS)if(n.lawManaged70||q.targets[lawKey70(n)]){n.hostile=false;n.lawManaged70=false;n._tactical14=null;n._arrest=0;}q.targets={};PARTY_TARGET20=null;hudAll();save();}
function lawRefuse70(){if(!LAW_OFFER70)return;const q=lawState70();q.phase='refused';LAW_OFFER70=null;closeDlg();for(const n of NPCS)if(n.lawManaged70&&!n.dead&&(n.area||'over')===AREA)n.hostile=true;save();toast('The watch draws its weapons.');}
function lawOffer70(n){const q=lawState70();if(LAW_OFFER70)return;LAW_OFFER70={name:n.name};q.phase='offered';n.lawManaged70=true;q.targets[lawKey70(n)]=true;n.hostile=false;P.melee=P.buffer22=null;P.draw=P.swing=0;mouse.l=mouse.r=false;
 say(n.name,['Enough. Put down your weapon. Answer to the watch, pay the fine, or resist us.',...(G.silver<G.law.bounty?['You lack the silver for the fine. You may still surrender.']:[])],()=>{},[
 {t:'Surrender and go to jail',go:()=>{if(!LAW_OFFER70)return;LAW_OFFER70=null;closeDlg();arrest();lawSettle70();}},
 {t:'Pay the fine · '+G.law.bounty+' silver',go:()=>{if(!LAW_OFFER70)return;const fine=G.law.bounty;if(G.silver<fine){LAW_OFFER70=null;return lawOffer70(n);}G.silver-=fine;LAW_OFFER70=null;closeDlg();lawSettle70();toast('The fine is paid. Keep the peace.');}},
 {t:'Refuse and fight',go:()=>lawRefuse70()}]);
}
const assaultWarning70Before=assaultNPC;
assaultNPC=function(n,damage,...args){
 if(n.dead||!(damage>0))return;
 if(SPAR22?.n===n||LESSON26?.n===n||n._party||livingState().followers.includes(n.name)||n===HECTOR)return assaultWarning70Before(n,damage,...args);
 const q=lawState70(),key=lawKey70(n);if(!(G.law.bounty>0))q.phase='pursuit';
 /* One swing may reach the same actor through more than one legacy hit path. */
 if(P.melee&&n.lawSwing70===P.melee)return;n.lawSwing70=P.melee||null;
 if(n.hostile&&!n.lawManaged70)return assaultWarning70Before(n,damage,...args);
 const warned=q.warnings[key]&&q.warnings[key].day===G.day;
 if(!warned&&!n.hostile){npcInit(n);if(n.mortal!==false&&!n.protected48)n.hp-=damage;
  q.warnings[key]={day:G.day};n.action='warning the careless attacker';
  if(n.hp<=0){n.lawManaged70=true;fallNPC(n);G.law.bounty=Math.max(80,G.law.bounty||0);G.law.heat=90;save();return;}
  reaction14('surprise',n);toast(n.name+': “Watch your weapon! Strike me again and I will call the watch.”');save();return;
 }
 const before=G.law.bounty||0;n.lawManaged70=true;q.targets[key]=true;assaultWarning70Before(n,damage,...args);
 G.law.bounty=Math.max(G.law.bounty||0,before+35);G.law.heat=Math.max(G.law.heat||0,35);G.law.lastCrime='assault';
 const realm=localRealm(P.x,P.z);G.law.jurisdiction=realm?.I.name||'local';
 if(q.phase!=='refused')q.phase='pursuit';
 if(nearbyLawGuard70()&&q.phase!=='refused'){n.hostile=false;PARTY_TARGET20=null;n.action='calling for the watch';}
 save();
};
/* Replace auto-payment/auto-jail tick, rather than chaining its destructive callbacks. */
lawTick=function(dt){const q=lawState70();if(STATE!=='play'||P.dead||!(G.law.bounty>0))return;
 if(LAW_OFFER70){lawRefuse70();return;}
 G.law.heat=Math.max(0,(G.law.heat||0)-dt);
 const realm=localRealm(P.x,P.z);if(G.law.jurisdiction&&G.law.jurisdiction!=='local'&&realm?.I.name!==G.law.jurisdiction)return;
 for(const n of NPCS){if(!lawGuard70(n))continue;const d=hyp(P.x-n.x,P.z-n.z);if(d>24)continue;
  n.lawManaged70=true;q.targets[lawKey70(n)]=true;if(q.phase==='refused'){n.hostile=true;continue;}
  n.hostile=false;n.action='approaching to demand surrender';
  if(d<=3.5){lawOffer70(n);return;}
  groundRouteStep(n,P.x,P.z,3.8,dt,.4);
 }
};
const lawThreat70Before=npcThreatTick;npcThreatTick=function(dt){const q=lawState70(),pause=[];
 for(const n of NPCS)if(q.targets[lawKey70(n)]&&!n.dead){n.lawManaged70=true;if(q.phase==='refused'||!isGuard(n)&&!nearbyLawGuard70())n.hostile=true;}
 if(q.phase!=='refused'&&(LAW_OFFER70||nearbyLawGuard70()&&G.law.bounty>0))for(const n of NPCS)if(n.lawManaged70&&n.hostile){pause.push(n);n.hostile=false;}
 try{return lawThreat70Before(dt);}finally{for(const n of pause)n.hostile=true;}
};
const lawLoad70Before=continueGame;continueGame=function(){LAW_OFFER70=null;return lawLoad70Before();};
const lawNew70Before=newGame;newGame=function(){LAW_OFFER70=null;return lawNew70Before();};
const lawDeath70Before=clearDeathProgress;clearDeathProgress=function(){LAW_OFFER70=null;for(const n of NPCS)if(n.lawManaged70){n.hostile=false;n.lawManaged70=false;n._tactical14=null;}const r=lawDeath70Before();if(G.world)G.world.law70={warnings:{},phase:'pursuit',targets:{}};return r;};
`;
export function applyLawWarningCheckpoint(html){const marker='window.WDS_READY33=true;';if(html.includes('function lawState70(')||html.split(marker).length!==2)throw new Error('Expected unpatched law source');return html.replace(marker,lawWarningRuntime+'\n'+marker);}
