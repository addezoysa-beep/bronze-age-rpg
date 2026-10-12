# Continuation checkpoint for integration review

Publication explicitly authorized by the repository owner on October 11, 2026. Snapshot of local commit 1254989. This isolated checkpoint preserves existing integration files and active PR ownership.

Exact generated game SHA-256: `6cbd8ca569bbdc01ae6c047986f1b1fb2ec6471b8a914c0792a9f4311f80e299` (37,946,093 bytes). Base source unchanged: `14e1907fe630e0d8062a29fb9a58087e46888a0c31198f563842cacb0efbe177`.

From this directory run:

```sh
node --test --test-concurrency=2 scripts/*.test.mjs
node scripts/verify.mjs
node scripts/build-offline.mjs
```

Open generated `dist/Wine-Dark-Sea-Save-Fix.html`. All 249 tests and repository/build validation passed again immediately before publication. Browser gameplay, visuals, performance, and ordinary pause Save/reload remain pending on this hash. No milestone is accepted. This is a draft integration candidate, not a release.

Includes combat lock/roll/grounding; workplace routing; 28 shared work actions with contracts; Phocas/law/greatsword fixes; target/chest/weather fixes; mounts/Hippos/theft; regional wells and riding circuits. The earlier independent remedy, arrow, grip and Pan PRs remain separate; review their dependencies before integration. Historical records mentioning publication blocks describe their original state, not current authorization. CHECKPOINT_README.md from the local workspace is deliberately excluded because it describes an older build.
