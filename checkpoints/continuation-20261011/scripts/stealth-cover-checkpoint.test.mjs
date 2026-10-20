import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import { applyStealthCoverCheckpoint281, stealthCoverPatch281 } from './stealth-cover-checkpoint.mjs';

function world(){
 const COVER_PATCHES=[],DG={id:'mineA',ox:0,oz:0,W:7,H:7,grid:Array(49).fill(1),chests:[],spawns:[],ints:[],start:{x:2,z:2},bossPos:{x:22,z:22}};
 const open=(x,z)=>{DG.grid[z*DG.W+x]=0;};
 open(3,3);open(4,3); // three solid walls: one-exit alcove
 open(1,1);open(2,1);open(0,1); // ordinary corridor with two exits
 const c={P:{x:14,z:14,crouch:true},AREA:'mineA',DG,DGS:{mineA:DG},TS:4,COVER_PATCHES,atmosphereKind108:()=> 'mine',hyp:Math.hypot,heightAt:()=>5,stealthCover:()=>0,campTent(){c.tents=(c.tents||0)+1;return 'tent-mesh';},globalThis:null};
 c.globalThis=c;vm.createContext(c);vm.runInContext(stealthCoverPatch281,c);return{c,DG};
}
test('new checkpoint inserts only into the third offline script and compiles all three',()=>{
 const html=fs.readFileSync(new URL('../dist/Wine-Dark-Sea-Dialogue-Input-279.html',import.meta.url));
 const out=applyStealthCoverCheckpoint281(html);assert.equal((out.toString().match(/<script\b/gi)||[]).length,3);assert.match(out.toString(),/STEALTH_COVER_281/);assert.throws(()=>applyStealthCoverCheckpoint281(out),/already applied/);
});
test('generated exact-280 descendant contains one live stealth wrapper',()=>{
 const file=new URL('../dist/Wine-Dark-Sea-Stealth-Cover-281.html',import.meta.url);
 if(!fs.existsSync(file))return;
 const html=fs.readFileSync(file,'utf8');
 assert.equal((html.match(/STEALTH_COVER_281: hide only in actual tent shadow or a clear dungeon recess\./g)||[]).length,1);
 assert.match(html,/prior280Sha256/);
 assert.match(html,/function caveAlcoveCover281\(\)/);
 assert.match(html,/tentCoverSites281/);
});
test('a crouched actor receives cover in a clear one-exit mine alcove, not a corridor',()=>{
 const {c}=world();assert.equal(c.caveAlcoveCover281(),1);c.P.x=6;c.P.z=6;assert.equal(c.caveAlcoveCover281(),0);c.P.x=14;c.P.z=14;c.P.crouch=false;assert.equal(c.caveAlcoveCover281(),0);
});
test('alcove cover fails closed for wrong room, occupied objective, or invalid room identity',()=>{
 const {c,DG}=world();DG.chests.push({x:14,z:14});assert.equal(c.caveAlcoveCover281(),0);DG.chests.length=0;c.DGS.mineA={...DG};assert.equal(c.caveAlcoveCover281(),0);c.DGS.mineA=DG;c.AREA='over';assert.equal(c.caveAlcoveCover281(),0);
});
test('actual tent builders register one local concealment patch without adding collision geometry',()=>{
 const {c}=world();assert.equal(c.campTent({},40,40,0,1),'tent-mesh');assert.equal(c.COVER_PATCHES.length,1);assert.equal(c.COVER_PATCHES[0].kind,'tent281');assert.equal(c.stealthCover(),1);c.campTent({},40,40,0,1);assert.equal(c.COVER_PATCHES.length,1);
});
test('tent/cave patch preserves underlying cover and returns a boolean-compatible value',()=>{
 const {c,DG}=world();c.COVER_PATCHES.push({x:14,z:14,r:2});assert.equal(c.stealthCover(),1);c.P.x=100;c.P.z=100;DG.chests.push({x:14,z:14});assert.equal(c.caveAlcoveCover281(),0);assert.equal(c.stealthCover(),0);
});
