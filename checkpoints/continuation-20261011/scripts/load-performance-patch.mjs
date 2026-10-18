export const loadPerformancePatch=String.raw`
/* LOAD_PERFORMANCE_146: bounded startup/save timings and deferred optional road work. */
const LOAD_PERF146={stages:Object.create(null),roadResumeAt:0,roadDeferrals:0,stationaryRequestsSkipped:0};
function loadStage146(name,fn){return function(...args){const start=performance.now();let recorded=false;const finish=()=>{if(recorded)return;recorded=true;const ms=performance.now()-start,s=LOAD_PERF146.stages[name]||(LOAD_PERF146.stages[name]={calls:0,lastMs:0,totalMs:0,maxMs:0});s.calls++;s.lastMs=ms;s.totalMs+=ms;s.maxMs=Math.max(s.maxMs,ms);};try{const result=fn.apply(this,args);if(result&&typeof result.finally==='function')return result.finally(finish);finish();return result;}catch(e){finish();throw e;}};}
populate=loadStage146('peopleAndPlaces',populate);
finalizeIslands=loadStage146('architectureBuckets',finalizeIslands);
buildDepthAndMap=loadStage146('seaChart',buildDepthAndMap);
warmStream=loadStage146('nearbyTerrain',warmStream);
init=loadStage146('coldStartup',init);
const continueLoad146Before=continueGame;continueGame=loadStage146('restoreSave',function(...args){const result=continueLoad146Before.apply(this,args);LOAD_PERF146.roadResumeAt=performance.now()+20000;return result;});
// Measure the synchronous storage decode and UI entry path separately. This lets
// a real old-save run distinguish JSON/migration work from world restoration.
if(typeof loadGame==='function')loadGame=loadStage146('decodeSave',loadGame);
if(typeof startGame==='function')startGame=loadStage146('startSavedGame',startGame);
// Complete saved NPC, quest, collision and equipment restoration immediately.
// Only optional road mesh/A* preparation waits; live actors and enemies do not.
roadWork15=function(){if(ROAD_JOB18)return;ROAD_JOB18=true;const job=()=>{ROAD_JOB18=false;if(!ROADS15.queue.length){ROADS15.ready=true;return;}if(performance.now()<LOAD_PERF146.roadResumeAt){LOAD_PERF146.roadDeferrals++;scheduleRoad18(500);return;}if(STREAM.building||STATE==='play'&&combatMusic14()){scheduleRoad18(350);return;}const nearby=nearestIsle(P.x,P.z),i=ROADS15.queue.findIndex(e=>e.region.id===nearby),edge=ROADS15.queue.splice(i<0?0:i,1)[0],{region}=edge,a=region.nodes[edge.a],b=region.nodes[edge.b],step=edge.retry?3:edge.dist>600?10:edge.dist>220?6:3,res=walkPath15(a,b,edge.retry?650:400,step);if(res.done&&res.path.length){edge.path=[{x:a.x,z:a.z},...res.path];region.paths.push(edge);a.edges.push(edge);b.edges.push(edge);roadMesh15(edge.path);roadSign15(region,a);roadSign15(region,b);}else if(!edge.retry){edge.retry=true;ROADS15.queue.push(edge);}scheduleRoad18(STATE==='title'?60:180);};if(typeof requestIdleCallback==='function')requestIdleCallback(job,{timeout:1500});else setTimeout(job,30);};
// The old quarter-second refresh rebuilds/sorts queues even at identical focus.
// Never suppress a changed destination, quality radius/cache limit or tile set.
function streamCacheSame146(q){if(!q||q.tiles!==STREAM.tiles||q.count!==STREAM.tiles.size||q.queue!==STREAM.queue||q.worker!==STREAM.worker||q.ready!==STREAM.ready)return false;let i=0;for(const key of STREAM.tiles.keys()){if(q.keys[i]!==key||q.values[i]!==STREAM.tiles.get(key))return false;i++;}return true;}
let requestLoad146Last=null;const requestLoad146Before=requestStream;requestStream=function(x,z){const q=requestLoad146Last;if(q&&q.x===x&&q.z===z&&q.prefetch===STREAM.prefetch&&q.limit===STREAM.limit&&q.size===STREAM.size&&streamCacheSame146(q)){LOAD_PERF146.stationaryRequestsSkipped++;return;}const result=requestLoad146Before.apply(this,arguments);requestLoad146Last={x,z,prefetch:STREAM.prefetch,limit:STREAM.limit,size:STREAM.size,tiles:STREAM.tiles,count:STREAM.tiles.size,queue:STREAM.queue,worker:STREAM.worker,ready:STREAM.ready,keys:Array.from(STREAM.tiles.keys()),values:Array.from(STREAM.tiles.values())};return result;};
window.__WDS_LOAD_PERF__={snapshot(){return{stages:Object.fromEntries(Object.entries(LOAD_PERF146.stages).map(([k,v])=>[k,{...v}])),roadGraceRemainingMs:Math.max(0,LOAD_PERF146.roadResumeAt-performance.now()),roadDeferrals:LOAD_PERF146.roadDeferrals,stationaryRequestsSkipped:LOAD_PERF146.stationaryRequestsSkipped,scope:'CPU/load-stage wall times; no reference-device FPS claim; saved-state decode/restoration is immediate, optional roads deferred for 20 seconds'};}};
`;

