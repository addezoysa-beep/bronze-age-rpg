import { applyRegionalWellsCheckpoint } from './regional-wells-checkpoint.mjs';
import { applyWildHerdsGrassCheckpoint } from './wild-herds-grass-checkpoint.mjs';
import { applyRidingChallengesCheckpoint } from './riding-challenges-checkpoint.mjs';
import { applyHorseMotionImpactCheckpoint } from './horse-motion-impact-checkpoint.mjs';
import { applyStableCallRegistryCheckpoint } from './stable-call-registry-checkpoint.mjs';
import { applyRegionalStableCoverageCheckpoint } from './regional-stable-coverage-checkpoint.mjs';
import { applyMountedRulerToursCheckpoint } from './mounted-ruler-tours-checkpoint.mjs';
import { applyMountOwnershipCheckpoint } from './mount-ownership-checkpoint.mjs';
import { applyRegionalMountServicesCheckpoint } from './regional-mount-services-checkpoint.mjs';
import { applyHipposTamingTheftCheckpoint } from './hippos-taming-theft-checkpoint.mjs';
import { applyTargetChestCheckpoint } from './target-chest-checkpoint.mjs';
import { applyGroundContactCheckpoint } from './ground-contact-checkpoint.mjs';
import { applyCombatLockCheckpoint } from './combat-lock-checkpoint.mjs';
import { applyDodgeGroundingCheckpoint } from './dodge-grounding-checkpoint.mjs';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { root, sha256, compileInlineScripts } from './workflow.mjs';
import { applyFastTravelCheckpoint } from './fast-travel-checkpoint.mjs';
import { applyLowGraphicsCheckpoint } from './low-graphics-checkpoint.mjs';
import { applyInteractionCheckpoint } from './interaction-checkpoint.mjs';
import { applyChargeFeintCheckpoint } from './charge-feint-checkpoint.mjs';
import { applyRevenantCheckpoint } from './revenant-checkpoint.mjs';
import { applyWorkplaceCheckpoint } from './workplace-checkpoint.mjs';
import { applySharedFieldActionsCheckpoint } from './shared-field-actions-checkpoint.mjs';
import { applySharedShepherdActionsCheckpoint } from './shared-shepherd-actions-checkpoint.mjs';
import { applySharedSmithActionsCheckpoint } from './shared-smith-actions-checkpoint.mjs';
import { applySharedQuarryActionsCheckpoint } from './shared-quarry-actions-checkpoint.mjs';
import { applySharedRiverCargoActionsCheckpoint } from './shared-river-cargo-actions-checkpoint.mjs';
import { applySharedIrrigationActionsCheckpoint } from './shared-irrigation-actions-checkpoint.mjs';
import { applySharedPloughActionsCheckpoint } from './shared-plough-actions-checkpoint.mjs';
import { applyLawWarningCheckpoint } from './law-warning-checkpoint.mjs';
import { applyGreatswordSmithCheckpoint } from './greatsword-smith-checkpoint.mjs';
import { applyPhocasOpeningCheckpoint } from './phocas-opening-checkpoint.mjs';

