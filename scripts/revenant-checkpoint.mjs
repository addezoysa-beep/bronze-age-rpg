export const revenantRuntime = `
/* Tomb revenants now guarantee weapon-specific archer and swordsman roles. */
const revSpawn60Before=spawnEnemy;
spawnEnemy=function(kind,x,z,opt){
 const e=revSpawn60Before(kind,x,z,opt);
 if(e?.faction56==='oathkeepers'&&['bow','sword'].includes(e.archetype56)){
  const weapon=e.archetype56;
  e.revenant36=true;
  e.name=weapon==='bow'?'Grave Revenant Archer':'Grave Revenant Swordsman';
  e.d={...e.d,w:weapon,ranged:weapon==='bow',keep:weapon==='bow'?13:11,range:weapon==='bow'?27:2.7};
  setWeapon(e.hum,weapon);
 }
 return e;
};
const revRoster60Before=buildDungeon;
buildDungeon=function(id){
 const result=revRoster60Before(id),dg=DGS[id];
 if(!dg||dg.revRoster60)return result;
 const graves=dg.spawns.filter(s=>String(s.id||'').startsWith('grave36_'));
 if(graves.length){
  graves[0].kind=factionKind56('oathkeepers','bow');
  if(graves[1])graves[1].kind=factionKind56('oathkeepers','sword');
  dg.revRoster60=true;
 }
 return result;
};`;

const marker = "buildTag23.textContent='ODYSSEY LIX · Hands and Motion';document.title='Wine-Dark Sea — Build 59';";

export function applyRevenantCheckpoint(html) {
  if (html.split(marker).length !== 2) throw new Error('Revenant checkpoint requires exactly one Build 59 marker');
  return html.replace(marker, marker + revenantRuntime);
}
