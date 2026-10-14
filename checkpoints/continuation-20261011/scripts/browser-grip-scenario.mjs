import {measureStickGripContact} from './grip-contact-contract.mjs';
// Diagnostic rendered rigs; full weapon matrix and visual acceptance remain open.
export async function runGripScenario(page,check,output){
 await page.evaluate(()=>{
  if(STATE==='talk')cancelDialogue();G.inv.stick_wood=(G.inv.stick_wood||0)+1;
 });
 if(await page.evaluate(()=>G.peaceful16)){await page.keyboard.press('r');await page.waitForFunction(()=>!G.peaceful16);}
 await page.keyboard.press('i');await page.waitForFunction(()=>STATE==='bag');
 await page.locator('[data-tab="weapons"]').click();await page.locator('[data-right="stick_wood"]').click();
 await page.keyboard.press('Escape');await page.waitForFunction(()=>STATE==='play');
 const measure=()=>page.evaluate(measureStickGripContact,{firstPerson:false});
 await page.waitForFunction(()=>PH.W.stick.visible);
 const idle=await measure();check('grip-live-stick-idle',idle.visible&&idle.drawn&&idle.weapon==='stick'&&idle.rootVisible&&idle.recordedSeat===-.014&&idle.angle<=65.00001&&idle.distance<1e-6,idle);
 await page.screenshot({path:output+'/grip-stick-idle.png'});
 await page.keyboard.down('w');await page.waitForTimeout(600);await page.keyboard.up('w');
 const moving=await measure();check('grip-live-stick-movement',moving.angle<=65.00001&&moving.distance<1e-6,moving);
 await page.screenshot({path:output+'/grip-stick-movement.png'});
 await page.keyboard.press('v');await page.waitForFunction(()=>FIRST_PERSON&&VIEW.weapons.stick?.visible);
 const measureView=()=>page.evaluate(measureStickGripContact,{firstPerson:true});
 const firstIdle=await measureView();check('grip-live-first-person-idle',firstIdle.firstPerson&&firstIdle.visible&&firstIdle.drawn&&firstIdle.weapon==='stick'&&firstIdle.rootVisible&&firstIdle.angle<=65.00001&&firstIdle.distance<1e-6,firstIdle);
 await page.screenshot({path:output+'/grip-first-person-idle.png'});
 await page.keyboard.down('w');await page.waitForTimeout(600);await page.keyboard.up('w');
 const firstMoving=await measureView();check('grip-live-first-person-movement',firstMoving.angle<=65.00001&&firstMoving.distance<1e-6,firstMoving);
 await page.screenshot({path:output+'/grip-first-person-movement.png'});
 await page.keyboard.press('v');await page.waitForFunction(()=>!FIRST_PERSON);
}


