export const alashiyaOccupationPatch=String.raw`
/* ALASHIYA_OCCUPATION_168: reserve local watch identities outside the playable world until rescue. */
(function(){
 const waiting='occupation_wait168',reserved=new Set(),origins=new WeakMap();let lastGame=null,lastWon=null;
 const guard168Before=isGuard;
 function localWatch168(n){return !!n&&!n.guild16&&!n.vessel&&(n.barracks20?.region==='alashiya'||((n.area||'over')==='over'||n.area===waiting)&&guard168Before(n)&&nearestIsle(n.home?.x??n.x,n.home?.z??n.z)==='alashiya');}
 function register168(n){if(!localWatch168(n)||reserved.has(n))return;reserved.add(n);const b=n.barracks20,at=(n.area||'over')==='over'?n:b?.door||n.home||n;origins.set(n,{x:at.x,z:at.z,yaw:n.yaw||0});}
 function reconcileOccupation168(){lastGame=G;lastWon=!!F().won;for(const n of NPCS)register168(n);for(const n of reserved){const origin=origins.get(n),excluded=n.dead||n._party||n.hostile,absent=!lastWon&&!excluded;
   if(absent){n.occupationAbsent168=true;n.area=waiting;n.speed29=0;n.nav15=null;n._tactical14=null;n.h.g.visible=false;}
   else if(n.occupationAbsent168||n.area===waiting){n.occupationAbsent168=false;if(n.area===waiting){n.area='over';n.x=origin.x;n.z=origin.z;n.yaw=origin.yaw;n.y=groundY(n.x,n.z);n.sleeping=false;n.h.g.rotation.x=0;OVER.add(n.h.g);n.h.g.position.set(n.x,n.y,n.z);}n.h.g.visible=!n.dead&&(n.area||'over')===AREA;}
  }INT_GRID16.count=-1;
 }
 const npc168Before=addNPC;addNPC=function(){const start=INTS.length,n=npc168Before.apply(this,arguments);register168(n);if(reserved.has(n))for(let i=start;i<INTS.length;i++){const interaction=INTS[i],visible=interaction.vis;interaction.occupationOwner168=n;interaction.vis=()=>!n.occupationAbsent168&&(!visible||visible());}return n;};
 isGuard=function(n){return !n?.occupationAbsent168&&guard168Before(n);};
 const barracks168Before=makeBarracks20;makeBarracks20=function(id){const start=INTS.length,o=barracks168Before.apply(this,arguments);if(id==='alashiya'&&o)for(let i=start;i<INTS.length;i++){const label=INTS[i].label;INTS[i].label=()=>label()+(F().won?'':' · vacant during the occupation');}return o;};
 const pop168Before=populate;populate=async function(){await pop168Before.apply(this,arguments);reconcileOccupation168();};
 const restore168Before=restoreLivingWorld;restoreLivingWorld=function(){const r=restore168Before.apply(this,arguments);reconcileOccupation168();return r;};
 const continue168Before=continueGame;continueGame=function(){const r=continue168Before.apply(this,arguments);reconcileOccupation168();return r;};
 const npcs168Before=updNPCs;updNPCs=function(){if(lastGame!==G||lastWon!==!!F().won)reconcileOccupation168();return npcs168Before.apply(this,arguments);};
 const visual168Before=updVisuals;updVisuals=function(){const r=visual168Before.apply(this,arguments);for(const n of reserved)if(n.occupationAbsent168)n.h.g.visible=false;return r;};
 const ints168Before=currentInts;currentInts=function(){return ints168Before.apply(this,arguments).filter(i=>!i.occupationOwner168?.occupationAbsent168);};
 Object.assign(globalThis,{localWatch168,reconcileOccupation168});
})();`;
