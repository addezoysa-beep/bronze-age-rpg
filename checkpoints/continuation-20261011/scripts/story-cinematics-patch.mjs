export const storyCinematicsPatch=String.raw`
/* STORY_CINEMATICS_110: narrative presentation never supplies quest flags,
   selects an option, solves a puzzle or grants a reward. */
(function(){
 const PUZZLE_CINE110={area:null,seen:new Set(),queue:[]};
 function cinemaStyle110(){if($('story-cine110'))return;const s=document.createElement('style');s.id='story-cine110';s.textContent='body.cinechoices110 #dchoices{display:flex!important;flex-wrap:wrap}body.cinechoices110 #dnext{display:none!important}body.cine84 #dlg{max-height:46vh}';document.head.appendChild(s);}
 function beginStoryCinema110(actor,choices=false){
  if(STATE!=='talk')return false;cinematicUI84();cinemaStyle110();
  if(!CINE84)CINE84={camera:camera.position.clone(),rotation:camera.quaternion.clone(),viewVisible:VIEW_ROOT?.visible,elapsed:0,line:DLG.i,lineTime:0};
  CINE84.n=actor||null;CINE84.extended110=true;CINE84.elapsed=0;CINE84.lineTime=0;
  document.body.classList.add('cine84');document.body.classList.toggle('cinechoices110',!!choices);
  if(VIEW_ROOT)VIEW_ROOT.visible=false;mouse.l=mouse.r=false;P.vx=P.vz=0;
  for(const k in keys)keys[k]=false;for(const k in once)delete once[k];try{document.exitPointerLock?.();}catch(_){}return true;
 }
 function mainSpeaker110(name,n){return /Lykos|Ph[oó]kas|Phocas|Daedalus|Ikarios|Priam|Odysseus|Agamemnon|Menelaus|Erigone|Helen|Proteus|Oracle|Scribe|King|Queen|Pharaoh/.test(name||'')||!!(n?.king16||n?.leaderVoice16||n?.role==='scribe');}
 const storySay110Before=say;say=function(name,lines,done,choices){const r=storySay110Before(name,lines,done,choices),n=NPCS.find(n=>n.name===name&&!n.dead&&(n.area||'over')===AREA);if(STATE==='talk'&&(mainSpeaker110(name,n)||typeof LAW_CINE91!=='undefined'&&LAW_CINE91))beginStoryCinema110(n,!!choices);else if(CINE84?.extended110)document.body.classList.toggle('cinechoices110',!!choices);return r;};
 const cinemaEnd110Before=endCinematic84;endCinematic84=function(){document.body.classList.remove('cinechoices110');return cinemaEnd110Before();};
 const cinemaClose110Before=closeDlg;closeDlg=function(...args){const r=cinemaClose110Before(...args);if(CINE84?.extended110)endCinematic84();return r;};
 const cinemaTick110Before=cinematicTick84;cinematicTick84=function(dt){
  const c=CINE84;if(!c?.extended110)return cinemaTick110Before(dt);
  if(STATE!=='talk'){endCinematic84();return;}c.elapsed+=dt;if(c.line!==DLG.i){c.line=DLG.i;c.lineTime=0;}c.lineTime+=dt;
  const n=c.n;if(n&&Number.isFinite(n.x+n.z)){const y=Number.isFinite(n.y)?n.y:AREA==='over'?groundY(n.x,n.z):0,blend=1-Math.exp(-Math.max(0,dt)*2.5),pan=c.camera.clone();pan.x+=Math.sin(Math.min(c.elapsed,4)*.3)*.12;camera.position.lerp(pan,blend);camera.lookAt(n.x,y+1.3,n.z);}
  const last=DLG.i>=DLG.lines.length-1;if(last&&DLG.choices){$('dhint').textContent='Choose your response · Esc to leave';return;}
  $('dhint').textContent='Dialogue continues automatically · E / click to advance · Esc to leave';const duration=clamp(String(DLG.lines[DLG.i]||'').length/16,4,14);if(c.lineTime>=duration){c.lineTime=0;dlgAdvance();}
 };
 function queuePuzzleCinema110(dg,g,key){if(!g||!Number.isFinite(g.x+g.z))return;const id=dg.id+':'+key;if(PUZZLE_CINE110.seen.has(id))return;PUZZLE_CINE110.seen.add(id);if(PUZZLE_CINE110.queue.length<4)PUZZLE_CINE110.queue.push({area:dg.id,focus:{x:g.x,z:g.z,y:0},text:'The stonework shifts. The opened passage lies ahead.'});}
 const puzzleUpdate110Before=dgUpdate;dgUpdate=function(dt){
  const dg=DG;if(!dg)return puzzleUpdate110Before(dt);
  if(PUZZLE_CINE110.area!==dg.id){PUZZLE_CINE110.area=dg.id;PUZZLE_CINE110.queue=[];PUZZLE_CINE110.seen.clear();}
  const closed=[];for(const [key,g]of Object.entries(dg.groups||{}))if(!g.open)closed.push(key);
  const r=puzzleUpdate110Before(dt);
  for(const key of closed){const g=dg.groups[key];if(g?.open)queuePuzzleCinema110(dg,g.gates?.[0]||g.sw?.[0],key);}
  if(STATE==='play'&&!P.dead&&!ENEMIES.some(e=>e.alive&&!e.friendly&&!e.trainingDummy&&e.area===AREA&&hyp(e.x-P.x,e.z-P.z)<16)){
   const q=PUZZLE_CINE110.queue.shift();if(q&&q.area===AREA){say('The opened passage',[q.text]);beginStoryCinema110(q.focus,false);}
  }
  return r;
 };
 const cinemaNew110Before=newGame;newGame=function(...args){endCinematic84();PUZZLE_CINE110.area=null;PUZZLE_CINE110.queue=[];PUZZLE_CINE110.seen.clear();return cinemaNew110Before(...args);};
 const cinemaRestore110Before=restoreLivingWorld;restoreLivingWorld=function(...args){endCinematic84();PUZZLE_CINE110.area=null;PUZZLE_CINE110.queue=[];PUZZLE_CINE110.seen.clear();return cinemaRestore110Before(...args);};
 Object.assign(globalThis,{beginStoryCinema110,mainSpeaker110,PUZZLE_CINE110});
})();`;
