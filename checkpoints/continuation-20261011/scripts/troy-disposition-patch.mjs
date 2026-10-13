export const troyDispositionPatch=String.raw`

/* Resume checkpoint 92: only real troops inherit Troy-war allegiance. */
function siegeMilitary92(a){
 if(!a||a.trainingDummy||a.d?.ship)return false;
 if(a.warSide22==='Achaea'||a.warSide22==='Troy'||a.trojanRaider||a.wall20||a.courtGuard16)return true;
 const name=a.name||'',role=a.role||'',weapon=a.weapon||a.d?.w||'';
 return /Achaean|Greek|Myrmidon|Trojan|Siege|Raiding Warrior|Sentry|Soldier|Spearman|Archer|Slinger|Captain|Guard|Watch/.test(name)
  ||/guard|warrior|soldier|captain/.test(role)
  ||(!!a.hum&&['spear','sword','axe','greatsword','bow','sling'].includes(weapon)&&a.hostile!==false);
}
troop29=function(a){return theatre29(a)&&siegeMilitary92(a);};
const siegeSide92Before=warSide22;warSide22=function(a){
 if(!a)return null;
 if(a.warSide22==='Achaea'||a.warSide22==='Troy')return a.warSide22;
 const name=a.name||'';
 if(/Achaean|Greek|Myrmidon|Siege/.test(name))return'Achaea';
 if(/Trojan|Troy|Idaios|Priam/.test(name)&&siegeMilitary92(a))return'Troy';
 if(theatre29(a)&&siegeMilitary92(a))return a.x<IS.troy.cx-160?'Achaea':'Troy';
 const prior=siegeSide92Before(a);return prior&&siegeMilitary92(a)?prior:null;
};
function syncSiegeDisposition92(a){
 const side=warSide22(a);if(!side)return null;
 a.warSide22=side;const hostile=warDisposition22(a)==='hostile';a.hostile=hostile;
 if(!hostile){if(PARTY_TARGET20===a)PARTY_TARGET20=null;if(LOCK===a)LOCK=null;a.combat=false;a._tactical14=null;}
 return hostile;
}
const siegeThreat92Before=npcThreatTick;npcThreatTick=function(dt){
 for(const n of NPCS)if(!n.dead&&!n._party&&theatre29(n)&&siegeMilitary92(n))syncSiegeDisposition92(n);
 return siegeThreat92Before(dt);
};
const siegeEnemy92Before=updEnemy;updEnemy=function(e,dt){
 if(e?.alive&&!e._party&&theatre29(e)&&siegeMilitary92(e))syncSiegeDisposition92(e);
 return siegeEnemy92Before(e,dt);
};
`;
