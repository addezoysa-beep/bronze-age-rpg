// Scenario setup uses production state; all dialogue progression uses real input.
export async function runInteractionScenario(page,check){
 await page.evaluate(async()=>{
  if(STATE==='talk')cancelDialogue();
  G.time=12;F().wolvesDone=1;F().king=0;
  const o=PALACES16.find(o=>o.key==='ikarios');
  if(!o)throw new Error('King palace missing');
  await enterDungeon(o.id,{x:P.x,z:P.z,yaw:P.yaw});
  const n=o.leader;n.sleep35=false;n.sleeping=false;n.action='holding court';
  P.x=n.x;P.z=n.z+2;P.y=groundY(P.x,P.z);STATE='play';
  n.talk(n);
 });
 await page.waitForFunction(()=>STATE==='talk');
 await page.waitForFunction(()=>document.pointerLockElement===null);
 for(let i=0;i<8;i++){
  const s=await page.evaluate(()=>({king:F().king,state:STATE,last:DLG.i>=DLG.lines.length-1,choices:DLG.choices?.map(c=>c.t)||[]}));
  if(s.king)break;
  if(s.last&&s.choices.length){
   const route=s.choices.find(t=>t==='Local affairs and quests'||t==='Other matters / quests'||t==='Other matters');
   if(!route)throw new Error('King completion blocked by choices: '+s.choices.join(' | '));
   await page.locator('#dchoices button').filter({hasText:route}).click();
   continue;
  }
  await page.keyboard.press('e');
 }
 const result=await page.evaluate(()=>({king:F().king,state:STATE}));
 check('king-princess-dialogue-completion',result.king===1&&result.state==='play',result);
 // Exercise actual nested guide callbacks, with ordinary mouse choices and number 5.
 await page.evaluate(()=>{const n=CARAVANS20[0];if(!n)throw new Error('Wagon guide missing');setArea('over');n.sleep35=false;n.sleeping=false;n.action='guiding';n.talk(n);});
 async function lastLine(){for(let i=0;i<12;i++){if(await page.evaluate(()=>DLG.i>=DLG.lines.length-1))return;await page.keyboard.press('e');}throw new Error('Dialogue exceeded line budget');}
 for(let i=0;i<8;i++){
  await lastLine();
  const choices=await page.evaluate(()=>DLG.choices?.map(c=>c.t)||[]);
  if(choices.includes('Tell me about Mesopotamia'))break;
  const route=choices.find(t=>/^(Other matters|Ask about the caravan route)/.test(t));
  if(!route)throw new Error('Guide route missing: '+choices.join(' | '));
  await page.locator('#dchoices button').filter({hasText:route}).click();
 }
 await page.locator('#dchoices button').filter({hasText:'Tell me about Mesopotamia'}).click();
 await lastLine();
 await page.locator('#dchoices button').filter({hasText:'Discuss the journey'}).click();
 await lastLine();await page.keyboard.press('5');
 const guide=await page.evaluate(()=>({state:STATE,pointerLocked:!!document.pointerLockElement}));
 check('wagon-guide-nested-dialogue-and-option-five',guide.state==='play'&&!guide.pointerLocked,guide);
}
