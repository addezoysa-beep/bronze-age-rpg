# Prioritized Implementation Roadmap

## Evidence and Baseline

Build 59 is a candidate, not yet a milestone-verified release. `index.html` is a
byte-for-byte import of the user-supplied offline file (37,815,418 bytes).
Its SHA-256 is `14e1907fe630e0d8062a29fb9a58087e46888a0c31198f563842cacb0efbe177`.
See `baseline/build-59.json` for source locations. Embedded `done` lists are
self-reported claims; they do not close tests.

The five original milestone names/scope below come from `DEVELOPMENT53` in the
build. The retrieved Game Movement Overhaul history confirms the five-part work
and adds five further soundtracks, anatomical hands/grips, arm sway, torso lean,
and a cleaner bottom equipment bar. Older milestone definitions and the Progress
visibility history still need recovery; that mapping remains provisional.
The master workstream's earlier provisional five-part plan is superseded by this
source-based mapping once Master Development reviews it.

Confirmed source definitions: four faction records; six equipment archetypes
(spear, sword, axe, greatsword, bow, sling); eight legendary site records; twelve
hideout records; humanoid horn alerts; humanoid feints; kobaloi evasion/feint/attack
states; revenant base and faction-spawn wrappers. Final runtime overrides and
representative behavior need inspection/testing. Four factions, sixteen base
enemy records, and encounters of eight to ten actors are different quantities.

The user explicitly clarified on 2026-10-10: **8-10 enemies attacking at once**,
**many more than four factions**, and **multiple enemy types in every faction**.
Eight to ten is concurrent combat participation, not the total faction count or
merely idle actors nearby. Attacks may have readable windups and separate damage
windows, but an encounter-wide attacker cap below eight does not satisfy this.
For planning, propose twelve factions with at least three distinct combat types
per faction. Those numbers are proposed, not user-approved; Master Development
must finalize the roster before M3 acceptance. Regional wildlife are tracked
separately and do not inflate the faction count.

## Dependencies and Order

Establish the baseline first (M0). Stabilize combat/action contracts (M1), then
equipment/animation contracts (M2). M3 requires both for mixed encounters.
M4 requires tested M3 encounters and M2 loot/crafting. M5's settlement, music, and
art work can proceed alongside M2-M4 after M0; travel/progression acceptance waits
for M1 and the M4 save/travel regression suite. All release gates require M0.

| Priority | Milestone | Source-based scope plus new requirements | Gate |
| --- | --- | --- | --- |
| P0 | M0 Baseline and verification | Preserve source; repository, override audit, reproducible offline launch, saves, baseline measurements, recover original discussion details | Import/syntax/offline startup pass; reference devices and test evidence established |
| P1 | M1 Combat and audio foundations | Explicit voice identity; five original two-minute scores plus five further soundtracks; animal/hoof/sail sounds; finite sling shots; roll pivot; limited retreat healing; weapon animations/monster cues; feints and kobaloi evasive attacks; anatomical hands/grips, arm sway, torso lean, FP/TP consistency; clean bottom equipment bar | Attack timing, collision, movement, audio limits, HUD and save regression tests pass |
| P1 | M2 Regional equipment and item models | Four regional styles; rare metals; revenant equipment; orichalcum/adamantine; ore-furnace-smith progression; rotating models for items/dishes; equipment-driven AI/animation contracts | Loadout matrix, regional/crafting rules, model audit, distinct six-archetype action tests pass |
| P2 | M3 Regional life and factions | Regional wildlife/predators; pastoral nomads; original named factions retained within an expanded roster well beyond four; multiple combat types per faction; 8-10 simultaneous attackers; coordinated kobaloi alerts; revenant archers/swordsmen; distinct archetype AI/animation | Approved expanded roster, mixed simultaneous attacks, alerts, bow/sword revenants, readable feints/evasion, navigation and actor budgets pass |
| P3 | M4 Legendary exploration | Six to eight legendary levels; signature faction hideouts; varied caves/tombs; Theseus/Athens palace interactions; tested progression/loot/save integration | Eight defined sites and twelve hideouts audited for reachability and clearability; loot/dialogue/save tests pass |
| P3 | M5 Egypt and world music life | Luxor/Valley of Kings; roads/Nile ferries; river-bank swimming; city puzzles/monumental art; friendly interaction sounds; musician phrases | Egypt travel/swim/puzzle/interaction routes, audio and offline packaging regressions pass |

