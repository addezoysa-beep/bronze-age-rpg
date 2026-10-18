import { readJson, releaseErrors } from './workflow.mjs';
import { parseReleaseArgs, candidateReleaseHash } from './release-candidate-input.mjs';

try {
  const {updatePath,candidatePath}=parseReleaseArgs(process.argv.slice(2));
  const tracker=readJson('tracking/milestones.json');
  const errors = releaseErrors(tracker, readJson(updatePath), candidateReleaseHash(tracker,candidatePath));
  if (errors.length) throw new Error(`Release blocked:\n${errors.join('\n')}`);
  console.log('Release evidence and Master Development review passed for this game hash.');
} catch (error) {
  console.error(error.message); process.exitCode = 1;
}

