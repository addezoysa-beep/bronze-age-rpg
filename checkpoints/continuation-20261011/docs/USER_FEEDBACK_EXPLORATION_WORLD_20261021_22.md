# User playtesting priorities — October 21–22, 2026

These are confirmed user requirements, not completed features. They remain subordinate to preserving the exact candidate lineage and are not grounds for accepting a milestone.

## Two new-game modes and Exploration route

- Story Mode keeps the existing main quest and progression.
- Exploration Mode uses the shared world and systems but disables the main quest. A different greeting guide grants silver and directs the player to book paid passage to Crete, sail onward to Egypt, then take a carriage to Mesopotamia/Ur.
- Persist the mode through New, Continue, old-save migration and ordinary pause-menu Save/reload.
- Make new assets and NPC rigs common to both modes. Regional boundaries and docks must read distinctly for Crete, Egypt, Mesopotamia, Achaea, the steppe and other regions.
- Teach by asking players to inspect and compare physical evidence before dialogue explains it: walls and urban density, art/monuments/inventions, deities and rituals, rulers/laws/protection, social ranks, and visible scripts/records.

### Ordered next-20 checkpoint block

1. Fix white-bed underground geometry in fresh and streamed worlds.
2. Verify Build 298 startup, New and Continue in both modes.
3. Finish paid Crete → Egypt → Ur travel and route stops.
4. Make regional docks distinct and legible.
5. Finish evidence-first scenes/journal and Exploration main-quest isolation.
6. Verify added assets and rigs are shared by both modes.
7. Improve home/palace furnishings, stairs, beds and gardens.
8. Expand amphorae.
9. Add herder/nomad sleeping alcoves.
10. Complete stealth tents, concealed chests and level-scaled loot.
11. Replace targeted underground ambience with torches.
12. Slow Revenant Archer draws and implement Revenant gear effects.
13. Add the requested bone equipment; remove physically impossible flint shield, helmet, bow and sword items.
14. Produce and verify two builds from the same accepted content: Story+Exploration and classic Story-only.

Each checkpoint requires its implementation, focused tests and exact-build evidence. Browser startup, both-mode play, visuals and ordinary Save/reload remain unverified unless recorded for that exact hash.

## October 22 world-life and campaign requests

- During raids, regional wall archers defend; wallwalks are traversable so the player can join. Mesopotamian cities need more meaningful activity inside their walls. The first soldier’s allegiance check persists so later guards do not repeat it.
- Verify the full Trojan campaign as a playable sequence, including character-specific dialogue, actions, cutscenes and bosses. Odysseus, Agamemnon, Achilles, Hector, Paris, Menelaus and Helen need distinct characterization, meshes and suitable equipment. Include the Cyclops, both peace/sack outcomes, a complete Trojan Horse mesh, and a witnessed physical moving action. Troy entry begins with a nearby guard decision at the walls.
- Preserve and extend blue water; improve shark meshes. Add finite spear throws and recoverable embedded spears. Fix the reported duplicate weapon pickup/equip/use issue.
- Add requested music and shared player/NPC work-action rigs; improve day/night, NPC pathfinding, regional houses/palaces/temples/caves/mines/dungeons, horses and suitable fauna including ibexes and antelopes. Animals drop bones. Audit asset meshes, item naming/categories and equipment rosters; strengthen weather effects and ambience.

## Evidence and lineage

The latest reported local candidate is Build 317/R9, with 35 focused tests, 45 embedded scripts parsed and ZIP integrity reported passing. Its exact source is unavailable in this workspace and is not present on PR #30. PR #30 remains a separate Build 280 draft. Do not layer new code on Build 280 and label it R9; no current-hash runtime, visual, both-mode or ordinary Save/reload evidence is implied here.

All listed requirements remain pending implementation and exact-build acceptance. No M0–M5 milestone is accepted by this note.
