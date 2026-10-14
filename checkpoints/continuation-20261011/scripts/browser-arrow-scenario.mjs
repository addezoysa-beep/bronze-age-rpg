// Prepared ammunition/hostile fixture; actions below use ordinary game controls.
export async function runArrowScenario(page,check){
 for(let i=0;i<5&&await page.evaluate(()=>STATE!=='play');i++)await page.keyboard.press('Escape');
 await page.waitForFunction(()=>STATE==='play');
 await page.evaluate(()=>{G.inv.bow_wood=Math.max(1,G.inv.bow_wood||0);G.arrowStock30={wood:8,bronze:8};G.arrows=16;G.arrowMaterial30='wood';hudAll();});
 if(await page.evaluate(()=>G.peaceful16))await page.keyboard.press('r');
 await page.keyboard.press('i');await page.waitForFunction(()=>STATE==='bag');await page.locator('[data-tab="weapons"]').click();await page.locator('[data-right="bow_wood"]').click();await page.keyboard.press('Escape');await page.waitForFunction(()=>STATE==='play');
 await page.locator('button[aria-label="Next arrow type"]').click();
 const selected=await page.evaluate(()=>({mat:G.arrowMaterial30,total:G.arrows,text:document.getElementById('arrowN').textContent}));
 check('arrow-HUD-button-material-and-count',selected.mat==='bronze'&&selected.total===16&&/8/.test(selected.text),selected);
 await page.keyboard.press('[');check('arrow-bracket-selection-conserves-stock',await page.evaluate(()=>G.arrowMaterial30==='wood'&&G.arrows===16),{});
 await page.evaluate(()=>{for(const e of ENEMIES)if(e.area===AREA&&hyp(e.x-P.x,e.z-P.z)<50)e.friendly=true;let site=null;for(let i=0;i<16&&!site;i++){const yaw=i*Math.PI/8;let safe=true;for(let d=1;d<=12;d++){const x=P.x+Math.sin(yaw)*d,z=P.z+Math.cos(yaw)*d;if(colBlocked(x,z,.6)||Math.abs(groundY(x,z)-P.y)>.35){safe=false;break;}}if(safe)site={x:P.x+Math.sin(yaw)*12,z:P.z+Math.cos(yaw)*12,yaw};}if(!site)throw Error('No unobstructed level bow fixture route');const e=spawnEnemy('wolf',site.x,site.z,{area:AREA,id:'arrow-hit114'});e.hp=e.maxHp=1000;e.stun=999;e.friendly=false;CAM.yaw=P.yaw=site.yaw;clearCombatLock62();});
 await page.keyboard.press('q');await page.waitForFunction(()=>LOCK?.id==='arrow-hit114');
 for(const first of[false,true])for(const crouch of[false,true]){
  if(await page.evaluate(()=>FIRST_PERSON)!==first)await page.keyboard.press('v');
  if(await page.evaluate(()=>P.crouch)!==crouch)await page.keyboard.press('b');
  await page.waitForFunction(()=>ARCHERY27.phase==='idle'&&BOW_RECOVERY<=0);
  const rect=await page.locator('#gl').boundingBox();await page.mouse.move(rect.x+rect.width/2,rect.y+rect.height/2);
  const hit=await page.evaluate(({x,y})=>{const node=document.elementFromPoint(x,y);return{id:node?.id,tag:node?.tagName,locked:document.pointerLockElement?.id||null};},{x:rect.x+rect.width/2,y:rect.y+rect.height/2});check('ordinary-bow-canvas-hit-target',hit.id==='gl',hit);
  if(await page.evaluate(()=>!document.pointerLockElement)){await page.mouse.click(rect.x+rect.width/2,rect.y+rect.height/2);await page.waitForFunction(()=>document.pointerLockElement?.id==='gl',null,{timeout:15000});}
  await page.waitForFunction(()=>ARCHERY27.phase==='idle'&&BOW_RECOVERY<=0);
  const before=await page.evaluate(()=>({hp:ENEMIES.find(e=>e.id==='arrow-hit114').hp,arrows:G.arrows}));
  await page.mouse.down();
  await page.waitForFunction(()=>ARCHERY27.phase==='draw'&&ARCHERY27.charge>=.9,null,{timeout:15000});await page.mouse.up();
  await page.waitForFunction(hp=>ENEMIES.find(e=>e.id==='arrow-hit114').hp<hp,before.hp,{timeout:7000});
  const after=await page.evaluate(()=>({hp:ENEMIES.find(e=>e.id==='arrow-hit114').hp,arrows:G.arrows,stock:G.arrowStock30.wood}));check('ordinary-arrow-damage-'+(first?'FP':'TP')+'-'+(crouch?'crouch':'stand'),after.hp<before.hp&&after.arrows===before.arrows-1,after);
 }
 await page.keyboard.press('Escape');const oldAt=await page.evaluate(()=>JSON.parse(localStorage.getItem(slotKey(SAVE_SLOT)))?.savedAt||0);await page.locator('#psave').click({noWaitAfter:true});await page.waitForFunction(at=>JSON.parse(localStorage.getItem(slotKey(SAVE_SLOT)))?.savedAt>at,oldAt);const saved=await page.evaluate(()=>({slot:SAVE_SLOT,data:JSON.parse(localStorage.getItem(slotKey(SAVE_SLOT)))}));
 await page.reload({waitUntil:'load'});await page.locator('#bnew').waitFor({state:'visible'});await page.locator('#bnew').click();await page.locator('[data-load="'+saved.slot+'"]').click({noWaitAfter:true});await page.waitForFunction(()=>G.started&&['play','talk'].includes(STATE));
 const after=await page.evaluate(()=>({x:P.x,z:P.z,mat:G.arrowMaterial30,stock:G.arrowStock30,total:G.arrows}));check('arrow-selection-stock-exact-position-ordinary-reload',after.mat===saved.data.arrowMaterial30&&after.total===saved.data.arrows&&JSON.stringify(after.stock)===JSON.stringify(saved.data.arrowStock30)&&Math.hypot(after.x-saved.data.pos.x,after.z-saved.data.pos.z)<1e-6,after);
}
