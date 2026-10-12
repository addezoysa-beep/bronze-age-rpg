// Seed discovery/clear-weather fixtures only; destination inputs and Save/load use real controls.
export async function runFastTravelScenario(page,check){
 if(await page.evaluate(()=>STATE==='bag'))await page.locator('#bagclose').click();
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
 await page.keyboard.press('m');await page.locator('#chart-search16').fill(setup.b.name);
 check('old-name-discovery-visible',await page.locator('#chart-results16 button').count()===1,setup.b);
 if(setup.locked){await page.locator('#chart-search16').fill(setup.locked.name);check('undiscovered-not-offered',await page.locator('#chart-results16 button').count()===0,setup.locked);await page.locator('#chart-search16').fill(setup.b.name)}
 for(const [weather,destination] of [['storm',setup.b],['rain',setup.a]]){
  await page.evaluate(kind=>G.weather.kind=kind,weather);
  if(await page.evaluate(()=>STATE==='bag'))await page.locator('#bagclose').click();
  if(await page.evaluate(()=>STATE!=='map'))await page.keyboard.press('m');
  await page.locator('#chart-search16').fill(destination.name);
  await page.locator('#chart-results16 button').click();
  await page.waitForFunction(d=>!STREAM.building&&hyp(P.x-d.x,P.z-d.z)<50&&['play','bag'].includes(STATE),destination,{timeout:180000});
  if(await page.evaluate(()=>STATE==='bag'))await page.locator('#bagclose').click();
  await page.waitForFunction(()=>STATE==='play');
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
