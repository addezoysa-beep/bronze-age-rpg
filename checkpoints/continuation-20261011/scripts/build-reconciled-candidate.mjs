import fs from 'node:fs';import crypto from 'node:crypto';
import {assembleReconciledCandidate} from './assemble-reconciled-candidate.mjs';
const root=new URL('../',import.meta.url),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
// Rebuild master259 from its exact recovered cinematic seed. Never import an older baseline.
delete process.env.WDS_CANDIDATE_FILE;await import('./build-continuation.mjs');
const prior=fs.readFileSync(new URL('Wine-Dark-Sea-Combined-Cinematic.html',root));
const seed=fs.readFileSync(new URL('recovered/Cinematic-Lock-Lesson.html',root),'utf8');
const output=assembleReconciledCandidate(prior,seed);
const name='Wine-Dark-Sea-Reconciled-267.html';
fs.mkdirSync(new URL('dist/',root),{recursive:true});fs.writeFileSync(new URL('dist/'+name,root),output);
const manifest={file:name,sha256:hash(output),buildSha256:hash(output),bytes:output.length,master259Sha256:hash(prior),attachment260Sha256:'55e9575a84cd2e6ba60e2273698ae8305ccb408f8c97498ee94162d60172190b',inlineScripts:3,acceptance:'pending',scope:'Reconciled city startup/ascent, burial native terrain contact and reachable entrance key sources; no ordinary browser/Save acceptance'};
fs.writeFileSync(new URL('dist/reconciled-267-manifest.json',root),JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify(manifest));
