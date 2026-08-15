# Design QA — clean mobile hero composition

## Evidence

- Reported iPhone Safari state: `/tmp/codex-remote-attachments/01a005cb-22e1-7622-967d-c6a50306d649/F03B0B21-59F3-49BD-A446-D7A477AA5A92/1-Photo-1.jpg`
- Corrected 390 × 844 implementation: `/Users/madbeam/.codex/visualizations/2026/08/15/01a005cb-22e1-7622-967d-c6a50306d649/jvr-hero-final-polished-mobile.jpg`
- Narrow 320 × 780 check: `/Users/madbeam/.codex/visualizations/2026/08/15/01a005cb-22e1-7622-967d-c6a50306d649/jvr-hero-final-320.jpg`
- Combined comparison: `/Users/madbeam/.codex/visualizations/2026/08/15/01a005cb-22e1-7622-967d-c6a50306d649/jvr-hero-clean-comparison.jpg`
- Browser: in-app browser using mobile viewport dimensions.
- Normalization: Safari chrome was removed from the reference before the app-owned content was resized proportionally to the 390 px implementation width.

## Findings and fixes

- P1 fixed — the biography crossed Jennifer's forehead, eyes and hair. The copy and portrait now occupy separate mobile grid rows, eliminating all text-on-face overlap.
- P1 fixed — simply stacking the portrait pushed both primary actions below the useful first-screen area. The actions now sit cleanly over the portrait's lower paper area, preserving a compact hero.
- P2 fixed — the biography's narrow seven-column measure caused unnecessary wrapping. It now uses the full mobile content width with a 350 px readable maximum.
- P2 fixed — the close portrait crop is retained without the previous oversized transform. The image uses a stable width-led crop at 122%, keeping Jennifer prominent at both 390 px and 320 px.
- P2 fixed — the secondary action lost contrast where it crossed the black dress. It now has an opaque paper surface while preserving the existing outlined style.
- P2 verified — the wordmark, menu, heading, biography, portrait, actions and availability remain legible with no horizontal overflow at 320 px or 390 px.

## Safeguards

- The original hero asset is reused without reprocessing.
- Desktop hero styling is unchanged.
- The KidZania video remains unchanged and uncompressed.
- Existing navigation, audio, contact and transcript behavior is unchanged.

final result: passed
