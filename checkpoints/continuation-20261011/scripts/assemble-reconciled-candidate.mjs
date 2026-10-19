import crypto from 'node:crypto';import vm from 'node:vm';
import {attachedBronzeAgeAdditions} from './attached-bronze-age-additions.mjs';
import {repairCityAccess} from './reconciled-city-access-patch.mjs';
import {repairDungeonKeySource} from './reachable-dungeon-key-patch.mjs';
import {burialContactReconciliationPatch} from './burial-contact-reconciliation-patch.mjs';
import {repairCampaignGuidance,campaignReconciliationPatch} from './campaign-reconciliation-patch.mjs';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
export function assembleReconciledCandidate(prior,seed){
 if(hash(prior)!=='d7d791a19731c731e1cb3cb98c83c9d7699263ce899bddfe7c3c38413ac60f32')throw Error('Master259 identity changed');
 if(hash(seed)!=='bf1405897255eeba324ca3095b49cf972bd7184b1f5f060c3dec952377a04fa1')throw Error('Cinematic seed identity changed');
 const base=prior.toString('utf8'),end=base.lastIndexOf('</script>');
 const attached=Buffer.from(base.slice(0,end)+attachedBronzeAgeAdditions+base.slice(end));
 if(hash(attached)!=='55e9575a84cd2e6ba60e2273698ae8305ccb408f8c97498ee94162d60172190b')throw Error('Library260 reconstruction changed');
 const additions=repairCampaignGuidance(repairDungeonKeySource(repairCityAccess(attachedBronzeAgeAdditions)));
 const output=Buffer.from(base.slice(0,end)+additions+burialContactReconciliationPatch(seed.toString('utf8'))+campaignReconciliationPatch+base.slice(end));
 const scripts=[...output.toString('utf8').matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)];
 if(scripts.length!==3||scripts.some(m=>/src\s*=/.test(m[1])))throw Error('Offline inline script contract changed');
 for(const m of scripts)new vm.Script(m[2]);return output;
}
