# Pause-fixed offline candidate

`node scripts/build-offline.mjs` produces
`dist/Wine-Dark-Sea-Save-Fix.html`, a standalone playable file with embedded assets.
Download the private `pause-fixed-offline-candidate` Actions artifact, unzip it,
and open that HTML in a desktop browser. No server or internet is required.

The production builder applies two reviewed source changes: it puts the control
guide inside the pause panel and releases pointer lock/held input when pausing.
It accepts only the exact imported Build59 hash and verifies the exact output
hash `5207ee4a75ae228a6031a35042a5c7cf4dad76af94d4cdb4722708af017c87ba`.
The build is an explicit packaging step used by both players and CI; browser
tests do not inject fixes, force clicks, or invoke saving programmatically.

The imported `index.html` remains preserved. Its hash and audit fixtures describe
the source; the artifact manifest and browser report describe the generated game.
CI uploads the candidate only after its ordinary-input offline smoke test passes.
This candidate fixes pause-menu accessibility only. The larger gameplay overhaul
and M0 reference-device baseline remain incomplete. No milestone or release is
accepted by generating or downloading this file.
