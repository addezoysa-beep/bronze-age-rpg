export const mountOwnershipRuntime=`
/* Ownership-aware stable menus and one shared whistle for the selected owned mount. */
function ownsHorse73(){return !!F().horse&&!G.horseRental48;}
const buyHorse73Before=buyStableHorse20;buyStableHorse20=function(at,power){if(F().horse)return toast(ownsHorse73()?'Horse · Owned. Your present horse remains yours.':'Return the hired horse before purchasing.');return buyHorse73Before(at,power);};
const acquire73Before=acquireHorse16;acquireHorse16=function(a){const r=acquire73Before(a);G.world.mountChoice73='horse';return r;};
const mountHorse73Before=mountHorse;mountHorse=function(){const r=mountHorse73Before();if(P.mode==='horse')G.world.mountChoice73='horse';return r;};
const mountInts73Before=currentInts;currentInts=function(){const list=mountInts73Before();for(const i of list){const label=typeof i.label==='function'?i.label():i.label;if(label==='Mount Hippos')i.label=()=> 'Ride '+(G.horseName16||'Hippos')+(ownsHorse73()?' · Owned':'');if(/^Buy a trained horse or saddle/.test(label)&&ownsHorse73())i.label=()=> 'Horse · Owned · Stable and riding gear';}return list;};
stableBuy20=function(n,s){const owned=ownsHorse73(),rental=!!G.horseRental48,at=s||n;
 const choices=[{t:owned?'Horse · Owned':'Horses and riding gear',go:()=>say(n.name,[owned?'Your horse is owned. H calls your selected mount.':'A saddle is needed for these stronger riding horses.'],()=>{},[
 {t:G.inv.saddle?'Saddle · Owned':'Buy saddle · 50 silver',go:()=>{if(G.inv.saddle)return toast('Saddle · Owned.');if(G.silver<50)return toast('You need 50 silver.');G.silver-=50;G.inv.saddle=1;hudAll();}},
 ...(!owned&&!rental?[{t:'Buy trained horse · 220 silver',go:()=>buyStableHorse20(at,2)},{t:'Buy powerful charger · 550 silver',go:()=>buyStableHorse20(at,5)}]:[]),
 {t:'Back',go:()=>stableBuy20(n,s)}])}];
 if(owned)choices.push({t:'Select my horse for H whistle',go:()=>{G.world.mountChoice73='horse';toast('H calls your horse.');}});
 if(owned)choices.push({t:'Stable my horse · 15 silver',go:()=>{if(!ownsHorse73())return;if(G.silver<15)return toast('You need 15 silver.');if(P.mode==='horse')callHorse();G.silver-=15;HORSE.x=at.x+2;HORSE.z=at.z;HORSE.here=true;G.stabled20={x:HORSE.x,z:HORSE.z,name:n.name};G.logistics||={horse:{items:{}},followers:{}};hudAll();toast('Your horse rests here. It remains yours.');}});
 if(!F().horse)choices.push({t:'Rent a road horse · 35 silver',go:()=>{if(F().horse)return;if(G.silver<35)return toast('You need 35 silver.');G.silver-=35;const q=makeHorse(hx(0x92735c));acquireHorse16({id:'rental48_'+G.day,kind:'horse',name:'Hired Road Horse',q,x:n.x+3,z:n.z,power:1});G.horseRental48={day:G.day,start:G.time,region:nearestIsle(n.x,n.z)};}});
 if(rental)choices.push({t:'Return hired horse',go:()=>{if(!G.horseRental48)return;if(P.mode==='horse')callHorse();delete G.horseRental48;F().horse=0;HORSE.here=HORSE.mounted=false;HORSE.q.g.visible=false;toast('The keeper takes the reins.');}});
 choices.push({t:'Leave',go:()=>closeDlg()});say(n.name,[owned?'Horse · Owned. Choose your mount or check your tack.':rental?'Your road horse is hired until the next sunset.':'I sell riding horses and tack, and hire road horses.'],()=>{},choices);
};
function ownChariot73(c){return !!G.world.chariots48?.[c.id48];}
function boardChariot73(c,training=false){if(P.dead||P.mode!=='foot'||AREA!=='over'||hyp(P.x-c.x,P.z-c.z)>7||c.used)return;if(!ownChariot73(c)&&!(training&&expansionState().war[c.realm]?.accepted))return toast('Speak to the chariot captain for training.');closeDlg();P.mode='chariot';P.chariot=c;c.used=true;P.x=c.x;P.z=c.z;P.y=groundY(c.x,c.z);P.yaw=c.yaw;P.vx=P.vz=0;CAM.dist=12;if(ownChariot73(c))G.world.mountChoice73=c.id48;}
const addChariot73Before=addChariot;addChariot=function(realm,x,z){const c=addChariot73Before(realm,x,z),i=INTS.at(-1),old=i.act;
 i.label=()=>ownChariot73(c)?realm+' chariot · Owned · Ride':realm+' chariot yard';
 i.act=()=>{if(P.dead||P.mode!=='foot')return;if(ownChariot73(c))return boardChariot73(c);
 say(realm+' Chariot Yard',['The team and vehicle cost 350 silver. Your owned chariot can be called with H after selecting it here.'],()=>{},[
 {t:'Buy chariot · 350 silver',go:()=>{if(ownChariot73(c))return;if(G.silver<350)return toast('You need 350 silver.');G.world.chariots48||={};G.silver-=350;G.world.chariots48[c.id48]=true;G.world.mountChoice73=c.id48;hudAll();toast('Chariot · Owned. E rides; H calls it.');}},
 {t:'Training ride',go:()=>boardChariot73(c,true)},{t:'Leave',go:()=>closeDlg()}]);};return c;
};
function safeChariotPoint73(x,z){if(!Number.isFinite(x+z)||groundY(x,z)<.6||colBlocked(x,z,3))return null;return{x,z};}
const callMount73Before=callHorse;callHorse=function(){if(P.mode==='chariot'||P.mode==='horse')return callMount73Before();const id=G.world.mountChoice73,c=CHARIOTS.find(a=>a.id48===id&&ownChariot73(a));if(!c)return callMount73Before();
 if(P.dead||AREA!=='over'||P.mode!=='foot'||STATE!=='play'||STREAM.building||MOUNT48||TAME16)return toast('Call the chariot from open ground on foot.');
 if(hyp(c.x-P.x,c.z-P.z)<7)return toast('Your chariot is here. E rides.');
 let at=null;for(const side of[-1,1]){at=safeChariotPoint73(P.x+side*sin(P.yaw)*8,P.z+side*cos(P.yaw)*8);if(at)break;}
 if(!at)return toast('There is no safe room for the team here.');Object.assign(c,at,{yaw:P.yaw,used:false,last48:null});c.q.g.position.set(c.x,groundY(c.x,c.z),c.z);c.q.g.rotation.y=c.yaw;c.q.g.visible=true;toast('Your chariot team comes at your whistle. E rides.');
};
const snapshotMount73Before=snapshot;snapshot=function(){snapshotMount73Before();G.world.chariotPositions73={};for(const c of CHARIOTS)if(ownChariot73(c))G.world.chariotPositions73[c.id48]={x:c.x,z:c.z,yaw:c.yaw};G.world.riddenChariot73=P.mode==='chariot'?P.chariot?.id48:null;};
function restoreChariots73(){for(const c of CHARIOTS){c.used=false;const p=G.world.chariotPositions73?.[c.id48];if(ownChariot73(c)&&p&&Number.isFinite(p.yaw)&&safeChariotPoint73(p.x,p.z))Object.assign(c,p);}if(P.mode==='chariot'){const c=CHARIOTS.find(a=>a.id48===G.world.riddenChariot73&&ownChariot73(a));if(c){P.chariot=c;c.used=true;c.x=P.x;c.z=P.z;c.yaw=P.yaw;}else{P.mode='foot';P.chariot=null;}}}
const continueMount73Before=continueGame;continueGame=function(...args){const r=continueMount73Before(...args);restoreChariots73();return r;};
`;
export function applyMountOwnershipCheckpoint(html){const marker='window.WDS_READY33=true;';if(html.includes('function ownsHorse73(')||html.split(marker).length!==2)throw new Error('Unexpected mount checkpoint source');return html.replace(marker,mountOwnershipRuntime+'\n'+marker);}
