import fs from 'node:fs';import crypto from 'node:crypto';import {assembleRiverCityCandidate} from './assemble-river-city-candidate.mjs';
const root=new URL('../',import.meta.url),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
await import('./build-reconciled-candidate.mjs');const prior=fs.readFileSync(new URL('dist/Wine-Dark-Sea-Reconciled-267.html',root)),output=assembleRiverCityCandidate(prior),file='Wine-Dark-Sea-River-Cities-269.html';
fs.writeFileSync(new URL('dist/'+file,root),output);const manifest={file,sha256:hash(output),buildSha256:hash(output),bytes:output.length,prior267Sha256:hash(prior),inlineScripts:3,acceptance:'pending',scope:'Full-footprint city palace placement/reservations, four public halls and guarded summit/room callbacks; ordinary browser, navigation, pause Save/reload and Master acceptance pending'};
fs.writeFileSync(new URL('dist/river-cities-269-manifest.json',root),JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify(manifest));
