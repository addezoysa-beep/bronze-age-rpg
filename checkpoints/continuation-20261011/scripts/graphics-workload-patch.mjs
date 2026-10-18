export const graphicsWorkloadPatch=String.raw`
/* GRAPHICS_WORKLOAD_173: accessible device quality and real slow-frame adaptation. */
(function(){
 let manual=null,sum=0,frames=0,fast=0,lastState=null;
 const tier=v=>v<25?'verylow':v<50?'low':v<80?'medium':'high';
 const scale=v=>.35+.9*v/100;
 const native173=applyGraphics28;
 function save173(){try{localStorage.setItem('wds-graphics173',JSON.stringify(manual===null?{mode:'auto'}:{mode:'manual',quality:manual}));}catch(_){} }
 function graphicsValue173(){return manual===null?Math.max(0,Math.min(100,Math.round((RSCALE-.35)/.9*100))):manual;}
 function syncGraphics173(){for(const panel of document.querySelectorAll('[data-graphics173]')){const input=panel.querySelector('input'),out=panel.querySelector('output');input.value=graphicsValue173();out.textContent=(manual===null?'Adaptive · ':'')+Math.round(RSCALE*100)+'% render resolution';input.setAttribute('aria-valuetext',out.textContent);panel.querySelector('button').setAttribute('aria-pressed',String(manual===null));}}
 function setGraphicsQuality173(value,persist=true){const n=Number(value);if(value===null||value===''||!Number.isFinite(n))return false;manual=Math.max(0,Math.min(100,Math.round(n)));const preset=tier(manual);if(GRAPHICS28.preset!==preset)native173(preset,persist);QUALITY23.mode='manual';QUALITY23.fast=QUALITY23.slow=0;RSCALE=scale(manual);resize();if(persist)save173();syncGraphics173();return true;}
 function autoGraphics173(persist=true){manual=null;native173('auto',persist);QUALITY23.mode='auto';QUALITY23.fast=QUALITY23.slow=0;sum=frames=fast=0;lastState=null;if(persist)save173();syncGraphics173();}
 applyGraphics28=function(preset,persist=true){manual=null;sum=frames=fast=0;lastState=null;const r=native173.apply(this,arguments);if(persist)try{localStorage.removeItem('wds-graphics173');}catch(_){}syncGraphics173();return r;};
 // Existing frame() already passes the real RAF interval, separately from its
 // bounded simulation dt. Do not discard the very slow frames needing relief.
 perf=function(dt){if(document.hidden||!['play','title'].includes(STATE)||!Number.isFinite(dt)||dt<=0||dt>5){sum=frames=fast=0;lastState=null;return;}if(lastState!==STATE){lastState=STATE;sum=frames=0;return;}sum+=dt;frames++;if(sum<2)return;const ms=sum/frames*1000;sum=frames=0;QUALITY23.ms=ms;if(manual!==null||QUALITY23.mode!=='auto')return;fast=ms<17.2?fast+1:0;let next=RSCALE;if(ms>28){next=Math.max(.35,RSCALE-.125);fast=0;}else if(fast>=4){next=Math.min(QUALITY23.ceiling,RSCALE+.05);fast=0;}if(next!==RSCALE){const preset=next<=.575?'verylow':next<=.8?'low':next<=1.06?'medium':'high';if(GRAPHICS28.preset!==preset)native173(preset,false);QUALITY23.mode='auto';RSCALE=next;resize();syncGraphics173();}};
 function graphicsPanel173(root){if(!root||root.querySelector('[data-graphics173]'))return;const panel=document.createElement('section');panel.dataset.graphics173='1';panel.innerHTML='<h3>Graphics workload</h3><label>Graphics quality <input type="range" min="0" max="100" step="1" aria-label="Graphics quality — lower for faster rendering"><output></output></label><button type="button">Adaptive graphics</button><p class="muted">Lower quality reduces render resolution, shadows and water detail. Start at the far left on a very slow computer. Combat, enemies and essential gameplay objects remain active. Lower resolution cannot fix every CPU bottleneck. Settings apply to this device.</p>';root.appendChild(panel);const input=panel.querySelector('input');input.oninput=()=>setGraphicsQuality173(input.value);panel.querySelector('button').onclick=()=>autoGraphics173();syncGraphics173();}
 const pause173Before=openPause;openPause=function(){const r=pause173Before.apply(this,arguments);graphicsPanel173($('media-controls166')||$('pause')?.querySelector('.bd'));return r;};
 let saved=null;try{saved=JSON.parse(localStorage.getItem('wds-graphics173')||'null');}catch(_){}if(saved?.mode==='manual'&&typeof saved.quality==='number'&&Number.isFinite(saved.quality))setGraphicsQuality173(saved.quality,false);else if(saved?.mode==='auto')autoGraphics173(false);
 graphicsPanel173($('title')?.querySelector('.bd')||$('title'));
 Object.assign(globalThis,{setGraphicsQuality173,autoGraphics173,graphicsPanel173,graphicsValue173});
})();`;
