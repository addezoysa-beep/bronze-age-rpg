import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { root, sha256, compileInlineScripts } from './workflow.mjs';
import { applyPanTallyCheckpoint } from './pan-tally-checkpoint.mjs';
import { applyOpeningSlingCheckpoint } from './opening-sling-checkpoint.mjs';
import { applyFastTravelCheckpoint } from './fast-travel-checkpoint.mjs';
import { applyLowGraphicsCheckpoint } from './low-graphics-checkpoint.mjs';
import { applyInteractionCheckpoint } from './interaction-checkpoint.mjs';
import { applyChargeFeintCheckpoint } from './charge-feint-checkpoint.mjs';
import { applyRevenantCheckpoint } from './revenant-checkpoint.mjs';

export const sourceHash = '14e1907fe630e0d8062a29fb9a58087e46888a0c31198f563842cacb0efbe177';
export const candidateHash = 'eaf2fd7e68d62fef7d921e15e67081e204440cf73964034a333c9c650083785a';

const alertRuntime = `
/* Kobaloi callers alert nearby packmates without leaking across obstacles, areas, or factions. */
const KOB_ALERT45={locks:new Map()},KOB_ALERT_RANGE45=34,KOB_ALERT_TTL45=10,KOB_ALERT_COOLDOWN45=14;
function kobAlertLOS45(a,b){if(a.area!==b.area)return false;if(a.area!=='over')return dgLOS(a.x,a.z,b.x,b.z);const d=hyp(a.x-b.x,a.z-b.z),n=Math.ceil(d/1.6),ay=(a.y||0)+(a.h||1.7)*.72,by=(b.y||0)+(b.h||1.7)*.72;for(let k=1;k<n;k++){const t=k/n,x=lerp(a.x,b.x,t),z=lerp(a.z,b.z,t),y=lerp(ay,by,t);if(heightAt(x,z)>y||colBlocked(x,z,.08))return false;}return true;}
function kobAlertEligible45(source,ally){return ally!==source&&ally.kind==='kobalos'&&ally.alive&&!ally.friendly&&!ally.trainingDummy&&ally.area===source.area&&hyp(ally.x-source.x,ally.z-source.z)<=KOB_ALERT_RANGE45&&(ally.suspicion||0)<.7&&!ally.kob26&&!ally.kobYell45&&kobAlertLOS45(source,ally);}
function kobAlertCanCall45(e){return ENEMIES.some(a=>kobAlertEligible45(e,a));}
function kobAlertPack45(e){if(!e.alive||e.friendly)return 0;let count=0;const target={x:P.x,z:P.z};for(const a of ENEMIES){if(!kobAlertEligible45(e,a))continue;a.kobAlert45={until:T_NOW+KOB_ALERT_TTL45,target:{...target},source:mobKey(e)};a.state='chase';a.sleeping=false;a.suspicion=1;a._unseen=0;a._lastSeen={...target};a.kobAlertReady45=Math.max(a.kobAlertReady45||0,T_NOW+KOB_ALERT_COOLDOWN45);count++;}if(count){fxBurst22(e.x,(e.y||0)+(e.h||1.7)*.8,e.z,'alert',12);tone(174.6,.36,'sawtooth',.055,132);tone(261.6,.28,'triangle',.035);toast('A Kobalos yells. The pack is alerted.');}return count;}
function kobAlertActive45(e){const a=e.kobAlert45;if(!a)return false;if(a.until<=T_NOW){e.kobAlert45=null;return false;}e._lastSeen={...a.target};return true;}
const alertKob45Before=kobFight26;kobFight26=function(e,dt,d){const yell=e.kobYell45;if(yell){yell.t+=dt;e.state='wind';e._moving14=0;e.yaw+=clamp(angDiff(Math.atan2(P.x-e.x,P.z-e.z),e.yaw),-dt*3,dt*3);if(yell.t>=.52&&!yell.called){yell.called=true;kobAlertPack45(e);}if(yell.t>=1.05){e.kobYell45=null;e.kobAlertReady45=T_NOW+KOB_ALERT_COOLDOWN45;}return;}const key=e.area||'over',locked=KOB_ALERT45.locks.get(key)||0;if(!e.kobAlert45&&d<22&&T_NOW>=(e.kobAlertReady45||0)&&locked<=T_NOW&&enemySightLine(e)&&kobAlertCanCall45(e)){KOB_ALERT45.locks.set(key,T_NOW+2.5);e.kobYell45={t:0,called:false};e.kobAlertReady45=T_NOW+KOB_ALERT_COOLDOWN45;e.state='wind';return;}return alertKob45Before(e,dt,d);};`;

