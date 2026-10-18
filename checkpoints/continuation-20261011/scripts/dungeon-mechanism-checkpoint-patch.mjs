export const dungeonMechanismCheckpointPatch=String.raw`
/* DUNGEON_MECHANISM_CHECKPOINT_252 / DUNGEON_TRAP_PHASE_253:
   Only resume the explicitly saved current room, not a new puzzle completion.
   Ordinary entry retains native reset behavior. Rewards/keys/deaths untouched. */
(function(){
 const finite=n=>typeof n==='number'&&Number.isFinite(n),plain=q=>q&&typeof q==='object'&&!Array.isArray(q);
 const arrays=['crates','targets','levers','braziers','spikes','doors'];
 const phase=t=>((t%1)+1)%1;
 function usable252(dg){return dg&&DGS[dg.id]===dg&&plain(dg.def)&&arrays.every(k=>Array.isArray(dg[k])&&dg[k].length<=512)&&finite(dg.ox)&&finite(dg.oz)&&Number.isInteger(dg.W)&&Number.isInteger(dg.H)&&dg.grid?.length===dg.W*dg.H&&Object.values(dg.groups||{}).every(g=>g&&Array.isArray(g.gates)&&g.gates.length<=512);}
 function shape252(dg){return JSON.stringify([dg.id,dg.ox,dg.oz,dg.W,dg.H,...arrays.map(k=>dg[k].map(o=>k==='crates'?[o.x0,o.z0]:[o.x,o.z])),Object.entries(dg.groups||{}).map(([k,g])=>[k,g.gates.map(o=>[o.x,o.z])]),dg.def.seq||null]);}
 function captureDungeon252(dg){if(!usable252(dg)||!finite(T_NOW))return null;
  return {version:1,area:dg.id,shape:shape252(dg),crates:dg.crates.map(c=>({x:c.x,z:c.z})),targets:dg.targets.map(t=>!!t.hit),levers:dg.levers.map(l=>!!l.on),braziers:dg.braziers.map(b=>!!b.lit),spikes:dg.spikes.map(s=>({phase:phase(T_NOW/2.4+s.ph),y:s.m.position.y})),gates:Object.fromEntries(Object.entries(dg.groups||{}).map(([k,g])=>[k,g.gates.map(t=>({y:t.m.position.y,solid:!!t.solid}))])),doors:dg.doors.map(d=>({y:d.m.position.y,solid:!!d.solid}))};
 }
 function crateClear252(dg,c,index,positions){if(!plain(c)||!finite(c.x)||!finite(c.z))return false;
  for(const [dx,dz]of [[-.95,-.95],[.95,-.95],[-.95,.95],[.95,.95]]){const x=Math.floor((c.x+dx-dg.ox)/TS),z=Math.floor((c.z+dz-dg.oz)/TS);if(x<0||z<0||x>=dg.W||z>=dg.H||dg.grid[z*dg.W+x]!==0)return false;}
  const st=gstate(dg.id),closed=o=>o.g?!st.open?.[o.g]:Number.isInteger(o.idx)?!st.doors?.[o.idx]:o.solid;
  if((dg.solids||[]).some(o=>closed(o)&&Math.abs(c.x-o.x)<2.9&&Math.abs(c.z-o.z)<2.9))return false;
  return !positions.some((o,i)=>i!==index&&Math.abs(c.x-o.x)<2&&Math.abs(c.z-o.z)<2);
 }
 function restoreDungeon252(dg,q){if(!usable252(dg)||DG!==dg||AREA!==dg.id||!plain(q)||q.version!==1||q.area!==dg.id||q.shape!==shape252(dg))return false;
  if(!arrays.every(k=>Array.isArray(q[k])&&q[k].length===dg[k].length)||!q.crates.every(c=>plain(c)&&finite(c.x)&&finite(c.z))||!q.crates.every((c,i)=>crateClear252(dg,c,i,q.crates)))return false;
  if(!['targets','levers','braziers'].every(k=>q[k].every(v=>typeof v==='boolean'))||!q.spikes.every(s=>plain(s)&&finite(s.phase)&&s.phase>=0&&s.phase<1&&finite(s.y)&&s.y>=-1.401&&s.y<=.001))return false;
  // All mutable geometry is checked before any object is changed.
  if(!plain(q.gates)||!Object.entries(dg.groups||{}).every(([k,g])=>Array.isArray(q.gates[k])&&q.gates[k].length===g.gates.length&&q.gates[k].every(t=>plain(t)&&finite(t.y)&&t.y>=-7.001&&t.y<=.001&&typeof t.solid==='boolean'))||!q.doors.every(t=>plain(t)&&finite(t.y)&&t.y>=-6.001&&t.y<=.001&&typeof t.solid==='boolean'))return false;
  dg.crates.forEach((c,i)=>{c.x=q.crates[i].x;c.z=q.crates[i].z;c.m.position.set(c.x,0,c.z);});
  dg.targets.forEach((t,i)=>{t.hit=q.targets[i];t.off.visible=!t.hit;t.onm.visible=t.hit;});
  dg.levers.forEach((l,i)=>{l.on=q.levers[i];l.h.rotation.x=l.on?.7:-.7;});
  // Native sequence progress is the authority, not independently saved flames.
  const st=gstate(dg.id),seq=dg.def.seq;
  dg.braziers.forEach((b,i)=>{b.lit=!!(seq&&Number.isInteger(st.seq)&&seq.slice(0,st.seq).includes(b.n)&&q.braziers[i]);b.fire.visible=b.lit;});
  if(seq&&dg.seqSw)dg.seqSw.on=st.seq>=seq.length;
  for(const[k,g]of Object.entries(dg.groups||{})){g.open=!!st.open?.[k];g.gates.forEach((t,i)=>{t.open=g.open;t.m.position.y=g.open?q.gates[k][i].y:0;t.solid=g.open?q.gates[k][i].solid:true;});}
  dg.doors.forEach((d,i)=>{d.open=!!st.doors?.[d.idx];d.m.position.y=d.open?q.doors[i].y:0;d.solid=d.open?q.doors[i].solid:true;});
  dg.spikes.forEach((s,i)=>{s.ph=q.spikes[i].phase-T_NOW/2.4;s.m.position.y=q.spikes[i].y;});return true;
 }
 const snapshotBefore=snapshot;snapshot=function(){const r=snapshotBefore.apply(this,arguments);G.world||={};G.world.dungeonMechanism252=AREA!=='over'&&DG?captureDungeon252(DG):null;return r;};
 const continueBefore=continueGame;continueGame=function(){const r=continueBefore.apply(this,arguments),q=G.world?.dungeonMechanism252;if(G.checkpoint21?.area===AREA&&AREA!=='over'&&DG)restoreDungeon252(DG,q);return r;};
 Object.assign(globalThis,{captureDungeon252,restoreDungeon252});
})();
`;
