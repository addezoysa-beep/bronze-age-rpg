# Work, lock and grounding handoff — October 11

Tuesday October 13 Eastern is the user's target for M0–M5 and expanded scope. It is not a guarantee or a relaxed acceptance gate.

Local candidate `8690b2a561d60e30b36545f2ea4831d1f31990745de0b3c7ccd3f53ed504101e` extends master snapshot `53989c4b3d3568d71fb54085479946be90eb22df` (fast travel candidate `a1159f19`). This replaces neither the earlier blocked lock candidate nor active PR19/20/21/26/27. Reconcile their source and documentation before integration. Publication was not attempted again.

COMBAT-LOCK-01: Q locks/unlocks, Shift+Q cycles, Backquote attacks left. Pause allows Q/Numpad0 selection with persistent settings. Eligible enemy targets are hostile, alive, visible, same-area and within bounded range/LOS. Menus, death, invalid targets and area changes release ownership. Existing marker, camera and facing contracts remain. Eight new source tests include the actual PC input interception path. Prepared browser scenario is unrun; hostile civilian NPC adapters and full melee/ranged combat remain open.

ROLL-60 partial correction: Alt now reaches the existing roll instead of being remapped to the unrelated dash; Caps Lock can be selected in pause as a persistent alternative. A 160 ms landing buffer spends 14 stamina once and respects attacks, guards, bow draw, rest, mining and foot/ground restrictions. Player rolls and Kobalos/wolf evades share collision substeps no longer than 0.24 units while preserving player/enemy collision modes, and active visible humanoid evasions get current-pose floor contact. Current descendants update before floor sampling, while hidden/weapon subtrees do not count as the body. Eight new movement tests plus the prior floor tests pass; all 90 source tests are green. Rendered feel, slopes, stairs, interiors, ten-attacker Low performance and Save/reload remain unverified, so ROLL-60 is not accepted.

PR27 Pan review: run38115452644 source checks/offline smoke/sling UI pass. The failed Pan screenshot shows a locked chest and zero picks. The prepared defeated-captain fixture omitted the physical cave key, rather than traversing the actual boss/key route. `review-corrections/browser-pan-scenario.mjs` adds that prerequisite to the explicitly prepared fixture only. The real key drop, approach, puzzles, captain fight, item collection and Daedalus route remain acceptance gates. No source unlock bypass was introduced.

# Forty proposed shared task actions

These are planned designs, not implemented animations. All need grounded body/clothing/hands/props; actual workstation or field anchors; destination routes, facing, reservation and recovery; sensible tools; player/NPC parity; Low-performance evidence and ordinary Save/reload.

| Job | Distinct actions |
| --- | --- |
| Shepherd | Call/drive herd; guide grazing route; open/close pen gate; distribute feed |
| Irrigation worker | Inspect canal; clear silt; hoe channel; open/close water diversion |
| Plough/seed worker | Prepare yoke/tools; guide plough; meter seed; level furrow |
| Grain worker | Reap; bind sheaves; thresh; winnow |
| Quarry worker | Strike stone; drive wedges; lever block; paired rope pull |
| Cargo worker | Lift/carry sack or jar; load/unload barge; tow cargo; pole river craft |
| Vine/orchard worker | Prune vine; tie vine; tend tree; collect orchard fruit |
| Smith | Hammer; work bellows; quench |
| Kitchen/tavern | Knead; cook/stir; pour/serve aligned vessel |
| Scribe | Prepare surface; inscribe; inspect/read record |
| Bard | Tune; play; sing deed-dependent phrase |

No speed variants count as distinct actions. Seven groups of four plus four groups of three total forty. Actual production implementation can revise candidates while preserving 30–40 total and roughly3–4/job.

WORK-60 tasks: assigned real fields/crops and regional hire/co-work offers; counted herding between grazing areas and back to pens; paid herder/quarry contracts with duration, quit/failure, fair wages, borrowed starting tools and no duplicate wages. Larger reachable quarries need coordinated phase/rope/hand/load motion, loading at actual docks and persistent stone/grain barge routes upriver. Regional transport assertions require additional research. Starting inventory/recipes remain empty and mandatory quest tools must still be earned.

