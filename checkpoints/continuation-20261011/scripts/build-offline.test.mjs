import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { root, sha256 } from './workflow.mjs';
import { buildOffline, sourceHash, candidateHash } from './build-offline.mjs';

test('reproduce the exact production candidate', () => {
  const source = readFileSync(resolve(root, 'index.html'));
  const result = buildOffline(source);
  assert.equal(sha256(source), sourceHash);
  assert.equal(sha256(result), candidateHash);
  assert.equal(result.length, 37971960);
  assert.equal(sha256(readFileSync(resolve(root, 'index.html'))), sourceHash);
});

test('reject changed source instead of silently applying an obsolete fix', () => {
  const source = readFileSync(resolve(root, 'index.html'));
  assert.throws(() => buildOffline(Buffer.concat([source, Buffer.from('\n')])), /source hash/);
});


// Exercise the actual character wrapper from the delivered HTML, not a mock label lookup.
test('startup character creation tolerates unknown culture and riding instructors use valid styles', () => {
  const html = buildOffline(readFileSync(resolve(root, 'index.html'))).toString('utf8');
  const line = html.split('\n').find(l => l.startsWith('const cultural13NPCBefore=addNPC;'));
  assert.ok(line);
  const f = { REGION_STYLE: {aegean:{label:'Aegean'},egypt:{label:'Egyptian'}}, cultureAt13:()=> 'egypt', faceHash:()=>1,
    culturalProfile:()=>({skin:'skin'}), addNPC:o=>({look:o.look,h:{}}) };
  vm.createContext(f); vm.runInContext(line,f);
  for(const culture of ['aegean','egypt','greek','unknown']) {
    const n=f.addNPC({name:'Test instructor',culture,x:0,z:0,look:{}});
    assert.equal(n.cultureLabel,culture==='aegean'?'Aegean':'Egyptian');
  }
  const source = readFileSync(resolve(root,'scripts/riding-challenges-checkpoint.mjs'),'utf8');
  assert.ok(source.includes("?'egypt':'aegean'"));
  assert.ok(!source.includes("?'egypt':'greek'"));
});

test('startup failure displays actual failing function and line with safe escaping', async () => {
  const html=buildOffline(readFileSync(resolve(root,'index.html'))).toString('utf8');
  const line=html.split('\n').find(l=>l.startsWith("init=async function(){try{loadCaption('Preparing people and places"));
  assert.ok(line);
  const fault={message:"can't find variable: cell",stack:'terrainBuild@file:///test.html:4041:20\n<bad>&'};
  const f={console:{error(){}},loadCaption:t=>f.caption=t,yieldPaint:async()=>{},populate:async()=>{throw fault;}};
  vm.createContext(f);vm.runInContext(line,f);await f.init();
  assert.match(f.caption,/terrainBuild@file:\/\/\/test.html:4041:20/);
  assert.match(f.caption,/Startup diagnostic v2/);
  assert.match(f.caption,/&lt;bad&gt;&amp;/);
  assert.ok(!f.caption.includes('<bad>'));
});
