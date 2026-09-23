# V2.2 verification report

Date: 2026-09-18. This report covers the actual local build, not a production deployment.

## Executed

- 125 functional assertions passed using Python Playwright and actual headless Chromium. Source CSS/JS and local image bytes were inlined into an offline document. This was a real browser rendering test, not a DOM mock.
- Five public routes; 18 sample projects; three projects in every category; all 15 video samples point to the requested YouTube ID.
- Deferred YouTube iframe creation, correct embed ID and referrer attribute, and player removal on dialog close. No live YouTube playback was verified.
- Image gallery buttons, thumbnails, keyboard navigation, and no video iframe for Design.
- Six animated GIF assets decoded successfully. Pause/resume, posters, and reduced-motion defaults were checked.
- Eye joystick mouse drag, keyboard/Shift/Home controls, simulated touch tap, all sliders, independent eyelids, follow-pointer mode, reset, and auto-blink cancellation on navigation.
- Page overflow checked at 320, 390, 768, 1024, 1440, and 1920 CSS pixels on all five routes. Tip dialog overflow checked at the same widths. Desktop and mobile screenshots visually reviewed.
- Studio: five sections, more than 200 editable UI strings, project addition, Design/gallery enforcement, gallery uploads and reordering, note upload, export ZIP CRC validation, byte-for-byte uploaded image export, import round-trip, and mobile layout.
- Unpublished note and its exclusive media were excluded from public export files; content.json intentionally retains the complete private backup. Keep it offline.
- Search, Enter navigation, theme controls, escaped user text, missing-GIF behavior, blocked clipboard error path, and blocked compose-popup fallback were checked.
- No uncaught page exceptions occurred in these scenarios.

## Limits

- The managed browser in this environment cannot navigate to localhost or file URLs. The testing adapter inlined the same source into an about:blank document. It is not part of the delivered website.
- External network playback, YouTube embedding permission for the supplied video, authentication/region restrictions, and actual audio playback are not verified.
- Real multi-window live preview handshakes and persistent localStorage across browser restarts were not end-to-end verified here. Storage-unavailable behavior was exercised. The production code uses standard same-origin storage and a source-checked postMessage handshake.
- No claim of testing Safari, Firefox, iOS, Android hardware, screen-reader software, or the user's hosting platform.
- GIF samples are schematic illustrations authored for this website, not recordings of After Effects/Blender or render benchmarks.

## Source checks

All supplied JavaScript is plain, unminified source. The final JavaScript files were syntax-checked with Node. The local preview server uses only the Python standard library. No external runtime JavaScript package or font file is bundled.

## Manual acceptance before publishing

1. Back up the existing website, launch the local preview, and open studio.html on the same origin.
2. Edit one text, upload one small GIF/image, and confirm Preview draft updates.
3. Play the provided YouTube video over a live connection; use the external-video link if embedding is unavailable.
4. Export update, retain content.json offline, merge public data/ and assets/uploads/, and reload the normal website.
5. Check at least one real phone and the intended hosting URL.
