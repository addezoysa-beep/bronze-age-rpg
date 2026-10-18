export const regionalMountServicesRuntime=`
/* A grounded steppe departure yard and explicit Egyptian horse/chariot services. */
let REGIONAL_MOUNTS74={busy:false,created:false};
async function regionalWagon74(n,dest,cost){
 if(REGIONAL_MOUNTS74.busy||STREAM.building||P.dead||P.mode!=='foot'||AREA!=='over')return toast('Leave your mount and wait for the road to clear.');
 if(G.silver<cost)return toast('You need '+cost+' silver.');const at=landPoint15(dest.x,dest.z);
 if(!at||!Number.isFinite(at.x+at.z)||groundY(at.x,at.z)<2||colBlocked(at.x,at.z,2))return toast('The destination has no clear arrival point.');
 closeDlg();if(STATE!=='play')return;REGIONAL_MOUNTS74.busy=true;const before={x:P.x,z:P.z};G.silver-=cost;let arrived=false;
 try{await caravanTravel({...at,name:dest.name});arrived=!P.dead&&AREA==='over'&&hyp(P.x-at.x,P.z-at.z)<=8;if(arrived){mapReveal13(P.x,P.z,70);toast(n.departure20+' → '+dest.name);}}
 catch(e){toast('The journey was interrupted.');}
 finally{if(!arrived){G.silver+=cost;toast('Your fare is returned.');}REGIONAL_MOUNTS74.busy=false;hudAll();}
}
function steppeGuide74(n){say(n.name,['Our wagon stands beside the horse camps. We carry travellers south to Ur and the Egyptian wagon yard.'],()=>{},[
 {t:'Wagon to Ur · 80 silver',go:()=>regionalWagon74(n,{...LOC.ur,name:'Ur · Mesopotamia'},80)},
 {t:'Wagon to Avaris · 110 silver',go:()=>regionalWagon74(n,{...LOC.avaris,name:'Avaris · Egypt'},110)},
 {t:'Leave',go:()=>closeDlg()}]);}
function regionalMountServices74(){if(REGIONAL_MOUNTS74.created)return;REGIONAL_MOUNTS74.created=true;
 const steppe=IS.scythia;if(steppe){const at=freeBuilding20(steppe.cx+30,steppe.cz+24),keeper=at&&landPoint15(at.x+5,at.z+2);
 if(at&&keeper){caravanWagon20('scythia',at);const n=addNPC({name:'Northern Steppe Wagon Guide',...keeper,culture:'scythian',role:'trade',look:{tunic:K.ochre,kilt:K.cream},talk:steppeGuide74});n.departure20='Northern Steppe';n.home=n.work=n.social={...keeper};CARAVANS20.push(n);INTS.push({...keeper,r:3,label:()=>'Northern Steppe wagon · Ur / Egypt',act:()=>steppeGuide74(n)});DISCOVER('Northern Steppe Wagon Yard',keeper.x,keeper.z,25,10);}}
 const city=LOC.avaris;if(city){const yard=freeBuilding20(city.x+34,city.z-28),at=yard&&landPoint15(yard.x+6,yard.z+1);
 if(yard&&at){if(!CHARIOTS.some(c=>c.realm==='egypt'&&hyp(c.x-yard.x,c.z-yard.z)<35))addChariot('egypt',yard.x,yard.z);
 const n=addNPC({name:'Avaris Horse and Chariot Keeper',...at,culture:'egypt',role:'trade',look:{tunic:K.linen,kilt:K.ochre},talk:n=>stableBuy20(n,n)});n.stableKeeper20=true;n.home=n.work=n.social={...at};STABLE_KEEPERS20.push(n);INTS.push({...at,r:3,label:()=>'Avaris horses and riding gear',act:()=>stableBuy20(n,n)});DISCOVER('Avaris Horse and Chariot Yard',at.x,at.z,25,10);}}
 INT_GRID16.count=-1;
}
const regionalMountPopulate74Before=populate;populate=async function(){await regionalMountPopulate74Before();regionalMountServices74();};
`;
export function applyRegionalMountServicesCheckpoint(html){const marker='window.WDS_READY33=true;';if(html.includes('function regionalMountServices74(')||html.split(marker).length!==2)throw new Error('Unexpected regional mount source');return html.replace(marker,regionalMountServicesRuntime+'\n'+marker);}
