// Prepared defeated-captain fixture, not a full cave/puzzle/boss acceptance.
export async function runPanScenario(page,check){
 await page.evaluate(async()=>{
  if(STATE==='talk')cancelDialogue();F().lykos=F().wolvesDone=F().king=F().cave=1;F().daedalus=0;opening25().stage='done';
  // Prepared post-boss fixture includes the captain's key; real key acquisition is a separate acceptance gate.
  G.inv.key_cave=Math.max(1,G.inv.key_cave||0);
  delete G.inv.relic_pan_tally61;delete livingState().panTallyCollected61;delete livingState().loot['chest:cave:100'];
  await enterDungeon('cave',{x:LOC.cave.x,z:LOC.cave.z,yaw:0});
  const ch=DG.chests.find(c=>c.idx===100);if(!ch)throw Error('Captain reward chest missing');
  P.x=ch.x;P.z=ch.z;P.y=dungeonFloor(P.x,P.z,P);STATE='play';
 });
 const before=await page.evaluate(()=>({item:G.inv.relic_pan_tally61||0,objective:mainObjective13().t}));
 check('captain-flag-is-not-item',before.item===0&&/captain.*chest/.test(before.objective),before);
 await page.keyboard.press('e');await page.locator('[data-loot="relic_pan_tally61"]').waitFor({state:'visible'});
 await page.locator('[data-loot="relic_pan_tally61"]').click();
 const acquired=await page.evaluate(()=>({item:G.inv.relic_pan_tally61,receipt:livingState().panTallyCollected61,objective:mainObjective13().t}));
 check('ordinary-captain-chest-tablet-acquisition',acquired.item===1&&acquired.receipt===true&&!/captain.*chest/.test(acquired.objective),acquired);
 await page.keyboard.press('Escape');await page.keyboard.press('Escape');await page.waitForFunction(()=>document.pointerLockElement===null);await page.locator('#psave').click();
 const saved=await page.evaluate(()=>({slot:SAVE_SLOT,data:JSON.parse(localStorage.getItem(slotKey(SAVE_SLOT)))}));
 check('Pan-ordinary-pause-save',saved.data.inv.relic_pan_tally61===1&&saved.data.world.panTallyCollected61===true,{entrance:saved.data.pos,checkpoint:saved.data.checkpoint21});
 await page.reload({waitUntil:'load'});await page.locator('#bnew').waitFor({state:'visible',timeout:60000});await page.locator('#bnew').click();await page.locator('[data-load="'+saved.slot+'"]').click({noWaitAfter:true});
 await page.waitForFunction(()=>G.started&&['play','talk'].includes(STATE),null,{timeout:180000});
 const restored=await page.evaluate(()=>({item:G.inv.relic_pan_tally61,receipt:livingState().panTallyCollected61,x:P.x,z:P.z,area:AREA}));
 check('Pan-tablet-exact-reload',restored.item===1&&restored.receipt===true&&restored.area===saved.data.checkpoint21.area&&restored.area==='cave'&&Math.hypot(restored.x-saved.data.checkpoint21.x,restored.z-saved.data.checkpoint21.z)<1e-6,restored);
 if(await page.evaluate(()=>STATE==='talk'))await page.keyboard.press('Escape');
 await page.keyboard.press('e');await page.locator('#loot-panel').waitFor({state:'visible'});
 check('Pan-tablet-no-repeated-loot',await page.locator('[data-loot="relic_pan_tally61"]').count()===0,{item:restored.item});
}
