# October 11 creature, mounts, encounters and travel feedback

Local target/chest/weather candidate: 3712f152e387a5033474d74833fc3366103c4d31ff07348627da2f17d4800a8e. 198 total tests including 8 workflow tests pass. Rendered acceptance remains pending. The giant chest uses a minimal `{id}` context: Egyptian puzzle wrapper dereferenced `dg.def.egyptPuzzle58`, reproducing a TypeError. Fixed optional access and stored direct guardian reference; interaction warns before opening while alive, unlocks when dead. Current lock then nearest engaged hostile owns health bar; stale bosses clear. Rain/storm no longer restrict discovered landmark travel.

## Remaining authorized requirements (planned)

- Convincing lion and dragon anatomy, silhouettes, articulated meshes/materials; visual review. More mountain dragons, lions and bears across suitable regions.
- Northern steppe wagon service; Egypt horses/chariots; best horses and horsemanship lessons in steppe.
- Owned labels after horse/chariot purchase; remove redundant purchase choices. Single-payment and Save ownership checks.
- Quest to earn hippos, preserving user's wording until existing hippo integration inspected.
- Horse taming with visible bucking and readable balance. Ordinary ride button steals eligible horses/chariots with law/ownership consequences; same summon control for owned chariot as horse.
- World NPC archery, sparring and horsemanship competitions with reachable starts, fair rules/rewards and save-safe no-duplicate payouts.
- Rival soldier faction tent camps in empty areas with meaningful patrol/encounter/loot systems.
- Usable well in every region; inspect coverage and verify ordinary interaction.
- Fast travel should be expedient in every weather. Weather veto removed locally; discovery, safe land arrival and departure remain. Broad runtime and user's all-weather expectation still pending.

The existing hourly task is enabled and retains these requirements plus all earlier scope and Tuesday target. No remote publication attempted after prior approval rejection; preserve active PR ownership and do not bypass it. Local files are materialized source, not a git checkout; next integration requires authorized feature-branch publication. No milestone accepted.

## Local mount services checkpoint — October 11

Candidate `27529e4f641e0f5afaeff03b5bf61daae2dd0b3de0ce9478d3081ee813ffc7c6` adds owned horse/saddle labels and repeat-purchase guards, direct owned-chariot E boarding, selected-mount H call with safe room checks, chariot position/ridden-state serialization, a modeled Northern Steppe wagon yard with Ur/Avaris routes, and an Avaris horse/chariot keeper. Travel refunds failed/interrupted fares and blocks concurrent duplicate selection. Source fixtures do not establish rendered contact or ordinary pause Save acceptance. Browser remains blocked by missing Chromium, not by a missing Playwright package. PR26 CI run38115436645 failed a map-selector wait while the level-up menu was open; local harness closes it via normal mouse and now expects storm/rain arrival. No remote publication, PR merge or milestone acceptance.

Next: obtain browser runtime for ordinary E/H/mouse and pause Save/reload; retain opening/Pan/grip/Low old-save priorities. More creature models/spawns, bucking/taming/theft, an earn-Hippos quest (Hippos is the named horse), best steppe horses/horsemanship, competitions/camps/wells remain pending. Keep active PR19/20/21/26/27 ownership.

## Hippos, taming and theft checkpoint

Local candidate `5096fbef8491c55e677c8309e5a6fe9f581c2b1aa4c84e35ed5e30a7d1486211` replaces Timaios's automatic horse handout with an ordered brush, trough, lead-to-pasture and return quest. Old saves that already own a horse migrate complete. Wild taming adds a visibly larger rear/kick cycle affecting horse limbs, root and rider torso. Ordinary ride interactions expose guarded theft choices for eligible unattended horses, household horses and unowned chariots, record law consequences and protect quest or existing mounts. A steppe horse master offers a power-five elite courser and three nonrepeatable horsemanship lessons that improve the existing balance mechanic. Rendered animation, ordinary E/mouse paths and pause Save/reload remain pending; no milestone is accepted.

## Regional wells and riding circuits — local continuation

Exact local candidate `6cbd8ca569bbdc01ae6c047986f1b1fb2ec6471b8a914c0792a9f4311f80e299` adds a bounded safe-site/approach audit that reuses usable wells and adds missing regional ones, plus five configured NPC riding circuits (steppe, Egypt, Mesopotamia, Naxos, Ithaca). Circuits use ordered gates, a moving mounted rival, ordinary mounted E interaction ahead of default dismount, no entry fee, one daily prize, bounded rank training and persisted result history; interrupted races reset without payment. An existing other named mount cannot be replaced by the Hippos quest, remote care/theft callbacks are rejected, and stale chariot theft choices cannot repeat crimes.

249 source/workflow tests pass, including 34 focused well/race/mount tests. The exact standalone candidate compiles and reproduces. Browser smoke on this candidate fails before launch because Chromium is absent; Playwright is installed. Safe course/site placement can explicitly fail, so region-wide water coverage and five reachable circuits are NOT claimed verified. Body/horse contact, ordinary UI navigation, Low performance, and ordinary offline pause Save/exact-position reload remain pending. No milestone is accepted. Earlier open PRs19/20/21/26/27 have unchanged dirty heads; only26 has a head-associated run, still the level-up-menu browser failure. Publication was not retried after the prior destination/export approval rejection.

Next: preserve existing opening/Pan/grip/Low old-save priority and active PR ownership; obtain browser verification for exact current candidate when possible. Continue remaining shared work actions, creature redesign/encounters, archery/sparring competitions and rival camps. Full requirement/deadline scope remains open; Tuesday completion is not guaranteed. Evidence: `verification/records/wells-riding-local-20261011.json`.

## Horse impact, gait and registration checkpoint — October 12

Exact candidate `e515b93a9e8e757a28efe371331991c93d2e3d3bf64bcdd76017eb07f1a204a2` (37,950,664 bytes) adds mounted horse contact damage only above an 8.5 speed threshold, requires forward travel, checks the swept segment, caps impact at 30 damage and gives each target a 1.15-second cooldown. Enemy impacts use the combat damage path; civilian impacts use the existing assault/law path. Slow contact, backward motion, implausibly long frame travel, friendly enemies, ships and repeated overlap do not damage.

The final horse pose now distinguishes stand, walk, trot and gallop with separate stance/airborne phases and articulated upper legs, knees, hocks and hoof counter-rotation. Both wild-taming entry points no longer require a purchased saddle. A newly tamed horse can be ridden bareback; an ordinary stable conversation registers it for 40 silver and grants at most one riding quilt. Registration and quilt state use normal save data, while transient impact cooldowns clear on reload.

The focused horse suite passes 6/6 and the exact candidate compiles. The full source/workflow run passes 255/255 when run serially; one parallel run had a file-level interaction-suite worker failure, and that interaction file then passed 9/9 alone. This is source/workflow evidence only: ordinary horse/NPC collision, law response, stable mouse choices, save/reload, gait quality from side/front/rear, slopes/turning, rider/quilt contact and Low-preset performance still require rendered runtime evidence. HORSE-GAIT, HORSE-CHARGE and HORSE-TAME-REGISTER therefore remain pending, and no milestone is accepted. Evidence: `verification/records/horse-motion-impact-local-20261012.json`.
