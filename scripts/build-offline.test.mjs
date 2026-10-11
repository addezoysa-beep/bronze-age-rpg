import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { root, sha256 } from './workflow.mjs';
import { buildOffline, sourceHash, candidateHash } from './build-offline.mjs';

test('reproduce the exact reviewed production candidate', () => {
  const source = readFileSync(resolve(root, 'index.html'));
  const result = buildOffline(source);
  assert.equal(sha256(source), sourceHash);
  assert.equal(sha256(result), candidateHash);
  assert.equal(result.length, 37820599);
  assert.equal(sha256(readFileSync(resolve(root, 'index.html'))), sourceHash);
});

test('reject changed source instead of silently applying an obsolete fix', () => {
  const source = readFileSync(resolve(root, 'index.html'));
  assert.throws(() => buildOffline(Buffer.concat([source, Buffer.from('\n')])), /source hash/);
});

