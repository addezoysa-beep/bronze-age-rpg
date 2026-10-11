// Integrate after prerequisite dialogue checks pass; uses production travel and actual clicks.
export async function runPaidWagonScenario(page,check){
 const start=await page.evaluate(()=>{
  if(STATE==='talk')cancelDialogue();const n=CARAVANS20[0];
  if(!n)throw new Error('No departure guide');
  setArea('over');G.time=12;P.dead=false;P.mode='foot';G.silver=100;
  P.x=n.x;P.z=n.z+2;P.y=groundY(P.x,P.z);n.sleep35=false;n.sleeping=false;
  STATE='play';const dest=caravanDestination20('mesopotamia');n.talk(n);
  return {dest,silver:G.silver};
 });
 for(let i=0;i<20;i++){
  const menu=await page.evaluate(()=>({last:DLG.i>=DLG.lines.length-1,choices:DLG.choices?.map(c=>c.t)||[]}));
  if(!menu.last){await page.keyboard.press('e');continue;}
  const route=menu.choices.find(t=>t==='Wagon to Ur · 80 silver'||/^(Other matters|Ask about the caravan route)/.test(t));
  if(!route)throw new Error('Paid wagon route missing: '+menu.choices.join(' | '));
  if(route==='Wagon to Ur · 80 silver'){
   await page.waitForFunction(()=>!STREAM.building);await page.locator('#dchoices button').filter({hasText:route}).click();
   await page.waitForFunction(({x,z})=>STATE==='play'&&!STREAM.building&&Math.hypot(P.x-x,P.z-z)<8,start.dest,{timeout:180000});
   const arrived=await page.evaluate(()=>({x:P.x,z:P.z,silver:G.silver,mode:P.mode,area:AREA}));
   check('paid-wagon-Ur-fare-arrival',arrived.silver===20&&arrived.mode==='foot'&&arrived.area==='over',arrived);
   await page.keyboard.press('Escape');await page.waitForFunction(()=>document.pointerLockElement===null);
   await page.locator('#psave').click();
   const saved=await page.evaluate(()=>({slot:SAVE_SLOT,data:JSON.parse(localStorage.getItem(slotKey(SAVE_SLOT)))}));
   check('wagon-destination-manual-save',Math.hypot(saved.data.pos.x-arrived.x,saved.data.pos.z-arrived.z)<1e-6&&saved.data.silver===20,saved.data.pos);
   await page.reload({waitUntil:'load'});await page.locator('#bnew').waitFor({state:'visible',timeout:60000});await page.locator('#bnew').click();
   await page.locator('[data-load="'+saved.slot+'"]').click({noWaitAfter:true});
   await page.waitForFunction(()=>G.started&&['play','talk'].includes(STATE),null,{timeout:180000});
   const restored=await page.evaluate(()=>({x:P.x,z:P.z,silver:G.silver}));
   check('wagon-destination-exact-reload',Math.hypot(restored.x-saved.data.pos.x,restored.z-saved.data.pos.z)<1e-6&&restored.silver===20,restored);return;
  }
  await page.locator('#dchoices button').filter({hasText:route}).click();
 }
 throw new Error('Paid wagon exceeded menu budget');
}
