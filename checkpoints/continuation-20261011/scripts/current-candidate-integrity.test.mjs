import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
test('actual current builder preserves seed and compiles every delivered script including latest QOL modules',()=>{
 const root=new URL('../',import.meta.url),name='Current-QOL-Integrity-Fixture.html';
 const output=execFileSync(process.execPath,['scripts/build-continuation.mjs'],{cwd:fileURLToPath(root),env:{...process.env,WDS_CANDIDATE_FILE:name},encoding:'utf8'});
 const manifest=JSON.parse(output.trim()),bytes=fs.readFileSync(new URL(name,root)),html=bytes.toString('utf8'),seed=fs.readFileSync(new URL('recovered/Cinematic-Lock-Lesson.html',root),'utf8'),end=seed.lastIndexOf('</script>');
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),manifest.sha256);assert.equal(bytes.length,manifest.bytes);
 assert.ok(html.startsWith(seed.slice(0,end)));assert.ok(html.endsWith(seed.slice(end)));
 const scripts=[...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)].filter(m=>!/src\s*=/.test(m[1]));assert.equal(scripts.length,3);for(const m of scripts)new vm.Script(m[2]);
 for(const marker of ['CLOTHING_MENU_133','PHTHIA_REGION_134','PLAYER_HELMET_ORNAMENT_136','RESOURCE_DIRECTIONS_137','WORKPLACE_ROUTING_138','COURT_WORK_ANCHORS_139','ZIGGURAT_ACCESS_140','TROY_WALL_ACCESS_141'])assert.ok(html.includes(marker),marker);
 assert.ok(html.includes('GRANARY_SERVICE_142'));assert.ok(html.includes('PAN_OBJECTIVE_RECOVERY_143'));
 assert.ok(html.includes('TAVERN_RESIDENCE_GUARD_145'));assert.ok(!html.includes('HEALER_REACH_GUARD_144'),'independent healer draft stays outside candidate under regression');
 assert.ok(html.includes('LOAD_PERFORMANCE_146'));
 assert.ok(html.includes('CLOTH_POSE_CACHE_148'));assert.ok(html.includes('CONTINUE_SAVE_SAFETY_150'));
 assert.ok(html.includes('ECOLOGY_QUERY_151'));assert.ok(html.includes('GREATSWORD_SCRATCH_152'));
 assert.ok(html.includes('RIG_MATH_SCRATCH_153'));assert.ok(html.indexOf('RIG_MATH_SCRATCH_153')<html.indexOf('CONTINUATION_ANATOMICAL_SHAFT_GRIP_V1'),'final shaft seating wraps optimized base grip');assert.ok(html.includes('ROAD_TRAVEL_TRANSACTION_154'));
 assert.ok(!html.includes('TROJAN_PREWAR_135'),'incomplete lower-priority campaign stays outside playable candidate');
});

