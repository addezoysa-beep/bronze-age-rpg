export const targetChestRuntime = `
/* Current combat target owns the bar; abandoned bosses cannot pin it. */
function healthTargetEligible72(e){return combatLockHostile62(e)&&hyp(e.x-P.x,e.z-P.z)<=(e.d?.ship?130:48);}
function healthTargetEngaged72(e){return healthTargetEligible72(e)&&(e.state!=='idle'||(e.suspicion||0)>=.7)&&enemySightLine(e);}
function healthBarTarget72(){
 if(STATE!=='play'||P.dead){BOSS=null;return null;}
 if(BOSS&&!healthTargetEngaged72(BOSS))BOSS=null;
 if(LOCK&&healthTargetEligible72(LOCK))return LOCK;
 const nearby=ENEMIES.filter(healthTargetEngaged72).sort((a,b)=>hyp(a.x-P.x,a.z-P.z)-hyp(b.x-P.x,b.z-P.z));
 return nearby[0]||BOSS||null;
}
const guardedChest72Before=openChest;openChest=function(dg,ch){
 if(!dg?.id||!ch)return toast('There is nothing to open here.');
 if(!ch.open&&ch.guardian72?.alive)return toast('The giant still guards this chest. Defeat it first.');
 return guardedChest72Before(dg,ch);
};
`;
export function applyTargetChestCheckpoint(html){
 const replacements=[
  ['const tg=BOSS&&BOSS.alive?BOSS:LOCK;','const tg=healthBarTarget72();'],
  ['dg={id:\'plains_\'+id};ch.open=', 'dg={id:\'plains_\'+id};ch.guardian72=e;ch.open='],
  ['if(dg.def.egyptPuzzle58&&ch.item===dg.def.special&&!gstate(dg.id).open.C&&!dg.seqSw.on)', 'if(dg.def?.egyptPuzzle58&&ch.item===dg.def.special&&!gstate(dg.id).open?.C&&!dg.seqSw?.on)']
 ];
 for(const [before,after]of replacements){if(html.split(before).length!==2)throw Error('Target/chest source anchor changed: '+before);html=html.replace(before,after);}
 const end=html.lastIndexOf('</script>');if(end<0)throw Error('Missing runtime script');
 return html.slice(0,end)+targetChestRuntime+'\n'+html.slice(end);
}
