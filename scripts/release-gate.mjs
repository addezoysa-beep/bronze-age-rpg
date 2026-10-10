import { readJson, gameHash, releaseErrors } from './workflow.mjs';

try {
  if (!process.argv[2]) throw new Error('Provide tracking/updates/<id>.json');
  const errors = releaseErrors(readJson('tracking/milestones.json'), readJson(process.argv[2]), gameHash());
  if (errors.length) throw new Error(`Release blocked:\n${errors.join('\n')}`);
  console.log('Release evidence and Master Development review passed for this game hash.');
} catch (error) {
  console.error(error.message); process.exitCode = 1;
}
