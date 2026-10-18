export const checkpointRestoreSafetyPatch=String.raw`
/* CHECKPOINT_COLLECTIONS_250: restore optional old arrays and unique actors without
   assigning one ambiguous legacy name to several current people. Disk unchanged. */
(function(){
 const plain=q=>q&&typeof q==='object'&&!Array.isArray(q),finite=n=>typeof n==='number'&&Number.isFinite(n);
 const pose=q=>plain(q)&&finite(q.x)&&finite(q.z),modes=new Set(['foot','boat','horse','swim','ferry']);
 let report250=null;
 function refuse250(reason){report250={status:'refused',reason};throw new SaveReadFailure150(reason+' The manual save was not deleted.');}
 function normalizeCheckpoint250(q){
  if(!plain(q)||!['x','y','z','yaw'].every(k=>finite(q[k]))||typeof q.area!=='string'||!modes.has(q.mode))return refuse250('The saved checkpoint position is incomplete.');
  if(q.area!=='over'&&!DUN[q.area])return refuse250('The saved room is not available in this build.');
  const counts={matched:0,skipped:0},saved=Array.isArray(q.npcs)?q.npcs:[],byName=new Map(),current=new Map();
  for(const a of saved)if(plain(a)&&typeof a.name==='string'){const list=byName.get(a.name)||[];list.push(a);byName.set(a.name,list);}
  for(const n of NPCS)current.set(n.name,(current.get(n.name)||0)+1);
  const unchangedRoster=saved.length===NPCS.length&&saved.every((a,i)=>plain(a)&&a.name===NPCS[i]?.name);
  const npcs=NPCS.map((n,i)=>{
   const records=byName.get(n.name)||[],a=current.get(n.name)===1&&records.length===1?records[0]:saved[i];
   // Duplicate legacy names keep only their original ordinal match. Do not
   // guess which displaced merchant owns inventory, health or a paid order.
   if(!plain(a)||a.name!==n.name||!pose(a)||!finite(a.yaw)||(a.hp!=null&&!finite(a.hp))||typeof a.dead!=='boolean'||typeof a.hostile!=='boolean'||typeof a.area!=='string'){counts.skipped++;return {};}
   if(records.length>1&&current.get(n.name)===1){counts.skipped++;return {};}
   if(current.get(n.name)>1&&!unchangedRoster){counts.skipped++;return {};}
   const next={...a};if(a.inventory!==null&&!plain(a.inventory))delete next.inventory;
   else if(a.inventory)next.inventory=Object.fromEntries(Object.entries(a.inventory).filter(([,v])=>Number.isSafeInteger(v)&&v>=0));
   counts.matched++;return next;
  });
  const sheep=(Array.isArray(q.sheep)?q.sheep:[]).map(a=>plain(a)&&pose(a)&&finite(a.hp)&&typeof a.dead==='boolean'?{x:a.x,z:a.z,hp:a.hp,dead:a.dead}:{});
  const enemies=(Array.isArray(q.enemies)?q.enemies:[]).filter(a=>plain(a)&&typeof a.key==='string'&&pose(a)&&finite(a.hp)&&a.hp>=0);
  const camera=plain(q.camera)?Object.fromEntries(Object.entries(q.camera).filter(([k,v])=>k==='first'?typeof v==='boolean':['yaw','pitch','dist'].includes(k)&&finite(v)&&(k!=='dist'||v>0))):null;
  report250={status:'prepared',...counts,missingCollections:['npcs','sheep','enemies'].filter(k=>!Array.isArray(q[k]))};
  return {...q,npcs,sheep,enemies,camera,oxygen:finite(q.oxygen)?Math.max(0,Math.min(10,q.oxygen)):10};
 }
 const before=continueGame;continueGame=function(){
  const game=G,original=G.checkpoint21;if(original==null)return before.apply(this,arguments);
  // Binding must see the original ordinal snapshot before unique-name reorder.
  if(typeof bindServiceSaveIdentity222==='function')bindServiceSaveIdentity222();
  const prepared=normalizeCheckpoint250(original);G.checkpoint21=prepared;
  try{return before.apply(this,arguments);}finally{if(G===game&&G.checkpoint21===prepared)G.checkpoint21=original;}
 };
 Object.assign(globalThis,{normalizeCheckpoint250,checkpointRestoreReport250:()=>report250});
})();
`;

export const manualCheckpointFeedbackPatch=String.raw`
/* MANUAL_CHECKPOINT_FEEDBACK_251: same Save/F5 paths, truthful persistent result.
   No automatic voyage write, forced click or UI acceptance claim. */
(function(){
 let result251=null;
 function message251(text,ok=false){result251={game:G,slot:SAVE_SLOT,text,ok};const status=$('manual-save-status251');if(status){status.textContent=text;status.dataset.saved=ok?'true':'false';}return ok;}
 function manualSaveStatus251(){const root=$('pause'),body=root?.querySelector('.bd');if(!body)return;
  let status=$('manual-save-status251');if(!status){status=document.createElement('p');status.id='manual-save-status251';status.className='muted';status.setAttribute('role','status');status.setAttribute('aria-live','polite');body.appendChild(status);}
  const button=$('psave');if(button){const ids=new Set((button.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean));ids.add(status.id);button.setAttribute('aria-describedby',[...ids].join(' '));}
  status.textContent=result251?.game===G&&result251.slot===SAVE_SLOT?result251.text:'Choose Save to write this voyage. Gameplay events do not replace your manual checkpoint.';
 }
 function ready251(){
  if(!Number.isInteger(SAVE_SLOT)||SAVE_SLOT<1||SAVE_SLOT>SAVE_SLOTS)return 'Choose a valid voyage slot before saving.';
  if(BEGINNING21||!G.started||P.dead||['title','loading','dead'].includes(STATE))return 'Save is unavailable until this voyage is active and the player is alive.';
  if(STREAM.building)return 'Terrain is still loading. Keep this voyage open and try Save when loading finishes.';
  if(!['x','y','z','yaw'].every(k=>Number.isFinite(P[k]))||!['foot','boat','horse','swim','ferry'].includes(P.mode)||typeof AREA!=='string'||(AREA!=='over'&&!DUN[AREA]))return 'The current position is invalid. Your manual checkpoint was not replaced.';
  return '';
 }
 const before=save;save=function(manual=false){
  if(manual!==true)return before.apply(this,arguments);
  const reason=ready251();if(reason){message251(reason);toast(reason);return false;}
  const game=G,slot=SAVE_SLOT,position={area:AREA,x:P.x,y:P.y,z:P.z,yaw:P.yaw,mode:P.mode},ok=before.apply(this,arguments);
  if(ok!==true)return message251('Save failed. Keep this voyage open and check that storage is available.');
  try{const stored=JSON.parse(localStorage.getItem(slotKey(slot))),q=stored?.checkpoint21;
   if(G!==game||SAVE_SLOT!==slot||!q||Object.keys(position).some(k=>q[k]!==position[k]))throw Error('Checkpoint readback differs');
  }catch(_){const text='Save could not be confirmed by reading it back. Keep this voyage open; do not reload yet.';message251(text);toast(text);return false;}
  return message251('Voyage '+slot+' saved manually at the current position. Reload this manual checkpoint to return here.',true);
 };
 const pauseBefore=openPause;openPause=function(){const r=pauseBefore.apply(this,arguments);if(STATE==='pause')manualSaveStatus251();return r;};
 Object.assign(globalThis,{manualSaveStatus251});
})();
`;
