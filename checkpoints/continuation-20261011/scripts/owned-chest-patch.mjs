export const ownedChestPatch=String.raw`
/* CONTINUATION_OWNED_CHEST_V1
   Craftable player storage uses the existing two-way chest transfer UI. Its
   position and contents live in G.world and therefore follow ordinary manual saves. */
(function(){
 const OWNED_CHESTS106=new Map(),OWNED_CHEST_LIMIT106=16;
 LABEL48.owned_chest106='Cedar storage chest';WEIGHT.owned_chest106=7;
 RECIPES.owned_chest106={n:'Cedar storage chest · placeable owned storage',need:{wood:10,fiber:2,bronze:1},make:()=>G.inv.owned_chest106=(G.inv.owned_chest106||0)+1};
 function ownedChestState106(){
  G.world||={};let a=Array.isArray(G.world.ownedChests106)?G.world.ownedChests106:[];
  const seen=new Set();
  a=a.filter(q=>{if(!q||typeof q.id!=='string'||!q.id||!Number.isFinite(q.x)||!Number.isFinite(q.z)||seen.has(q.id))return false;seen.add(q.id);return true;}).slice(0,OWNED_CHEST_LIMIT106).map(q=>{q.items=Object.fromEntries(Object.entries(q.items&&typeof q.items==='object'?q.items:{}).filter(([,n])=>Number.isFinite(n)&&Math.floor(n)>0).map(([k,n])=>[k,Math.floor(n)]));return q;});
  G.world.ownedChests106=a;G.world.ownedChestSerial106=Math.max(0,Math.floor(Number(G.world.ownedChestSerial106)||0),...a.map(q=>/^ownedChest106:\d+$/.test(q.id)?Number(q.id.split(':')[1]):0));return a;
 }
 function openOwnedChest106(q){
  if(!q||!ownedChestState106().includes(q)||hyp(P.x-q.x,P.z-q.z)>3.2||AREA!=='over')return false;
  showLoot('Your cedar storage chest',{...q.items},(k,n)=>{if(!ownedChestState106().includes(q)||!Number.isInteger(n)||n<1||(q.items[k]||0)<n)return false;q.items[k]-=n;if(!q.items[k])delete q.items[k];lootEquipment({[k]:n});hudAll();return true;});
  if(LOOT_CONTEXT){LOOT_CONTEXT.storage52=q;renderLoot();}return true;
 }
 function chestCollider106(runtime,remove=false){
  const c=runtime.collider;if(c){for(const key of runtime.cells){const list=CG.get(key);if(!list)continue;const i=list.indexOf(c);if(i>=0)list.splice(i,1);if(!list.length)CG.delete(key);}runtime.collider=null;runtime.cells=[];}
  if(remove)return;
  const q=runtime.q,collider={x:q.x,z:q.z,hw:.72,hd:.48};runtime.collider=collider;runtime.cells=[];
  for(let x=floor((q.x-.72-2.5)/CSZ);x<=floor((q.x+.72+2.5)/CSZ);x++)for(let z=floor((q.z-.48-2.5)/CSZ);z<=floor((q.z+.48+2.5)/CSZ);z++)runtime.cells.push(ckey(x,z));
  cadd(collider,q.x-.72-2.5,q.x+.72+2.5,q.z-.48-2.5,q.z+.48+2.5);
 }
 function removeOwnedChest106(runtime){
  chestCollider106(runtime,true);if(runtime.m.g.parent)runtime.m.g.parent.remove(runtime.m.g);runtime.m.g.traverse?.(o=>{if(o.isMesh)o.geometry?.dispose();});
  const i=INTS.indexOf(runtime.interaction);if(i>=0)INTS.splice(i,1);
  if(LOOT_CONTEXT?.storage52===runtime.q&&typeof closeLoot==='function')closeLoot();
  OWNED_CHESTS106.delete(runtime.q.id);INT_GRID16.count=-1;
 }
 function buildOwnedChest106(q){
  const old=OWNED_CHESTS106.get(q.id);if(old){if(LOOT_CONTEXT?.storage52===old.q&&old.q!==q&&typeof closeLoot==='function')closeLoot();const moved=old.q.x!==q.x||old.q.z!==q.z;old.q=q;if(moved){old.m.g.position.set(q.x,groundY(q.x,q.z),q.z);old.interaction.x=q.x;old.interaction.z=q.z;chestCollider106(old);INT_GRID16.count=-1;}if(old.m.g.parent!==OVER)OVER.add(old.m.g);return old;}
  const m=makeChestMesh(K.woodD);m.g.position.set(q.x,groundY(q.x,q.z),q.z);m.g.userData.ownedChest106=q.id;OVER.add(m.g);
  const runtime={q,m,cells:[],collider:null,interaction:null};const interaction={x:q.x,z:q.z,r:2.8,label:()=> 'Open your cedar storage chest',act:()=>openOwnedChest106(runtime.q)};runtime.interaction=interaction;INTS.push(interaction);chestCollider106(runtime);OWNED_CHESTS106.set(q.id,runtime);return runtime;
 }
 function syncOwnedChests106(){const records=ownedChestState106(),ids=new Set(records.map(q=>q.id));for(const runtime of OWNED_CHESTS106.values())if(!ids.has(runtime.q.id))removeOwnedChest106(runtime);for(const q of records)buildOwnedChest106(q);return OWNED_CHESTS106.size;}
 function placeOwnedChest106(){
  if(!['play','bag'].includes(STATE)||P.dead||AREA!=='over'||P.mode!=='foot')return toast('Place the chest outdoors while standing on foot.'),false;
  if(!(G.inv.owned_chest106>0))return toast('Craft a cedar storage chest first.'),false;
  const x=P.x+sin(P.yaw)*2.3,z=P.z+cos(P.yaw)*2.3,p=landPoint15(x,z,1.1);
  if(!p||heightAt(p.x,p.z)<2||colBlocked(p.x,p.z,1.05)||ownedChestState106().some(q=>hyp(q.x-p.x,q.z-p.z)<3.2))return toast('Find clear, level ground with room to open the lid.'),false;
  if(G.world.ownedChests106.length>=OWNED_CHEST_LIMIT106)return toast('You cannot maintain any more storage chests.'),false;
  if(!removePlayerItem('owned_chest106',1))return false;
  const q={id:'ownedChest106:'+(++G.world.ownedChestSerial106),x:p.x,z:p.z,items:{}};G.world.ownedChests106.push(q);buildOwnedChest106(q);hudAll();if(STATE==='bag')closeBag();toast('Cedar storage chest placed · use the pause menu to save its position and contents.');return true;
 }
 const chestRender106Before=renderLoot;renderLoot=function(){if(LOOT_CONTEXT?.storage52?.id?.startsWith('ownedChest106:'))LOOT_CONTEXT.items={...LOOT_CONTEXT.storage52.items};return chestRender106Before();};
 const chestBag106Before=renderBag;renderBag=function(){chestBag106Before();if(BAG_TAB!=='materials')return;for(const row of $('bagbody')?.querySelectorAll('[data-select="owned_chest106"]')||[]){const actions=row.querySelector('.item-actions');if(actions&&!actions.querySelector('[data-place106]')){const b=document.createElement('button');b.dataset.place106='1';b.textContent='Place';b.onclick=()=>placeOwnedChest106();actions.prepend(b);}}};
 const chestPopulate106Before=populate;populate=async function(){await chestPopulate106Before();syncOwnedChests106();INT_GRID16.count=-1;};
 const chestRestore106Before=restoreLivingWorld;restoreLivingWorld=function(){const r=chestRestore106Before();syncOwnedChests106();return r;};
 const chestNew106Before=newGame;newGame=function(...args){const r=chestNew106Before(...args);syncOwnedChests106();return r;};
 Object.assign(globalThis,{OWNED_CHESTS106,ownedChestState106,openOwnedChest106,buildOwnedChest106,syncOwnedChests106,placeOwnedChest106});
})();`;
