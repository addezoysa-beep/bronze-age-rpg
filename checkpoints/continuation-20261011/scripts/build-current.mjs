import fs from 'node:fs';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {buildOffline} from './build-offline.mjs';
const root=new URL('../',import.meta.url),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const baseline=fs.readFileSync(new URL('index.html',root)),published=buildOffline(baseline);
if(hash(published)!=='5a8cad0527f72a80bfc4d991c82b38ed80062842881b774eff2ffd1d19963f4f')throw Error('Published seed identity mismatch');
const hunks=JSON.parse(fs.readFileSync(new URL('seed-recovery.json',import.meta.url),'utf8'));
let at=0;const chunks=[];for(const h of hunks){if(!Number.isInteger(h.start)||!Number.isInteger(h.end)||h.start<at||h.end<h.start||h.end>published.length)throw Error('Invalid recovery hunk');chunks.push(published.subarray(at,h.start),Buffer.from(h.text));at=h.end;}chunks.push(published.subarray(at));
const recovered=Buffer.concat(chunks);if(hash(recovered)!=='bf1405897255eeba324ca3095b49cf972bd7184b1f5f060c3dec952377a04fa1')throw Error('Recovered cinematic source identity mismatch');
fs.mkdirSync(new URL('recovered/',root),{recursive:true});fs.writeFileSync(new URL('recovered/Cinematic-Lock-Lesson.html',root),recovered);
delete process.env.WDS_CANDIDATE_FILE;
await import('./build-continuation.mjs');
const name='Wine-Dark-Sea-Combined-Cinematic.html',candidate=fs.readFileSync(new URL(name,root));
if(hash(candidate)!=='6aa6095bb9d6a52836c28a6897d4c580c94bbd6fada8c582fd810bf310bc2671')throw Error('Combined candidate identity mismatch');
fs.mkdirSync(new URL('dist/',root),{recursive:true});fs.writeFileSync(new URL('dist/'+name,root),candidate);
fs.writeFileSync(new URL('dist/current-build-manifest.json',root),JSON.stringify({file:name,buildSha256:hash(candidate),bytes:candidate.length,recoveredSourceSha256:hash(recovered),preservedPublishedSeedSha256:hash(published),milestoneAcceptance:'pending',includes:['cinematic opening','animated FP/TP sling','all local continuation patches through storage and dungeon atmosphere','main-story/guard/puzzle cinematic extension','ghost stable seller removal','saved graphics policy retained','offscreen wild-horse presentation budget','reused exact weapon seat vector','unchanged cloth pose cache','inclusive active rig/dungeon factory timings','failed Continue preserves manual save slots','direct ecology bucket queries without per-actor neighbour arrays','exact reused greatsword support wrist temporaries','exact shared anatomical arm and palm math temporaries','transactional wagon arrival and once-only fares/refunds','rechecked fast travel landing and explicit foot departure','atomic single-parse save decode preserving legacy inventory/remedies','exact ranged and held-weapon scratch transforms preserving final shaft seating','unchanged rigid melee-trail bounding cache with attribute/morph invalidation','exact cylinder transform hoisting and anatomical loft ring-point reuse','swept furniture-aware tavern routes with bounded target-directed search','NPC firing material preserved across finite fort release and recovery','bounded startup/save timing diagnostics','optional roadfinding deferred for 20 seconds after save restore','stationary terrain refresh suppression when cache state is unchanged']},null,2)+'\n');
console.log(JSON.stringify({file:name,sha256:hash(candidate),bytes:candidate.length}));


