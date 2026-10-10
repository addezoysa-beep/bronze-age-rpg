# Pause input checkpoint review

Master Development inspected PR4, active openPause wrappers, GitHub Actions run 38028928955/job 114145592863, and its downloaded pause-scene screenshot. The game hash was 70c78a7e562987a95c357aaeb58d4b0e17561161076db2a7f47b59d9dcbc1435.

The guide is inside the panel and no longer covers Save. Offline scene diversity, movement and guide containment passed. Ordinary Save click failed because the pause overlay intercepted pointer input. Save/reload remains failed/unverified; neither force clicks nor programmatic saving were used. Source inspection confirms original openPause never releases pointer lock although inventory, map and shop do. The pointer-lock explanation needs the candidate runtime check; the screenshot alone cannot prove it.

Prepared candidate hash 5207ee4a75ae228a6031a35042a5c7cf4dad76af94d4cdb4722708af017c87ba changes only original openPause after the prior guide fix: enter paused state, release pointer lock, clear held mouse and keyboard input. Local reconstruction of the preceding guide patch matched PR4's exact hash before applying the candidate. Three inline scripts compile. VM checks pass for pause-before-unlock, repeat-call guard, unsupported unlock handling and held-input reset. These are source fixtures, not browser acceptance.

scripts/browser-smoke.mjs now checks pointer-lock release and the actual Save hit target before its normal click. Read-only candidate workflow run 38031513911 is pending. It applies the checked source transformation in an ephemeral checkout, runs static/action/browser checks and retains the candidate source plus evidence as artifacts. It has contents:read and cannot push. The candidate source is not integrated on master-development.

Existing master-development action-contract fixtures were read and executed locally: four pass for canceled Kobalos feint, once-only strike, distant windup abort and anatomical hand assignment. They cover isolated original functions, not final runtime wrapper chains, visible grips or full acceptance.

A proposed write-enabled preparation workflow was rejected by automatic approval review because it would run repository code and push commits. It was not created. Direct source blob retrieval failed with Transport closed; shell Git authentication is absent. Do not retry a privileged workaround. Direct source publication remains pending a supported authenticated large-file path or explicit approval. Main and baseline remain unchanged. M0/M1 and all downstream acceptance remain pending.

Next: inspect read-only candidate logs/artifacts and exact hash, fix failures without bypassing UI, publish reviewed candidate through an approved direct path, then rerun exact-commit ordinary offline save/reload before integration. Reference-device performance and discussion reconciliation also remain open.