export const sourceHash = '14e1907fe630e0d8062a29fb9a58087e46888a0c31198f563842cacb0efbe177';
export const candidateHash = '9679f64b643199e6c00a3620a46b0fcae5947abd1b8f1c9f4d10f68d09e0827f';

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
  html = applyFastTravelCheckpoint(applyLowGraphicsCheckpoint(applyInteractionCheckpoint(applyChargeFeintCheckpoint(applyRevenantCheckpoint(html)))));
  html = applySharedPloughActionsCheckpoint(applySharedIrrigationActionsCheckpoint(applySharedRiverCargoActionsCheckpoint(applySharedQuarryActionsCheckpoint(applySharedSmithActionsCheckpoint(applySharedShepherdActionsCheckpoint(applySharedFieldActionsCheckpoint(applyWorkplaceCheckpoint(applyDodgeGroundingCheckpoint(applyCombatLockCheckpoint(applyGroundContactCheckpoint(html)))))))))));
  html = applyLawWarningCheckpoint(applyPhocasOpeningCheckpoint(html));
  html = applyTargetChestCheckpoint(applyGreatswordSmithCheckpoint(html));
  html = applyHipposTamingTheftCheckpoint(applyRegionalMountServicesCheckpoint(applyMountOwnershipCheckpoint(html)));
  html = applyWildHerdsGrassCheckpoint(applyMountedRulerToursCheckpoint(applyRegionalStableCoverageCheckpoint(applyStableCallRegistryCheckpoint(applyHorseMotionImpactCheckpoint(applyRidingChallengesCheckpoint(applyRegionalWellsCheckpoint(html)))))));
  const output = Buffer.from(html, 'utf8');
  if (sha256(output) !== candidateHash) throw new Error('Unexpected offline candidate hash '+sha256(output)+' bytes '+output.length);
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
      'Five bounded wild-horse herds traverse grounded grazing circuits across the Northern Steppe and suitable Greek uplands, with persistent identities and existing taming/registration',
      'Actual grass-blade patches mark grazing grounds and use whole-patch Low/Very Low distance budgets without collision or desert blanket placement',
      'Seventeen named major settlement hubs reuse nearby stable services or add a safely grounded local stable without duplicating stock',
      'Royal households ride grounded twice-weekly three-hour circuits with two real palace escorts, persistent recall state and urgent quest-audience fallback',
      'Horse charges use speed, forward direction, swept contact, bounded damage and per-target cooldowns; civilian impacts enter the law path',
      'Horse gait separates stance and airborne swing phases across walk, trot and gallop with articulated knees, hocks and hooves',
      'Wild horses can be tamed and ridden bareback, then registered once at a stable for a conserved fee and riding quilt',
      'Stable menus retain multiple owned horses and chariots, select one persistent responder for the shared H call, and migrate old single-horse saves',
      'Regional water coverage audits existing well approach paths and adds only missing safely grounded region wells',
      'Five candidate regional mounted riding circuits use ordered gates and an actual moving NPC opponent, with once-per-day prizes and save-safe results',
      'Hippos is earned through ordered grooming, trough, leading and pasture work; existing owners migrate complete',
      'Wild horse taming visibly rears and kicks; eligible horse/chariot ride interactions offer theft with law consequences and quest safeguards',
      'Northern Steppe horse master sells a power-five courser and three bounded horsemanship lessons',
      'Owned horse/saddle menus prevent repeat purchases; owned chariots board directly, selected owned team uses H and serializes position/ridden identity',
      'Northern Steppe wagon has paid Ur/Egypt routes with refund/reentrancy guards; Avaris has explicit horse and chariot services',
      'Current lock/nearest engaged enemy health bar replaces stale boss priority; abandoned bosses clear by area, range and engagement',
      'Giant chest blocks while guardian lives; outdoor chests safely bypass Egyptian dungeon-only puzzle checks',
      'Discovered landmark fast travel works during rain and storms while retaining safe landing and departure checks',
      'Regional arms craftsmen have direct greatsword commissions, next-day save-safe collection and targeted recipe lessons; major cities offer iron at level eight',
      'Phocas opening conversation bypasses supply/spar wrappers, gives and equips a physical sling once with stones, preserves lesson progress and explains timed guard',
      'Civilian first-hit warnings and repeated-assault escalation; guard demand offers voluntary jail, single full fine or resistance, replacing automatic payment/arrest',
      'Conflict-free configurable combat lock, cycling and target eligibility/release',
      'Configurable Alt/Caps Lock roll with landing buffer, action/stamina gates, swept NPC evasion and active humanoid floor contact',
      'Ikaria civilian workers use unique reserved field, market, dock, loom, dye-vat, craft-bench and smithy stations instead of random back-and-forth work points',
      'Player and field NPCs share four grounded grain actions: reap, bind, thresh and winnow, with household tools and once-per-day conserved rewards',
      'Player and Lykos share call, drive, feed and gate actions using his counted flock, real grazing route and pen, with one save-safe daily wage',
      'Regional arms smiths and the player share bellows, heat, hammer and quench actions across real furnace, anvil and trough stations, with staged progress and one daily assistant wage',
      'Upper Egypt quarry crews and the player share strike, wedge, lever and paired rope-haul actions across an expanded cut-stone apron and moving sled, with supplied tools, explicit quit/failure rules and one daily wage',
      'Nile cargo crews and the player share carry, load, dockside tow and pole actions at real landings; persistent grain and stone barges follow direction-specific, save-safe river routes with bounded Low-preset visibility',
      'A Mesopotamian canal household and the player share channel inspection, silt clearing, feeder hoeing and bounded diversion-gate work at a real Euphrates field, with ordered save-safe stages and one daily wage',
      'A separate Ur field household and the player share yoke and drill preparation, draft-plough guidance, seed metering and furrow levelling with a modeled ox team, supplied tools and one daily conserved wage',
      'Current-pose floor contact excludes hidden/equipped weapon subtrees',
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


