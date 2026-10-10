# Master Development baseline audit

Reviewed published commit `ba20a9d032af4deed4cc9ea34d396783a69cbe20` through the authenticated GitHub connection. Direct shell Git authentication is unavailable. Repository files were materialized locally; the locally computed tree is exactly `3e86847636a90716c157dd50e04e874deb9b7011`, matching the published commit tree. Local snapshot commits have separate identities and must not be pushed as replacement history.

The GitHub contents endpoint returned an empty content field for the large game. The existing offline artifact was retrieved instead and verified against both the expected SHA256 and repository blob identity. Game bytes remain unchanged: 37,815,418 bytes; SHA256 `14e1907fe630e0d8062a29fb9a58087e46888a0c31198f563842cacb0efbe177`.

Master read AGENTS.md, ROADMAP.md, DEVELOPMENT_WORKFLOW.md and milestones.json. DEVELOPMENT53 lines 6233-6238 directly confirm the original five milestone scopes. Later done arrays are not accepted evidence. The roadmap's source-based scope mapping supersedes the earlier provisional plan; missing discussion wording and hardware targets remain open.

Three scripts compile; all eight workflow tests pass locally. Runtime smoke could not launch because Chromium is absent. Installation failed with invalid/truncated downloaded ZIPs. This is an environment failure before any game execution, not evidence of a game crash or successful startup. BASE-02 and BASE-03 remain pending. No milestones are accepted.

The original smoke selector #new-voyage30 is incompatible with the menu handler captured by #bnew.onclick. The local diagnostic used the actual [data-new] controls, but no browser execution was possible. Oversight owns the corresponding harness fix; this checkpoint does not publish a competing smoke edit.

packRole29 (line 4927) is defined once and assigns at most two committed attackers per wolf/Kobaloi kind. packApproach29 gates the close-state path before kobFight26, including its later crawl and dread wrappers. scripts/audit-pack-limit.mjs executes the actual source function: eight and ten nearby Kobaloi both yield only two eligible attackers. This fails the source-fixture eligibility check, not a full browser GROUP-01 scenario. Do not simply remove all spacing: the eventual fix needs eight-to-ten concurrent attack eligibility plus collision-aware approach and readable action timing.

kobFight26 contains close/feint/wind/strike/recovery and evasion paths; later wrappers add crawl and dread attacks. Existing source presence does not establish collision correctness, coordinated alerts, or runtime acceptance. The final Build59 hand/grip/motion/HUD overrides require visual and action tests.

Next: obtain a working browser runtime or consume exact-hash runtime evidence from oversight; finish BASE-02; record reference devices and remaining history limitations for BASE-03. Then begin M1 narrow action/attachment checkpoints. M3 pack eligibility is a confirmed source mismatch awaiting the required dependencies. Preserve eight-to-ten simultaneous attackers and multiple equipment/AI/animation types in every faction; numerical roster remains a proposal.

Master checkpoint review: source/tree identity and static workflow evidence reviewed here; audit accepted as diagnostic evidence only. No gameplay, performance, or milestone acceptance is granted.
