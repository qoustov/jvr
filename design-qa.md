# Design QA — close mobile hero and transcript spacing

## Evidence

- Hero framing reference: `/tmp/codex-remote-attachments/01a005cb-22e1-7622-967d-c6a50306d649/34C43203-869F-43E3-AC94-2A7EE8CBDBF8/2-Photo-2.jpg`
- Transcript/client reference: `/tmp/codex-remote-attachments/01a005cb-22e1-7622-967d-c6a50306d649/34C43203-869F-43E3-AC94-2A7EE8CBDBF8/1-Photo-1.jpg`
- Mobile hero implementation: `/Users/madbeam/.codex/visualizations/2026/08/15/01a005cb-22e1-7622-967d-c6a50306d649/jvr-hero-target-mobile.jpg`
- Transcript/client implementation: `/Users/madbeam/.codex/visualizations/2026/08/15/01a005cb-22e1-7622-967d-c6a50306d649/jvr-transcript-separator-mobile.jpg`
- Combined hero comparison: `/Users/madbeam/.codex/visualizations/2026/08/15/01a005cb-22e1-7622-967d-c6a50306d649/jvr-hero-target-comparison.jpg`
- Combined divider comparison: `/Users/madbeam/.codex/visualizations/2026/08/15/01a005cb-22e1-7622-967d-c6a50306d649/jvr-divider-comparison.jpg`
- Browser and viewport: in-app browser, 390 × 844 CSS pixels.
- Normalization: the 827 × 1280 portrait reference was proportionally resized to 390 × 604 and compared with the matching 390 × 604 hero region. The Safari chrome was removed from the transcript reference before its page width was normalized to 390 pixels.

## Findings and fixes

- P1 fixed — the previous mobile portrait remained visibly smaller than the supplied reference. The portrait now uses the full mobile hero width and a 136% crop, matching the reference head, shoulder and torso scale while retaining the original hero asset.
- P2 fixed — the portrait's center was slightly too far right after enlargement. A small 14 px left correction aligns Jennifer with the reference framing.
- P2 fixed — the client strip added a second rule beneath the transcript's own bottom border. Removed the client-strip border so the transition now contains one separator only.
- P2 verified — the closer portrait remains inside the clipped hero frame, the two primary controls retain their full labels, and the page has no accidental horizontal overflow in the 390 px capture.

## Asset and behavior safeguards

- The original `jennifer-hero-original.webp` is used without reprocessing.
- The original KidZania video remains unchanged and uncompressed.
- Desktop hero rules are unchanged; the closer reference crop is scoped to the mobile breakpoint.
- Existing playback, menu, contact and transcript interactions are unchanged.

final result: passed
