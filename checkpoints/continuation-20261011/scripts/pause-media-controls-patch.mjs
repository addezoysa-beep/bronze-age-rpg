export const pauseMediaControlsPatch=String.raw`
/* PAUSE_MEDIA_CONTROLS_166: visible independent music/decorative VFX controls. */
(function(){
 const bounded=(v,fallback)=>typeof v==='number'&&Number.isFinite(v)?Math.max(0,Math.min(1,v)):fallback;
 let prefs={};try{const p=JSON.parse(localStorage.getItem('wds-media166')||'null');if(p&&typeof p==='object'&&!Array.isArray(p))prefs=p;}catch(_){}
 function vfxIntensity166(){return bounded(G.vfxIntensity166,bounded(prefs.vfx,1));}
 function setMedia166(kind,value){const v=Number(value)/100;if(!Number.isFinite(v))return false;const volume=bounded(v,1);if(kind==='music'){G.musicVolume=volume;prefs.music=volume;const now=AU.ctx?.currentTime,active=typeof SCORE22==='undefined'?[]:SCORE22.active;if(Number.isFinite(now))for(const a of active){a.gain.gain.cancelScheduledValues(now);a.gain.gain.setTargetAtTime(volume*(a.theme==='combat'?.25:.19)*(a===active.at(-1)?1:0),now,.10);a.fadeEnd=now;}}
  else if(kind==='vfx'){G.vfxIntensity166=volume;prefs.vfx=volume;}else return false;
  try{localStorage.setItem('wds-media166',JSON.stringify(prefs));}catch(_){}return true;
 }
 function mediaPanel166(){const pause=$('pause'),parent=pause?.querySelector('.bd');if(!parent)return;let panel=$('media-controls166');if(!panel){panel=document.createElement('section');panel.id='media-controls166';panel.innerHTML='<h3>Music and visual effects</h3><label for="music-volume166">Music volume <output id="music-output166"></output></label><input id="music-volume166" type="range" min="0" max="100" step="1" aria-label="Music volume"><label for="vfx-intensity166">Decorative VFX <output id="vfx-output166"></output></label><input id="vfx-intensity166" type="range" min="0" max="100" step="1" aria-label="Decorative visual effects intensity"><p class="muted">VFX adjusts particles, weapon trails and boat foam. Enemy alerts and gameplay objects remain visible. Music volume leaves sound effects unchanged.</p>';parent.appendChild(panel);}
  for(const kind of['music','vfx']){const input=$(kind==='music'?'music-volume166':'vfx-intensity166'),output=$(kind+'-output166');input.value=Math.round((kind==='music'?bounded(G.musicVolume,.65):vfxIntensity166())*100);output.textContent=input.value+'%';input.oninput=()=>{setMedia166(kind,input.value);output.textContent=input.value+'%';input.setAttribute('aria-valuetext',output.textContent);};}
 }
 const pause166Before=openPause;openPause=function(){const r=pause166Before.apply(this,arguments);mediaPanel166();return r;};
 const burst166Before=fxBurst22;fxBurst22=function(x,y,z,kind,count=8){return burst166Before(x,y,z,kind,kind==='alert'?count:Math.ceil(Math.max(0,count)*vfxIntensity166()));};
 const particles166Before=fxTick22;fxTick22=function(){const r=particles166Before.apply(this,arguments),v=vfxIntensity166();if(v<1)for(let i=0;i<FX_MAX22;i++)if(FX_POOL22[i].kind!=='alert')FX_ALPHA22[i]*=v;return r;};
 const trails166Before=trailTick31;trailTick31=function(){const r=trails166Before.apply(this,arguments),v=vfxIntensity166();for(const t of TRAILS31)t.m.material.opacity*=v;return r;};
 function restoreMedia166(){if(typeof prefs.music==='number'&&Number.isFinite(prefs.music))G.musicVolume=bounded(prefs.music,.65);if(typeof prefs.vfx==='number'&&Number.isFinite(prefs.vfx))G.vfxIntensity166=bounded(prefs.vfx,1);}
 const restore166Before=restoreLivingWorld;restoreLivingWorld=function(){const r=restore166Before.apply(this,arguments);restoreMedia166();return r;};const new166Before=newGame;newGame=function(){const r=new166Before.apply(this,arguments);restoreMedia166();return r;};
 Object.assign(globalThis,{setMedia166,vfxIntensity166,mediaPanel166});
})();`;
