// Diagnostic rendered rigs; full weapon matrix and visual acceptance remain open.
export async function runGripScenario(page,check,output){
 await page.evaluate(()=>{
  if(STATE==='talk')cancelDialogue();G.inv.stick_wood=(G.inv.stick_wood||0)+1;
 });
 await page.keyboard.press('i');await page.waitForFunction(()=>STATE==='bag');
 await page.locator('[data-tab="weapons"]').click();await page.locator('[data-right="stick_wood"]').click();
 await page.keyboard.press('Escape');await page.waitForFunction(()=>STATE==='play');
 const measure=()=>page.evaluate(()=>{
  PH.g.updateWorldMatrix(true,true);
  const item=PH.W.stick,wrist=PH.armR.userData.wrist;
  const anchor=wrist.localToWorld(new THREE.Vector3(0,-.098,.034));
  return {angle:new THREE.Quaternion().angleTo(wrist.quaternion)*180/Math.PI,
   distance:item.localToWorld(new THREE.Vector3(0,0,0)).distanceTo(anchor),visible:item.visible,firstPerson:FIRST_PERSON};
 });
 await page.waitForFunction(()=>PH.W.stick.visible);
 const idle=await measure();check('grip-live-stick-idle',idle.visible&&idle.angle<=65.00001&&idle.distance<1e-6,idle);
 await page.screenshot({path:output+'/grip-stick-idle.png'});
 await page.keyboard.down('w');await page.waitForTimeout(600);await page.keyboard.up('w');
 const moving=await measure();check('grip-live-stick-movement',moving.angle<=65.00001&&moving.distance<1e-6,moving);
 await page.screenshot({path:output+'/grip-stick-movement.png'});
 await page.keyboard.press('v');await page.waitForFunction(()=>FIRST_PERSON&&VIEW.weapons.stick?.visible);
 const measureView=()=>page.evaluate(()=>{
  VIEW_ROOT.updateWorldMatrix(true,true);
  const item=VIEW.weapons.stick,wrist=VIEW.right.userData.wrist;
  const anchor=wrist.localToWorld(new THREE.Vector3(0,-.098,.034));
  return {angle:new THREE.Quaternion().angleTo(wrist.quaternion)*180/Math.PI,
   distance:item.localToWorld(new THREE.Vector3()).distanceTo(anchor),visible:item.visible,firstPerson:FIRST_PERSON};
 });
 const firstIdle=await measureView();check('grip-live-first-person-idle',firstIdle.firstPerson&&firstIdle.visible&&firstIdle.angle<=65.00001&&firstIdle.distance<1e-6,firstIdle);
 await page.screenshot({path:output+'/grip-first-person-idle.png'});
 await page.keyboard.down('w');await page.waitForTimeout(600);await page.keyboard.up('w');
 const firstMoving=await measureView();check('grip-live-first-person-movement',firstMoving.angle<=65.00001&&firstMoving.distance<1e-6,firstMoving);
 await page.screenshot({path:output+'/grip-first-person-movement.png'});
 await page.keyboard.press('v');await page.waitForFunction(()=>!FIRST_PERSON);
}
