import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const path='index.html', baseline='14e1907fe630e0d8062a29fb9a58087e46888a0c31198f563842cacb0efbe177';
const sha=b=>createHash('sha256').update(b).digest('hex');
const original=readFileSync(path);
if(sha(original)!==baseline) throw new Error('Expected unchanged Build59; refusing unknown source');
const source=original.toString('utf8');
const lines=source.split('\n');
const matches=lines.map((s,i)=>s.startsWith('const guidePauseBefore=openPause;')?i:-1).filter(i=>i>=0);
if(matches.length!==1)throw new Error('Expected one control-guide creation override');
const n=matches[0];
if(!lines[n].includes("root.appendChild(p)"))throw new Error('Expected guide parent');
lines[n]=lines[n].replace("root.appendChild(p)","root.querySelector('.win .bd').appendChild(p)");
const revised=lines.join('\n');
writeFileSync(path,revised);
const hash=sha(readFileSync(path));
const report={test:'pause-guide-source-patch',status:'passed',beforeSha256:baseline,buildSha256:hash,
 method:'One exact control-guide parent replacement; no forced clicks, pointer-event bypass, or save logic changes',
 line:n+1, runtimeStatus:'pending'};
writeFileSync('verification/records/pause-source-patch.json',JSON.stringify(report,null,2)+'\n');
const tracker=JSON.parse(readFileSync('tracking/milestones.json','utf8'));
for(const m of tracker.milestones)for(const t of m.tests){
 if(t.status!=='pending'){t.previousResult={...t};t.status='pending';delete t.buildSha256;delete t.method;delete t.evidence;delete t.reviewer;}
}
const m0=tracker.milestones.find(m=>m.id==='M0');
m0.blockers=['Revised pause-menu source requires exact-hash save/reload verification','Reference-device performance baseline and remaining history reconciliation pending'];
m0.nextAction='Run ordinary Save click and reload in GitHub Actions, inspect logs and screenshots, then record review';
writeFileSync('tracking/milestones.json',JSON.stringify(tracker,null,2)+'\n');
const record={id:'pause-save-accessibility',createdOn:'2026-10-10',buildSha256:hash,milestoneIds:['M0'],
 summary:'Place the pause control guide inside the menu body so it cannot cover Save. Runtime verification pending.',
 changedFiles:['index.html','scripts/browser-smoke.mjs','tracking/milestones.json','verification/records/pause-source-patch.json'],
 evidence:['verification/records/pause-source-patch.json'],
 masterDelivery:{status:'delivered',evidence:'Prepared in designated Master Development workstream'},
 masterReview:{status:'pending',buildSha256:null,evidence:null},releaseStatus:'candidate'};
writeFileSync('tracking/updates/pause-save-accessibility.json',JSON.stringify(record,null,2)+'\n');
console.log(JSON.stringify(report));
