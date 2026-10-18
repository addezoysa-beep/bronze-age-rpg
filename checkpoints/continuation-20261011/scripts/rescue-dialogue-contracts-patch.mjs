export const rescueDialogueContractsPatch=String.raw`
/* STORY_TRANSACTIONS_189 / PROTEUS_PHYSICAL_CHART_190 / ERIGONE_RESCUE_191.
   Keep native chapter rewards/cinematics. Completion never proves a voyage home. */
(function(){
 let active189=null,dialogue189=null;
 const princess191=new Map(),CHART190='proteus_chart190';
 LABEL48[CHART190]='Proteus’ annotated sea chart';WEIGHT[CHART190]=.15;
 function storyReach189(n){return !!n&&NPCS.includes(n)&&!n.dead&&!n.hostile&&!n._party&&!P.dead&&P.mode==='foot'&&P.grounded!==false&&(n.area||'over')===AREA&&Number.isFinite(n.x+n.z+P.x+P.z)&&hyp(n.x-P.x,n.z-P.z)<=4&&['play','talk'].includes(STATE);}
 function stamp189(){return{game:G,flags:F(),values:JSON.stringify(F()),pan:G.world?.panReturn117,panValues:JSON.stringify(G.world?.panReturn117),rescue:G.world?.rescuePlan164,rescueValues:JSON.stringify(G.world?.rescuePlan164)};}
 function current189(s){return G===s.game&&F()===s.flags&&JSON.stringify(F())===s.values&&G.world?.panReturn117===s.pan&&JSON.stringify(G.world?.panReturn117)===s.panValues&&G.world?.rescuePlan164===s.rescue&&JSON.stringify(G.world?.rescuePlan164)===s.rescueValues;}
 function invoke189(n,action,s){if(!storyReach189(n)||s&&!current189(s))return toast('This conversation has changed. Speak to the available traveller again.'),false;if(active189===n)return action();const oldSay=say,oldActive=active189;active189=n;
  say=function(name,lines,done,choices){const stamp=stamp189();const list=choices?.map(c=>({...c,go:typeof c.go==='function'?function(){const args=arguments;return invoke189(n,()=>c.go.apply(this,args),stamp);}:c.go}));let used=false;return oldSay(name,lines,typeof done==='function'?()=>{if(used)return false;const result=invoke189(n,done,stamp);if(result!==false)used=true;return result;}:done,list);};
  try{return action();}finally{say=oldSay;active189=oldActive;}
 }
 const proteus189Before=proteusTalk;proteusTalk=function(n){return invoke189(n,()=>{
  if(F().proteus){const stored=chartStorage190();return say(n.name,['Kadmos at Tyre’s harbour can identify the raiders’ ship. My chart marks shoals; it does not make an unvisited harbour safe or unlock passage there.',(G.inv[CHART190]||0)>0?'You still carry the chart.':stored?'Your chart is in '+stored+'. Retrieve that copy; I will not make another while it is safely stored.':'If your chart is lost, I can copy the shoal marks again.'],null,!(G.inv[CHART190]>0)&&!stored?[{t:'Copy the missing sea chart',go:()=>recoverChart190(n)},{t:'Leave',go:()=>closeDlg()}]:undefined);}
  return proteus189Before.apply(this,arguments);
 });};
 const kadmos189Before=kadmosTalk;kadmosTalk=function(n){return invoke189(n,()=>{if(!F().proteus&&!F().kadmos&&!F().fort&&!F().won)return say(n.name,['Many ships buy grain here. Speak to Proteus on Pharos first; his account will tell me which voyage you mean.']);return kadmos189Before.apply(this,arguments);});};
 function chartStorage190(){if((G.logistics?.horse?.items?.[CHART190]||0)>0)return 'your horse’s packs';for(const[name,q]of Object.entries(G.logistics?.followers||{}))if((q.items?.[CHART190]||0)>0)return name+'’s supplies';for(const q of G.world?.ownedChests106||[])if((q.items?.[CHART190]||0)>0)return 'your cedar storage chest';for(const[id,q]of Object.entries(G.world?.loot||{}))if((!q.claimed||/^(chest:|overChest:)/.test(id))&&(q.items?.[CHART190]||0)>0)return q.label||'stored belongings';return null;}
 function recoverChart190(n){if(!storyReach189(n)||!F().proteus||G.inv[CHART190]>0||chartStorage190())return false;G.inv[CHART190]=1;F().chart=1;hudAll();toast('Proteus’ chart is in Special items. Use the pause menu to save.');return true;}
 function readChart190(){if(!['play','talk'].includes(STATE)||P.dead||P.mode!=='foot'||!F().proteus||!(G.inv[CHART190]>=1))return false;const n=NPCS.find(n=>/^Kadmos(?:\b|,)/.test(n.name)&&!n.dead&&!n.hostile&&!n._party),p=n&&((n.area||'over')==='over'?n:n.house||n.home),point=p&&Number.isFinite(p.x)&&Number.isFinite(p.z)?{x:p.x,z:p.z}:null;
  if(point)npcMapHints13(n,point,'Kadmos · Tyre harbour');say('Proteus’ annotated sea chart',['A coast traced in dark ink runs from Pharos toward Tyre. Short marks warn of shoals beside the approaches.',point?'A note names Kadmos at Tyre’s harbour. His actual location is added as a rumour, not as a visited destination.':'A note names Kadmos at Tyre’s harbour; no reliable current location can be marked.',F().kadmos?'Your conversation with Kadmos supplies the next lead. Follow the current rescue objective.':'Ask Kadmos which grain ship carried the guarded passenger.','A chart is not passage or safe arrival. You must still visit destinations before using discovered-landmark travel.']);return true;
 }
 const bag190Before=renderBag;renderBag=function(){const r=bag190Before.apply(this,arguments);if(BAG_TAB!=='special'||!(G.inv[CHART190]>=1)||!F().proteus)return r;const root=$('bagbody');if(!root||root.querySelector('[data-read-chart190]'))return r;const b=document.createElement('button'),game=G;b.dataset.readChart190='1';b.textContent='Read Proteus’ sea chart';b.onclick=()=>{if(G!==game||STATE!=='bag'||BAG_TAB!=='special'||P.dead||P.mode!=='foot'||!(G.inv[CHART190]>=1)||!F().proteus)return false;closeBag();return readChart190();};root.appendChild(b);return r;};
 const item190Before=giveItem;giveItem=function(k){if(k!=='chart')return item190Before.apply(this,arguments);if(!(G.inv[CHART190]>0)&&!chartStorage190())G.inv[CHART190]=1;F().chart=1;banner('Proteus’ annotated sea chart','Shoals and the trail to Tyre. Unvisited destinations remain undiscovered.');sfx('fanfare');hudAll();};
 function rescueReady191(dg,n){return DGS.fort===dg&&dg?.id==='fort'&&DG===dg&&AREA==='fort'&&!!F().fort&&!F().won&&!!dg.cage?.open&&!dg.cage.solid&&allWritingRelics()&&!ENEMIES.some(e=>e.alive&&e.area==='fort'&&e.kind==='warlord')&&storyReach189(n)&&Number.isFinite(P.y)&&Math.abs(P.y)<2;}
 function princessTalk191(dg,n){if(!rescueReady191(dg,n))return toast('Reach Erigone after the warlord falls and the four-script cage opens.'),false;return invoke189(n,()=>{
  const game=G;return say(n.name,['Aris? The shepherd boy from the pasture? You crossed the sea for me?','The four seals have fallen silent, and the hall is open. We can leave this fortress.','My father must hear what happened here. For now, let us get clear of these walls.'],()=>{if(G!==game||!rescueReady191(dg,n))return false;F().won=1;gstate('fort').won=1;save();showVictory();return true;});
 });}
 function installPrincess191(dg){if(dg?.id!=='fort'||DGS.fort!==dg||!dg.cage)return false;
  // Replace native cached entries too: the older seal closure captured the base
  // factory before later wrappers, so merely wrapping freeErigone is not enough.
  for(const i of dg.ints){const label=typeof i.label==='function'?i.label():i.label;if(label==='Read the princess’s four-script seal')i.act=()=>{if(!allWritingRelics())return say('Four-script seal',Object.values(WRITING).map(w=>w.relic).concat(['Carry all four actual relics before the seal can open.']));return freeErigone(dg);};}
  let row=princess191.get(dg);if(row&&NPCS.includes(row.n))return row;
  const existing=NPCS.find(n=>n.name==='Princess Erigone'&&n.area==='fort');if(!existing&&(!F().fort||F().won))return false;
  const n=existing||addNPC({name:'Princess Erigone',x:dg.cage.x,z:dg.cage.z+.01,yaw:PI/2,area:'fort',group:dg.group,noInt:true,look:{tunic:hx(0xf0ece0),kilt:hx(0xe0d8c0),hair:hx(0x2a1a10),skin:hx(0xd6a070),sc:.9},talk:()=>{}});
  n.protected48=true;n.mortal=false;n.talk=()=>princessTalk191(dg,n);
  const old=dg.ints.filter(i=>(typeof i.label==='function'?i.label():i.label)==='Speak to Erigone');
  const interaction=old[0]||{x:()=>n.x,z:()=>n.z,r:4,label:()=>'Speak to Erigone'};interaction.act=()=>princessTalk191(dg,n);interaction.vis=()=>!F().won&&!n.dead;
  // Keep old handles inert rather than splicing unrelated interactable indices.
  for(const i of old.slice(1)){i.vis=()=>false;i.act=()=>false;}
  if(!old.length)dg.ints.push(interaction);row={n,interaction};princess191.set(dg,row);return row;
 }
 const free191Before=freeErigone;freeErigone=function(dg){if(dg?.id!=='fort')return free191Before.apply(this,arguments);if(DGS.fort!==dg||!F().fort)return false;if(!allWritingRelics()){const r=free191Before.apply(this,arguments);installPrincess191(dg);return r;}if(!ENEMIES.some(e=>e.alive&&e.area==='fort'&&e.kind==='warlord'))dg.cage.open=true;return installPrincess191(dg);};
 function bindStory189(){for(const n of NPCS){if(n.story189)continue;const id=/^Proteus(?:\b|,)/.test(n.name)?'proteus':/^Kadmos(?:\b|,)/.test(n.name)?'kadmos':null;if(!id)continue;n.story189=id;n.talk=actor=>id==='proteus'?proteusTalk(actor||n):kadmosTalk(actor||n);}}
 const populate189Before=populate;populate=async function(){const r=await populate189Before.apply(this,arguments);bindStory189();return r;};
 const build191Before=buildDungeon;buildDungeon=function(id){const r=build191Before.apply(this,arguments);if(id==='fort')installPrincess191(DGS.fort);return r;};
 const restore191Before=restoreLivingWorld;restoreLivingWorld=function(){dialogue189=null;const r=restore191Before.apply(this,arguments);bindStory189();if(DGS.fort)installPrincess191(DGS.fort);return r;};
 const line189Before=dlgLine;dlgLine=function(){const r=line189Before.apply(this,arguments);if(active189)dialogue189={n:active189,stamp:stamp189(),lines:DLG.lines,choices:DLG.choices};const d=dialogue189;if(!d||d.lines!==DLG.lines||d.choices!==DLG.choices)return r;for(const b of $('dchoices').children){const click=b.onclick;if(typeof click!=='function')continue;b.onclick=function(e){if(STATE!=='talk'||d.lines!==DLG.lines||d.choices!==DLG.choices||!current189(d.stamp)||!storyReach189(d.n))return toast('This conversation is no longer available.'),false;return click.call(this,e);};}return r;};
 Object.assign(globalThis,{invokeStory189:invoke189,storyReach189,bindStory189,chartStorage190,recoverChart190,readChart190,princessTalk191,rescueReady191,installPrincess191});
})();`;
