import crypto from 'node:crypto';import vm from 'node:vm';import {repairWorldLootTransactions} from './world-loot-transactions-patch.mjs';import {repairKeyQuantity} from './key-quantity-patch.mjs';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
export function assembleLootCandidate(prior){
 if(hash(prior)!=='5838fa869a37ba398be252d69ed06559f0f54c78e28be58578a46ce76777e975')throw Error('Preserved274 identity changed');
 const output=Buffer.from(repairKeyQuantity(repairWorldLootTransactions(prior.toString('utf8')))),scripts=[...output.toString('utf8').matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)];
 if(scripts.length!==3||scripts.some(m=>/src\s*=/.test(m[1])))throw Error('Offline script contract changed');for(const m of scripts)new vm.Script(m[2]);return output;
}
