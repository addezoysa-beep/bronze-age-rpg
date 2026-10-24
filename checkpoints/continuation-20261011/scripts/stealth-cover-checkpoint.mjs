import { compileInlineScripts } from './workflow.mjs';

export const stealthCoverPatch281 = String.raw`
/* STEALTH_COVER_281: hide only in actual enemy-tent shadow or a clear dungeon recess. */
(function(){
 const tentCoverSites281=new Map();
 function registerTentSite281(x,z){
  if(!Number.isFinite(x+z)||typeof heightAt!=='function'||heightAt(x,z)<1)return null;
  const key=Math.round(x*10)+':'+Math.round(z*10);if(tentCoverSites281.has(key))return tentCoverSites281.get(key);
  const q={x,z,r:2.35,kind:'tent281'};tentCoverSites281.set(key,q);COVER_PATCHES.push(q);return q;
 }
 function caveAlcoveCover281(){
  if(!P.crouch||AREA==='over'||!DG||DG!==DGS[AREA]||!['cave','mine','dungeon'].includes(atmosphereKind108(DG)))return 0;
  const step=typeof TS==='number'&&TS>0?TS:4,oz=DG.oz||0,x=Math.floor((P.x-DG.ox)/step),z=Math.floor((P.z-oz)/step);
  if(x<0||z<0||x>=DG.W||z>=DG.H||DG.grid[z*DG.W+x]!==0)return 0;
  const cx=DG.ox+(x+.5)*step,cz=oz+(z+.5)*step;
  if(hyp(P.x-cx,P.z-cz)>1.45)return 0;
  const open=([dx,dz])=>{const a=x+dx,b=z+dz;return a>=0&&b>=0&&a<DG.W&&b<DG.H&&DG.grid[b*DG.W+a]===0;};
  const exits=[[1,0],[0,1],[-1,0],[0,-1]].filter(open).length;
  if(exits!==1)return 0;
  if((DG.chests||[]).some(q=>hyp(cx-q.x,cz-q.z)<3)||(DG.spawns||[]).some(q=>hyp(cx-q.x,cz-q.z)<3)||(DG.ints||[]).some(q=>Number.isFinite(q.x+q.z)&&hyp(cx-q.x,cz-q.z)<2.4))return 0;
  if(DG.start&&hyp(cx-DG.start.x,cz-DG.start.z)<5||DG.bossPos&&hyp(cx-DG.bossPos.x,cz-DG.bossPos.z)<5)return 0;
  return 1;
 }
 const stealth281Before=stealthCover;
 stealthCover=function(){return stealth281Before.apply(this,arguments)||caveAlcoveCover281();};
 if(typeof campTent==='function'){
  const tent281Before=campTent;
  campTent=function(b,x,z,yaw,color){const r=tent281Before.apply(this,arguments);
   registerTentSite281(x,z);
   return r;
  };
 }
 if(typeof populate==='function'){
  const populate281Before=populate;
  populate=async function(){const r=await populate281Before.apply(this,arguments),camp=globalThis.RIVAL_CAMP98;
   if(camp?.status==='ready'&&Number.isFinite(camp.x+camp.z))for(const [dx,dz]of[[-8,-5],[7,4],[-7,7]])registerTentSite281(camp.x+dx,camp.z+dz);
   return r;
  };
 }
 Object.assign(globalThis,{tentCoverSites281,caveAlcoveCover281,registerTentSite281});
})();
`;

export function applyStealthCoverCheckpoint281(input){
 const html=Buffer.isBuffer(input)?input.toString('utf8'):String(input);
 const marker='STEALTH_COVER_281: hide only in actual enemy-tent shadow or a clear dungeon recess.';
 if(html.includes(marker))throw new Error('Stealth cover checkpoint already applied');
 const matches=[...html.matchAll(/<script(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi)];
 if(matches.length!==3)throw new Error('Expected exactly three embedded inline scripts');
 const last=matches.at(-1),insert=last.index+last[0].lastIndexOf('</script>');
 const output=html.slice(0,insert)+'\n'+stealthCoverPatch281+'\n'+html.slice(insert);
 compileInlineScripts(output);
 return Buffer.from(output,'utf8');
}
