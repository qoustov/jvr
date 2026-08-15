# Design QA — iPhone 17 Pro Max safe area

## Evidence

- Reported iPhone 17 Pro Max capture: `/tmp/codex-remote-attachments/01a005cb-22e1-7622-967d-c6a50306d649/EB5AEFC8-5F8F-4888-AC57-FA5EE026EDFB/1-Photo-1.jpg`
- Local 430 × 932 implementation capture: `/Users/madbeam/.codex/visualizations/2026/08/15/01a005cb-22e1-7622-967d-c6a50306d649/jvr-safe-area-430-normal.jpg`
- Normalized comparison: `/Users/madbeam/.codex/visualizations/2026/08/15/01a005cb-22e1-7622-967d-c6a50306d649/jvr-safe-area-comparison.jpg`
- The supplied 589 px capture was proportionally normalized to the 430 px CSS viewport used for local testing.

## Findings and fixes

- P1 fixed — the wordmark occupied the iOS status-bar region and collided with the clock. Mobile header top padding now includes `env(safe-area-inset-top)`.
- P1 fixed — moving only the header would make it collide with the eyebrow on notched devices. Mobile hero top padding uses the same safe-area inset, preserving the established header-to-heading spacing.
- P2 fixed — tablet/landscape header padding now also respects top, left and right safe-area insets.
- P2 verified — at a zero-inset 430 × 932 viewport, the established hero geometry, portrait crop, actions and player remain unchanged.
- P2 verified — Jennifer's forehead, eyes, nose, mouth and chin remain fully visible in the supplied 17 Pro Max capture and the local 430 px capture.

## Limits

- Desktop browser emulation reports zero for iOS environment insets. The CSS uses Apple's standardized runtime safe-area values; final status-bar clearance must be confirmed on the physical 17 Pro Max after deployment.
- No application asset, content or interaction changed.

final result: passed
