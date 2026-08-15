# Design QA — iPhone portfolio corrections

## Evidence

- Source visual truth: `/tmp/codex-remote-attachments/01a005cb-22e1-7622-967d-c6a50306d649/3B3AFD97-B774-40F8-8340-3EB5FEB800AE/1-Photo-1.jpg`
- Implementation capture: `/Users/madbeam/.codex/visualizations/2026/08/15/01a005cb-22e1-7622-967d-c6a50306d649/jvr-hero-closeup-mobile.jpg`
- Desktop implementation capture: `/Users/madbeam/.codex/visualizations/2026/08/15/01a005cb-22e1-7622-967d-c6a50306d649/jvr-hero-closeup-desktop.jpg`
- Combined comparison: `/Users/madbeam/.codex/visualizations/2026/08/15/01a005cb-22e1-7622-967d-c6a50306d649/jvr-hero-closeup-comparison.jpg`
- State: mobile hero at page load, audio paused
- CSS viewport: 390 × 844
- Source pixels: 589 × 1280, including iPhone Safari chrome
- Implementation pixels: 390 × 844 at device scale factor 1
- Normalization: source browser chrome cropped at y=143, then the 589 px page width was resized to the 390 px CSS target; implementation was compared at its native 390 px width.
- Additional source captures: `/tmp/codex-remote-attachments/01a005cb-22e1-7622-967d-c6a50306d649/C477C2FD-3928-497C-AB4F-CE2E085233C2/1-Photo-1.jpg`, `/tmp/codex-remote-attachments/01a005cb-22e1-7622-967d-c6a50306d649/C477C2FD-3928-497C-AB4F-CE2E085233C2/2-Photo-2.jpg`, and `/tmp/codex-remote-attachments/01a005cb-22e1-7622-967d-c6a50306d649/C477C2FD-3928-497C-AB4F-CE2E085233C2/3-Photo-3.jpg`.
- Additional implementation captures: `jvr-work-mobile-final.jpg`, `jvr-about-mobile-final.jpg`, `jvr-contact-mobile-final.jpg`, and `jvr-clients-mobile-final.jpg` in the visualization folder above.
- Additional combined comparisons: `jvr-work-comparison.jpg`, `jvr-about-comparison.jpg`, and `jvr-contact-comparison.jpg` in the visualization folder above.

## Full-view comparison

The combined comparison confirms that the original composition and content hierarchy remain intact. Jennifer is now unmistakably larger and positioned closer to the introduction on mobile. The desktop capture confirms the same closer crop at the wide breakpoint, while both primary actions remain visible without horizontal overflow.

## Focused comparison

The hero controls were inspected at readable size in the combined comparison. The source displayed Apple emoji substitutions for the play and external-link glyphs. The implementation uses local Bootstrap Icons SVG assets, with stable monochrome rendering and the contact label remaining on one line.

## Findings and iteration history

- P1 fixed — Unicode play and arrow characters rendered as blue Apple emoji in iPhone Safari. Replaced the glyphs with official Bootstrap Icons assets and updated playback state changes to swap play and pause SVG files.
- P2 fixed — Jennifer's portrait felt detached from the copy. Increased the mobile portrait region from 310 px to 340 px, shifted it left and upward, then enlarged the image itself to 115% with a small downward correction to preserve the full head. The desktop image is enlarged to 110%.
- P2 fixed — The first SVG-icon pass caused “Contact Jennifer” to wrap at 390 px. Reduced mobile button spacing and padding and added `white-space: nowrap`; the final capture shows a single-line label.
- P1 fixed — The KidZania placeholder showed an unrelated portrait. Replaced it with a still captured from the unchanged source video; playback transitions from the still into the original video.
- P1 fixed — The client grid used the unrelated METRO retail logo. Replaced it with the blue Петербургский метрополитен emblem and an explicit Russian brand label.
- P2 fixed — The About section repeated the white studio portrait. Replaced it with the requested seated KidZania-placeholder portrait and removed the captured phone bars from its presentation crop.
- P2 fixed — Direct-contact links were visually noisy text rows and still exposed Safari emoji. Replaced them with four consistent Bootstrap icon controls for email, WhatsApp, Instagram and Telegram, each with an accessible name.
- P2 fixed — Removed the redundant “Open video in a new tab” action from the selected-work section.

## Required fidelity surfaces

- Fonts and typography: existing families, sizing, line height and hierarchy are unchanged; the contact action remains single-line.
- Spacing and layout rhythm: hero spacing remains consistent, with the portrait intentionally enlarged and brought closer to the copy.
- Colors and tokens: existing paper, ink, coral and pink tokens are unchanged; icons inherit the established monochrome treatment through image filtering on dark controls.
- Image quality and asset fidelity: the original hero WebP and 31,431,785-byte KidZania video remain unchanged. The new poster is an actual frame from that video, and the About image is a clean crop of the requested existing portrait.
- Copy and content: the redundant video link was removed; the direct-contact label is concise and all icon links have descriptive accessible names.

## Interaction and technical checks

- Play control tested: audio starts, `aria-pressed` becomes `true`, and both visible play icons switch to the pause asset.
- KidZania cover tested: activating it hides the cover, starts the original video and leaves captions available.
- Direct-contact destinations verified in the DOM, including WhatsApp at `wa.me/79652657136`.
- No horizontal overflow at 390 px.
- Browser console: no errors.

## Follow-up polish

- None required for this scoped correction.

final result: passed
