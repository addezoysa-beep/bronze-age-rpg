# Post-load presentation budget checkpoint

Game SHA256 `bf22a397a307c979cbfe937d550d3a4fcf0ffec6b3565e420e2b32cfd9c2be5f`, 38,148,911 bytes. Recovered seed `bf1405897255eeba324ca3095b49cf972bd7184b1f5f060c3dec952377a04fa1` preserved. Isolated feature branch `m1/postload-pose-budget-20261014`; no original/synced files replaced.

The prior local workspace had reverted to an older checkout. Recovered actual published PR29 source at `513271aaed761f9a651373ddc0d611ee818eb763` into an isolated directory, reproduced exact prior `118d9a82` hash, then advanced implementation. Do not duplicate source as missing or assume obsolete publication hold.

Integrated 147: hidden wild-herd rig pose, neck and root presentation work now yields. Logical movement, route selection, grazing timers, agitation and saved positions still run. Visible/approaching horses pose normally; owned/dead/taming/interior exclusions retained. Actual original function compared over 1,000 ticks; no enemy AI/attacker reduction.

Hand grip reuses one private Vector3, resetting it before every exact rotated shaft-seat calculation. 1,000 alternating weapon/rotation calls allocate no additional seat vectors and preserve positions within 1e-12. Existing grip epsilon/angle checks are unchanged. One fixture initially compared floating-point subtraction to a decimal literal; expected value corrected to the actual `.034-.014` arithmetic, not a widened tolerance. Legacy fake Vector3 now implements real `set` behavior; actual embedded Three.js separately verifies the calculation.

80 available continuation/source/compile/executable tests pass. This is not the complete remote baseline suite. Current build integrity compiles all three delivered scripts and preserves seed prefix/tail. New-hash ordinary runtime/visual/performance/manual Save acceptance is pending. No speedup percentage or smoothness claim.

Fresh inspection confirms prior118 browser Pan, lock, stick-grip, remedies and Low startup/ordinary Save/exact Load passed scoped scenarios. Travel failed saved-slot absence before menu; tavern purchase/indoor identity passed but server movement failed; arrow draw failed. Those passes are historical and not carried onto bf22 automatically. Current remote513 workflows fail before job steps/logs; cause not established, not a source failure or approval rejection. Keep runtime work open.

Next: collect full current source/workflow result and ordinary Low startup/Save/Load; old-save reference performance with 8–10 simultaneous attackers; instrument dominant actors/visuals and people/places construction, fix actual Save/server/arrow failures. Preserve all opening/Pan/King/Daedalus/QOL/core Bronze Age priorities; expanded Troy remains lower. No M0–M5 accepted; 120 active-hour budget not decremented.
