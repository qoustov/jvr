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

## Photography refresh — Downloads/Jenn

### Source and implementation evidence

- Source contact sheet: `/Users/madbeam/.codex/visualizations/2026/08/15/01a005cb-22e1-7622-967d-c6a50306d649/jenn-photo-review/contact-sheet.jpg`
- Source-to-site comparison: `/Users/madbeam/.codex/visualizations/2026/08/15/01a005cb-22e1-7622-967d-c6a50306d649/jenn-photo-review/source-to-site-comparison.jpg`
- Desktop captures: `hero-desktop.png`, `about-desktop.png`, `gallery-desktop.png` in the same review folder.
- Mobile captures: `hero-mobile.png`, `about-mobile.png`, `gallery-mobile-expanded.png` and `gallery-mobile-lightbox.png` in the same review folder.

### Decisions and checks

- All 17 supplied photographs are represented in the portrait gallery; no previous headshot or portrait is referenced by the page.
- The hero uses `IMG_3987`, selected for direct eye contact, neutral styling and sufficient crop room on narrow screens.
- The About section pairs the red microphone performance image (`IMG_6258`) with the black-and-white grand-piano image (`IMG_6272`) to communicate both vocal and musical work.
- The KidZania image remains its genuine video preview rather than a portrait, so the work card continues to represent the media it opens.
- Desktop and 390 × 844 mobile captures were inspected. Jennifer's face is fully visible in the hero at both widths, text does not cross her face, and the mobile actions remain reachable.
- The gallery's four-image mobile preview, 17-image expanded state and full-image dialog were all exercised successfully.
- The supplied originals remain untouched in `Downloads/Jenn`. Site assets use full-size and thumbnail WebP derivatives for responsive loading.
- The KidZania source video remains unmodified at 31,431,785 bytes.
- `npm run check` and `git diff --check` pass.

### Requested photo swap

- The black-and-white chair portrait (`IMG_3981`) now leads the About section and occupies gallery position 1.
- The red microphone portrait (`IMG_6258`) now occupies gallery position 8, preserving all 17 unique gallery photographs.
- Verified at 390 × 844: the About crop contains Jennifer's full face and the chair portrait reads cleanly above the heading.
- Verified gallery item 8 in the mobile lightbox with the correct red microphone image and updated accessible caption.
- QA captures: `about-mobile-swapped.png` and `gallery-mobile-item-8-swapped.png` in the photography review folder.

### Gallery curation and colour sequence

- Removed the hero portrait (`IMG_3987`) from the gallery, leaving 16 distinct gallery images.
- Reordered the collection to alternate monochrome, vivid red, neutral studio and dark cinematic frames instead of clustering similar backgrounds.
- The four-photo mobile preview now opens with a deliberate sequence: monochrome, red performance, neutral black look and warm studio portrait.
- The three-column desktop composition distributes red and dark images across the grid; the final unpaired tile is centred so the sequence ends intentionally.
- The two-column mobile grid remains complete with eight balanced rows and no forced column override.
- Verified desktop at 1280 px and mobile at 390 × 844, including collapsed and expanded mobile states.
- Comparison: `/Users/madbeam/.codex/visualizations/2026/08/15/01a005cb-22e1-7622-967d-c6a50306d649/jenn-photo-review/gallery-order-comparison.jpg`.
- Final captures: `gallery-order-desktop.png`, `gallery-order-desktop-final-lower.png`, `gallery-order-mobile-collapsed.png`, `gallery-order-mobile-expanded.png`, and `gallery-order-mobile-lower.png` in the same review folder.

### Contact block density

- Removed the helper sentence beneath the enquiry button and its now-unused `aria-describedby` reference.
- Replaced the stretched contact card with a compact, content-sized panel aligned to the end of the desktop form.
- Preserved the icon-only contact treatment while reducing icon and spacing scale for a tighter visual group.
- On mobile the heading and icon row stack within a short panel; the contact section no longer contains the large empty vertical area shown in the reference.
- Verified at 1280 × 900 and 390 × 844, including the transition into the footer.
- Comparison: `/Users/madbeam/.codex/visualizations/2026/08/15/01a005cb-22e1-7622-967d-c6a50306d649/jenn-photo-review/contact-layout-comparison.jpg`.
- Final captures: `contact-desktop-compact.png` and `contact-mobile-compact.png` in the same review folder.

final result: passed

### KidZania video playback and poster

- Replaced the preview with the supplied landscape piano portrait; Jennifer's full face remains visible in the 16:9 work frame at 390 × 844.
- Added inline playback support and made the custom mobile cover disappear only after playback actually starts.
- MP4 responses now use `Cache-Control: no-store`, preventing a cached full-file response from replacing Safari's required byte-range response.
- Versioned the video request so the first corrected deployment bypasses the stale CDN object immediately.
- Production verification found Cloudflare removes the `Range` request on the custom domain; the video source therefore uses the linked Railway media URL, which preserves `206 Partial Content`, while the public site remains on the canonical domain.
- Verified the local media endpoint returns `206 Partial Content`, `Content-Range: bytes 0-1023/31431785` and `Cache-Control: no-store`.
- Exercised the mobile cover in-browser: playback reached 2.4 seconds with `paused: false`, `readyState: 4` and no media error.
- Comparison: `/Users/madbeam/.codex/visualizations/2026/08/15/01a005cb-22e1-7622-967d-c6a50306d649/jenn-photo-review/kidzania-poster-comparison.jpg`.
- The original KidZania MP4 remains unmodified at 31,431,785 bytes.

final result: passed
