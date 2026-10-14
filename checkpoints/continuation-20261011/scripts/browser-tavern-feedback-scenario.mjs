// Prepared indoor service location, NOT natural regional travel/workplace acceptance.
// Purchase/consumption and Save below use only ordinary keyboard/mouse inputs.
export async function runTavernFeedbackScenario(page,check){
 await page.evaluate(async()=>{if(STATE==='talk')cancelDialogue();opening25().stage='done';F().cave=1;const o=TAVERNS15.find(o=>DUN[o.id]?.tavern);if(!o)throw Error('No actual tavern definition');await enterDungeon(o.id,{x:o.x,z:o.z,yaw:0});if(!DG.service118)throw Error('Dedicated serving counter missing');const s=DG.service118;P.x=s.approach.x;P.z=s.approach.z;P.y=dungeonFloor(P.x,P.z,P);P.mode='foot';P.dead=false;G.silver=20;frontier36().hydration=10;STATE='play';});
 await page.waitForFunction(()=>DG?.service118&&DG.service118.counter.area===AREA&&hyp(DG.service118.counter.x-DG.tavern15.bar.x,DG.service118.counter.z-(DG.tavern15.bar.z-1.2))<.1);
 const anchor=await page.evaluate(()=>({legacy:DG.ints.some(i=>(typeof i.label==='function'?i.label():i.label)==='Buy food and drink'),same:DG.service118.counter===DG.service118.server,server:DG.service118.server.area,area:AREA,x:DG.service118.server.x,z:DG.service118.server.z,bar:DG.tavern15.bar}));
 check('tavern-distinct-indoor-staff-and-no-legacy-counter',!anchor.legacy&&!anchor.same&&anchor.server===anchor.area&&Math.hypot(anchor.x-anchor.bar.x,anchor.z-anchor.bar.z)<20,anchor);
 await page.keyboard.press('e');await page.waitForFunction(()=>STATE==='talk');
 for(let i=0;i<10&&await page.evaluate(()=>DLG.i<DLG.lines.length-1);i++)await page.keyboard.press('e');
 const before=await page.evaluate(()=>({silver:G.silver,milk:G.inv.milk||0,thirst:frontier36().hydration}));
 await page.locator('#dchoices button').filter({hasText:/Drink .*milk.*here/i}).click();
 const after=await page.evaluate(()=>({silver:G.silver,milk:G.inv.milk||0,thirst:frontier36().hydration}));
 check('ordinary-tavern-milk-purchase-and-drink',after.silver===before.silver-3&&after.milk===before.milk&&after.thirst>before.thirst&&after.thirst<=100,{before,after});
 await page.locator('#dchoices button').filter({hasText:'Leave the counter'}).click();await page.waitForFunction(()=>STATE==='play');
 const server=await page.evaluate(()=>({x:DG.service118.server.x,z:DG.service118.server.z}));
 await page.waitForFunction(p=>Math.hypot(DG.service118.server.x-p.x,DG.service118.server.z-p.z)>.01,server,{timeout:15000});
 check('table-server-actual-indoor-movement',true,{scope:'One movement interval; not a complete serving/nav/contact cycle.'});
 await page.keyboard.press('Escape');await page.waitForFunction(()=>STATE==='pause'&&!document.pointerLockElement);const oldAt=await page.evaluate(()=>JSON.parse(localStorage.getItem(slotKey(SAVE_SLOT)))?.savedAt||0);await page.locator('#psave').click({noWaitAfter:true});await page.waitForFunction(t=>JSON.parse(localStorage.getItem(slotKey(SAVE_SLOT)))?.savedAt>t,oldAt);
 const saved=await page.evaluate(()=>({slot:SAVE_SLOT,data:JSON.parse(localStorage.getItem(slotKey(SAVE_SLOT)))}));
 await page.reload({waitUntil:'load'});await page.locator('#bnew').waitFor({state:'visible'});await page.locator('#bnew').click();await page.locator('[data-load="'+saved.slot+'"]').click({noWaitAfter:true});await page.waitForFunction(()=>G.started&&['play','talk'].includes(STATE),null,{timeout:180000});
 const restored=await page.evaluate(()=>({area:AREA,x:P.x,z:P.z,silver:G.silver,milk:G.inv.milk||0,service:!!DG?.service118}));
 check('ordinary-tavern-payment-inventory-exact-position-reload',restored.area===saved.data.checkpoint21.area&&restored.service&&restored.silver===saved.data.silver&&restored.milk===(saved.data.inv.milk||0)&&Math.hypot(restored.x-saved.data.checkpoint21.x,restored.z-saved.data.checkpoint21.z)<1e-6,restored);
}
