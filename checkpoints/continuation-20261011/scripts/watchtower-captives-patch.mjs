export const watchtowerCaptivesPatch=String.raw`
/* WATCHTOWER_CAPTIVES_179: two real optional captives; release, grounded escape
   to the causeway, then household recognition. Never sets main-story flags. */
(function(){
 const C179={built:false,children:[],gate:null};
 function captiveState179(){G.world||={};let q=G.world.watchtowerCaptives179;if(!q||typeof q!=='object'||Array.isArray(q))q=G.world.watchtowerCaptives179={};q.known=!!q.known;q.released=!!q.released;q.rewarded=!!q.rewarded;if(!Array.isArray(q.positions))q.positions=[];return q;}
 function kinName179(){return FAMILIES48.find(f=>f.id==='family48_ikaria_0')?.name||'our kin on Ikaria';}
 function cleared179(){return SEA_FORT99.status==='ready'&&seaFortState99().cleared&&!SEA_FORT99.enemies.some(e=>e.alive);}
 function usable179(n){return STATE==='play'&&!P.dead&&P.mode==='foot'&&AREA==='over'&&n&&!n.dead&&NPCS.includes(n)&&(n.area||'over')==='over'&&hyp(n.x-P.x,n.z-P.z)<4;}
 function landing179(i){return{x:SEA_FORT99.x+(i?.8:-.8),z:SEA_FORT99.z+17};}
 function arrived179(){const q=captiveState179();return q.released&&C179.children.length===2&&C179.children.every((n,i)=>q.positions[i]?.route===3&&hyp(n.x-landing179(i).x,n.z-landing179(i).z)<1);}
 function releaseCaptives179(n){if(!usable179(n)||!C179.children.includes(n)||!cleared179())return false;const q=captiveState179();if(q.released)return false;q.known=q.released=true;C179.gate.visible=false;hudQuest();toast('The pen is open. Follow the children through the south gate to the causeway.');return true;}
 function captiveTalk179(n){if(!usable179(n))return;const q=captiveState179();q.known=true;
  if(!cleared179())return say(n.name,['We are from Ikaria. The raiders locked us behind these rails. Please do not open the pen while their guards still hold the court.']);
  if(q.released)return say(n.name,[arrived179()?'We can breathe again. Tell '+kinName179()+' on Ikaria that Thaleia and Mikon are safe at the Watchtower causeway. We will wait here for passage.':'Stay close while we reach the open causeway. We will not run through a wall or leave you in the fighting.']);
  say(n.name,['The guards have fallen. Unbar the pen and let us get out of this court.'],null,[{t:'Unbar the pen and release the children',go:()=>releaseCaptives179(n)},{t:'Wait here a moment',go:()=>closeDlg()}]);
 }
 function syncCaptives179(){if(!C179.built)return;const q=captiveState179(),f=SEA_FORT99;
  C179.gate.visible=!q.released;
  for(const[i,n]of C179.children.entries()){const p=q.positions[i],valid=p&&Number.isFinite(p.x)&&Number.isFinite(p.z)&&Math.abs(p.x-f.x)<=12&&p.z>=f.z+4&&p.z<=f.z+19&&Number.isInteger(p.route)&&p.route>=0&&p.route<=3;
   n.x=valid?p.x:f.x+5+i*2;n.z=valid?p.z:f.z+6;n.area='over';n.dead=false;n.hostile=false;n._party=false;n.protected48=true;n.mortal=false;n.maxHp=n.hp=9999;n.home=n.work=n.social={x:n.x,z:n.z};q.positions[i]={x:n.x,z:n.z,route:q.released&&valid?p.route:0};n.h.g.position.set(n.x,groundY(n.x,n.z),n.z);
  }
 }
 function installCaptives179(){if(C179.built||SEA_FORT99.status!=='ready')return false;const f=SEA_FORT99,x=f.x+6,z=f.z+6.5,y=groundY(x,z),b=ibatch('i7');
  // A real holding pen, front gap and removable barred gate beside the court.
  for(const [cx,cz,w,d]of[[x,z-2.5,6,.16],[x-3,z,.16,5],[x+3,z,.16,5],[x-2,z+2.5,2,.16],[x+2,z+2.5,2,.16]]){b.box(cx,y+.75,cz,w,1.5,d,K.woodD);addRectRot(cx,cz,w,d,0);}
  const gb=new Batch();for(let i=-2;i<=2;i++)gb.box(x+i*.4,y+.75,z+2.5,.1,1.5,.12,K.woodD);gb.box(x,y+.35,z+2.5,2,.12,.14,K.wood);gb.box(x,y+1.2,z+2.5,2,.12,.14,K.wood);C179.gate=gb.mesh(ACTOR_MAT);OVER.add(C179.gate);
  for(const[i,name]of['Thaleia · Watchtower captive','Mikon · Watchtower captive'].entries()){const n=addNPC({name,x:f.x+5+i*2,z:f.z+6,area:'over',noInt:true,role:'social',age:'child',gender:i?'male':'female',culture:'aegean',look:{tunic:K.linen,kilt:K.woodD},talk:captiveTalk179});n.captive179=true;C179.children.push(n);INTS.push({x:()=>n.x,z:()=>n.z,r:3,vis:()=>AREA==='over'&&!n.dead,label:()=> 'Speak to '+n.name.split(' · ')[0],act:()=>captiveTalk179(n)});}
  C179.built=true;syncCaptives179();INT_GRID16.count=-1;return true;
 }
 const collision179Before=colBlocked;colBlocked=function(x,z,r){const f=SEA_FORT99;if(AREA==='over'&&C179.built&&!captiveState179().released&&Math.abs(x-(f.x+6))<1+(r||0)&&Math.abs(z-(f.z+9))<.12+(r||0))return true;return collision179Before.apply(this,arguments);};
 function captiveTick179(dt){if(!C179.built||STATE!=='play'||AREA!=='over'||P.dead)return;const q=captiveState179(),f=SEA_FORT99;
  for(const[i,n]of C179.children.entries()){let moving=false;const p=q.positions[i];if(q.released&&cleared179()&&p.route<3&&hyp(P.x-n.x,P.z-n.z)<100){const route=[{x:f.x+6,z:f.z+10},{x:f.x,z:f.z+10},landing179(i)],t=route[p.route];if(hyp(n.x-t.x,n.z-t.z)<.3)p.route++;else moving=groundRouteStep(n,t.x,t.z,1.8,Math.min(.05,Math.max(0,dt)),.28);}
   p.x=n.x;p.z=n.z;n.home=n.work=n.social={x:n.x,z:n.z};n.action=q.released?(p.route===3?'waiting for safe passage':'walking to the open causeway'):'waiting behind the barred pen';n.h.g.visible=hyp(P.x-n.x,P.z-n.z)<180;n.h.g.position.set(n.x,groundY(n.x,n.z),n.z);n.h.g.rotation.y=n.yaw||0;poseHuman13(n.h,{w:'fists',speed:moving?1.8:0,dt});
  }
 }
 // Native ecology/schedules cannot move locked captives through their pen.
 const npcs179Before=updNPCs;updNPCs=function(dt){const list=C179.children;for(const n of list){n.area='captive179';n.h.g.visible=false;}let r;try{r=npcs179Before(dt);}finally{for(const n of list)n.area='over';}captiveTick179(dt);return r;};
 function guardian179(n){return n?.family48?.id==='family48_ikaria_0'&&n.age!=='child'&&n.familyRole48<2&&!n.hostile&&!n._party;}
 function rescueReward179(n){const q=captiveState179();if(!usable179(n)||!guardian179(n)||!arrived179()||!cleared179()||q.rewarded)return false;q.rewarded=true;G.inv.bread=(G.inv.bread||0)+4;G.inv.bandage=(G.inv.bandage||0)+2;addXp(60);hudAll();hudQuest();say(n.name,['Word has reached us: Thaleia and Mikon are safe on the open Watchtower causeway, waiting for passage. You broke their pen and stayed until they were clear of the court.','Take food and clean dressings for your own journey. Erigone’s trail still needs you.']);return true;}
 function guardianTalk179(n){if(!usable179(n)||!guardian179(n))return;const q=captiveState179();if(q.rewarded)return say(n.name,['We will remember the shepherd who opened the Watchtower pen. Thaleia and Mikon are waiting safely for passage.']);
  if(arrived179())return say(n.name,['Is it true? The children reached the open causeway?'],null,[{t:'They are safe outside the cleared fort',go:()=>rescueReward179(n)},{t:'I must go',go:()=>closeDlg()}]);
  say(n.name,['Two of our kin, Thaleia and Mikon, were carried to Watchtower Isle. A sailor saw them held in a timber pen beside the command court.','If you can clear that fort, unbar their pen and stay until they reach its southern causeway. Do not risk them while the guards remain.'],null,[{t:'I will look for them',go:()=>{if(!usable179(n)||!guardian179(n))return;q.known=true;hudQuest();}},{t:'Not now',go:()=>closeDlg()}]);
 }
 const household179Before=householdTalk48;householdTalk48=function(n){if(!guardian179(n)||!F().king)return household179Before(n);const prev=say;say=function(name,lines,done,choices){return prev(name,lines,done,choices?[...choices,{t:'Ask about the children held on Watchtower Isle',go:()=>guardianTalk179(n)}]:choices);};try{return household179Before(n);}finally{say=prev;}};
 function bindGuardians179(){for(const n of NPCS)if(guardian179(n)&&n.talk===household179Before)n.talk=householdTalk48;}
 const populate179Before=populate;populate=async function(){await populate179Before();installCaptives179();bindGuardians179();};
 const restore179Before=restoreLivingWorld;restoreLivingWorld=function(){const r=restore179Before.apply(this,arguments);syncCaptives179();bindGuardians179();return r;};
 const new179Before=newGame;newGame=function(){const r=new179Before.apply(this,arguments);syncCaptives179();return r;};
 const journal179Before=hudQuest;hudQuest=function(){const r=journal179Before(),q=G.world?.watchtowerCaptives179;if(q?.known&&!q.rewarded){const el=$('quest');if(el)el.textContent+=' · Optional: '+(arrived179()?'bring news to '+kinName179():q.released?'follow Thaleia and Mikon to the causeway':'free Thaleia and Mikon at Watchtower Isle');}return r;};
 Object.assign(globalThis,{C179,captiveState179,installCaptives179,syncCaptives179,captiveTick179,releaseCaptives179,captiveTalk179,arrived179,guardianTalk179,rescueReward179});
})();`;
