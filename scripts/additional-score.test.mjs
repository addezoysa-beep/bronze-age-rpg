import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const source = readFileSync(resolve(root, 'index.html'), 'utf8');
const buildHash = createHash('sha256').update(source).digest('hex');
const marker = 'const AUDIO_ASSETS54=';
const start = source.indexOf(marker);
const open = source.indexOf('{', start);
const close = source.indexOf('};\nfor(const [k,v] of Object.entries(AUDIO_ASSETS54)', open);
assert.ok(start >= 0 && open > start && close > open, 'AUDIO_ASSETS54 definition is present');
const assets = JSON.parse(source.slice(open, close + 1));
const keys = Object.keys(assets).filter(key => key.startsWith('music54_')).sort();

test('five additional scores are embedded as distinct MP3 assets', () => {
  assert.equal(buildHash, '14e1907fe630e0d8062a29fb9a58087e46888a0c31198f563842cacb0efbe177');
  assert.deepEqual(keys, ['music54_0', 'music54_1', 'music54_2', 'music54_3', 'music54_4']);
  const decoded = keys.map(key => Buffer.from(assets[key], 'base64'));
  assert.ok(decoded.every(buffer => buffer.length === 840573));
  assert.ok(decoded.every(buffer => buffer.subarray(0, 3).toString('ascii') === 'ID3'));
  const hashes = decoded.map(buffer => createHash('sha256').update(buffer).digest('hex'));
  assert.equal(new Set(hashes).size, 5);
});

test('additional scores are routed three to exploration and two to combat', () => {
  assert.match(source, /ACOUSTIC_SCORE14\.explore\.push\(\.\.\.\[0,1,2\]\.map\(i=>AUDIO_ASSETS54\['music54_'\+i\]\)\)/);
  assert.match(source, /ACOUSTIC_SCORE14\.combat\.push\(\.\.\.\[3,4\]\.map\(i=>AUDIO_ASSETS54\['music54_'\+i\]\)\)/);
});
