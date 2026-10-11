// Prepared post-shearing fixture; this does not claim a full Lykos/wolf/cave walkthrough.
export async function runSlingScenario(page,check){
 await page.evaluate(()=>{
  if(STATE==='talk')cancelDialogue();setArea('over');G.time=12;P.dead=false;P.mode='foot';STATE='play';
  opening25().stage='done';F().lykos=1;F().wolvesDone=1;F().king=1;
  G.inv={};G.own.sling=0;G.training.sling=0;G.trainingTask=G.trainingLoan=null;G.trainingProg=0;G.slingLessonStones=false;
  const n=NPCS.find(n=>/Mentor Phokas|Phocas/.test(n.name));if(!n)throw Error('Phocas missing');
  n.sleep35=false;n.sleeping=false;P.x=n.x;P.z=n.z+1;P.y=groundY(P.x,P.z);n.talk(n);
 });
 async function choose(){
  for(let i=0;i<12;i++){if(await page.evaluate(()=>DLG.i>=DLG.lines.length-1))break;await page.keyboard.press('e')}
  const choices=await page.evaluate(()=>DLG.choices?.map(c=>c.t)||[]);
  const text=choices.find(t=>/Receive a sling/.test(t));if(!text)throw Error('Direct sling option missing: '+choices.join(' | '));
  await page.locator('#dchoices button').filter({hasText:text}).click();
 }
 await choose();
 const granted=await page.evaluate(()=>({items:playerItems(),weapon:G.weapon,hand:G.handItems.right,trained:G.training.sling,task:G.trainingTask,stones:G.inv.stone}));
 check('ordinary-Phocas-sling-grant',granted.items.sling_wood===1&&granted.weapon==='sling'&&granted.hand==='sling_wood'&&granted.trained===0&&granted.task==='sling'&&granted.stones===12,granted);
 // Prepared partial progress must survive a repeat lesson (not a rendered hit claim).
 await page.evaluate(()=>G.trainingProg=2);
 await page.keyboard.press('Escape');
 await page.keyboard.press('e');await page.waitForFunction(()=>STATE==='talk');await choose();
 const repeat=await page.evaluate(()=>({sling:G.inv.sling_wood,stone:G.inv.stone,task:G.trainingTask,prog:G.trainingProg}));
 check('repeat-sling-lesson-no-duplicates',repeat.sling===1&&repeat.stone===12&&repeat.task==='sling'&&repeat.prog===2,repeat);
 await page.keyboard.press('Escape');await page.keyboard.press('Escape');await page.waitForFunction(()=>document.pointerLockElement===null);await page.locator('#psave').click();
 const saved=await page.evaluate(()=>({slot:SAVE_SLOT,data:JSON.parse(localStorage.getItem(slotKey(SAVE_SLOT)))}));
 check('sling-ordinary-save',saved.data.inv.sling_wood===1&&saved.data.trainingTask==='sling'&&saved.data.training.sling===0,saved.data.trainingTask);
 await page.reload({waitUntil:'load'});await page.locator('#bnew').waitFor({state:'visible',timeout:60000});await page.locator('#bnew').click();await page.locator('[data-load="'+saved.slot+'"]').click({noWaitAfter:true});
 await page.waitForFunction(()=>G.started&&['play','talk'].includes(STATE),null,{timeout:180000});
 const loaded=await page.evaluate(()=>({x:P.x,z:P.z,sling:G.inv.sling_wood,stones:G.inv.stone,task:G.trainingTask,trained:G.training.sling}));
 check('sling-exact-reload',Math.hypot(loaded.x-saved.data.pos.x,loaded.z-saved.data.pos.z)<1e-6&&loaded.sling===1&&loaded.stones===12&&loaded.task==='sling'&&loaded.trained===0,loaded);
}
