import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { root, sha256, compileInlineScripts } from './workflow.mjs';

export const sourceHash = '14e1907fe630e0d8062a29fb9a58087e46888a0c31198f563842cacb0efbe177';
export const candidateHash = '5207ee4a75ae228a6031a35042a5c7cf4dad76af94d4cdb4722708af017c87ba';
const replacements = [
  ["function openPause(){if(STATE!=='play')return;STATE='pause';$('pause').classList.add('on')}",
   "function openPause(){if(STATE!=='play')return;STATE='pause';$('pause').classList.add('on');try{document.exitPointerLock?.()}catch(_){}mouse.l=mouse.r=false;for(const k in keys)keys[k]=false}"],
  ["p.style.cssText='max-width:560px;font-size:12px;color:#cab98f;margin:12px auto;line-height:1.6';root.appendChild(p)",
   "p.style.cssText='max-width:560px;font-size:12px;color:#cab98f;margin:12px auto;line-height:1.6';root.querySelector('.win .bd').appendChild(p)"]
];

// These are production source transformations, not browser-test injections.
// Fail closed if the imported source or the reviewed output ever changes.
export function buildOffline(input) {
  if (sha256(input) !== sourceHash) throw new Error('Unexpected offline source hash');
  let html = input.toString('utf8');
  for (const [before, after] of replacements) {
    if (html.split(before).length !== 2) throw new Error('Patch requires exactly one source match');
    html = html.replace(before, after);
  }
  const output = Buffer.from(html, 'utf8');
  if (sha256(output) !== candidateHash) throw new Error('Unexpected offline candidate hash');
  compileInlineScripts(html);
  return output;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const source = readFileSync(resolve(root, 'index.html'));
  const output = buildOffline(source);
  const directory = resolve(root, 'dist');
  mkdirSync(directory, { recursive: true });
  writeFileSync(resolve(directory, 'Wine-Dark-Sea-Save-Fix.html'), output);
  writeFileSync(resolve(directory, 'build-manifest.json'), JSON.stringify({
    sourceSha256: sourceHash, buildSha256: candidateHash, bytes: output.length,
    candidateOnly: true, changes: ['Pause guide contained in panel', 'Pause releases pointer lock and input state'],
    milestoneAcceptance: 'pending'
  }, null, 2) + '\n');
  console.log(JSON.stringify({ sourceSha256: sourceHash, buildSha256: candidateHash, bytes: output.length }));
}
