// Prepared hostile encounter; this checks ordinary controls, not a natural quest route.
export async function runCombatLockScenario(page,check){
 for(let i=0;i<5&&await page.evaluate(()=>STATE!=='play');i++)await page.keyboard.press('Escape');
 await page.waitForFunction(()=>STATE==='play');
 await page.evaluate(()=>{clearCombatLock62();for(const [id,dx,dz]of[['lock-a62',0,9],['lock-b62',5,11]]){const e=spawnEnemy('wolf',P.x+dx,P.z+dz,{area:AREA,id});e.stun=30;}CAM.yaw=0;});
 await page.waitForFunction(()=>ENEMIES.filter(e=>/lock-[ab]62/.test(e.id||'')).length===2&&ENEMIES.filter(e=>/lock-[ab]62/.test(e.id||'')).every(e=>combatLockEligible62(e)),null,{timeout:15000});
 check('lock-fixture-rendered-visible-eligible',await page.evaluate(()=>ENEMIES.filter(e=>/lock-[ab]62/.test(e.id||'')).every(e=>e.g.visible&&combatLockEligible62(e))),{});
 await page.keyboard.press('q');
 await page.waitForFunction(()=>LOCK&&/lock-[ab]62/.test(LOCK.id));
 const a=await page.evaluate(()=>({id:LOCK.id,melee:!!P.melee,marker:document.getElementById('ret').style.display}));
 check('ordinary-Q-acquisition-without-left-attack',!a.melee&&a.marker==='block',a);
 await page.keyboard.press('Shift+q');const b=await page.evaluate(()=>LOCK?.id);
 check('ordinary-shift-Q-cycling',!!b&&b!==a.id,{before:a.id,after:b});
 await page.keyboard.press('q');check('ordinary-Q-release',await page.evaluate(()=>LOCK===null),{});
 await page.keyboard.press('q');await page.keyboard.press('Escape');
 check('pause-releases-target',await page.evaluate(()=>STATE==='pause'&&LOCK===null),{});
 await page.locator('#combat-lock-key62').selectOption('Numpad0');
 await page.keyboard.press('Escape');await page.keyboard.press('Numpad0');
 check('ordinary-configured-lock-control',await page.evaluate(()=>!!LOCK),{});
 await page.keyboard.press('Escape');await page.locator('#psave').click();
 const saved=await page.evaluate(()=>({slot:SAVE_SLOT,data:JSON.parse(localStorage.getItem(slotKey(SAVE_SLOT)))}));
 check('lock-checkpoint-ordinary-pause-save',!!saved.data.started&&!!saved.data.pos,saved.data.pos);
 await page.reload({waitUntil:'load'});await page.locator('#bnew').waitFor({state:'visible'});await page.locator('#bnew').click();await page.locator('[data-load="'+saved.slot+'"]').click({noWaitAfter:true});
 await page.waitForFunction(()=>G.started&&['play','talk'].includes(STATE));
 const restored=await page.evaluate(()=>({x:P.x,z:P.z,code:COMBAT_LOCK62.code,lock:!!LOCK}));
 check('lock-input-persists-exact-position-reload',restored.code==='Numpad0'&&!restored.lock&&Math.hypot(restored.x-saved.data.pos.x,restored.z-saved.data.pos.z)<1e-6,restored);
}
