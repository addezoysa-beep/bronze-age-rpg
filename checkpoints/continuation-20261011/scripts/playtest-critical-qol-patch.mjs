export const playtestCriticalQolPatch=String.raw`
/* PLAYTEST_CRITICAL_QOL_163: ordinary greatsword dispatch and physical key/pick supplies. */
(function(){
 const attack163Before=pAttack;pAttack=function(){if(G.hands?.right==='greatsword')return meleeStart('right');return attack163Before.apply(this,arguments);};
 // Copper is the active ingot ID used by the existing lockpick recipe.
 if(RECIPES.lockpick){RECIPES.lockpick.n='Copper lockpicks (6)';RECIPES.lockpick.make=()=>{G.inv.lockpick=(G.inv.lockpick||0)+6;};}
 function fortKey163(e){if(!e||e.area!=='fort'||e.id==='boss'||e.boss||e.d?.boss||F().fort)return false;putLoot('fort:warden-key163',e.x,e.z,'fort',{key:1},'Sea Peoples gatekeeper’s bronze key');return true;}
 const kill163Before=killEnemy;killEnemy=function(e){const alive=e.alive,result=kill163Before.apply(this,arguments);if(alive&&!e.alive){fortKey163(e);if(/^(robber|thief)$/.test(e.kind)){const id=mobKey(e),cycle=renewalState().mobCycles[id]||0;putLoot('lockpicks163:'+id+':'+cycle,e.x,e.z,e.area,{lockpick:1+(faceHash(id)%3===0?1:0)},'Robber’s lockpicks');}}return result;};
 const fall163Before=fallNPC;fallNPC=function(n){const alive=!n.dead,result=fall163Before.apply(this,arguments);if(alive&&n.dead&&n.guild16==='thieves')putLoot('thief-picks163:'+n.name,n.x,n.z,n.area||'over',{lockpick:2},'Thief’s lockpicks');return result;};
 const loot163Before=putLoot;putLoot=function(id,x,z,area,items,label){if(id.startsWith('jar:')&&area!=='over'&&DUN[area]&&!DUN[area].house&&!DUN[area].tavern&&!DUN[area].palace16&&faceHash(id)%5===0)items={...items,lockpick:Math.max(1,items.lockpick||0)};return loot163Before(id,x,z,area,items,label);};
 // Old saves can already have defeated every guard before the boss door. Keep
 // the recovery physical and at a defeated guard's original reachable spawn.
 const spawn163Before=spawnDungeonEnemies;spawnDungeonEnemies=function(dg){const r=spawn163Before.apply(this,arguments);if(dg?.id==='fort'&&!F().fort&&!dg.doors?.some(d=>d.open)){const dead=dg.spawns?.find(s=>dg.dead?.[s.id]&&s.z>18*TS);if(dead)fortKey163({...dead,area:'fort'});}return r;};
 Object.assign(globalThis,{fortKey163});
})();`;
