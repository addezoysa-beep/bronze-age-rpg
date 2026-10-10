import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url));
const source = html.toString('utf8');
const sha256 = crypto.createHash('sha256').update(html).digest('hex');

assert.equal(
  sha256,
  '14e1907fe630e0d8062a29fb9a58087e46888a0c31198f563842cacb0efbe177',
  'audit must run against the exact accepted Build59 baseline'
);

const factionsBlock = source.match(/const FACTIONS56=\{([\s\S]*?)\};\s*const ARCHETYPES56=/)?.[1];
assert.ok(factionsBlock, 'FACTIONS56 registry is present');
const factions = [...factionsBlock.matchAll(/(?:^|,)\s*([a-zA-Z0-9_]+):\{name:/g)].map(match => match[1]);
assert.deepEqual(factions, ['labyrinth', 'retainers', 'oathkeepers', 'deserters']);

const archetypesBlock = source.match(/const ARCHETYPES56=\{([\s\S]*?)\};\s*const LEGENDARY56=/)?.[1];
assert.ok(archetypesBlock, 'ARCHETYPES56 registry is present');
const archetypes = [...archetypesBlock.matchAll(/(?:^|,)\s*([a-zA-Z0-9_]+):\{base:/g)].map(match => match[1]);
assert.deepEqual(archetypes, ['spear', 'sword', 'axe', 'greatsword', 'bow', 'sling']);

const packRole = source.match(/function packRole29\([\s\S]*?return\{attack:slot<Math\.min\((\d+),Math\.ceil\(list\.length\/2\)\)/);
assert.ok(packRole, 'packRole29 committed-attacker cap is inspectable');
assert.equal(Number(packRole[1]), 2, 'known gap: Build59 commits only two attackers');

for (const faction of factions) {
  const sitePattern = new RegExp(`faction:'${faction}'[\\s\\S]{0,220}archetypes:\\[[^\\]]*'spear'[^\\]]*'sword'[^\\]]*'axe'[^\\]]*'greatsword'[^\\]]*'bow'[^\\]]*'sling'`);
  assert.match(source, sitePattern, `${faction} site exposes all six equipment archetypes`);
}

console.log(JSON.stringify({
  baselineSha256: sha256,
  committedAttackerCap: Number(packRole[1]),
  factions,
  archetypes,
  status: 'known-gap-not-acceptance'
}, null, 2));
