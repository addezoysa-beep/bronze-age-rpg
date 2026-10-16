export const serviceInteractionGuardPatch=String.raw`
/* SERVICE_INTERACTION_GUARD_181: actual regional service menus revalidate every
   ordinary choice, including nested remedies, patterns and smith commissions. */
(function(){
 let active181=null;
 function serviceReachable181(n){return !!n&&['cloth','heal','arms'].includes(n.service48)&&NPCS.includes(n)&&!P.dead&&P.mode==='foot'&&!n.dead&&!n.hostile&&!n._party&&(n.area||'over')===AREA&&Number.isFinite(n.x+n.z+P.x+P.z)&&hyp(n.x-P.x,n.z-P.z)<=3.4&&['play','talk'].includes(STATE);}
 function invokeService181(n,action){if(!serviceReachable181(n))return toast('Approach the available seller on foot to trade or learn.');if(active181===n)return action();const previous=say,previousActor=active181;active181=n;
  say=function(name,lines,done,choices){const guarded=Array.isArray(choices)?choices.map(choice=>({...choice,go:typeof choice.go==='function'?function(){const args=arguments;return invokeService181(n,()=>choice.go.apply(this,args));}:choice.go})):choices;
   return previous(name,lines,typeof done==='function'?()=>invokeService181(n,done):done,guarded);
  };try{return action();}finally{say=previous;active181=previousActor;}
 }
 function bindServiceGuard181(actors=NPCS){for(const n of actors){if(!['cloth','heal','arms'].includes(n.service48)||typeof n.talk!=='function'||n.talk===n.serviceGuard181?.wrapped)continue;const original=n.talk;const wrapped=function(){const args=arguments;return invokeService181(n,()=>original.apply(this,args));};n.serviceGuard181={original,wrapped};n.talk=wrapped;}}
 const talk181Before=serviceTalk48;serviceTalk48=function(n){return ['cloth','heal','arms'].includes(n?.service48)?invokeService181(n,()=>talk181Before.apply(this,arguments)):talk181Before.apply(this,arguments);};
 const create181Before=createServices48;createServices48=function(s){const r=create181Before.apply(this,arguments);bindServiceGuard181(s.cast||[]);return r;};
 const populate181Before=populate;populate=async function(){await populate181Before();bindServiceGuard181();};
 const restore181Before=restoreLivingWorld;restoreLivingWorld=function(){const r=restore181Before.apply(this,arguments);bindServiceGuard181();return r;};
 Object.assign(globalThis,{serviceReachable181,invokeService181,bindServiceGuard181});
})();`;
