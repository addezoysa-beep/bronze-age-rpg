export const feedbackMenuStablePatch=String.raw`
/* Remove the old virtual stable seller, retain real keeper-owned services,
   and expose one automatic graphics policy rather than duplicate controls. */
(function(){
 const ghostLabel111=t=>/^Buy a trained horse or saddle/.test(t||'')||t==='Horse · Owned · Stable and riding gear';
 function pruneGhostStable111(){for(let i=INTS.length-1;i>=0;i--){const q=INTS[i],t=typeof q.label==='function'?q.label():q.label;if(ghostLabel111(t))INTS.splice(i,1);}INT_GRID16.count=-1;}
 const keeperBuy111Before=stableBuy20;stableBuy20=function(n,s){if(!n||!NPCS.includes(n)||n.dead||(n.area||'over')!==AREA||hyp(P.x-n.x,P.z-n.z)>5)return toast('Speak to the keeper at the stable yard.');return keeperBuy111Before(n,s);};
 const keeperInts111Before=currentInts;currentInts=function(){return keeperInts111Before().filter(q=>!ghostLabel111(typeof q.label==='function'?q.label():q.label));};
 const keeperPopulate111Before=populate;populate=async function(...args){const r=await keeperPopulate111Before(...args);pruneGhostStable111();return r;};pruneGhostStable111();
 graphicsMenu28=function(){};
 for(const id of ['pq1','pq2','pq3']){const e=$(id);if(e){e.hidden=true;e.style.display='none';const label=e.parentElement?.querySelector('.muted');if(label)label.hidden=true;}}
 for(const e of document.querySelectorAll('[data-graphics-row28]'))e.remove();
 // Preserve the player's saved quality; new installs default to Adaptive.
 let savedGraphics111='auto';try{const v=localStorage.getItem('wine-dark-graphics28');if(['auto','verylow','low','medium','high'].includes(v))savedGraphics111=v;}catch(_){}
 if(GRAPHICS28.preset!==savedGraphics111)applyGraphics28(savedGraphics111,false);
 document.title='Wine-Dark Sea · Combined Cinematic Checkpoint · 2026-10-13';
 const title=$('title');if(title&&!$('build-identity111')){const note=document.createElement('p');note.id='build-identity111';note.textContent='Combined cinematic + animated sling checkpoint · 13 October 2026';note.style.cssText='color:#cbb791;font-size:12px;text-align:center';(title.querySelector('.bd')||title).appendChild(note);}
 Object.assign(globalThis,{pruneGhostStable111});
})();`;
