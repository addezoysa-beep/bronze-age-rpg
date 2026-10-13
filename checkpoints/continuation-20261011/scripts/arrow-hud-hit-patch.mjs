export const arrowHudHitPatch=String.raw`
/* CONTINUATION_ARROW_HUD_HIT_V1: ammunition selection never consumes inventory.
 * Projectile damage must not inherit a melee height gate or duck/parry context. */
function arrowChoices114(){const stock=ammo30();return Object.keys(stock).filter(m=>Number.isFinite(stock[m])&&stock[m]>0);}
function cycleArrow114(step){if(STATE!=='play'||P.dead||P.draw>0||ARCHERY27.phase==='release')return false;const choices=arrowChoices114();if(choices.length<2)return false;const index=Math.max(0,choices.indexOf(G.arrowMaterial30)),next=choices[(index+(step<0?-1:1)+choices.length)%choices.length];selectArrow30(next);hudSilver();return true;}
let ARROW_HUD114=null,ARROW_HUD_TEXT114='';
function updateArrowHud114(){
 const anchor=$('arrowN');if(!anchor)return;
 if(!ARROW_HUD114){const host=anchor.parentElement;host.textContent='';host.style.pointerEvents='auto';ARROW_HUD114=document.createElement('span');
 const prev=document.createElement('button'),label=document.createElement('span'),next=document.createElement('button');prev.textContent='‹';next.textContent='›';prev.type=next.type='button';prev.setAttribute('aria-label','Previous arrow type');next.setAttribute('aria-label','Next arrow type');label.id='arrowN';
 prev.onclick=e=>{e.stopPropagation();cycleArrow114(-1);};next.onclick=e=>{e.stopPropagation();cycleArrow114(1);};for(const b of[prev,next]){b.style.cssText='padding:0 6px;margin:0 4px;min-width:24px;font-size:17px';b.onpointerdown=e=>e.stopPropagation();}ARROW_HUD114.append(prev,label,next);host.appendChild(ARROW_HUD114);host.title='[ / ] or Alt + mouse wheel: select arrows. Scroll here with the pointer unlocked.';
 host.addEventListener('wheel',e=>{if(!e.deltaY)return;e.preventDefault();e.stopImmediatePropagation();cycleArrow114(e.deltaY);},{passive:false});
 }
 const stock=ammo30(),mat=G.arrowMaterial30||'wood',text=G.arrows>0?itemLabel('arrow_'+mat)+' ×'+(stock[mat]||0)+' · '+G.arrows+' total':'Arrows ×0';if(text!==ARROW_HUD_TEXT114){$('arrowN').textContent=text;ARROW_HUD_TEXT114=text;}
}
const arrowHudSilver114Before=hudSilver;hudSilver=function(){arrowHudSilver114Before();ARROW_HUD_TEXT114='';updateArrowHud114();};
const arrowHudTick114Before=updHud;updHud=function(dt){arrowHudTick114Before(dt);updateArrowHud114();};
addEventListener('keydown',e=>{if((e.code==='BracketLeft'||e.code==='BracketRight')&&!e.repeat&&STATE==='play'&&!/INPUT|TEXTAREA|SELECT/.test(e.target?.tagName||'')){e.preventDefault();e.stopImmediatePropagation();cycleArrow114(e.code==='BracketLeft'?-1:1);}},{capture:true});
addEventListener('wheel',e=>{if(e.altKey&&STATE==='play'&&e.deltaY){e.preventDefault();e.stopImmediatePropagation();cycleArrow114(e.deltaY);}},{capture:true,passive:false});
const arrowHit114Before=arrowImpact27;arrowImpact27=function(p,hit){
 if(p.done27)return;const skill=REV29.hitSkill,melee=P.melee,target=hit.c?.type==='enemy'?hit.c.a:null,hp=target?.hp;
 REV29.hitSkill=null;P.melee=null;
 try{const result=arrowHit114Before(p,hit);if(p.from==='p'&&target&&target.hp===hp&&target.d.sh)toast('Arrow blocked by shield');return result;}
 finally{REV29.hitSkill=skill;P.melee=melee;}
};
`;
