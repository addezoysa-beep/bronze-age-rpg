export const captiveBerthRecoveryPatch=String.raw`
/* CAPTIVE_BERTH_RECOVERY_219 / CAPTIVE_MOORING_CONTROLS_220 / CAPTIVE_EXACT_BERTH_221.
   Short, swept boat realignment only. Never re-anchor or relocate children,
   create a rescue boat, forgive ownership, complete a quest or auto-save. */
(function(){
 let job=null,stopped=null;const fields=['name','x','z','bx','bz','yaw'];
 function dock219(q){if(!q||!['boarding','alighting','returning'].includes(q.phase))return null;
  const saved=q.phase==='returning'?q.return203?.dock:q.phase==='alighting'?q.landing199?.dock:SEA_FORT99.dock;
  const d=DOCKS.find(d=>saved&&fields.every(k=>d[k]===saved[k]));
  if(!d||!fields.slice(1).every(k=>Number.isFinite(d[k]))||hyp(q.anchor.x-d.bx,q.anchor.z-d.bz)>.5||Math.abs(angDiff(q.anchor.yaw,d.yaw))>.05)return null;
  if(q.phase==='returning'&&!captiveReturn203()||q.phase==='alighting'&&!captiveLanding199())return null;return d;
 }
 function valid219(q,d){return !!d&&dock219(q)===d&&STATE==='play'&&AREA==='over'&&!P.dead&&P.mode==='foot'&&P.grounded!==false&&C179.boat196.live()&&!C179.boat196.danger()&&!STREAM.building&&!RACE21&&hyp(P.x-d.x,P.z-d.z)<8&&Number.isFinite(BOAT.x+BOAT.z+BOAT.yaw+BOAT.sp)&&Math.abs(BOAT.sp)<=.02&&hyp(BOAT.x-q.anchor.x,BOAT.z-q.anchor.z)<=6&&Math.abs(angDiff(BOAT.yaw,q.anchor.yaw))<=.35;}
 function anchor219(q){return JSON.stringify([q.anchor.x,q.anchor.z,q.anchor.yaw]);}
 function atAnchor221(q){return hyp(BOAT.x-q.anchor.x,BOAT.z-q.anchor.z)<1e-8&&Math.abs(angDiff(BOAT.yaw,q.anchor.yaw))<1e-8;}
 function needed221(q,d=dock219(q)){return !!d&&(!C179.boat196.fixed(q)||q.phase==='alighting'&&(hyp(BOAT.x-d.bx,BOAT.z-d.bz)>=.35||Math.abs(angDiff(BOAT.yaw,d.yaw))>=.04));}
 function cancel219(expected=job){if(!job||job!==expected)return false;job=null;return true;}
 function stop219(j,message){cancel219(j);stopped={game:G,q:j.q,message};toast(message);return false;}
 function begin219(){const q=captiveBoat196(),d=dock219(q);if(job||!q||!valid219(q,d)||!needed221(q,d)||boatBlockedAt(BOAT.x,BOAT.z,BOAT.yaw))return toast('Stand ashore beside the original dock with the owned, seaworthy boat within six paces of its saved berth, nearly aligned, and clear of danger.'),false;
  stopped=null;stopBoatCall172();job={game:G,q,people:q.people,revision:q.revision,phase:q.phase,anchor:anchor219(q),dock:d,dockValues:fields.map(k=>d[k]),ship:BOAT.ship,x:BOAT.x,z:BOAT.z,yaw:BOAT.yaw,elapsed:0};BOAT.sp=0;C179.boat196.clear();hudQuest();toast('The boat eases back beneath the saved ramp. The children wait; stay ashore beside the dock.');return true;
 }
 function current219(j){return G===j.game&&captiveBoat196()===j.q&&j.q.people===j.people&&j.q.revision===j.revision&&j.q.phase===j.phase&&anchor219(j.q)===j.anchor&&dock219(j.q)===j.dock&&fields.every((k,i)=>j.dock[k]===j.dockValues[i])&&BOAT.ship===j.ship&&Math.abs(BOAT.x-j.x)<.00001&&Math.abs(BOAT.z-j.z)<.00001&&Math.abs(angDiff(BOAT.yaw,j.yaw))<.00001;}
 function tick219(dt){const j=job;if(!j)return false;
  if(!current219(j)){cancel219(j);return false;}
  if(STATE==='pause'||STATE==='talk')return true;
  if(!valid219(j.q,j.dock))return stop219(j,'Mooring stopped. Return ashore to the original dock when the boat and route are safe.');
  const seconds=Math.min(.05,Math.max(0,Number.isFinite(dt)?dt:0));if(!seconds)return true;j.elapsed+=seconds;
  if(j.elapsed>30)return stop219(j,'Mooring stopped. Check the berth before trying again.');
  const a=j.q.anchor,dx=a.x-BOAT.x,dz=a.z-BOAT.z,distance=hyp(dx,dz),move=Math.min(distance,seconds*.6),turn=angDiff(a.yaw,BOAT.yaw),rotation=Math.max(-seconds*.15,Math.min(seconds*.15,turn)),x=BOAT.x+(distance?dx/distance*move:0),z=BOAT.z+(distance?dz/distance*move:0),yaw=BOAT.yaw+rotation;
  // <=.03m / .0075rad per tick, with finer intermediate collision samples.
  const samples=Math.max(1,Math.ceil(move/.01),Math.ceil(Math.abs(rotation)/.002));
  for(let i=0;i<=samples;i++){const u=i/samples,X=BOAT.x+(x-BOAT.x)*u,Z=BOAT.z+(z-BOAT.z)*u,Y=BOAT.yaw+rotation*u;if(!inBounds(X,Z)||boatBlockedAt(X,Z,Y))return stop219(j,'The boat holds off: an obstruction blocks the saved berth.');}
  BOAT.x=j.x=x;BOAT.z=j.z=z;BOAT.yaw=j.yaw=yaw;BOAT.sp=0;
  const g=BOAT.ship.g;g.position.x=x;g.position.z=z;g.rotation.y=yaw;g.updateMatrixWorld(true);
  if(atAnchor221(j.q)){cancel219(j);toast('The boat is secured beneath the saved ramp. The crossing can resume.');hudQuest();}return true;
 }
 function directions219(q){if(!q||!G.work?.boatOwned||(G.seafaring21?.hull27??100)<=0)return null;const d=dock219(q);return job?'The boat is easing back beneath the saved ramp; stay ashore at '+job.dock.name+'.':needed221(q,d)?stopped?.game===G&&stopped.q===q?stopped.message:'Stand ashore at '+d.name+' and secure the nearby boat beneath its saved ramp. Only short realignment is available; distant or sunken boats still need separate recovery.':null;}
 C179.moor219={directions:directions219};const prior=C179.passage194;C179.passage194={...prior,tick(dt){const active=job;tick219(dt);if(active){C179.boat196.clear();if(G===active.game&&captiveBoat196()===active.q)for(let i=0;i<2;i++){const n=C179.children[i];if(n&&NPCS.includes(n)&&!n.dead){C179.boat196.pose(n,active.q.people[i],0,0);n.h.g.rotation.set(0,n.yaw||0,0);}}return true;}return prior.tick(dt);},where(){return directions219(captiveBoat196())||prior.where();}};
 const intsBefore=currentInts;currentInts=function(){const native=intsBefore.apply(this,arguments),q=captiveBoat196(),d=dock219(q);if(!q||!d||STATE!=='play'||AREA!=='over'||P.mode!=='foot'||!C179.boat196.live()||hyp(P.x-d.x,P.z-d.z)>=8)return native;const list=native.slice();
  if(job){const expected=job;list.unshift({x:P.x,z:P.z,r:8,label:()=>'Stop securing the saved ramp',act:()=>current219(expected)&&valid219(q,d)&&cancel219(expected)});}
  else if(needed221(q,d)){const game=G,rev=q.revision,anchor=anchor219(q),ship=BOAT.ship,people=q.people;list.unshift({x:P.x,z:P.z,r:8,label:()=>'Secure the boat beneath the saved ramp',act:()=>G===game&&captiveBoat196()===q&&q.revision===rev&&anchor219(q)===anchor&&BOAT.ship===ship&&q.people===people&&begin219()});}return list;
 };
 const hudBefore=hudQuest;hudQuest=function(){const r=hudBefore.apply(this,arguments),text=directions219(captiveBoat196()),el=$('quest');if(el&&text)el.textContent=el.textContent.replace(/ · Optional passage:.*$/,'')+' · Optional passage: '+text;return r;};
 const restoreBefore=restoreLivingWorld;restoreLivingWorld=function(){cancel219();stopped=null;return restoreBefore.apply(this,arguments);};const newBefore=newGame;newGame=function(){cancel219();stopped=null;return newBefore.apply(this,arguments);};
 Object.assign(globalThis,{beginCaptiveMooring219:begin219,tickCaptiveMooring219:tick219,cancelCaptiveMooring219:cancel219,captiveMooring219:()=>job});
})();`;