const replacements = [
  ["function openPause(){if(STATE!=='play')return;STATE='pause';$('pause').classList.add('on')}",
   "function openPause(){if(STATE!=='play')return;STATE='pause';$('pause').classList.add('on');try{document.exitPointerLock?.()}catch(_){}mouse.l=mouse.r=false;for(const k in keys)keys[k]=false}"],
  ["p.style.cssText='max-width:560px;font-size:12px;color:#cab98f;margin:12px auto;line-height:1.6';root.appendChild(p)",
   "p.style.cssText='max-width:560px;font-size:12px;color:#cab98f;margin:12px auto;line-height:1.6';root.querySelector('.win .bd').appendChild(p)"],
  ["return{attack:slot<Math.min(2,Math.ceil(list.length/2)),angle:slot*TAU/list.length,index:slot,size:list.length};",
   "const attackCap=Math.min(10,list.length);return{attack:slot<attackCap,angle:slot*TAU/list.length,index:slot,size:list.length,attackCap};"],
  ["const packKob29Before=kobFight26;kobFight26=function(e,dt,d){if(!packApproach29(e,dt))return packKob29Before(e,dt,d);};",
   "const packKob29Before=kobFight26;kobFight26=function(e,dt,d){if(!packApproach29(e,dt))return packKob29Before(e,dt,d);};" + alertRuntime],
  ["const seen=enemyPerception(e,d,dt);if(!e.kob26&&!seen&&e.state==='idle')return creature26Before(e,dt);",
   "const seen=enemyPerception(e,d,dt),packAlert=kobAlertActive45(e);if(!e.kob26&&!seen&&!packAlert&&e.state==='idle')return creature26Before(e,dt);"],
  ["else if(seen||e._unseen<5||e.dash26){kobFight26(e,dt,d);}",
   "else if(seen||packAlert||e._unseen<5||e.dash26){if(packAlert&&!seen)e._unseen=0;kobFight26(e,dt,d);}"]
];

// These are production source transformations, not browser-test injections.
// Fail closed if the imported source or the reviewed output ever changes.
export function buildOffline(input) {
  if (sha256(input) !== sourceHash) throw new Error('Unexpected offline source hash');
  let html = input.toString('utf8');
  for (const [before, after] of replacements) {
    if (html.split(before).length !== 2) throw new Error('Patch requires exactly one source match');
    html = html.replace(before, after);
  }
  html = applyPanTallyCheckpoint(applyOpeningSlingCheckpoint(applyFastTravelCheckpoint(applyLowGraphicsCheckpoint(applyInteractionCheckpoint(applyChargeFeintCheckpoint(applyRevenantCheckpoint(html)))))));
  const output = Buffer.from(html, 'utf8');
  if (sha256(output) !== candidateHash) throw new Error('Unexpected offline candidate hash');
  compileInlineScripts(html);
  return output;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const source = readFileSync(resolve(root, 'index.html'));
  const output = buildOffline(source);
  const directory = resolve(root, 'dist');
  mkdirSync(directory, { recursive: true });
  writeFileSync(resolve(directory, 'Wine-Dark-Sea-Save-Fix.html'), output);
  writeFileSync(resolve(directory, 'build-manifest.json'), JSON.stringify({
    sourceSha256: sourceHash, buildSha256: candidateHash, bytes: output.length,
    candidateOnly: true,
    changes: [
      'Pause guide contained in panel',
      'Pause releases pointer lock and input state',
      'Kobaloi and wolf packs permit up to ten committed attackers',
      'Kobaloi yell alerts nearby eligible packmates with range, line-of-sight, cooldown, and target expiry rules',
      'Tombs guarantee explicit Grave Revenant archer and swordsman roles with weapon-specific combat contracts',
      'Melee humanoids and hostile NPCs can feint a collision-aware charge, pull back and recover without damage',
      'Low graphics disables dynamic shadow rendering without throttling nearby combat actors',
      'Story callbacks survive palace-art additions; every dialogue releases pointer lock; options 1-9 and numpad supported; long menus scroll'
    ],
    milestoneAcceptance: 'pending'
  }, null, 2) + '\n');
  console.log(JSON.stringify({ sourceSha256: sourceHash, buildSha256: candidateHash, bytes: output.length }));
}