Egypt river-cargo research checkpoint: Metropolitan Museum object records for Meketre's Middle Kingdom boats distinguish northward/downstream rowing from the southward return under sail, and show a sailor pushing off with a forked pole. A separate Old Kingdom relief fragment identifies deck cargo as probably a large stone block or architectural element. Use these as visual/action evidence for the planned Nile loading, poling/rowing and upstream sailing loop; do not represent towing, every region, or every Bronze Age century as identical without further evidence. Sources: https://www.metmuseum.org/art/collection/search/544211, https://www.metmuseum.org/art/collection/search/544213, https://www.metmuseum.org/art/collection/search/577298, https://www.metmuseum.org/art/collection/search/552238.

Research supplied/read in the workstream:
- https://lahs.org.uk/blog/farming-during-the-later-bronze-age-part-1-land-division — British later Bronze Age crop enclosures versus pastoral territory; not universal Mediterranean practice.
- https://etcsl.orinst.ox.ac.uk/section5/tr563.htm — Sumerian Farmer's Instructions: irrigation, levelling, seeder-plough, harvesting teams, threshing and winnowing.
- https://archeologie.culture.gouv.fr/en/glossary/irrigation — regional gravity-fed canals, barley/legumes/date palms.

All earlier requirements in USER_FEEDBACK_20261011.md remain. Priorities continue opening/fast-travel/grips/rolls/old-save Low performance before expanding shared workplace actions, economy, law and sea/exploration. No milestone accepted.

## Local Nile cargo checkpoint

Twenty of the proposed forty actions now have source-backed local implementations on exact artifact `2448001f0ddd0dc2951401b81168cbc133de00d5611e3e4771161f46713b25d1`. Cargo workers and the player share carry, load, short dockside launch-line tow and pole poses at the actual Lower Egypt Canal and Upper Egypt Quarry landings. The shift supplies job props, conserves player inventory, persists only completed stages, fails unpaid on quit/incapacitation/district exit and pays once per day after launch. Persistent cargo-identified barges use the Nile centerline: the grain barge moves upstream under sail and the stone barge downstream without sail, with nearer Low-preset culling. This implements visible cargo traffic and a landing work loop, not a full NPC quarry-to-dock procession or evidence that long-distance towing was normal.

All 139 source tests, repository verification and eight workflow tests pass. Browser smoke remains unavailable because Playwright is not installed, so ordinary mouse/input navigation, rendered hand/cargo/rope/pole/deck contact, hull/water presentation, Low performance and ordinary pause-menu Save/exact-position reload remain pending. No milestone is accepted and publication was not retried.

## Local Mesopotamian irrigation checkpoint

Twenty-four of the proposed forty actions now have source-backed local implementations on exact artifact `dbd1153845e44fa9b04a869b8978061d5c63be43a7f69a8f84e8c3e22ab07ce2`. At an actual Euphrates bank, a named canal-field overseer and the player share channel inspection, silt clearing, feeder-bank hoeing and diversion-gate operation. The modeled feeder serves one assigned barley plot, the gate and bounded water panel persist with world state, job tools are supplied, inventory is conserved, completed stages survive restore, failure/quit paths are unpaid and the final diversion pays 14 silver once per day. This applies the recorded Mesopotamian canal and field-work evidence without claiming that one layout represents every period or region.

All 148 source tests, repository verification and eight workflow tests pass. Browser execution remains unavailable, so ordinary movement and interaction, rendered hand/tool/channel/terrain/water contact, worker navigation, Low performance and pause-menu Save/exact-position reload remain pending. No milestone is accepted and publication was not retried.

## Local Ur seed-plough checkpoint

Twenty-eight of the proposed forty actions now have source-backed local implementations on exact artifact `e9101c26c369d17eb911a5ca644d02c14422456a29da153679b0220059a0c0bf`. At a separate Ur household plot, a named overseer and the player share yoke/drill preparation, draft-plough guidance, seed metering and furrow levelling. The plot has a modeled draft ox and plough rig, assigned crop field and persistent finished furrow; work tools are supplied and inventory is conserved. The ordered contract fails unpaid on explicit quit, incapacity or district exit, preserves completed stages across restore, defaults safely for old saves, resets unpaid progress on a new day and pays 16 silver at most once per day.

All 157 source tests, repository verification and eight workflow tests pass. Browser execution remains unavailable because Playwright is not installed, so ordinary movement and interaction, rendered ox/plough/tool/hand/clothing/terrain contact, worker navigation, Low performance and pause-menu Save/exact-position reload remain pending. No milestone is accepted and publication was not retried.
