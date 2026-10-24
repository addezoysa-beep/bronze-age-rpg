import crypto from 'node:crypto';import vm from 'node:vm';import {repairEntranceKeyCache} from './entrance-key-cache-patch.mjs';import {repairDungeonDoorTransactions} from './dungeon-door-transactions-patch.mjs';import {repairDungeonBuildAccess} from './dungeon-build-access-patch.mjs';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
export function assembleDungeonKeysCandidate(prior){
 if(hash(prior)!=='1d12bb6ca7ec07056cbe7837523426fb985959edbd7a5c1724578ee848b8eb77')throw Error('Preserved269 identity changed');
 const output=Buffer.from(repairDungeonDoorTransactions(repairDungeonBuildAccess(repairEntranceKeyCache(prior.toString('utf8'))))),scripts=[...output.toString('utf8').matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)];
 if(scripts.length!==3||scripts.some(m=>/src\s*=/.test(m[1])))throw Error('Offline script contract changed');for(const m of scripts)new vm.Script(m[2]);return output;
}
