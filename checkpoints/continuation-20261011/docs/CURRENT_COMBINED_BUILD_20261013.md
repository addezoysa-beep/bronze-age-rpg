Latest correction: e96ef458a8f7d6217e5e672c7f8e9b8146680322d42449dcda97b482c489b9d2 (38,085,980 bytes) supersedes add0bd26, which failed browser startup in the dragon wing. See ARROW_HUD_STARTUP_20261013.md. 67 focused local tests pass; current remote runtime checks pending. Historical statements below refer to the earlier candidate.

# Current combined cinematic candidate

The current build entry point for PR29 is `node scripts/build-current.mjs`.
It reconstructs the known 5a8cad05 published seed from preserved Build59,
applies checked byte-offset recovery hunks, verifies the exact recovered
bf140589 cinematic/sling source, and then applies all continuation modules.
The imported Build59 and original published-generator remain unchanged.

Deliver only `dist/Wine-Dark-Sea-Combined-Cinematic.html` with its current
manifest. SHA-256:
`add0bd26bbef5aefabe610f120cd3ffdaebdfb3b43133d36b4b82528441ea16e`.
38,082,770 bytes. The title displays the combined cinematic checkpoint label.
Old artifact links and old runtime evidence do not verify this candidate.

Preserved: animated sling in both camera views, cinematic opening/lock lesson,
recognizable Ikaria stable and independent Hippos, performance diagnostics,
camera-ray ballistic aiming and finite Pan supplies; later local lion/dragon,
NPC mounted impact, antler equipment, Retainer camp, Watchtower fort, hand/spear/
greatsword/arrow work, remedies, craftable storage and domestic-dog rest.

New: chest reload binding/orphan cleanup, cave formations/puddles and dungeon
chains; main-quest speaker and guard cinematic framing with accessible choices;
puzzle-open transitions deferred during nearby combat; hidden-target tactile
lock presentation with pick/hand motion, resistance and bounded difficulty;
locked-gate approach dialogue; two optional clue-driven side mechanisms with
nonduplicating ordinary food/ammo loot; revenant metal weapon corrosion at
spawn/equip. Removed the virtual horse/saddle seller and duplicate graphics
controls; graphics uses the automatic policy.

60 focused compile, source-preservation and executable-contract checks pass.
This is not full rendered gameplay, reference-device performance, ordinary
Save/reload or main-story acceptance. Remote full tests/build/browser outcomes
must be recorded separately on the exact new hash. All M0–M5 acceptance pending.

Next priorities from October13 feedback: test the actual new download; complete
main quest dependency/dialogue/action audit for Erigone rescue, four writing
artifacts/final ward and both Trojan resolutions; predator speed and species-safe
injury/death voices, three-four actual human pain variations and reduced chatter.
Expand puzzle variety only with safe routes/clues/reset/loot/save tests.

Working budget for this feedback is provisionally 30 active hours: 6 for build
integration/critical regressions, 10 for the three main-story route families,
6 for cinematic/puzzle/audio/predator refinements, 8 for ordinary runtime/save/
performance regressions and correction. This is a planning budget, not measured
remaining time or a promise of uninterrupted execution. Reassess after runtime
failures are known. The original 120-task/M0–M5 scope remains open.
