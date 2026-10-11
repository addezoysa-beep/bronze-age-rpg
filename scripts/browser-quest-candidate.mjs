import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {root,sha256} from './workflow.mjs';
import {runSlingScenario} from './browser-sling-scenario.mjs';
import {runPanScenario} from './browser-pan-scenario.mjs';
const scenario=process.env.WDS_QUEST_SCENARIO||'sling';
if(!['sling','pan'].includes(scenario))throw Error('Unknown quest scenario');
const file=resolve(root,'dist/Wine-Dark-Sea-Save-Fix.html'),out=resolve(root,'verification/runtime/'+scenario);
mkdirSync(out,{recursive:true});
const report={test:scenario+'-ordinary-UI',status:'failed',buildSha256:sha256(readFileSync(file)),scope:scenario==='sling'?'Prepared post-shearing: ordinary grant/revisit/Save/exact reload. Full opening, actual fire/hits/certification and target visuals pending.':'Prepared defeated captain: chest loot/Save/exact reload/nonduplication. Full cave puzzles/boss/Daedalus pending.',checks:[],pageErrors:[],externalRequests:[]};
let browser,page;
const check=(name,passed,detail)=>{report.checks.push({name,passed,detail});console.log(JSON.stringify({name,passed,detail}));if(!passed)throw Error(name);};
try{
 const mod=await import(process.env.PLAYWRIGHT_MODULE_PATH?pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE_PATH)).href:'playwright');
 browser=await (mod.default||mod).chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH});
 report.browser=await browser.version();
 const context=await browser.newContext({viewport:{width:1365,height:768},offline:true});
 await context.addInitScript(()=>localStorage.setItem('wine-dark-graphics28','verylow'));
 page=await context.newPage();page.setDefaultTimeout(180000);
 page.on('pageerror',e=>report.pageErrors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))report.externalRequests.push(r.url())});
 await page.goto(pathToFileURL(file).href,{waitUntil:'load',timeout:60000});
 await page.locator('#bnew').waitFor({state:'visible',timeout:60000});await page.locator('#bnew').click();await page.locator('#new-voyage30, [data-new]').first().click({noWaitAfter:true});
 await page.waitForFunction(()=>G.started&&['play','talk'].includes(STATE),null,{timeout:180000});
 for(let i=0;i<5&&await page.evaluate(()=>STATE!=='play');i++)await page.keyboard.press('Escape');
 await page.waitForFunction(()=>STATE==='play');
 await (scenario==='sling'?runSlingScenario:runPanScenario)(page,check);
 check('no-runtime-errors',report.pageErrors.length===0,report.pageErrors);
 check('offline-no-external-requests',report.externalRequests.length===0,report.externalRequests);
 report.status='passed';
}catch(e){report.error=e.stack||String(e);process.exitCode=1;if(page)try{await page.screenshot({path:resolve(out,'failure.png')})}catch{}}
finally{writeFileSync(resolve(out,'report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));await browser?.close();}
