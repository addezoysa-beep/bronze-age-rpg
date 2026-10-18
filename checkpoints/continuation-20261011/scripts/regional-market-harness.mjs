import fs from 'node:fs';import vm from 'node:vm';import {serviceHarness} from './service-qol-harness.mjs';import {regionalMarketPatch} from './regional-market-patch.mjs';
const seed=fs.readFileSync(new URL('../recovered/Cinematic-Lock-Lesson.html',import.meta.url),'utf8'),lines=seed.split('\n');
function line(p){const s=lines.find(l=>l.startsWith(p));if(!s)throw Error('Missing native '+p);return s;}
export function marketHarness(patched=true){const h=serviceHarness(),c=h.c;Object.assign(c,{hx:()=>[.4,.5,.6],clamp:(x,a,b)=>Math.max(a,Math.min(b,x)),METAL_COLORS:{},WEIGHT:{},MINE_SITES36:[],refreshWeapon(){},renderBag(){},discoverRecipes30(){},itemCategory:()=>'',playerItems:()=>({...c.G.inv})});Object.assign(c.G,{silver:100000,day:1,level:8,own:{},gear:{},gearOwned:{},training:{sling:1},weaponMaterials:{},hands:{},handItems:{},arrows:0});
vm.runInContext(line('const MATERIAL30=')+'\n'+line('const CRAFT_METAL30=')+'\n'+line('const ARMOR_MATERIALS=')+'\n'+line('const REGION_STYLE='),c);
vm.runInContext(line('for(const[mat,col,def]of')+'\n'+line('const CULTURES48='),c); // actual rare materials and regional registries
for(const s of lines.filter(l=>l.startsWith('for(const culture of CULTURES48)for(const mat of[')))vm.runInContext(s,c);
vm.runInContext(line('function lootEquipment(')+'\n'+line('function removePlayerItem(')+'\n'+line('function disableItemDerived(')+'\n'+line('const HAND_WEAPONS=')+'\n'+line('function playerItems(')+'\n'+line('const physicalLootBefore=lootEquipment;'),c);
vm.runInContext(seed.slice(seed.indexOf('function materialNeed30('),seed.indexOf('const ARROW_GEOMETRY30=')),c);
vm.runInContext(line('for(const [mat,key]of Object.entries({wood:')+'\n'+line('function removeTransfer52(')+'\n'+line('RECIPES.sellSilverOre=')+'\n'+line('for(const [metal,ore]of Object.entries({copper:')+'\n'+line('const ingotPrice55='),c);
c.ITEMS={};const items=seed.slice(seed.indexOf('const ITEMS={')+'const ITEMS='.length,seed.indexOf('\nconst SHOPS='));vm.runInContext('Object.assign(ITEMS,'+items.replace(/;\s*$/,'')+');',c);c.ITEMS.shield1={p:18};c.ARROW_PRICE105={wood:6,flint:18,copper:32,bronze:52,iron:90};
vm.runInContext(line('const equipLabels48Before='),c);if(patched)vm.runInContext(regionalMarketPatch,c);return h;}
export function installCommodityCraft224(c){Object.assign(c,{floor:Math.floor,SMELTERS:[{x:0,z:0}],polityState36:()=>c.storeStock224,practice29(){}});vm.runInContext(line('function storeTrade36(')+'\n'+line('function canCraft(')+'\n'+line('function nearSmelter(')+'\n'+line('const forgeCanCraftBefore=')+'\n'+line('const craft30Before='),c);}
