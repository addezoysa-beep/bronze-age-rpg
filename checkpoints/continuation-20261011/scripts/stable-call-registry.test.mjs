import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import vm from 'node:vm';
import {root} from './workflow.mjs';
import {applyStableCallRegistryCheckpoint,stableCallRegistryRuntime} from './stable-call-registry-checkpoint.mjs';

const source=readFileSync(resolve(root,'index.html'),'utf8');
const built=applyStableCallRegistryCheckpoint(source);

function fixture(){const flags={horse:1},events=[],f={G:{silver:1000,horseName16:'Hippos',horsePower16:2,world:{},inv:{}},P:{mode:'foot',dead:false,x:0,z:0,yaw:0},AREA:'over',HORSE:{q:{g:{userData:{coat:[.4,.3,.2]},parent:{remove(){}}}},x:4,z:5,yaw:.2,here:true,mounted:false},OWN_HORSE_LIFE:{},CHARIOTS:[],F:()=>flags,livingState(){},ownChariot73:c=>!!f.G.world.chariots48?.[c.id48],toast:m=>events.push(m),makeHorse:coat=>({kind:'horse',g:{userData:{coat},parent:{remove(){}},visible:false}}),horseBuild35(){},scene:{add(){}},OVER:{add(){}},save(){f.saved=(f.saved||0)+1;},nearestIsle:()=> 'ikaria',hx:x=>x,hudAll(){},closeDlg(){},say:(name,lines,done,choices)=>{f.menu={name,lines,choices};},stableBuy20:(n,s)=>f.say(n.name,['services'],null,[{t:'Leave',go(){}}]),snapshot(){},continueGame(){},acquireHorse16:a=>{f.G.horseName16=a.name;f.G.horsePower16=a.power;f.HORSE.q=a.q;f.HORSE.x=a.x;f.HORSE.z=a.z;flags.horse=1;},events,flags};vm.createContext(f);vm.runInContext(stableCallRegistryRuntime,f);return f;}

test('old saves migrate the current owned horse without inventing extra mounts',()=>{
  assert.match(built,/id='legacy_horse80'/);
  assert.match(built,/if\(F\(\)\.horse&&!r\.activeHorse\)/);
});
test('acquiring another horse snapshots and retains the previous horse',()=>{
  assert.match(built,/recordCurrentHorse80\(\);const value=acquireRegistry80Before/);
  assert.match(built,/r\.horses\[id\]=\{id,name:/);
  assert.doesNotMatch(built,/r\.horses=\{\}/);
});
test('stable menu exposes every owned horse and owned chariot in one selector',()=>{
  assert.match(built,/for\(const h of horses\)choices\.push/);
  assert.match(built,/for\(const c of chariots\)choices\.push/);
  assert.match(built,/Choose responding mount/);
});
test('horse and chariot selection persist through the existing shared H control',()=>{
  assert.match(built,/G\.world\.mountChoice73='horse'/);
  assert.match(built,/G\.world\.mountChoice73=c\.id48/);
  assert.match(built,/save\(\);toast/);
});
test('unavailable horses and chariots cannot be selected',()=>{
  assert.match(built,/h\.dead\|\|h\.available===false/);
  assert.match(built,/c\.dead\|\|c\.unavailable80/);
});
test('additional stable purchases preserve funds on failure and keep previous horses',()=>{
  assert.match(built,/if\(G\.silver<cost\)return toast/);
  assert.match(built,/G\.silver-=cost;acquireHorse16/);
  assert.match(built,/other registered horses remain at the stable/);
});
test('snapshot records active horse position and load repairs invalid selections',()=>{
  assert.match(built,/snapshot=function\(\)\{recordCurrentHorse80/);
  assert.match(built,/!CHARIOTS\.some\(c=>c\.id48===G\.world\.mountChoice73&&ownChariot73\(c\)\)/);
});
test('runtime registry keeps an old horse when a second horse is acquired',()=>{const f=fixture(),r=f.horseRegistry80();assert.equal(Object.keys(r.horses).length,1);f.acquireHorse16({id:'courser',name:'Bay Courser',power:4,q:f.makeHorse([.2,.1,.1]),x:10,z:11,a:.6});assert.equal(Object.keys(r.horses).length,2);assert.equal(r.horses.legacy_horse80.name,'Hippos');assert.equal(r.activeHorse,'courser');});
test('runtime stable selector switches horses without deleting either record',()=>{const f=fixture(),r=f.horseRegistry80();f.acquireHorse16({id:'courser',name:'Bay Courser',power:4,q:f.makeHorse([.2,.1,.1]),x:10,z:11,a:.6});f.activateHorse80('legacy_horse80',{x:2,z:3});assert.equal(f.G.horseName16,'Hippos');assert.equal(r.activeHorse,'legacy_horse80');assert.equal(Object.keys(r.horses).length,2);assert.equal(f.G.world.mountChoice73,'horse');});
test('runtime chariot selection uses the same persistent call choice',()=>{const f=fixture(),c={id48:'egypt:1',realm:'Egypt'};f.CHARIOTS.push(c);f.G.world.chariots48={[c.id48]:true};f.selectChariot80(c);assert.equal(f.G.world.mountChoice73,c.id48);assert.equal(f.saved,1);});
