export const trapTelltalesPatch=String.raw`
/* TRAP_TELLTALES_256: physical bronze catches precede native spike pulse.
   Damage, cadence, saved phase, enemy count, collision and rewards unchanged. */
(function(){
 const phase=s=>((T_NOW/2.4+s.ph)%1+1)%1;
 function installTrapTelltales256(dg){if(!dg||DGS[dg.id]!==dg||dg.telltales256||!Array.isArray(dg.spikes)||!dg.spikes.length)return false;
  const cues=[];for(const sp of dg.spikes){const b=new Batch();for(const x of[-1.55,1.55])for(const z of[-1.55,1.55])b.box(x,.08,z,.16,.16,.16,K.bronze);const mesh=b.mesh();mesh.position.set(sp.x,-.15,sp.z);dg.group.add(mesh);cues.push({sp,mesh,lastCycle:null});}
  dg.telltales256={cues,nextSound:0};return true;
 }
 function tickTrapTelltales256(dg){const q=dg?.telltales256;if(!q||DG!==dg||AREA!==dg.id||STATE!=='play'||P.dead||!Number.isFinite(T_NOW))return false;let click=false;
  for(const cue of q.cues){const t=phase(cue.sp),warning=t>=.74,near=(P.x-cue.sp.x)**2+(P.z-cue.sp.z)**2<22*22,cycle=Math.floor(T_NOW/2.4+cue.sp.ph);
   cue.mesh.visible=near;cue.mesh.position.y=warning?.04+.16*((t-.74)/.26):t<.34?.2:-.15;
   if(near&&warning&&cue.lastCycle!==cycle){cue.lastCycle=cycle;click=true;}
  }
  if(click&&T_NOW>=q.nextSound){q.nextSound=T_NOW+.3;sfx('click');}return true;
 }
 const buildBefore=buildDungeon;buildDungeon=function(id){const r=buildBefore.apply(this,arguments);installTrapTelltales256(DGS[id]);return r;};
 const updateBefore=dgUpdate;dgUpdate=function(){const r=updateBefore.apply(this,arguments);tickTrapTelltales256(DG);return r;};
 for(const dg of Object.values(DGS))installTrapTelltales256(dg);
 Object.assign(globalThis,{installTrapTelltales256,tickTrapTelltales256});
})();
`;
