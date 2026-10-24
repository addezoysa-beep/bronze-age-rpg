export const ariadneStory274=String.raw`
/* ARIADNE_STORY_TRANSACTION_274: use the existing actual story dialogue guard. */
(function(){
 function bindAriadne274(){for(const n of NPCS){if(n.name!=='Ariadne, Keeper of the Thread'||typeof n.talk!=='function'||n.ariadneGuard274===n.talk)continue;
  const before=n.talk,wrapped=function(){const args=arguments;return invokeStory189(n,()=>{
   const beforeSay274=say;say=function(name,lines,done,choices){let ownLines274;
    const finish274=typeof done==='function'?()=>{if(STATE!=='play'||DLG.lines!==ownLines274||DLG.done!==null||DLG.i!==DLG.lines.length-1||DLG.choices)return false;return done();}:done;
    const result=beforeSay274(name,lines,finish274,choices);ownLines274=DLG.lines;return result;
   };try{return before.apply(this,args);}finally{say=beforeSay274;}
  });};n.talk=wrapped;n.ariadneGuard274=wrapped;
 }}
 const beforePopulate274=populate;populate=async function(){const r=await beforePopulate274.apply(this,arguments);bindAriadne274();return r;};
 const beforeRestore274=restoreLivingWorld;restoreLivingWorld=function(){const r=beforeRestore274.apply(this,arguments);bindAriadne274();return r;};
 bindAriadne274();Object.assign(globalThis,{bindAriadne274});
})();
`;
export function repairAriadneStory(source){for(const a of["name:'Ariadne, Keeper of the Thread'",'invokeStory189:invoke189'])if(!source.includes(a))throw Error('Missing actual Ariadne/story guard anchor: '+a);const at=source.lastIndexOf('</script>');if(at<0)throw Error('Missing game script boundary');return source.slice(0,at)+ariadneStory274+source.slice(at);}
