import { execFileSync } from 'node:child_process';
import { compileInlineScripts, sha256, validateUpdate } from './workflow.mjs';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
try {
  const files = git('diff', '--cached', '--name-only', '-z').split('\0');
  if (!files.includes('index.html')) process.exit(0);
  const branch = git('branch', '--show-current').trim();
  let hasHead = true;
  try { git('rev-parse', '--verify', 'HEAD'); } catch { hasHead = false; }
  if (branch === 'main' && hasHead && !process.argv.includes('--reviewed-merge')) {
    throw new Error('Game changes go through master-development and release review.');
  }
  const staged = execFileSync('git', ['show', ':index.html'], { maxBuffer: 64 * 1024 * 1024 });
  const hash = sha256(staged);
  compileInlineScripts(staged.toString('utf8'));
  const tracker = JSON.parse(git('show', ':tracking/milestones.json'));
  const candidates = files.filter(f => /^tracking\/updates\/[^/]+\.json$/.test(f));
  const matching = candidates.map(f => JSON.parse(git('show', `:${f}`))).find(u => u.buildSha256 === hash);
  if (!matching) throw new Error('Stage a current-game update record with this change.');
  const errors = validateUpdate(matching, tracker);
  if (errors.length) throw new Error(errors.join('\n'));
  console.log('Staged game syntax and milestone update record passed.');
} catch (error) { console.error(error.message); process.exitCode = 1; }
