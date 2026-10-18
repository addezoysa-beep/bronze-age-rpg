import vm from 'node:vm';import {mechanismHarness,line,range} from './dungeon-mechanism-harness.mjs';
// Actual native terrain field, causeway and floor mesh, not a flat floor stub.
// Enemy population, sounds and HUD remain controlled by mechanismHarness.
export function puzzleTerrainHarness(id='cave',checkpoint=true){
 const h=mechanismHarness(id,checkpoint),{c,d}=h;
 vm.runInContext(line('const sstep=')+'\n'+line('function geology41(')+'\n'+line('function floorSample26(')+'\n'+range('function naturalRoutes41(','const ROCK_MAT41=')+'\n'+range('function naturalFloorBuild26(','const routes26Before=')+'\n'+line('function dungeonFloor(')+'\n'+line('const floor26Before=dungeonFloor;')+'\n'+range('function dgSolid(','function canStand('),c);
 c.naturalFloorBuild26(d);
 // Retain actual native build -> natural terrain dispatch for fresh rooms too.
 vm.runInContext(line('function buildVerticalRoutes(')+'\n'+line('function naturalDungeon26(')+'\n'+line('const routes26Before=buildVerticalRoutes;')+'\n'+line('const verticalBuild=buildDungeon;'),c);return h;
}
export function renderedFloor(c,d,x,z){d.terrain26.mesh.updateMatrixWorld(true);const ray=new c.THREE.Raycaster(new c.THREE.Vector3(x,20,z),new c.THREE.Vector3(0,-1,0),0,30),hit=ray.intersectObject(d.terrain26.mesh,false)[0];return hit?.point.y??null;}
