export const greatswordSmithRuntime=`
/* Regional arms craftsmen offer visible long-blade commissions and targeted lessons. */
const GREAT_CITIES71=new Set(['mycenae','sparta','ithaca','krete','troy','athens','egypt','pharos','mesopotamia','ur','tyre','phoenicia','alashiya']);
function greatSmith71(n){return n.service48==='arms'||n.job36==='smith48';}
function greatSmithId71(n){return(n.area||'over')+':'+n.name;}
function greatOrders71(){livingState();return G.world.greatOrders71||={};}
function greatOffers71(n){const culture=n.culture||holdCulture20(nearestIsle(n.x,n.z)),region=nearestIsle(n.x,n.z),materials=['copper','bronze',...(GREAT_CITIES71.has(region)&&G.level>=8?['iron']:[])];return materials.map(material=>({key:'greatsword_'+culture+'_'+material,material,price:({copper:360,bronze:720,iron:2400})[material],lesson:({copper:48,bronze:90,iron:180})[material]})).filter(o=>REGIONAL_ITEMS48[o.key]&&RECIPES[o.key]);}
function greatCommission71(n,key){
 if(n.dead||n.hostile||openingPending25())return toast('Finish your duty at the fold before ordering arms.');
 const orders=greatOrders71(),id=greatSmithId71(n),offer=greatOffers71(n).find(o=>o.key===key);
 if(!offer)return toast('This smith cannot work that material.');
 if(orders[id])return toast('Your existing commission must be collected first.');
 if(G.silver<offer.price)return toast('You need '+offer.price+' silver.');
 G.silver-=offer.price;orders[id]={key,readyDay:G.day+1,price:offer.price};hudAll();save();
 say(n.name,['I will shape the blade and fit its grip. Return after tomorrow’s dawn; the finished weapon will be waiting here.'],()=>{},[{t:'Agreed',go:()=>closeDlg()}]);
}
function greatCollect71(n){if(n.dead||n.hostile)return;const orders=greatOrders71(),id=greatSmithId71(n),order=orders[id];if(!order)return;
 if(G.day<order.readyDay)return toast('The blade is still at the forge. Return tomorrow.');
 G.inv[order.key]=(G.inv[order.key]||0)+1;delete orders[id];hudAll();save();toast(itemLabel(order.key)+' received. Equip it from Weapons; it needs both hands.');
}
function greatLesson71(n,key){if(n.dead||n.hostile||openingPending25())return;const offer=greatOffers71(n).find(o=>o.key===key);if(!offer)return;
 if(recipeKnown30(key))return toast('You already know this pattern.');if(G.silver<offer.lesson)return toast('You need '+offer.lesson+' silver.');G.silver-=offer.lesson;learnPlans36([key]);hudAll();save();toast('Learned '+itemLabel(key));
}
function greatMenu71(n){const order=greatOrders71()[greatSmithId71(n)],offers=greatOffers71(n);
 const options=order?[{t:G.day>=order.readyDay?'Collect my greatsword':'Ask about my commission',go:()=>greatCollect71(n)}]:offers.map(o=>({t:'Commission '+itemLabel(o.key)+' · '+o.price+' silver',go:()=>greatCommission71(n,o.key)}));
 options.push({t:'Learn local greatsword patterns',go:()=>say(n.name,['A long blade needs a sound ingot, a well-fitted grip and room at the bench.'],()=>{},offers.filter(o=>!recipeKnown30(o.key)).map(o=>({t:'Learn '+itemLabel(o.key)+' · '+o.lesson+' silver',go:()=>greatLesson71(n,o.key)})).concat([{t:'Back',go:()=>greatMenu71(n)}]))},{t:'Back',go:()=>n.talk(n)});
 return say(n.name,['I can make a long blade in our local style. It takes both hands; you cannot carry a shield with it.',...(order?['Your '+itemLabel(order.key)+' is '+(G.day>=order.readyDay?'ready to collect.':'being worked. Return after tomorrow’s dawn.')]:['Copper and bronze are available here. The larger city workshops also work iron for experienced travellers.'])],()=>{},options);
}
function bindGreatSmith71(n){if(!greatSmith71(n)||n.greatSmith71)return;n.greatSmith71=true;const old=n.talk;n.talk=a=>say(a.name,['Need a long blade? I take commissions here at the forge, and I can teach you our patterns.'],()=>{},[{t:'Greatswords and commissions',go:()=>greatMenu71(a)},{t:'Other goods, lessons and work',go:()=>old(a)},{t:'Leave',go:()=>closeDlg()}]);}
const greatCreate71Before=createServices48;createServices48=function(s){const r=greatCreate71Before(s);for(const n of s.cast)bindGreatSmith71(n);return r;};
const greatPopulate71Before=populate;populate=async function(){await greatPopulate71Before();for(const n of NPCS)bindGreatSmith71(n);};
`;
export function applyGreatswordSmithCheckpoint(html){const marker='window.WDS_READY33=true;';if(html.includes('function greatOffers71(')||html.split(marker).length!==2)throw new Error('Expected unpatched regional smith source');return html.replace(marker,greatswordSmithRuntime+'\n'+marker);}
