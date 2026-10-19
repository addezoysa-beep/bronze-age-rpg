import test from 'node:test';import assert from 'node:assert/strict';import {riverCityHarness,installRiverSaveBackend} from './river-city-harness.mjs';
const place=(c,p,y)=>Object.assign(c.P,{x:p.x,z:p.z,y:y??p.y??0,mode:'foot',dead:false,grounded:true});
function start(){const h=riverCityHarness(true,true);h.c.installCities264();return h;}
test('all four built palaces have stable distinct rooms and a clear front portal, not just an exterior collider',()=>{const {c}=start();const origins=[];
 for(const city of c.cities264){assert.ok(city.palaceBuilt268);const d=c.DUN[city.hall269];assert.equal(d.riverHall269,city.id);assert.equal(d.objs.filter(o=>o[2]==='S').length,1);origins.push(d.ox);const p=city.hallDoor269;assert.equal(c.colBlocked(p.x,p.z,.6),false);assert.equal(p.z,city.palaceZ+17.4);const entry=c.INTS.find(i=>i.riverEntry269===city.hall269);assert.ok(entry);assert.equal(entry.vis(),false);place(c,p);assert.equal(entry.vis(),true);}
 assert.equal(new Set(origins).size,4);
});
test('actual native entry, floor grid, public furnishings/NPCs, and exit work for each new hall',()=>{const {c}=start();
 for(const city of c.cities264){const entry=c.INTS.find(i=>i.riverEntry269===city.hall269);place(c,city.hallDoor269);c.STATE='play';entry.act();const dg=c.DG;assert.equal(dg.id,city.hall269);assert.ok(dg.riverHall269);assert.equal(dg.spawns.length,0);assert.equal(dg.chests.length,0);assert.equal(dg.solids.filter(s=>s.riverHall269).length,7);assert.equal(dg.ints.filter(i=>i.label().startsWith('Speak to ')).length,2);assert.ok(dg.group.children.some(m=>m.geometry?.attributes?.position?.count>100));
  const col=Math.floor((c.P.x-dg.ox)/c.TS),row=Math.floor(c.P.z/c.TS);assert.equal(dg.grid[row*dg.W+col],0);const exit=dg.ints.find(i=>i.label().startsWith('Leave the '));assert.ok(exit);place(c,exit);exit.act();assert.equal(c.AREA,'over');assert.equal(c.P.x,city.hallDoor269.x);assert.equal(c.P.z,city.hallDoor269.z);assert.equal(c.P.y,city.hallDoor269.y);
 }
 assert.deepEqual(JSON.parse(JSON.stringify(c.G.inv)),{});assert.deepEqual(JSON.parse(JSON.stringify(c.G.F)),{});
});
test('new summit and hall callbacks reject remote, wrong-area, dead, mounted, airborne and stale room access',()=>{const {c}=start(),entries=c.INTS.filter(i=>i.riverEntry269);assert.equal(entries.length,7);
 for(const e of entries){const def=c.DUN[e.riverEntry269],city=c.cities264.find(v=>v.hall269===e.riverEntry269||'zig_'+v.id===e.riverEntry269),y=e.riverEntry269.startsWith('zig_')?city.top:city.hallDoor269.y;
  const invalid=[()=>c.P.x+=100,()=>c.P.y+=3,()=>c.P.dead=true,()=>c.P.mode='horse',()=>c.P.grounded=false,()=>c.AREA='other',()=>c.STATE='pause',()=>c.P.x=NaN,()=>c.DUN[e.riverEntry269]={...def}];
  for(const bad of invalid){c.AREA='over';c.STATE='play';c.DG=null;c.DUN[e.riverEntry269]=def;place(c,e,y);bad();assert.equal(e.vis(),false,e.riverEntry269);e.act();assert.equal(c.DG,null);}
  c.DUN[e.riverEntry269]=def;
 }
});
test('native entered hall is reused on return without duplicate actors, solids or rewards',()=>{const {c}=start(),city=c.cities264[0],e=c.INTS.find(i=>i.riverEntry269===city.hall269);place(c,city.hallDoor269);e.act();const dg=c.DG,children=dg.group.children.length,solids=dg.solids.length,n=c.actors.length,inv=JSON.stringify(c.G.inv);c.leaveDungeon();e.act();assert.equal(c.DG,dg);assert.equal(c.actors.length,n);assert.equal(dg.group.children.length,children);assert.equal(dg.solids.length,solids);assert.equal(JSON.stringify(c.G.inv),inv);
});
test('occupied room origins and blocked palace doorway fail closed without overwriting saved definitions',()=>{const {c}=riverCityHarness(true,true),older={ox:90400,W:14,name:'Existing room'};c.DUN.older=older;c.installCities264();assert.equal(c.DUN.older,older);assert.equal(c.cities264[0].hall269,undefined);assert.equal(c.cities264[0].hallPlacement269,'room_conflict');assert.equal(c.DUN.palace_river269_ur,undefined);
 const city=c.cities264[1],id=city.hall269;delete c.DUN[id];delete c.DGS[id];delete city.hall269;c.addRect(city.hallDoor269.x,city.hallDoor269.z,.6,.6);c.installRiverHalls269();assert.equal(city.hallPlacement269,'blocked_door');assert.equal(c.DUN[id],undefined);
});
test('hall conversations use live actor coordinates and reject dead/hostile/stale-area callbacks',()=>{const {c}=start(),city=c.cities264[0],e=c.INTS.find(i=>i.riverEntry269===city.hall269);place(c,city.hallDoor269);e.act();const dg=c.DG,n=c.actors.find(n=>n.area===dg.id),talk=dg.ints.find(i=>i.label()==='Speak to '+n.name);let called=0;n.talk=()=>called++;place(c,n);talk.act();assert.equal(called,1);n.x+=1;assert.equal(talk.x(),n.x);n.dead=true;talk.act();n.dead=false;n.hostile=true;talk.act();n.hostile=false;c.AREA='over';talk.act();c.AREA=dg.id;c.DGS[dg.id]={...dg};talk.act();assert.equal(called,1);
});
test('native checkpoint backend preserves exact hall position and outdoor return point; no automatic save accepted',()=>{const {c}=start(),city=c.cities264[0],e=c.INTS.find(i=>i.riverEntry269===city.hall269);place(c,city.hallDoor269);e.act();const storage=installRiverSaveBackend(c);c.P.x+=1.125;c.P.z-=1.25;c.P.y=0;c.STATE='pause';assert.equal(c.save(),false);assert.equal(storage.size,0);assert.equal(c.save(true),true);const stored=JSON.parse(storage.get('slot1')),expected=JSON.parse(JSON.stringify(stored.checkpoint21));assert.equal(expected.area,city.hall269);assert.equal(expected.out.x,city.hallDoor269.x);assert.equal(expected.out.z,city.hallDoor269.z);
 c.G=stored;c.P.x=c.P.z=-100;c.P.y=3;c.AREA='over';c.DG=null;c.continueGame();for(const k of['x','y','z','yaw','mode'])assert.equal(c.P[k],expected[k]);assert.equal(c.AREA,expected.area);assert.equal(c.DG.out.x,expected.out.x);assert.equal(c.DG.out.z,expected.out.z);assert.equal(storage.size,1);
 const steward=c.NPCS.find(n=>n.name==='Kurigalzu Palace Steward');assert.equal(c.colBlocked(steward.x,steward.z,.5),false);
});
