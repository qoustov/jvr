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

### Voice-reel duration reliability

- Verified the source MP3 durations with macOS audio metadata: Girly and Glam `29.86s`, Cozy and Warm `70.85s`, Emotional / Dramatic `41.51s`, Tech / Instructional `40.94s`, Sassy and Fun `59.78s`, and Warm and Whimsical `26.31s`.
- Confirmed every visible duration label matches the corresponding recording when formatted with the player's whole-second convention.
- Production diagnosis: Cloudflare returned cached `200` responses for MP3 Range requests, while the linked Railway media host returned correct `206 Partial Content` responses.
- Kept all six audio sources on the canonical site origin so iOS playback remains first-party and reliable.
- Added a declared-duration fallback so Safari never replaces a valid total with `0:00` while metadata is unavailable or delayed.
- Browser-tested every reel at 390 × 844: each control entered its `Pause` state and displayed the expected non-zero total (`0:29`, `1:10`, `0:41`, `0:40`, `0:59`, `0:26`).
- Confirmed the elapsed timer advances during playback (`0:09 / 0:26`) and no console errors were recorded.

final result: passed

### Girly and Glam default reel

- Source visual truth: `/tmp/codex-remote-attachments/01a005cb-22e1-7622-967d-c6a50306d649/DB36D766-B52E-4E05-888A-67DE5EFBC7FF/1-Photo-1.jpg` (1280 × 368 screenshot).
- Promoted `Girly and Glam Commercial` from position 6 to position 1 and made it the initial hero and player selection.
- Moved `Warm and Whimsical Read` to position 6 so the six-recording set remains complete.
- Updated the initial player duration and accessible controls to `0:29` and `Girly and Glam Commercial`.

final result: passed

### Default reel and mobile availability spacing

- Source visual truth: `/tmp/codex-remote-attachments/01a005cb-22e1-7622-967d-c6a50306d649/DE7C9737-284B-48DE-B052-E8344B757F75/1-Photo-1.jpg` (1280 × 853 screenshot).
- Browser-rendered implementation: `http://127.0.0.1:3003/?default-reel=qa#top`, inspected in the Codex in-app browser at 390 × 844 CSS px.
- State: initial hero and active playback state at 1.93 seconds.
- Promoted `Warm and Whimsical Read` from position 4 to position 1 and made it the initial hero and player selection.
- Moved `Tech / Instructional` to position 4 so all six unique recordings remain present.
- Updated the initial player duration to `0:26`, matching the selected recording instead of briefly displaying `0:00`.
- Increased the mobile gap above the availability line by 8 px, separating it from the overlaid hero actions without changing desktop spacing.
- Full-view comparison: hero composition, portrait crop and action placement remain unchanged; only the requested spacing and initial reel content differ.
- Focused-region comparison: the availability margin is 26 px, the player shows `Warm and Whimsical Read`, and playback reports a 26.28-second duration.
- Typography, colors and image assets are unchanged; the existing hierarchy and tokens remain consistent.
- Copy and accessibility: the hero and player labels now identify the same selected demo, and the active button changes to `Pause Warm and Whimsical Read`.
- Findings: no actionable P0, P1 or P2 issues remain; no console errors were recorded.
- Comparison history: pass 1 corrected the default reel, initial duration and availability spacing; the mobile initial and playing states both passed.

final result: passed

### Contact icon simplification

- Source visual truth: `/tmp/codex-remote-attachments/01a005cb-22e1-7622-967d-c6a50306d649/EA74F6BD-53B3-43AF-982C-573775A65255/1-Photo-1.jpg` (1280 × 720 screenshot).
- Browser-rendered implementation: `http://127.0.0.1:3003/?contact-icons=qa#contact`, inspected in the Codex in-app browser at 390 × 844 CSS px and 1280 × 900 CSS px.
- State: bottom of the contact form, default links, no hover or focus state active.
- Removed the visible `Direct contact` heading, rectangular panel, border and tinted panel background.
- Kept all four accessible contact links as a compact icon-only row directly on the pink section background.
- Reduced the desktop contact column to the row's natural width; mobile centres the icons beneath the enquiry form.
- Full-view comparison: the large pale rectangle and excess internal padding in the source are gone; the form-to-footer transition is shorter and visually cleaner.
- Focused-region comparison: the four source icons, their order and accessible destinations are preserved; only the enclosing rectangle and heading were removed, as requested.
- Typography: no contact heading remains; surrounding form labels and button typography are unchanged.
- Spacing and layout: desktop icons align with the enquiry action; mobile uses a centred 12 px-gap row with 52 px touch targets and no horizontal overflow.
- Colors and tokens: icons and outlines continue to use the existing ink token directly on the pink section background.
- Asset fidelity: the existing icon assets are unchanged; no placeholder, CSS-drawn or substitute icons were introduced.
- Copy and content: no visible contact copy remains, while `aria-label` text preserves the purpose of every link for assistive technology.
- Findings: no actionable P0, P1 or P2 differences remain. No additional focused crop was needed because all four icons are legible at both tested sizes.
- Comparison history: the source showed a large bordered card; pass 1 removed it and passed at both responsive sizes without further visual fixes.

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
