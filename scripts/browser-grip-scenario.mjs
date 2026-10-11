// Diagnostic rendered rigs; full weapon matrix and visual acceptance remain open.
export async function runGripScenario(page,check,output){
 await page.evaluate(()=>{
  if(STATE==='talk')cancelDialogue();G.peaceful16=false;G.own.stick=1;equip('stick');
 });
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
}
