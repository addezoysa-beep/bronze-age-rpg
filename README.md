# Wine-Dark Sea

Candidate Build 59 of the Bronze Age RPG, imported unchanged from the supplied
offline HTML. Open `index.html` directly in a browser. No server is required for
the game. The supplied file remains untouched.

This repository is owned by **Bronze Age RPG - Master Development** for
integration and verification. `main` holds the preserved baseline and reviewed
checkpoints; `master-development` is the integration branch. Read the
[roadmap](docs/ROADMAP.md), [workflow](docs/DEVELOPMENT_WORKFLOW.md), and
[milestone tracker](tracking/milestones.json) for current evidence and gates.

The embedded game's progress lists are not independent test results. Source
presence, browser startup, manual gameplay verification, and milestone acceptance
are tracked separately. No gameplay features were changed during repository setup.

## Checks

Node 22 or newer runs the dependency-free repository checks:

```sh
node scripts/verify.mjs
node --test scripts/workflow.test.mjs
node scripts/progress.mjs
```

For the offline browser smoke test, install the pinned development dependency and
its browser once. The game itself has no new dependency:

```sh
npm install
npx playwright install chromium
npm run test:browser
```

Existing local Playwright installations can be selected with
`PLAYWRIGHT_MODULE_PATH`. `NODE_BIN` selects Node for the local hooks.
`PLAYWRIGHT_EXECUTABLE_PATH` selects an installed Chromium-family browser.
Reports go to `verification/runtime/`. Evidence snapshots belong in
`verification/records/` and must identify the exact game SHA-256.

Install the tracked local hooks in each checkout:

```sh
git config core.hooksPath .githooks
```

Hooks help enforce local practice but can be bypassed. The GitHub workflow runs
after publication. Remote branch protection and cloud checkout access require
separate confirmation. The private remote is
[addezoysa-beep/bronze-age-rpg](https://github.com/addezoysa-beep/bronze-age-rpg).
No credentials are stored in this repository.

