// Run the existing serial suite without reporter-destination propagation, and
// persist the complete child stream before reporting success. No game runtime.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url)),name=process.argv[2];
if(!/^[a-z0-9-]+$/.test(name||''))throw Error('Provide a simple evidence basename');
const game=path.join(root,'Wine-Dark-Sea-Combined-Cinematic.html'),hash=()=>crypto.createHash('sha256').update(fs.readFileSync(game)).digest('hex'),before=hash();
const tests=fs.readdirSync(path.join(root,'scripts')).filter(p=>p.endsWith('.test.mjs')).sort().map(p=>'scripts/'+p);
const run=spawnSync(process.execPath,['--test','--test-concurrency=1','--test-reporter=tap',...tests],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024});
const tap=run.stdout||'',footer=/\n1\.\.(\d+)\n# tests (\d+)\n# suites \d+\n# pass (\d+)\n# fail (\d+)\n# cancelled (\d+)\n# skipped (\d+)\n# todo (\d+)\n# duration_ms ([\d.]+)\s*$/.exec(tap);
const after=hash(),ok=(tap.match(/^ok \d+ - /gm)||[]).length;
const passed=run.status===0&&!run.error&&footer&&before===after&&+footer[1]===+footer[2]&&+footer[2]===+footer[3]&&ok===+footer[3]&&footer.slice(4,8).every(v=>+v===0)&&!/^not ok /m.test(tap);
const report={status:passed?'passed':'incomplete_or_failed',buildSha256:before,hashUnchanged:before===after,exitCode:run.status,signal:run.signal,error:run.error?.message||null,tests:footer?+footer[2]:null,passed:footer?+footer[3]:null,failed:footer?+footer[4]:null,durationMs:footer?+footer[8]:null,completeFooter:!!footer,okEntries:ok,method:'node --test --test-concurrency=1 --test-reporter=tap scripts/*.test.mjs',scope:'LOCAL source/native/Three/workflow/compile/package; not ordinary browser/render/Save/Master',log:'verification/'+name+'-full-tap.txt'};
fs.mkdirSync(path.join(root,'verification'),{recursive:true});
fs.writeFileSync(path.join(root,report.log),tap+(run.stderr?'\n# Child stderr\n'+run.stderr:''));
fs.writeFileSync(path.join(root,'verification/'+name+'-full-result.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));if(!passed)process.exitCode=1;
