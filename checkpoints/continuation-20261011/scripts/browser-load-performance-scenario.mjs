// CI software-rendered fresh-save observation, not old-save/reference-device
// acceptance or ten-attacker combat. Common harness uses ordinary Save/Load.
export async function runLoadPerformanceScenario(page,check,report){
 const before=await page.evaluate(()=>({preset:GRAPHICS28.preset,load:window.__WDS_LOAD_PERF__?.snapshot(),x:P.x,z:P.z}));
 check('low-preset-retained-through-ordinary-reload',before.preset==='low',before);
 check('load-stage-timings-present',before.load?.stages.restoreSave.calls>=1&&Object.values(before.load.stages).every(s=>Number.isFinite(s.lastMs)&&s.lastMs>=0),before.load);
 await page.evaluate(()=>window.__WDS_PERF__?.reset());
 report.postLoadObservation={scope:'60 seconds after ordinary fresh-save reload on CI software rendering. Captures load-stage timing plus frame p95/maximum and long-frame counts. Not representative old-save or reference-device combat FPS.',samples:[]};
 for(let i=0;i<12;i++){
  if(i===0){await page.keyboard.down('w');await page.waitForTimeout(1000);await page.keyboard.up('w');}
  await page.waitForTimeout(i===0?4000:5000);
  report.postLoadObservation.samples.push(await page.evaluate(()=>({at:performance.now(),state:STATE,preset:GRAPHICS28.preset,position:{x:P.x,z:P.z},frame:window.__WDS_PERF__?.snapshot(),load:window.__WDS_LOAD_PERF__?.snapshot(),terrain:{tiles:STREAM.tiles.size,pending:STREAM.queue.length},attackers:ENEMIES.filter(e=>e.alive&&!e.friendly&&e.area===AREA&&hyp(e.x-P.x,e.z-P.z)<50).length})));
 }
 const last=report.postLoadObservation.samples.at(-1);
 report.postLoadObservation.summary={frameP95Ms:last.frame?.sections?.frame?.p95??null,frameMaxMs:last.frame?.sections?.frame?.max??null,intervalP95Ms:last.frame?.sections?.interval?.p95??null,longFrames:last.frame?.longFrames??null,cpuLongFrames:last.frame?.cpuLongFrames??null,roadDeferrals:last.load?.roadDeferrals??null,stationaryRequestsSkipped:last.load?.stationaryRequestsSkipped??null};
 check('low-postload-observation-complete',last.state==='play'&&last.preset==='low'&&last.frame.samples>0&&report.postLoadObservation.samples.length===12,last);
 check('low-postload-frame-telemetry-recorded',Number.isFinite(report.postLoadObservation.summary.frameP95Ms)&&Number.isFinite(report.postLoadObservation.summary.longFrames),report.postLoadObservation.summary);
 check('ordinary-postload-movement',Math.hypot(last.position.x-before.x,last.position.z-before.z)>.1,{before,after:last.position});
}
