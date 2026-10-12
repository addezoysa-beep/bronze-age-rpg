async function closeInventoryPanels(page){
 for(let attempt=0;attempt<8;attempt++){
  await page.waitForTimeout(350);
  if(await page.locator('#bagwin').isVisible()){await page.locator('#bagclose').click();continue;}
  if(await page.evaluate(()=>STATE==='bag')){await page.keyboard.press('i');continue;}
  await page.waitForTimeout(500);
  if(!await page.locator('#bagwin').isVisible()&&await page.evaluate(()=>STATE!=='bag'))return;
 }
 throw Error('Inventory or level-up panel did not close through its ordinary UI control');
}
async function openChartThroughControls(page){
 for(let attempt=0;attempt<8;attempt++){
  await closeInventoryPanels(page);
  if(await page.evaluate(()=>STATE==='map'))return;
  await page.keyboard.press('m');
  await page.waitForFunction(()=>STATE==='map'||STATE==='bag',null,{timeout:15000}).catch(()=>{});
  if(await page.evaluate(()=>STATE==='map'))return;
 }
 throw Error('Chart did not open through ordinary M after closing delayed level-up panels');
}
// Seed discovery/weather fixtures only; destination inputs and Save/load use real controls.
export async function runFastTravelScenario(page,check){
 await closeInventoryPanels(page);
 const setup=await page.evaluate(()=>{
  if(STATE==='talk')cancelDialogue();G.time=12;G.weather.kind='clear';P.dead=false;P.mode='foot';STATE='play';
  const candidates=DISC.filter(d=>heightAt(d.x,d.z)>2&&landmarkLanding60(d));
  const a=candidates.find(d=>nearestIsle(d.x,d.z)==='ikaria');
  const b=candidates.find(d=>nearestIsle(d.x,d.z)==='troy')||candidates.find(d=>hyp(d.x-a.x,d.z-a.z)>500);
  if(!a||!b)throw Error('Missing representative travel destinations');
  // Preserve production actors; choose a quiet departure rather than deleting threats.
  for(const d of candidates){const p=landmarkLanding60(d);if(!nearbyThreats(p.x,p.z).some(e=>hyp(e.x-p.x,e.z-p.z)<24)){P.x=p.x;P.z=p.z;P.y=groundY(p.x,p.z);break}}
  G.disc[a.id]=1;delete G.disc[b.id];G.disc[b.name]=1;
  const locked=candidates.find(d=>d!==a&&d!==b&&!G.disc[d.id]&&!G.disc[d.name]);
  return {a,b,locked,silver:G.silver};
 });
 await openChartThroughControls(page);await page.locator('#chart-search16').fill(setup.b.name);
 check('old-name-discovery-visible',await page.locator('#chart-results16 button').count()===1,setup.b);
 if(setup.locked){await page.locator('#chart-search16').fill(setup.locked.name);check('undiscovered-not-offered',await page.locator('#chart-results16 button').count()===0,setup.locked);await page.locator('#chart-search16').fill(setup.b.name)}
 for(const [weather,destination] of [['storm',setup.b],['rain',setup.a]]){
  await page.evaluate(kind=>G.weather.kind=kind,weather);
  await closeInventoryPanels(page);
  await openChartThroughControls(page);
  await page.locator('#chart-search16').fill(destination.name);
  await page.locator('#chart-results16 button').click();
  await page.waitForFunction(d=>!STREAM.building&&hyp(P.x-d.x,P.z-d.z)<50&&['play','bag'].includes(STATE),destination,{timeout:180000});
  await closeInventoryPanels(page);await page.waitForFunction(()=>STATE==='play');
  const result=await page.evaluate(()=>({x:P.x,y:P.y,z:P.z,state:STATE,mode:P.mode,silver:G.silver,blocked:colBlocked(P.x,P.z,1.8),ground:groundY(P.x,P.z)}));
  check('ordinary-'+weather+'-fast-travel-arrival',result.state==='play'&&result.mode==='foot'&&!result.blocked&&Math.abs(result.y-result.ground)<.1&&result.silver===setup.silver,result);
 }
 const arrived=await page.evaluate(()=>({x:P.x,y:P.y,z:P.z,state:STATE,mode:P.mode,silver:G.silver}));
 await page.screenshot({path:'verification/runtime/fast-travel-arrival.png'});
 await page.keyboard.press('Escape');await page.waitForFunction(()=>document.pointerLockElement===null);await page.locator('#psave').click();
 const saved=await page.evaluate(()=>({slot:SAVE_SLOT,data:JSON.parse(localStorage.getItem(slotKey(SAVE_SLOT)))}));
 check('fast-travel-ordinary-save',Math.hypot(saved.data.pos.x-arrived.x,saved.data.pos.z-arrived.z)<1e-6,saved.data.pos);
 await page.reload({waitUntil:'load'});await page.locator('#bnew').waitFor({state:'visible',timeout:60000});await page.locator('#bnew').click();await page.locator('[data-load="'+saved.slot+'"]').click({noWaitAfter:true});
 await page.waitForFunction(()=>G.started&&['play','talk'].includes(STATE),null,{timeout:180000});
 const restored=await page.evaluate(()=>({x:P.x,z:P.z,silver:G.silver}));
 check('fast-travel-exact-reload',Math.hypot(restored.x-saved.data.pos.x,restored.z-saved.data.pos.z)<1e-6&&restored.silver===saved.data.silver,restored);
}
