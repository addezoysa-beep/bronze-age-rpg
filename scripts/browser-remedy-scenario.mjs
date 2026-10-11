// Money/position/health are scenario setup. Purchases and use go through mouse controls.
export async function runRemedyScenario(page,check){
 await page.evaluate(()=>{
  if(STATE==='talk')cancelDialogue();const s=SERVICES48.get('ikaria');createServices48(s);
  const n=s.cast.find(n=>n.service48==='heal');if(!n)throw new Error('No reachable healer');
  G.silver=1000;G.time=12;P.x=n.x;P.z=n.z+2;P.y=groundY(P.x,P.z);P.dead=false;n.sleep35=false;n.sleeping=false;
  G.hp=10;ensureStamina();G.stamina=10;G.remedies62={};n.talk(n);
 });
 for(let i=0;i<20;i++){
  const menu=await page.evaluate(()=>({last:DLG.i>=DLG.lines.length-1,choices:DLG.choices?.map(c=>c.t)||[]}));
  if(!menu.last){await page.keyboard.press('e');continue;}
  const target=menu.choices.find(t=>t==='More health and stamina remedies')||menu.choices.find(t=>/^(Other matters|Local affairs)/.test(t));
  if(!target)throw new Error('Healer restoratives menu unreachable: '+menu.choices.join(' | '));
  await page.locator('#dchoices button').filter({hasText:target}).click();if(target==='More health and stamina remedies')break;
 }
 // Complete displayed introduction before clicking the purchase choices.
 while(await page.evaluate(()=>DLG.i<DLG.lines.length-1))await page.keyboard.press('e');
 for(const name of ['Honeyed fig restorative','Concentrated herbal remedy','Restorative herb infusion','Barley endurance draught']){
  await page.locator('#dchoices button').filter({hasText:'Buy '+name+' ·'}).click();
 }
 const bought=await page.evaluate(()=>({silver:G.silver,counts:Object.fromEntries(Object.keys(REMEDIES62).map(k=>[k,G.inv[k]]))}));
 check('remedy-healer-four-purchases',bought.silver===888&&Object.values(bought.counts).every(n=>n===1),bought);
 // Actual mouse insufficient-funds path must not deduct or add an item.
 await page.evaluate(()=>G.silver=0);await page.locator('#dchoices button').filter({hasText:'Buy Honeyed fig restorative ·'}).click();
 check('remedy-healer-insufficient-funds',await page.evaluate(()=>G.silver===0&&G.inv.fig_restorative62===1),{});
 await page.keyboard.press('Escape');await page.waitForFunction(()=>STATE==='play');
 await page.keyboard.press('i');await page.waitForFunction(()=>STATE==='bag');
 await page.locator('[data-tab="food"]').click();
 await page.locator('[data-eat="fig_restorative62"]').click();
 const fig=await page.evaluate(()=>({hp:G.hp,stamina:G.stamina,count:G.inv.fig_restorative62}));
 check('remedy-Food-tab-combined-use',fig.hp===28&&fig.stamina>=35&&fig.count===0,fig);
 await page.locator('[data-eat="concentrated_remedy62"]').click();
 check('remedy-Food-tab-strong-healing',await page.evaluate(()=>G.hp===G.maxHp&&G.inv.concentrated_remedy62===0),{});
 await page.locator('[data-eat="herb_infusion62"]').click();await page.locator('[data-eat="endurance_draught62"]').click();
 const effects=await page.evaluate(()=>JSON.parse(JSON.stringify(G.remedies62)));
 await page.waitForTimeout(500);
 check('remedy-effects-frozen-in-inventory',await page.evaluate(e=>JSON.stringify(G.remedies62)===JSON.stringify(e),effects),effects);
 await page.keyboard.press('Escape');await page.waitForFunction(()=>STATE==='play');
 await page.keyboard.press('Escape');await page.waitForFunction(()=>STATE==='pause'&&document.pointerLockElement===null);
 await page.locator('#psave').click();
 const saved=await page.evaluate(()=>({slot:SAVE_SLOT,data:JSON.parse(localStorage.getItem(slotKey(SAVE_SLOT)))}));
 check('remedy-ordinary-save-effects',!!saved.data.remedies62?.heal&&!!saved.data.remedies62?.endurance,saved.data.remedies62);
 await page.reload({waitUntil:'load'});await page.locator('#bnew').waitFor({state:'visible',timeout:60000});await page.locator('#bnew').click();
 await page.locator('[data-load="'+saved.slot+'"]').click({noWaitAfter:true});
 await page.waitForFunction(()=>G.started&&['play','talk'].includes(STATE),null,{timeout:180000});
 const restored=await page.evaluate(()=>({pos:{x:P.x,z:P.z},effects:G.remedies62,inv:G.inv}));
 check('remedy-exact-position-reload',Math.hypot(restored.pos.x-saved.data.pos.x,restored.pos.z-saved.data.pos.z)<1e-6,restored.pos);
 check('remedy-reload-bounded-remaining-effects',restored.effects.heal.left<=saved.data.remedies62.heal.left&&restored.effects.heal.budget<=saved.data.remedies62.heal.budget&&restored.effects.endurance.left<=saved.data.remedies62.endurance.left&&Object.keys(saved.data.remedies62).length===2&&['fig_restorative62','concentrated_remedy62','herb_infusion62','endurance_draught62'].every(k=>restored.inv[k]===0),{});
}
