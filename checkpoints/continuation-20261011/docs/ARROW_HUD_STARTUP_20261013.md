# Arrow HUD and startup correction — October 13

Supersedes the add0bd26 candidate, which failed ordinary browser startup. The
dragon outer wing called Batch.dquad with three points and a color, omitting its
fourth point/color argument. It now uses two correctly wound triangles. A new
construction test executes the delivered Batch.tri/quad/dquad methods and the
full new dragon factory; malformed colors throw rather than being mocked away.

Arrow HUD shows selected material count and total, with buttons, bracket keys,
Alt-wheel in gameplay and pointer wheel over the HUD. Selection skips empty
stock, wraps, never consumes ammunition, and refuses switching during an active
draw/release, death or menu. Existing save selection and material-specific fire,
mesh, damage and recovery paths remain active.

Arrow impacts clear and finally restore melee hitSkill and melee-action context.
The actual delivered damage height wrapper no longer rejects an arrow because
the shooter is on another elevation or a stale melee skill was active. A shield
block is reported when a player's enemy impact does no damage against a shield.
This addresses a concrete damage-path defect, not a claim that every reported
miss is reproduced or fixed. Rendered crouch/standing, FP/TP, slope/range/shield,
ammo consumption and offline ordinary Save/reload still require current-hash
browser checks. Distant-hit auto-detection remains a separate pending repair.

New candidate SHA256 de232a9f53e24672152a01b7e90e1a3e8f9421d31bdf2bf523c4bea4aa524cea,
38,085,986 bytes. Recovered cinematic/animated-sling seed unchanged. No milestone
accepted. Newly requested criminal trainers, populated regional jails with
prisoner dialogue/release/arrest cycles, and NPC mutual interactions remain
pending; the existing arrest system creates a regional jail but does not prove
those requested populated/reachable services or schedules.

The first replacement e96ef458 also failed startup because rival camp bedding used nonexistent K.hide. It now uses explicit hide RGB; all continuation K palette references are audited against actual K0, with explicit fallback required for absent entries. Current hash supersedes both failed candidates.
