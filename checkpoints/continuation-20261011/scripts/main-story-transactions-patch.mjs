export const mainStoryTransactionsPatch=String.raw`
/* MAIN_STORY_TRANSACTIONS_193: guard the royal report, inventor briefing and
   Delphi revelation without replacing the composed NPC service dialogue. */
(function(){
 const king193Before=kingTalk;kingTalk=function(n){const args=arguments;return invokeStory189(n,()=>king193Before.apply(this,args));};
 const inventor193Before=daedalusTalk;daedalusTalk=function(n){const args=arguments;return invokeStory189(n,()=>inventor193Before.apply(this,args));};
 const oracle193Before=oracleTalk;oracleTalk=function(n){const args=arguments;return invokeStory189(n,()=>oracle193Before.apply(this,args));};
 function bindMainStory193(){for(const n of NPCS){if(!/^King Ikarios(?:$|,| ·)|^Daedalus(?: the Inventor)?$|^Pythia, Oracle of Delphi$/.test(n.name)||typeof n.talk!=='function'||n.storyGuard193?.wrapped===n.talk)continue;const original=n.talk,wrapped=function(){const args=arguments;return invokeStory189(n,()=>original.apply(this,args));};n.storyGuard193={original,wrapped};n.talk=wrapped;}}
 const populate193Before=populate;populate=async function(){const r=await populate193Before.apply(this,arguments);bindMainStory193();return r;};
 const restore193Before=restoreLivingWorld;restoreLivingWorld=function(){const r=restore193Before.apply(this,arguments);bindMainStory193();return r;};
 bindMainStory193();Object.assign(globalThis,{bindMainStory193});
})();`;
