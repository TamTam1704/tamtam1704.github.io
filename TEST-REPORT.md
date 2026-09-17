# tamtam. Portfolio V2 / Verification report

Date: 2026-09-17. Application version: 4.0.0.

## Environment and scope

Headless system Chromium, controlled with Playwright. The managed browser
blocks navigation to HTTP and file URLs. Policies were not changed. The site
HTML, its exact CSS/JavaScript and local images were assembled into an offline
inline document and rendered using set_content. Separate loopback HTTP requests
confirmed that the actual multi-file index, Studio and all 17 index
resource paths were present and served successfully.

This is a browser layout/interaction check, not a real-device lab, a deployment
check, a Safari certification, or a network-performance benchmark.

## Responsive checks

85 route/viewport combinations: five views at 17 viewport sizes.
All measured document widths fit the viewport. No offscreen horizontal overflow
was detected in visible, non-dialog HTML elements. Sample screens were also
inspected visually. Touch/coarse-pointer emulation was used on narrow/tablet
sizes; browser emulation is not a substitute for actual iOS/Android hardware.

| CSS viewport | Views |
|---|---|
| 320 x 690 | Home, Projects, Lab, About, Contact |
| 360 x 800 | Home, Projects, Lab, About, Contact |
| 375 x 667 | Home, Projects, Lab, About, Contact |
| 390 x 844 | Home, Projects, Lab, About, Contact |
| 430 x 932 | Home, Projects, Lab, About, Contact |
| 507 x 900 | Home, Projects, Lab, About, Contact |
| 768 x 1024 | Home, Projects, Lab, About, Contact |
| 820 x 1180 | Home, Projects, Lab, About, Contact |
| 844 x 390 | Home, Projects, Lab, About, Contact |
| 1024 x 768 | Home, Projects, Lab, About, Contact |
| 1180 x 820 | Home, Projects, Lab, About, Contact |
| 1280 x 720 | Home, Projects, Lab, About, Contact |
| 1366 x 768 | Home, Projects, Lab, About, Contact |
| 1440 x 900 | Home, Projects, Lab, About, Contact |
| 1920 x 1080 | Home, Projects, Lab, About, Contact |
| 2560 x 1080 | Home, Projects, Lab, About, Contact |
| 3440 x 1440 | Home, Projects, Lab, About, Contact |

## Functional checks

43 named checks passed in the final functional run. This count is
not a quality score and should not be presented as one. No application or Studio
JavaScript exceptions were captured in the final layout/functional runs.

- Home mounts on demand without other views
- Brand is tamtam.
- Seven exact project filters
- Filter Motion: correct sample membership
- Filter 3D: correct sample membership
- Filter Story: correct sample membership
- Filter Design: correct sample membership
- Filter Ads: correct sample membership
- Filter Social: correct sample membership
- Empty project search has reset action
- Project list view switches
- Project opens a native dialog
- No pretend video button in sample project
- Project keyboard focus stays in dialog
- Esc closes project and restores filter
- Lab has six starter notes
- No looping animation while idle
- Motion playground changes timing in actual rendered frames
- AE shorthand search finds After Effects notes
- Bookmark and saved-only filter work
- Blocked storage is reported honestly
- Note reader has official reference and sample disclaimer
- Quick search finds an expression note
- Quick search opens correct note
- Copyable snippet available
- Close search result moves focus to visible content
- OS reduced motion disables playground
- Accent choice updates theme
- Contact uses a Gmail compose fallback, no sending
- Optional case study fields render
- Comparison slider updates split
- Phone dialog fits viewport
- Studio exposes Lab article fields
- Studio autosave serializes new schema
- Studio exports all three JS data files
- Unpublished notes are excluded from public export
- Offline content.json retains unpublished note
- Multi-category and case-study changes exported
- Legacy configuration receives Lab defaults and category migration
- Studio mobile content has no horizontal overflow
- Studio mobile projects has no horizontal overflow
- Studio mobile lab has no horizontal overflow
- Studio mobile tools has no horizontal overflow

## Important test distinctions

- Image comparison and case-study fields were exercised with temporary in-memory
  fixtures. These fixtures are NOT shipped as fake portfolio work.
- Browser storage is restricted on the offline test origin. The public app's
  storage-unavailable fallback was checked directly. Studio save/restore schema
  and export were tested with an explicitly injected in-memory Storage adapter.
  This checks serialization, not native persistent storage across real sessions.
- Export ZIP bytes were inspected. The three JS files are present; unpublished
  notes are excluded from public lab.js and retained in offline content.json.
  Native browser download behavior was not independently verified here.
- Clipboard and outgoing browser navigation are restricted by the environment.
  Copy controls and graceful failure paths exist; successful OS clipboard access
  must be checked in the user's browser. No contact message was sent.
- The Gmail popup-blocked fallback generated the intended compose link. No
  external account was accessed and no GitHub repository was modified.
- No real video was supplied. Native video/iframe playback, remote permissions,
  codecs and third-party embeds were NOT validated end-to-end in this revision.
- No Safari/WebKit/Firefox run, physical iPad/iPhone run, screen-reader audit,
  measured FPS, Lighthouse score, slow-network trace or Core Web Vitals claim.
- Aspect ratios and breakpoints were checked as CSS viewports. Device pixel
  ratio, OS scaling, browser zoom, keyboards, rotation UI and notches can differ
  on hardware; validate those in the final browser/device combination.

## Final content caveats

Three inherited project artworks remain labeled concepts. Some thumbnails are
low resolution. Six Lab notes are marked starter examples and cite official
Adobe/Blender references; they are not personal testing claims. Before/after and
case-study sections only appear after the owner supplies relevant data.

The standalone preview is for portable review. The ZIP contains the deployable
multi-file source and Vietnamese instructions. Back up the old site first.
