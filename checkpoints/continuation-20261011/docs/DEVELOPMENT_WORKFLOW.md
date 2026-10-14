# Master Development Integration and Verification

## Ownership

The implementation owner is the ChatGPT conversation
`6ac9c216-df0c-83ea-ac8d-41f13f292693`, requested title
**Bronze Age RPG - Master Development**. The cloud executor currently identified
for that conversation is `01a1241e-4f6e-72c5-badf-7ae87f8ad0d8`.
The oversight conversations stay separate and can read progress evidence.

The private remote is `https://github.com/addezoysa-beep/bronze-age-rpg`.
Master Development has received the requirements, inspected the published
baseline commit `ba20a9d032af4deed4cc9ea34d396783a69cbe20`, and materialized a
matching local source tree in its cloud workspace. The unchanged 37,815,418-byte
game is published on `main` and `master-development`. The master audit is
[PR #2](https://github.com/addezoysa-beep/bronze-age-rpg/pull/2).
This workflow cannot intercept changes made in unrelated conversations or
unmanaged copies. Repository instructions, local hooks, and CI cover work in this
repository; remote enforcement requires publishing and protecting the branch.

## Per-update Cycle

1. Master Development assigns the next requirement and milestone IDs, using the
   dependency order in `ROADMAP.md`. Start a small branch from `master-development`
   (for example `m1/kobaloi-alerts`). Parallel work uses separate branches or
   worktrees with disjoint changes.
2. Inspect the active game code. Implement the assigned behavior and add its
   verification alongside it. Prefer a narrow checkpoint over a large batch.
3. Add `tracking/updates/<id>.json` containing milestone IDs, the current game
   SHA-256, summary, changed files, evidence paths, and master delivery/review state.
   Each subsequent game revision needs a fresh matching update record.
4. Run static/workflow checks and offline browser smoke checks. Run affected
   acceptance tests while development proceeds. Update the milestone's test
   results with the hash, method, evidence path, and reviewer. Record unrun tests
   as pending and failures as failed.
5. Send the update, branch/commit, and evidence to Master Development. Delivery
   and review are separate. Set delivery to `delivered` only after the message
   succeeded; set review to `passed` only after an actual review response. Include
   a link or durable reference to that response in `masterReview.evidence`.
6. Master Development integrates reviewed work on `master-development`. Fix
   failed checks on the same feature branch. Independent work may continue, but
   dependent milestone acceptance waits for its prerequisites.
7. Before promoting a checkpoint to `main`, run
   `node scripts/release-gate.mjs tracking/updates/<id>.json`. Every affected
   milestone must be accepted with passed tests and review for the current hash.
   Tag only that verified commit. Update records and test evidence travel with it.

Baseline import is a preserved candidate, not a verified release. All five
milestones start with `code_inspected` status and pending acceptance tests.

## Tracking Rules

`tracking/milestones.json` is the canonical progress source. States are
`planned`, `in_progress`, `code_inspected`, `runtime_verified`, and `accepted`.
Tests use `pending`, `passed`, or `failed`. Blockers and next actions accompany
every milestone. No percentage is inferred from the embedded `done` arrays.

Test results are tied to `buildSha256`. After code changes, rerun affected tests;
carry-forward requires an explicit review explaining why old evidence still
applies, followed by a new report for the current hash. The release gate requires
current-hash evidence and a passed master review. The review metadata is an audit
record, not cryptographic proof of the reviewer's identity.

Local hooks reject game commits on `main`, require a staged current-hash update
record, and compile staged inline scripts. They also run before local merges.
GitHub Actions will run repository checks and browser smoke checks on pushes/PRs.
These checks do not impersonate the master chat or automatically complete manual
gameplay tests.

## Remote Enforcement and Availability

The GitHub account is connected and the private repository is published. The
remote tree confirms the exact game blob and roadmap/check/tracking files.
GitHub Actions ran repository checks successfully; the initial browser run failed
on the obsolete test selector. The corrected local harness subsequently reached
gameplay and exposed a covered Save button. Runtime acceptance remains failed.

The intended protected `main` policy requires pull requests and the
`Repository checks` and `Offline browser smoke` status checks, prevent force
pushes/deletion, and restrict main integration to the designated account. Verify
which protections the account plan supports before claiming enforcement.
On 2026-10-10 the rulesets endpoint returned HTTP 403 requiring GitHub Pro or a
public repository; branch-protection inspection returned integration access
denied. No remote branch protection is claimed. Keep the repository private and
use the documented review/gate workflow; a plan change is not required to keep
development and CI progressing.

Master source access is verified in its baseline audit. Runtime evidence from
oversight travels on an M0 feature branch and is sent back to the master for
review and integration. No candidate becomes an accepted release from an audit.
An hourly follow-up named **Bronze Age RPG master follow-up** is active on the
separate local oversight chat. It checks the master workstream, completes setup,
and sends the next actionable checkpoint when the master is idle. Schedule
registration does not prove a future run executed. Implementation stays with
Master Development. Notify only on meaningful progress, completion, a failure,
or a required user action. The scheduler's execution availability is a separate
constraint from the cloud executor's current turn.
These local follow-ups require the Mac and desktop app to remain available.
An active cloud turn is distinct from a cloud-only recurring schedule; no such
cloud-only continuation has been verified during setup.
