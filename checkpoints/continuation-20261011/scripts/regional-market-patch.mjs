export const regionalMarketPatch=String.raw`
/* EQUIPMENT_PRICE_LADDER_224 / SETTLEMENT_ARMS_MARKET_225 /
   COMMODITY_EXCHANGE_MARGIN_226. No quest/trainer rewards or save UI changes. */
(function(){
 const metal224={wood:1,flint:2.25,leather:3,linen:2,wool:2.4,studded:9,scale:18,copper:9,bronze:18,silver:32,gold:56,iron:60,orichalcum:150,adamantine:300};
 const weapon224={stick:6,pole:12,sword:24,dagger:12,spear:20,axe:24,greatsword:40},armor224={helmet:18,breastplate:52,greaves:24,shield:28,bracers:12,gauntlets:12};
 function equipmentIdentity224(k){const d=REGIONAL_ITEMS48[k];if(d)return{slot:d.slot,material:d.base||d.material,armor:!!d.armor,quality:/_heavy_/.test(k)?1.25:/_light_/.test(k)?.82:/_grave_/.test(k)?1.35:1};
  const m=/^(stick|pole|sword|dagger|spear|axe|greatsword|bow|sling|helmet|breastplate|greaves|shield|bracers|gauntlets)_(.+)$/.exec(k||'');if(!m)return null;let mat=m[2],quality=1;
  if(armor224[m[1]]){if(!ARMOR_MATERIALS[mat])return null;quality=/^great_/.test(mat)?1.3:/^simple_/.test(mat)?.8:/^(scaled|banded)_/.test(mat)?1.15:1;mat=mat.replace(/^(great|simple|scaled|banded)_/,'');}
  return metal224[mat]?{slot:m[1],material:mat,armor:!!armor224[m[1]],quality}:null;
 }
 function equipmentPrice224(k){const d=equipmentIdentity224(k);if(!d||!metal224[d.material])return null;
  if(d.slot==='bow')return({wood:24,flint:42,copper:96,bronze:520,silver:900,gold:1500,iron:1200,orichalcum:2600,adamantine:5200})[d.material]||null;
  if(d.slot==='sling')return({wood:8,flint:12,leather:18,copper:42,bronze:72,silver:150,gold:240,iron:180,orichalcum:550,adamantine:1100})[d.material]||null;
  const p=(d.armor?armor224:weapon224)[d.slot]*metal224[d.material]*d.quality;return Number.isFinite(p)&&p>0?Math.ceil(p):null;
 }
 const legacy224={shield1:40,sword2:432,sword3:1440,bow2:520,bow3:1200,sling2:100,sling3:260,shield2:504,armor1:180,armor2:960,armor3:1600};
 for(const[k,p]of Object.entries(legacy224))if(ITEMS[k])ITEMS[k].p=p;
 const buy224Before=buyService48;buyService48=function(k,n,cost){const p=equipmentPrice224(k);if(p){cost=p*n;const count=G.inv[k]??0;if(!Number.isSafeInteger(n)||n<1||!Number.isSafeInteger(cost)||!Number.isSafeInteger(count)||count<0||count>Number.MAX_SAFE_INTEGER-n||!Number.isSafeInteger(G.silver)||G.silver<0)return toast('Ask for a current equipment quote.');}return buy224Before.call(this,k,n,cost);};
 const tiers225={ikaria:1,ithaca:2,naxos:2,krete:3,mycenae:3,sparta:3,athens:3,troy:3,egypt:3,pharos:2,tyre:3,phoenicia:2,philistia:2,alashiya:3,mesopotamia:3,scythia:2,northmountains:1,phthia:2,'egypt:memphis44':3,'egypt:lowerEgypt26':2,'egypt:upperEgypt26':2,'mesopotamia:ur':3,'mesopotamia:akkad48':3,luxor58:3,valley58:1};
 function marketContext225(n){if(n?.service48!=='arms'||!NPCS.includes(n))return null;for(const[key,s]of SERVICES48)if(s.cast?.includes(n))return{key,s,n,tier:tiers225[key]||1,culture:n.culture||holdCulture20(s.id)};return null;}
 function marketCatalog225(c){if(!c)return[];const out=[],add=(key,cap,pack=1,price=equipmentPrice224(key),category=null)=>{if((equipmentIdentity224(key)||RECIPES[key]||REGIONAL_ITEMS48[key]||ingotPrice55[key])&&Number.isSafeInteger(price)&&price>0&&!out.some(o=>o.key===key))out.push({key,cap,pack,price,category:category||(equipmentIdentity224(key)?.armor?'armour':'weapons')});},t=c.tier;
  for(const w of['stick','spear','axe','sword','dagger'])add(w+'_wood',t+2);add('bow_wood',t);if(G.training?.sling>=1)add('sling_wood',t+1);
  for(const slot of['helmet','breastplate','greaves','shield'])add(slot+'_leather',t);
  for(const w of(t===1?['sword']:['dagger','spear','axe','sword']))add(w+'_'+c.culture+'_copper',t===1?1:t);
  if(t>=2)add('bow_copper',t-1);
  if(t===3&&G.level>=4){for(const w of['dagger','spear','axe','sword'])add(w+'_'+c.culture+'_bronze',2);for(const cut of['light','heavy'])for(const slot of['helmet','breastplate','greaves','shield'])add(slot+'_'+c.culture+'_'+cut+'_bronze',cut==='light'?2:1);}
  if(t===3&&G.level>=8){add('bow_bronze',1);for(const w of['dagger','spear','axe','sword'])add(w+'_'+c.culture+'_iron',1);for(const slot of['helmet','breastplate','greaves','shield'])add(slot+'_'+c.culture+'_light_iron',1);}
  for(const mat of['wood','flint',...(t>=2?['copper','bronze']:[]),...(t===3&&G.level>=8?['iron']:[])])add('arrow_'+mat,t+1,8,ARROW_PRICE105[mat],'arrows');
  for(const k of['copper','tin',...(t>=2?['silverIngot']:[]),...(t===3?['goldIngot',...(G.level>=8?['iron']:[])]:[])])add(k,t+1,1,ingotPrice55[k],'metal');
  return out;
 }
 function marketState225(c){if(!c||!Number.isSafeInteger(G.day)||G.day<0)return null;G.world||={};if(G.world.regionalMarkets225===undefined)G.world.regionalMarkets225={};const root=G.world.regionalMarkets225;if(!root||typeof root!=='object'||Array.isArray(root))return null;
  if(root[c.key]===undefined)root[c.key]={day:G.day,qty:{},budget:[0,180,900,3000][c.tier]};const q=root[c.key];if(!q||typeof q!=='object'||!q.qty||typeof q.qty!=='object'||Array.isArray(q.qty)||!Number.isSafeInteger(q.day)||!Number.isSafeInteger(q.budget)||q.budget<0)return null;
  const later=G.day>q.day;if(later){q.day=G.day;q.budget=[0,180,900,3000][c.tier];}for(const o of marketCatalog225(c)){if(q.qty[o.key]===undefined)q.qty[o.key]=o.cap;else if(Number.isSafeInteger(q.qty[o.key])&&q.qty[o.key]>=0&&later)q.qty[o.key]=Math.min(o.cap,q.qty[o.key]+Math.ceil(o.cap/2));}return q;
 }
 function validMarket225(q){const c=marketContext225(q.n);return !q.used&&G===q.game&&G.day===q.day&&q.stock.day===q.stockDay&&serviceReachable181(q.n)&&DLG.lines===q.lines&&DLG.choices===q.choices&&c&&c.s===q.s&&c.key===q.key&&c.tier===q.tier&&c.culture===q.culture&&G.world?.regionalMarkets225?.[q.key]===q.stock;}
 function spare225(k){const count=G.inv[k],d=equipmentIdentity224(k);if(!d||!Number.isSafeInteger(count)||count<1)return false;if(count>1)return true;
  return !(d.slot==='shield'&&(G.own?.shield>0||G.hands?.left==='shield'))&&!G.gearOwned?.[k]&&!Object.values(G.handItems||{}).includes(k)&&!Object.values(G.handItems48||{}).includes(k)&&!Object.values(G.regionalGear48||{}).includes(k)&&!(G.own?.[d.slot]>0&&G.weaponMaterials?.[d.slot]===d.material);
 }
 function marketMenu225(n,mode='main',page=0){const c=marketContext225(n);if(!c||!serviceReachable181(n))return toast('Approach the available arms seller on foot.');if(openingPending25())return toast('Finish Lykos’s sheepfold work before buying arms.');return invokeService181(n,()=>{
  const stock=marketState225(c);if(!stock)return toast('The recorded stores are unavailable. Nothing was traded.');const q={...c,stock,stockDay:stock.day,day:G.day,game:G,used:false,lines:null,choices:null},choices=[],guard=fn=>()=>{if(!validMarket225(q))return false;q.used=true;return fn();},catalog=marketCatalog225(c);
  if(mode==='main'){for(const[category,title]of[['weapons','Weapons'],['armour','Armour'],['arrows','Arrow bundles'],['metal','Worked metal']])if(catalog.some(o=>o.category===category))choices.push({t:title,go:guard(()=>marketMenu225(n,category))});
   choices.push({t:'Sell spare equipment',go:guard(()=>marketMenu225(n,'sell'))},{t:'Workshop lessons and directions',go:guard(()=>marketMenu225(n,'workshop'))});
  }else if(mode==='workshop'){choices.push({t:'Commissions and greatsword patterns',go:guard(()=>greatMenu71(n))},{t:'Learn local weapon and armour patterns',go:guard(()=>lesson48(n,'smith'))},{t:'Where are the mine and furnace?',go:guard(()=>{const s=MINE_SITES36.find(a=>a.id===c.s.id);if(s)npcMapHints13(n,s,s.name);npcMapHints13(n,{x:n.work.x-3,z:n.work.z-1},'Market furnace');say(n.name,['Ore comes from the gallery; the furnace beside this workshop makes usable metal. Ask the gallery keeper about the pick.']);})},{t:'Back to market',go:guard(()=>marketMenu225(n))});
  }else{
   const all=mode==='sell'?Object.keys(G.inv||{}).filter(spare225).map(key=>({key,price:Math.floor(equipmentPrice224(key)*.35)})).filter(o=>o.price>0):catalog.filter(o=>o.category===mode&&Number.isSafeInteger(stock.qty[o.key])&&stock.qty[o.key]>0);page=Math.max(0,Math.min(Math.floor(page)||0,Math.max(0,Math.ceil(all.length/4)-1)));
   for(const o of all.slice(page*4,page*4+4))choices.push({t:(mode==='sell'?'Sell spare ':'Buy ')+itemLabel(o.key)+(o.pack>1?' × '+o.pack:'')+' · '+o.price+' silver'+(mode==='sell'?'':' ('+stock.qty[o.key]+' remaining)'),go:guard(()=>{
    if(mode==='sell'){if(!spare225(o.key)||Math.floor(equipmentPrice224(o.key)*.35)!==o.price||!Number.isSafeInteger(stock.budget)||stock.budget<o.price||!Number.isSafeInteger(G.silver)||G.silver<0||G.silver>Number.MAX_SAFE_INTEGER-o.price)return toast('The seller lacks silver or that spare is unavailable. Nothing was taken.');if(!removeTransfer52(o.key,1))return false;stock.budget-=o.price;G.silver+=o.price;refreshWeapon();hudAll();}
    else{const now=marketCatalog225(marketContext225(n)).find(a=>a.key===o.key),mat=o.key.slice(6),count=o.category==='arrows'?(G.arrowStock30?(G.arrowStock30[mat]??0):mat==='wood'?(G.arrows??0):0):(G.inv[o.key]??0);if(!now||now.price!==o.price||now.pack!==o.pack||!Number.isSafeInteger(stock.qty[o.key])||stock.qty[o.key]<1||!Number.isSafeInteger(count)||count<0||count>Number.MAX_SAFE_INTEGER-o.pack||o.category==='arrows'&&(!Number.isSafeInteger(G.arrows??0)||(G.arrows??0)<0||(G.arrows??0)>Number.MAX_SAFE_INTEGER-o.pack)||!Number.isSafeInteger(G.silver)||G.silver<o.price)return toast('Insufficient silver or a changed stock quote. Nothing was taken.');stock.qty[o.key]--;G.silver-=o.price;lootEquipment({[o.key]:o.pack});hudAll();}
    return marketMenu225(n,mode,page);
   })});
   if(page>0)choices.push({t:'Previous stock',go:guard(()=>marketMenu225(n,mode,page-1))});if(all.length>(page+1)*4)choices.push({t:'More stock',go:guard(()=>marketMenu225(n,mode,page+1))});choices.push({t:'Back to market',go:guard(()=>marketMenu225(n))});
  }
  choices.push({t:'Leave',go:guard(()=>closeDlg())});
  const r=say(n.name,[mode==='sell'?'I buy spare physical equipment, not your only registered tool, worn gear or quest belongings. My buying purse holds '+stock.budget+' silver.':'These are the goods actually on my shelves. '+(c.tier===1?'This small settlement keeps basic supplies.':c.tier===2?'This town carries more tools and copper arms.':'This major market keeps deeper regional stock, bronze work and advanced gear for experienced travellers.')],null,choices);q.lines=DLG.lines;q.choices=DLG.choices;return r;
 });}
 const before225=serviceTalk48;serviceTalk48=function(n){return marketContext225(n)?marketMenu225(n):before225.apply(this,arguments);};
 if(RECIPES.sellSilverOre)RECIPES.sellSilverOre={...RECIPES.sellSilverOre,n:'Refine and exchange a silver lot · 10 silver',make:()=>{G.silver+=10;}};
 if(RECIPES.sellGold)RECIPES.sellGold={...RECIPES.sellGold,n:'Exchange a small gold ingot · 30 silver',make:()=>{G.silver+=30;}};
 Object.assign(globalThis,{equipmentPrice224,equipmentIdentity224,marketContext225,marketCatalog225,marketState225,marketMenu225,spare225});
})();
`;