## Acceptance Tests

The runnable repository and smoke checks accompany every code update. Gameplay
acceptance tests below require recorded scenarios or automated fixtures. None are
passed solely by source-name matches.

| ID | Milestone | Acceptance scenario and expected result |
| --- | --- | --- |
| BASE-01 | M0 | Imported file's bytes/hash match supplied baseline; scripts compile |
| BASE-02 | M0 | Offline title -> new voyage -> visible nonblank scene -> movement -> save -> reload; no uncaught exceptions or external resource dependence |
| BASE-03 | M0 | Reference hardware/browser/resolution/settings, startup, frame-time and memory baseline recorded; original discussion mapping resolved |
| MOVE-01 | M1 | Walk/run/crouch/roll/dodge over ground, steps, slopes, docks and interiors; no penetration or nonfinite position; FP/TP attachment consistency |
| FEINT-01 | M1 | Eligible humanoid visibly begins/cancels attack or charge; canceled feint causes no damage; real strike has bounded damage window and recovery |
| KOB-EVADE-01 | M1 | Kobalos responds to melee/projectile pressure with collision-aware dodge/duck, readable three-attack windups, range-limited damage and recovery |
| AUDIO-01 | M1 | Voices/cues/music trigger correctly offline; shared voice/cache limits hold; quiet actors do not flood cues; no audio startup exception |
| AUDIO-02 | M1 | Audit original five scores and five additional distinct tracks for duration, transitions, offline decoding and bounded asset size; no duplicates counted as new tracks |
| HUD-01 | M1 | Bottom equipment UI stays readable and unobstructed at supported resolutions; switching equipment, interaction prompts and inventory remain reachable |
| GEAR-01 | M2 | Each supported hand/weapon/shield combination stays attached through idle, movement, attack, dodge, equip and unequip in FP/TP; invalid combinations rejected |
| ARCH-01 | M2 | Spear/sword/axe/greatsword/bow/sling use distinct reachable action animations, range/spacing/recovery choices and equipment; no placeholder/shared-only distinction |
| CRAFT-01 | M2 | Regional materials and ore/furnace/smith requirements apply; inventory quantities conserved; special-item/dish rotating previews work; save/reload preserves gear |
| GROUP-01 | M3 | Seeded encounters with both eight and ten simultaneously engaged, attack-capable enemies; instrumentation records overlapping attack intent/actions from all actors, not an idle crowd or a global cap below eight. Test mixed melee/ranged loadouts in open ground and narrow passages; readable windups, navigable spacing and no persistent deadlock or clipping pile |
| KOB-ALERT-01 | M3 | Kobalos detection/call alerts eligible allies with documented range, cooldown, line-of-sight rules and stale target expiry; isolated/unrelated actors remain unaware; no infinite alert chain |
| REV-01 | M3 | Tomb and faction revenant archers/swordsmen spawn, awaken, fight with bow/sword-specific behavior, take damage, terminate combat and produce intended loot |
| FACTION-01 | M3 | Master approves an explicit roster well beyond four factions (planning proposal: twelve), each with multiple equipment/AI/animation types (proposal: at least three). Audit faction identity, region, relationships, spawn/loot rules and every type; preserve original named factions and resolve Mine Raiders/deserters naming. Wildlife/nomads use their own correct regional behavior |
| SITE-01 | M4 | Audit all eight legendary sites and twelve hideouts: entry/exit, branching passages, clear condition and loot reachable; no duplicate rewards or locked return path |
| STORY-01 | M4 | Theseus/Athens interactions and trainer/quest/attribute/skill progression work without conflicting active objectives; checkpoints survive save/reload |
| EGYPT-01 | M5 | Luxor/Valley route, roads, Nile ferry boarding/disembarking and bank swimming complete without stranding/collision faults; puzzles and monumental art are reachable |
| LIFE-01 | M5 | Friendly sounds and musician phrases play contextually with bounded concurrency; offline travel, inventory, followers and save regression passes |

