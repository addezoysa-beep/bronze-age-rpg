import crypto from 'node:crypto';import vm from 'node:vm';import {repairDungeonMatteLifecycle} from './dungeon-matte-lifecycle-patch.mjs';import {repairAriadneStory} from './ariadne-story-patch.mjs';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
export function assembleDungeonStoryCandidate(prior){
 if(hash(prior)!=='1ed345ed4e84affbd7c1c1c590adca5d9619168b5773cc63b47c665731ab1822')throw Error('Preserved272 identity changed');
 const output=Buffer.from(repairAriadneStory(repairDungeonMatteLifecycle(prior.toString('utf8')))),scripts=[...output.toString('utf8').matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)];
 if(scripts.length!==3||scripts.some(m=>/src\s*=/.test(m[1])))throw Error('Offline script contract changed');for(const m of scripts)new vm.Script(m[2]);return output;
}
