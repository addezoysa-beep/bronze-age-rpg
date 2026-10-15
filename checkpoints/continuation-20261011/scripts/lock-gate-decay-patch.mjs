export const lockGateDecayPatch=String.raw`
/* Tactile pin binding: player lift is visible; hidden pin targets are never
   drawn. Resistance, pick flex and contact cues require applied tension. */
(function(){
 /* LOCK_FEEDBACK_163: clearer contact/progress without exposing target heights. */
 if(typeof beginLockpick==='function'){const begin163Before=beginLockpick;beginLockpick=function(){if(AU.on&&AU.ctx?.state==='suspended')AU.ctx.resume?.().catch?.(()=>{});return begin163Before.apply(this,arguments);};}
 function lockFeel112(q){const tier=q.dg?.def.faction56||q.dg?.def.boss?2:q.dg?.def.mine36?1:0,tolerance=7.5-tier*.9+Math.min(3,G.skills?.lockpick||0),gap=Math.abs(q.targets[q.selected]-q.heights[q.selected]);return{tier,tolerance,binding:gap<=tolerance,near:gap<=tolerance+6};}
 drawLock16=function(){const q=LOCK16;if(!q)return;const x=$('lock-canvas16').getContext('2d'),tension=q.tension||keys.KeyE,feel=lockFeel112(q),lift=q.heights[q.selected],bend=Math.min(1,q.stress);
  x.clearRect(0,0,640,350);x.fillStyle='#151b1e';x.fillRect(40,30,560,272);x.strokeStyle='#8c7751';x.lineWidth=3;x.strokeRect(40,30,560,272);
  x.fillStyle='#302d25';x.fillRect(160,80,320,178);x.fillStyle='#090d0f';x.fillRect(230,120,190,100);
  x.strokeStyle=tension?'#d9bb78':'#786c52';x.lineWidth=4;x.beginPath();x.moveTo(420,225);x.lineTo(515,225-bend*8);x.stroke();
  const px=180+q.selected*140,py=217-lift*.35;x.strokeStyle=tension&&feel.binding?'#a7e1cd':tension&&feel.near?'#e3cb88':'#bbb3a0';x.lineWidth=4;x.beginPath();x.moveTo(126,284);x.quadraticCurveTo(180,256-bend*12,px,py+15);x.lineTo(px+12,py);x.stroke();
  x.fillStyle='#97735a';x.beginPath();x.ellipse(123,287,44,23,-.2,0,Math.PI*2);x.fill();x.strokeStyle='#c09a7d';x.lineWidth=11;for(let i=0;i<3;i++){x.beginPath();x.moveTo(142-i*8,270+i*6);x.lineTo(169-i*7,260+i*7-bend*2);x.stroke();}
  for(let i=0;i<3;i++){x.fillStyle=q.set[i]?'#82b59a':i===q.selected?'#e3cb88':'#534d41';x.beginPath();x.arc(180+i*140,62,10,0,Math.PI*2);x.fill();x.fillStyle='#e4dccb';x.font='14px serif';x.fillText(q.set[i]?'SET':String(i+1),170+i*140,43);}
  const progress=Math.min(1,q.hold/(.40+feel.tier*.10));x.fillStyle='#423a33';x.fillRect(80,306,480,10);x.fillStyle='#92d5c0';x.fillRect(80,306,480*progress,10);
  x.fillStyle='#423a33';x.fillRect(80,324,480,7);x.fillStyle='#ac6c50';x.fillRect(80,324,480*bend,7);$('pin-lift16').value=lift;
  const status='Pin '+(q.selected+1)+' · '+q.set.filter(Boolean).length+'/3 set · '+(G.inv.lockpick||0)+' picks · ';
  $('lock-feedback16').textContent=status+(q.set.every(Boolean)?'The bolt turns.':q.stress>.65?'The pick is flexing. Release tension before it snaps.':tension?(feel.binding?'Clear contact. Hold steady as the green bar fills.':feel.near?'A soft rattle. The pin is close; ease the lift.':'Resistance. Release tension and adjust the lift.'):'Feel the next pin · W/S or slider lifts · hold E / tension button to feel contact · A/D or click a numbered pin · Esc leaves');
 };
 lockTick16=function(dt){const q=LOCK16;if(!q||STATE!=='lockpick')return;dt=Math.min(.05,Math.max(0,Number(dt)||0));if(q.set[q.selected])q.selected=q.set.findIndex(v=>!v);if(q.selected<0)return;
  q.heights[q.selected]=clamp(q.heights[q.selected]+((keys.KeyW?1:0)-(keys.KeyS?1:0))*dt*24,0,100);const f=lockFeel112(q),tension=q.tension||keys.KeyE;
  q.cueClock163=(q.cueClock163||0)+dt;const cue=tension?(f.binding?'binding':f.near?'near':'resist'):'released';
  if(cue!==q.cue163&&q.cueClock163>=(q.cueAfter163||0)){q.cue163=cue;q.cueAfter163=q.cueClock163+.16;if(AU.on&&AU.ctx&&cue!=='released'){if(f.binding)tone(960,.11,'sine',.09,1140);else noiseB(.05,f.near?.07:.045,f.near?1400:500);}}
  if(tension&&f.binding){q.hold+=dt;q.stress=Math.max(0,q.stress-dt*.35);if(q.hold>.40+f.tier*.10){q.set[q.selected]=true;q.hold=0;if(AU.on&&AU.ctx)tone(1280,.13,'triangle',.10,1600);sfx('pick');if(q.set.every(Boolean)){const{dg,ch,id}=q;G.world.locks[id]=true;G.skills.lockpick=Math.min(3,(G.skills.lockpick||0)+.15);closeLock16();unlockedChestBefore(dg,ch);ch.lid.rotation.x=-1.35;guildEvidence16('lock',id);toast('Lock opened · pick intact');save();return;}q.selected=q.set.findIndex(v=>!v);}}
  else if(tension){q.hold=0;q.stress+=dt*(f.near?.10:.32+f.tier*.06);if(q.stress>=1){G.inv.lockpick=Math.max(0,G.inv.lockpick-1);q.stress=q.hold=0;q.tension=false;keys.KeyE=false;sfx('pick');if(!G.inv.lockpick){closeLock16();toast('Your last pick snapped.');return;}toast('The pick snapped. Set pins hold; release tension and try the next pin.');}}
  else{q.hold=0;q.stress=Math.max(0,q.stress-dt*.9);}drawLock16();
 };
 const LOCKED_GATE112={area:null,last:0,seen:new Set()};
 const gateApproach112Before=dgUpdate;dgUpdate=function(dt){const r=gateApproach112Before(dt);if(!DG||STATE!=='play'||P.dead)return r;if(LOCKED_GATE112.area!==DG.id){LOCKED_GATE112.area=DG.id;LOCKED_GATE112.seen.clear();}
  if(T_NOW<LOCKED_GATE112.last)return r;for(const[key,g]of Object.entries(DG.groups||{})){if(g.open||!g.sw?.length)continue;const gate=g.gates?.find(q=>!q.open&&hyp(P.x-q.x,P.z-q.z)<4.4);if(!gate||LOCKED_GATE112.seen.has(key))continue;if(ENEMIES.some(e=>e.alive&&!e.friendly&&e.area===AREA&&hyp(e.x-P.x,e.z-P.z)<12))return r;LOCKED_GATE112.seen.add(key);LOCKED_GATE112.last=T_NOW+8;say('The gate',['The gate seems locked.','Marks in the stone lead back to the mechanism. Inspect the nearby target, weights or inscription.']);beginStoryCinema110({x:gate.x,z:gate.z,y:0},false);break;}return r;};
 function decayEquipment112(h){if(!h?.revenant36)return;for(const mesh of [...Object.values(h.W||{}),h.shield,h.armor16,h.helmet16].filter(Boolean)){mesh.traverse?.(m=>{if(m.isMesh&&!m.userData?.decayWeapon112){decayMesh41(m);m.userData||={};m.userData.decayWeapon112=true;}});if(mesh.isMesh&&!mesh.userData?.decayWeapon112){decayMesh41(mesh);mesh.userData||={};mesh.userData.decayWeapon112=true;}}}
 const revenantSet112Before=setWeapon;setWeapon=function(h,...args){const r=revenantSet112Before(h,...args);decayEquipment112(h);return r;};
 const revenantSpawn112Before=spawnEnemy;spawnEnemy=function(...args){const e=revenantSpawn112Before(...args);if(e?.revenant36&&e.hum){e.hum.revenant36=true;decayEquipment112(e.hum);}return e;};for(const e of ENEMIES)if(e.revenant36&&e.hum){e.hum.revenant36=true;decayEquipment112(e.hum);}
 Object.assign(globalThis,{lockFeel112,decayEquipment112});
})();`;

