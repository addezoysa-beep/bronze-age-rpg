import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script, createContext } from 'node:vm';
import { buildOffline } from './build-offline.mjs';

const source=buildOffline(readFileSync(new URL('../index.html',import.meta.url))).toString();
const scripts=[...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)];
const context=createContext({});
new Script(scripts[1][1]).runInContext(context);
const {THREE}=context;
context.DOWN_AXIS=new THREE.Vector3(0,-1,0);context.GRIP_X23=new THREE.Vector3(1,0,0);
const grip=source.split('\n').find(l=>l.startsWith('closeGrip23=function('));
const fingers=source.split('\n').find(l=>l.startsWith('function gripHand('));
assert.ok(grip&&fingers);
new Script(fingers+'\n'+grip+';globalThis.grip=closeGrip23;').runInContext(context);

test('production grips keep scaled weapon handles at the finger anchor during torso and arm motion',()=>{
 for(const handle of [0,-.08,.03])for(const side of [-1,1]){
  const root=new THREE.Group(),arm=new THREE.Group(),wrist=new THREE.Group(),socket=new THREE.Group(),item=new THREE.Group();
  root.add(arm);arm.add(wrist);wrist.add(socket);socket.add(item);
  root.scale.setScalar(1.7);arm.position.set(side*.245,1.415,0);wrist.position.set(0,-.27,0);socket.position.set(0,-.04,.012);item.scale.setScalar(1.3);
  const palm=new THREE.Group();palm.userData.fingers=Array.from({length:4},()=>({f:new THREE.Group(),m:new THREE.Group(),tip:new THREE.Group()}));palm.userData.thumb=new THREE.Group();
  arm.userData={wrist,palm,side59:side};
  for(let i=0;i<15;i++){
   root.rotation.set(i*.009,i*.08,i*.005);arm.rotation.set(i*.07,0,side*i*.014);item.quaternion.setFromAxisAngle(new THREE.Vector3(1,0,0),i*.11);root.updateMatrixWorld(true);
   const before=item.getWorldQuaternion(new THREE.Quaternion());context.grip(arm,item,handle);root.updateMatrixWorld(true);
   const actual=item.localToWorld(new THREE.Vector3(0,handle,0)),expected=wrist.localToWorld(new THREE.Vector3(0,-.098,.034));
   assert.ok(actual.distanceTo(expected)<1e-9,'shaft handle must remain centered in the finger anchor');
   assert.ok(item.getWorldQuaternion(new THREE.Quaternion()).angleTo(before)<1e-7,'gripping must preserve the weapon world direction');
   assert.equal(palm.userData.fingers[0].f.rotation.x,-.95);
  }
 }
});
test('hidden and detached weapons leave the wrist unchanged',()=>{
 const wrist=new THREE.Group(),arm=new THREE.Group(),item=new THREE.Group();arm.userData.wrist=wrist;item.visible=false;
 const before=wrist.quaternion.clone();context.grip(arm,item);assert.ok(wrist.quaternion.equals(before));
 item.visible=true;context.grip(arm,item);assert.ok(wrist.quaternion.equals(before));
});

test('extreme shaft directions cannot invert the wrist or break the finger attachment',()=>{
 for(const side of [-1,1])for(let i=0;i<72;i++){
  const root=new THREE.Group(),arm=new THREE.Group(),elbow=new THREE.Group(),wrist=new THREE.Group(),socket=new THREE.Group(),item=new THREE.Group();
  root.add(arm);arm.add(elbow);elbow.add(wrist);wrist.add(socket);socket.add(item);
  root.scale.setScalar(1.7);arm.rotation.set(.6,i*.08,side*.3);elbow.rotation.x=.9;wrist.position.y=-.27;socket.position.set(0,-.04,.012);item.scale.setScalar(1.3);
  arm.userData={wrist,side59:side};item.quaternion.setFromAxisAngle(new THREE.Vector3(0,0,1),i*Math.PI/36);
  root.updateMatrixWorld(true);const world=item.getWorldQuaternion(new THREE.Quaternion());
  context.grip(arm,item,-.08);root.updateMatrixWorld(true);
  assert.ok(new THREE.Quaternion().angleTo(wrist.quaternion)<=Math.PI*65/180+1e-9,'wrist must stay within the articulation limit');
  assert.ok(item.getWorldQuaternion(new THREE.Quaternion()).angleTo(world)<1e-7,'bounded wrist must preserve the weapon direction');
  assert.ok(item.localToWorld(new THREE.Vector3(0,-.08,0)).distanceTo(wrist.localToWorld(new THREE.Vector3(0,-.098,.034)))<1e-9);
 }
});


