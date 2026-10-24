import crypto from 'node:crypto';import vm from 'node:vm';
import {repairRiverCityPlacement} from './river-city-placement-patch.mjs';
import {repairRiverCityAccess} from './river-city-access-patch.mjs';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
export function assembleRiverCityCandidate(prior){
 if(hash(prior)!=='1acd66041941e98abe23471cdfb28571350ac7503983677981635d92200af2b1')throw Error('Preserved reconciled267 identity changed');
 const output=Buffer.from(repairRiverCityAccess(repairRiverCityPlacement(prior.toString('utf8'))));
 const scripts=[...output.toString('utf8').matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)];if(scripts.length!==3||scripts.some(m=>/src\s*=/.test(m[1])))throw Error('Offline inline script contract changed');for(const m of scripts)new vm.Script(m[2]);return output;
}
