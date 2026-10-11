export async function runArrowShopScenario(page,check){
 await page.evaluate(()=>{
  if(STATE==='talk')cancelDialogue();const s=SERVICES48.get('ikaria');createServices48(s);
  const n=s.cast.find(n=>n.service48==='arms');G.silver=100;G.time=12;
  G.arrowStock30={};G.arrows=0;G.arrowMaterial30='wood';P.x=n.x;P.z=n.z+2;P.y=groundY(P.x,P.z);n.sleep35=false;n.sleeping=false;n.talk(n);
 });
 async function openShop(){
 if(await page.evaluate(()=>STATE==='play')){await page.keyboard.press('e');await page.waitForFunction(()=>STATE==='talk');}
 for(let i=0;i<20;i++){
  const menu=await page.evaluate(()=>({last:DLG.i>=DLG.lines.length-1,choices:DLG.choices?.map(c=>c.t)||[]}));
  if(!menu.last){await page.keyboard.press('e');continue;}
  if(menu.choices.some(t=>t.startsWith('Buy wood arrows')))break;
  const target=menu.choices.find(t=>t==='Buy arrows')||menu.choices.find(t=>t==='Arrows, tools and learned patterns')||menu.choices.find(t=>/^Other matters/.test(t));
  if(!target)throw new Error('Arms arrow menu missing: '+menu.choices.join(' | '));
  await page.locator('#dchoices button').filter({hasText:target}).click();if(target==='Buy arrows')break;
 }
 while(await page.evaluate(()=>DLG.i<DLG.lines.length-1))await page.keyboard.press('e');
 }
 await openShop();await page.locator('#dchoices button').filter({hasText:'Buy wood arrows × 8 · 6 silver'}).click();
 await openShop();await page.locator('#dchoices button').filter({hasText:'Buy flint arrows × 8 · 32 silver'}).click();
 const bought=await page.evaluate(()=>({silver:G.silver,wood:G.arrowStock30.wood,flint:G.arrowStock30.flint,total:G.arrows}));
 check('arrow-priced-bundles-ordinary-purchase',bought.silver===62&&bought.wood===8&&bought.flint===8&&bought.total===16,bought);
 await openShop();await page.locator('#dchoices button').filter({hasText:'Buy iron arrows × 8 · 180 silver'}).click();
 check('arrow-insufficient-funds-no-ammo-added',await page.evaluate(()=>G.silver===62&&!G.arrowStock30.iron&&G.arrows===16),{});
 if(await page.evaluate(()=>STATE==='talk'))await page.keyboard.press('Escape');await page.waitForFunction(()=>STATE==='play');
 await page.keyboard.press('i');await page.waitForFunction(()=>STATE==='bag');await page.locator('[data-tab="weapons"]').click();
 await page.locator('[data-select="arrow_wood"]').click();
 const preview=await page.evaluate(()=>({key:ITEM_PREVIEW55.key,shared:ITEM_PREVIEW55.model.children.filter(m=>m.isMesh).every(m=>m.geometry===arrowGeometry30('wood'))}));
 check('arrow-ordinary-wood-preview-shared-geometry',preview.key==='arrow_wood'&&preview.shared,preview);
 await page.keyboard.press('Escape');await page.waitForFunction(()=>STATE==='play');
}
