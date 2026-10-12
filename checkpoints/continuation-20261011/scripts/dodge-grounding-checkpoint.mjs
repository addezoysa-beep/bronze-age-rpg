export const dodgeGroundingRuntime = `
/* Accessible roll input, buffered landing response, and active-evasion ground contact. */
const DODGE62={code:'AltLeft',buffer:.16};
try{const k=localStorage.getItem('wine-dark-dodge-key62');if(['AltLeft','CapsLock'].includes(k))DODGE62.code=k;}catch(_){}
function dodgeInput62(code){return code===DODGE62.code||(DODGE62.code==='AltLeft'&&code==='AltRight');}
function dodgeReady62(){return STATE==='play'&&!P.dead&&P.mode==='foot'&&P.grounded&&!P.rest&&!P.mine&&!P.melee&&P.rollT<=0&&P.at<0&&P.draw<=0&&!(P.guard>0)&&!(P.swordGuard22>0);}
const dodgePlayer62Before=updatePlayer;updatePlayer=function(dt){
 if(once.KeyC&&P.mode==='foot'){P.dodgeBuffer62=DODGE62.buffer;delete once.KeyC;}
 if((P.dodgeBuffer62||0)>0&&dodgeReady62()){
  P.dodgeBuffer62=0;
  if(spendStamina(14,'roll'))once.KeyC=true;
 }
 const result=dodgePlayer62Before(dt);
 P.dodgeBuffer62=Math.max(0,(P.dodgeBuffer62||0)-dt);
 return result;
};
function dodgeHelp62(){const name=DODGE62.code==='CapsLock'?'Caps Lock':'Alt';const help=$('dodge-help62');if(help)help.textContent=name+' roll / dodge · input buffers briefly before landing';if(typeof controls22!=='undefined')controls22.textContent=controls22.textContent.replace(/(?:Alt|Caps Lock) dodge \\/ roll/,name+' dodge / roll');}
function dodgeControls62(){const panel=$('pause')?.querySelector('.win .bd');if(!panel||$('dodge-key62'))return;const line=document.createElement('label');line.style.cssText='display:block;margin:10px 0;color:#dacaa4';line.textContent='Roll / dodge: ';const select=document.createElement('select');select.id='dodge-key62';select.setAttribute('aria-label','Roll or dodge key');for(const[code,name]of[['AltLeft','Alt'],['CapsLock','Caps Lock']]){const option=document.createElement('option');option.value=code;option.textContent=name;select.appendChild(option);}select.value=DODGE62.code;select.onchange=()=>{if(!['AltLeft','CapsLock'].includes(select.value))return;DODGE62.code=select.value;P.dodgeBuffer62=0;try{localStorage.setItem('wine-dark-dodge-key62',select.value);}catch(_){}for(const k of ['AltLeft','AltRight','CapsLock','KeyC']){keys[k]=false;delete once[k];}dodgeHelp62();};line.appendChild(select);panel.appendChild(line);const help=document.createElement('p');help.id='dodge-help62';panel.appendChild(help);dodgeHelp62();}
const dodgePause62Before=openPause;openPause=function(){dodgePause62Before();P.dodgeBuffer62=0;dodgeControls62();dodgeHelp62();};
const dodgeVisuals62Before=updVisuals;updVisuals=function(dt){dodgeVisuals62Before(dt);for(const e of ENEMIES)if(e.alive&&e.dash26&&e.hum?._rig13&&e.g.visible&&e.area===AREA)keepPoseAboveFloor(e.hum,e.area);};
dodgeHelp62();
`;

export function applyDodgeGroundingCheckpoint(html){
 const mapBefore="function mapPCKey(code){if((code==='ControlLeft'||code==='ControlRight'||code==='KeyC')&&P.mode==='swim')return'KeyC';if(code==='KeyX'&&P.mode==='swim')return'KeyX';return KEY_BINDINGS[code]||code;}";
 const mapAfter="function mapPCKey(code){if(typeof DODGE62!=='undefined'&&P.mode==='foot'&&dodgeInput62(code))return'KeyC';if((code==='ControlLeft'||code==='ControlRight'||code==='KeyC')&&P.mode==='swim')return'KeyC';if(code==='KeyX'&&P.mode==='swim')return'KeyX';return KEY_BINDINGS[code]||code;}";
 if(html.split(mapBefore).length!==2)throw Error('Dodge input anchor changed');
 html=html.replace(mapBefore,mapAfter);
 const playerMoveBefore="const rad=P.mode==='chariot'?1.7:riding?1.1:.5;moveEnt(P,(P.vx+P.kx)*dt,(P.vz+P.kz)*dt,rad,true);";
 const playerMoveAfter="const rad=P.mode==='chariot'?1.7:riding?1.1:.5,moveX=(P.vx+P.kx)*dt,moveZ=(P.vz+P.kz)*dt;if(P.rollT>0)sweptGroundMove62(P,moveX,moveZ,rad,true);else moveEnt(P,moveX,moveZ,rad,true);";
 if(html.split(playerMoveBefore).length!==2)throw Error('Player movement anchor changed');
 html=html.replace(playerMoveBefore,playerMoveAfter);
 const evadeBefore="function stepEvade26(e,dt){const q=e.dash26;if(!q)return false;q.t+=dt;const progress=clamp(q.t/q.duration,0,1),speed=7.0*sin(progress*PI),step=Math.min(1.45-q.distance,Math.max(0,speed*dt)),x=e.x,z=e.z;if(step>0)moveEnt(e,sin(q.yaw)*step,cos(q.yaw)*step,e.r,false);const travelled=hyp(e.x-x,e.z-z);q.distance+=travelled;e._moving14=travelled/Math.max(dt,.001);e.yaw=q.face;e.state='chase';if(q.t>=q.duration){e.dash26=null;e.cd=Math.max(e.cd||0,.28);}return true;}";
 const evadeAfter="function sweptGroundMove62(e,dx,dz,rad=e.r,out=false){const distance=hyp(dx,dz),parts=Math.max(1,Math.ceil(distance/.24)),sx=dx/parts,sz=dz/parts;for(let i=0;i<parts;i++){const x=e.x,z=e.z;moveEnt(e,sx,sz,rad,out);if(hyp(e.x-x,e.z-z)<hyp(sx,sz)*.15)break;}}function stepEvade26(e,dt){const q=e.dash26;if(!q)return false;q.t+=dt;const progress=clamp(q.t/q.duration,0,1),speed=7.0*sin(progress*PI),step=Math.min(1.45-q.distance,Math.max(0,speed*dt)),x=e.x,z=e.z;if(step>0)sweptGroundMove62(e,sin(q.yaw)*step,cos(q.yaw)*step,e.r,false);const travelled=hyp(e.x-x,e.z-z);q.distance+=travelled;e._moving14=travelled/Math.max(dt,.001);e.yaw=q.face;e.state='chase';if(q.t>=q.duration){e.dash26=null;e.cd=Math.max(e.cd||0,.28);}return true;}";
 if(html.split(evadeBefore).length!==2)throw Error('Enemy evade anchor changed');
 html=html.replace(evadeBefore,evadeAfter);
 const end=html.lastIndexOf('</script>');
 if(end<0)throw Error('No runtime script');
 return html.slice(0,end)+dodgeGroundingRuntime+'\n'+html.slice(end);
}
