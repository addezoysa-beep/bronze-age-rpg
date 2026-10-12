export const combatLockRuntime = `
/* Combat target ownership: keyboard, camera and marker share one eligible target. */
const COMBAT_LOCK62={code:'KeyQ',checked:null,nextLOS:0};
try{const k=localStorage.getItem('wine-dark-lock-key62');if(['KeyQ','Numpad0'].includes(k))COMBAT_LOCK62.code=k;}catch(_){}
function combatLockHostile62(e){return !!(e&&e.alive&&!e.friendly&&!e.trainingDummy&&!e.noncombat&&e.hostile!==false&&e.area===AREA&&e.g?.visible!==false&&Number.isFinite(e.x+e.z)&&(!e.warSide22||warDisposition22(e)==='hostile'));}
function combatLockEligible62(e,retain=false){return combatLockHostile62(e)&&hyp(e.x-P.x,e.z-P.z)<=(e.d?.ship?(retain?130:90):(retain?48:34))&&enemySightLine(e);}
function clearCombatLock62(){LOCK=null;COMBAT_LOCK62.checked=null;COMBAT_LOCK62.nextLOS=0;}
function validateCombatLock62(){if(STATE!=='play'||P.dead||!G.started){clearCombatLock62();return;}if(!LOCK)return;if(!combatLockHostile62(LOCK)||hyp(LOCK.x-P.x,LOCK.z-P.z)>(LOCK.d?.ship?130:48)){clearCombatLock62();return;}if(COMBAT_LOCK62.checked!==LOCK||T_NOW>=COMBAT_LOCK62.nextLOS){COMBAT_LOCK62.checked=LOCK;COMBAT_LOCK62.nextLOS=T_NOW+.15;if(!enemySightLine(LOCK))clearCombatLock62();}}
function selectCombatLock62(cycle=false){if(STATE!=='play'||P.dead||!G.started)return;if(LOCK&&!cycle){clearCombatLock62();return;}const list=ENEMIES.filter(e=>combatLockEligible62(e)).sort((a,b)=>{const score=e=>hyp(e.x-P.x,e.z-P.z)+abs(angDiff(Math.atan2(e.x-P.x,e.z-P.z),CAM.yaw))*14;return score(a)-score(b);});if(!list.length){clearCombatLock62();CAM.manual=0;return;}const index=list.indexOf(LOCK);LOCK=cycle&&index>=0?list[(index+1)%list.length]:list[0];COMBAT_LOCK62.checked=LOCK;COMBAT_LOCK62.nextLOS=T_NOW+.15;}
cycleLock=function(){selectCombatLock62(false);};
function routeCombatLock62(e){if(e._odysseyKey||e.code!==COMBAT_LOCK62.code||STATE!=='play')return;e.preventDefault();e.stopImmediatePropagation();if(e.type==='keydown'&&!e.repeat)selectCombatLock62(!!e.shiftKey);}
addEventListener('keydown',routeCombatLock62,true);addEventListener('keyup',routeCombatLock62,true);
const combatLockPlayer62Before=updatePlayer;updatePlayer=function(dt){validateCombatLock62();combatLockPlayer62Before(dt);validateCombatLock62();};
const combatLockCamera62Before=updateCamera;updateCamera=function(dt){validateCombatLock62();combatLockCamera62Before(dt);};
const combatLockHud62Before=updHud;updHud=function(dt){validateCombatLock62();combatLockHud62Before(dt);};
function combatLockHelp62(){const key=COMBAT_LOCK62.code==='KeyQ'?'Q':'Numpad 0';const guide=$('pause')?.querySelector('.pauselist');if(guide)guide.innerHTML=guide.innerHTML.replace('<kbd>E · Q</kbd><span>Interact · left-hand attack</span>','<kbd>E · Backquote</kbd><span>Interact · left-hand attack</span>');if(typeof controls22!=='undefined')controls22.textContent=controls22.textContent.replace('Q left-hand attack','Backquote left-hand attack');const old=$('combat-lock-help62');if(old)old.textContent=key+' lock / unlock · Shift + '+key+' cycle target';}
function combatLockControls62(){const panel=$('pause')?.querySelector('.win .bd');if(!panel||$('combat-lock-key62'))return;const line=document.createElement('label');line.style.cssText='display:block;margin:10px 0;color:#dacaa4';line.textContent='Combat lock / unlock (Shift + key cycles): ';const select=document.createElement('select');select.id='combat-lock-key62';select.setAttribute('aria-label','Combat lock key');for(const [code,name]of[['KeyQ','Q'],['Numpad0','Numpad 0']]){const option=document.createElement('option');option.value=code;option.textContent=name;select.appendChild(option);}select.value=COMBAT_LOCK62.code;select.onchange=()=>{if(!['KeyQ','Numpad0'].includes(select.value))return;COMBAT_LOCK62.code=select.value;clearCombatLock62();combatLockHelp62();try{localStorage.setItem('wine-dark-lock-key62',select.value);}catch(_){}for(const k of ['KeyQ','Numpad0']){keys[k]=false;once[k]=false;}};line.appendChild(select);panel.appendChild(line);const help=document.createElement('p');help.id='combat-lock-help62';panel.appendChild(help);combatLockHelp62();}
const combatLockPause62Before=openPause;openPause=function(){combatLockPause62Before();clearCombatLock62();combatLockControls62();combatLockHelp62();};
combatLockHelp62();
`;
export function applyCombatLockCheckpoint(html){
 const before="if(e.code==='KeyQ'&&STATE==='play'){e.preventDefault();e.stopImmediatePropagation();if(e.type==='keydown'&&!e.repeat)meleeStart('left');return;}";
 if(html.split(before).length!==2)throw Error('Combat input anchor changed');
 html=html.replace(before,before.replace("e.code==='KeyQ'","e.code==='Backquote'"));
 // The capture route owns lock-on so the old once queue cannot toggle it twice.
 const queue="if(once.KeyQ)cycleLock();";
 if(html.split(queue).length!==2)throw Error('Combat queue anchor changed');
 html=html.replace(queue,'');
 html=html.replace('<kbd>Q</kbd><span>Left-hand attack</span>','<kbd>\\u0060</kbd><span>Left-hand attack</span><kbd>Q</kbd><span>Lock / unlock (Shift: cycle; configurable in pause)</span>');
 const end=html.lastIndexOf('</script>');if(end<0)throw Error('No runtime script');
 return html.slice(0,end)+combatLockRuntime+'\n'+html.slice(end);
}
