# Bronze Age RPG - Master Development

The user designated the master-development workstream as the integration and
verification owner. Canonical ChatGPT conversation:
`6ac9c216-df0c-83ea-ac8d-41f13f292693`.
Its current cloud execution chat is `01a1241e-4f6e-72c5-badf-7ae87f8ad0d8`.
Keep the oversight/check-progress conversations separate.

- Read `docs/DEVELOPMENT_WORKFLOW.md`, `docs/ROADMAP.md`, and
  `tracking/milestones.json` before changes.
- Treat `index.html` as the candidate Build 59 source. Inspect active overrides
  before changing behavior. Embedded milestone claims are source claims, not
  verified acceptance results.
- Route each update through Master Development. Other implementation chats
  contribute branches and evidence; Master Development integrates them.
- Work on a feature branch or `master-development`; do not put game changes
  directly on `main`. Add an update record in `tracking/updates/` with the exact
  game SHA-256 and affected milestones. Keep verification running alongside work.
- Run static and workflow checks for every update. Run browser smoke checks when
  game code changes, and the affected milestone acceptance tests. Record failures
  and pending manual tests honestly. A smoke pass does not complete a milestone.
- A release requires delivered master review, a passed review for the exact game
  hash, and passed acceptance evidence for all affected milestones. Use
  `scripts/release-gate.mjs`; never alter evidence to make a gate pass.
- Send human-readable update summaries to Master Development only with user
  authorization. The user has authorized routing updates from this work through
  that chat. Do not send unrelated messages or alter oversight chats.
- Do not edit the original Downloads file or synced references outside this repo.
- GitHub publishing, branch protection, and cloud checkout access are pending
  until an authenticated GitHub connection is available. Never report them active
  before verifying them.