## Proposed Performance Targets

These are proposed gates, not measurements or promises. M0 must name the reference
desktop and lower-powered target, browser, resolution and quality setting before
acceptance. Headless software-rendered browser smoke timings are diagnostic only.

| Measure | Proposed gate |
| --- | --- |
| Desktop normal play / ten-actor encounter | 60 FPS target; p95 frame time <=20 ms; no sustained 5-second interval below 30 FPS |
| Lower-powered target at low quality | 30 FPS target; p95 frame time <=33.3 ms |
| Ten active enemies' AI | p95 <=3 ms per frame on reference desktop; separate from rendering |
| Offline cold start to playable | <=10 s desktop; <=20 s lower-powered target |
| Travel/encounter memory | No monotonic growth; <=10% retained-memory increase after repeatable 30-minute loop and cleanup |
| Package | <=50 MiB provisional; justify asset increases against 36.1 MiB imported baseline |
| Reliability | No uncaught exceptions, broken critical assets, nonfinite actor positions or release-blocking save regressions |

Run baseline checks before coding; rerun affected acceptance and performance scenes
at each milestone checkpoint; run the full regression set before a release.
`tracking/milestones.json` records test states and dependencies, and
`tracking/updates/` records exact-build master review. No schedule estimate is
assigned until baseline audit and unresolved requirement wording are recovered.



## User playtesting priorities — October 10 Eastern

Prioritize blocked king/other NPC dialogue and wagon actions, then Low-preset old-save combat profiling and visual staff grip/wrist correction before broad faction work. Transform-only hand tests do not establish GEAR-01 acceptance; the supplied screenshot is failed visual evidence. Recover a representative old save for performance comparisons without reducing the required 8–10 concurrent attackers.

M4 additionally requires more dungeon puzzles and traps. Audit the existing Cave of Pan sling-target, crate/pressure-plate, locked-door and captain/cargo-tally route first; preserve progression to Daedalus in Knossos. Add clue-driven puzzle combinations and telegraphed traps with reset/save persistence and avoid unavoidable damage or inaccessible quest rewards. Existing definitions alone do not prove reachable gameplay.

## October 11 integrated progress and active candidates

PR #18 is integrated: paid Ur travel, exact 80-silver deduction and ordinary destination pause Save/exact-position reload are verified on candidate 043091f3. PRs #19 (grip wrist bounds), #20 (four remedies) and #21 (wood-arrow identity/damage and tipped bundle prices) are separate unmerged candidates with passing source tests and pending runtime/visual review. See verification/records/continuation-20261011.json for exact hashes, heads, evidence, scope limits and conflict-resolution handoff. No milestone is accepted.

The full weapon/armor price ladder and bigger-city regional stocks/ingredients/advanced lessons/accurate dialogue are still planned. Remedies require ordinary UI lesson/crafting/expiry verification; arrows require material damage/recovery/craft/loot/sell and NPC provenance checks. Keep grip, old-save Low combat and Cave of Pan progression/puzzles/traps priorities.

October 11 verification follow-up: PR #19 exact-game browser checks passed for third-person stick idle/movement, dialogue/wagon and ordinary Save/reload; screenshot distance prevents hand-shape acceptance, so GEAR-01 remains failed. A normal V first-person capture rerun is pending. PR #20 has 64 passing source tests including production crafting gates and conservation, with browser runtime still pending. PR #21 has 61 passing source tests; its first browser run failed a test-navigation assumption at the actual outer smith menu. The corrected harness rerun is pending. Full equipment pricing, city tiers, Cave of Pan/puzzle/trap and old-save Low combat work remain open. Exact evidence is in the continuation record.
