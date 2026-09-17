# tamtam. / Portfolio V2 + The Lab

A five-view, static portfolio: Home, Projects, Lab, About, Contact.
Dark navy, lime/ice/lilac accents, dimensional game-inspired details.
HTML + CSS + JavaScript. No build step, framework, external font files, tracking,
autoplaying background video, or paid service. Public copy is English.

## Start and publish

Extract the entire ZIP first. Open index.html to see the site. Open studio.html
for the editor. Read HUONG-DAN.html for Vietnamese instructions. The optional
START-PREVIEW.bat launcher requires Python 3 and starts a local-only server.
The website itself does not require Python.

This is a COMPLETE REPLACEMENT for the previous generated site, not a CSS patch.
Back up the current repository. Upload the contents of this folder to the
repository root, where index.html belongs. Do not upload the enclosing folder.
No live website or GitHub repository was changed while creating this package.

## Content Studio

The editor is local, not an authenticated CMS and not connected to GitHub.
It does not write to your website source files. Browser storage is used when
available; use Export update to keep a portable copy of your changes.

Four panels:
- Profile & content: name, brand, bio, hero, real showreel URL, contacts, history.
- Projects: fixed category filters, multiple categories per project, artwork,
  video, optional case-study sections, before/after image paths, ordering.
- Lab / Tips & Tricks: add, remove, reorder, publish/unpublish notes; edit text,
  steps, code, official references, tutorial/resource URLs and sample labels.
- Tools & appearance: tool slots, optional logos, palette and motion defaults.

Preview draft opens index.html?draft=1. Normal public visits do not load drafts.
Export update creates data/site.js, data/projects.js, data/lab.js and content.json.
Replace the THREE JS data files in your website, add any new media files, then
commit to GitHub. Media is NOT included in the content-update ZIP.

IMPORTANT: content.json retains unpublished notes. Keep it offline; do NOT
upload it. The exported data/lab.js includes only published notes. Putting
unpublished content directly in a public data file does not make it private.
Any data and media you upload to a public repository can be read by others.
No private credentials belong in this website or its editor.

Older exported content.json files are normalized on import, including category
migration. Back up the original JSON before importing. Preview it before export.
Some browser file:// or privacy modes disable persistent storage. The editor
reports this; export before closing. Local HTTP preview is preferable for editing.

## Where to change things

| Change | File |
|---|---|
| Profile, brand, real reel, theme, Lab introduction | data/site.js |
| Projects, categories, case studies, media | data/projects.js |
| Tips, snippets, versions, resources, official references | data/lab.js |
| Main colors and fonts (system fallbacks only) | styles/theme.css |
| V2 responsive overrides and Lab layout | styles/upgrade.css |
| Base layout | styles/main.css |
| Motion preferences and transitions | styles/motion.css |
| Individual views | components/*.js |
| Routing, interaction, dialog, search | scripts/app.js |
| Editor | studio.html, scripts/studio.js, styles/studio.css |
| Static social and search metadata | index.html |

Keep upgrade.css AFTER main.css and motion.css. Fixed filters are defined in
scripts/utils.js: All Work, Motion, 3D, Story, Design, Ads, Social. A project's
primary category determines its card label; its categories array controls
additional memberships. The total collection count counts projects, not tags.

## Authentic work first

The three inherited projects remain clearly marked CONCEPT PREVIEW. They are
not published client case studies. Their media fields are empty. Some artwork
is low resolution; use your full-resolution approved images for final work.
Do not turn off the preview label until the project is ready to present honestly.
No client logos, view counts, performance results or experience claims were made up.

Optional caseStudy fields: brief, role, process, outcome. Empty sections hide.
Optional compare: before and after image paths, beforeLabel and afterLabel.
Both paths enable a touch/keyboard image comparison slider. Use aligned images
with matching aspect ratios. It compares images, NOT synchronized videos.

Video: YouTube, Vimeo, or direct/local MP4/WebM/OGV. Embeds load on Play, not on
page entry. Availability, permissions, codec compatibility and platform policies
still require testing with your actual media. Set showreel in site.js to enable
the Home reel action; there is no fake showreel in this package.

## The Lab

The playground compares linear timing with three CSS cubic-bezier curves. It
is an illustrative browser experiment, not a reproduction of the AE Graph Editor.
It runs only when pressed, respects reduced motion, and stops on route changes.

Six starter notes include links to Adobe or Blender documentation. They are
editorial examples, not claims that Tam personally tested these recipes. Replace
or adapt them and state actual tested versions before publishing as your own.
Pinned Blender 4.2 references are not claims about the newest Blender version.
Share your own project files or original-author resource links, never unlicensed
paid plugin binaries. For a strong note, add a short result demo, clear steps,
application version, limitations and source attribution.

Bookmarks and display preferences are per-browser and not account-synced.
Search opens via the header button or Ctrl/Cmd + K. It searches loaded local
configuration, not the web. Hash links work with browser Back/Forward; search
engines/social previews may not index individual hash-route notes as separate
articles. The package does not claim a multi-page SEO blog. A future content-heavy
Lab could generate one static URL per article without changing the visual design.

## Responsive and accessibility choices

Fluid layout, constrained desktop widths, dedicated ultrawide sizing, touch
navigation, 44px primary controls, safe-area padding, 16px form input text,
keyboard navigation, native dialogs with explicit focus wrapping, no forced
cursor replacement, no scroll hijacking and system reduced-motion support.
Do not equate these choices with a formal accessibility certification.

TEST-REPORT.md lists the exact checks and limitations. This package was rendered
in Chromium at 17 viewports, not tested on physical iPhones/iPads or Safari.
Native media playback, network performance, server caching and GitHub deployment
must be checked in the final hosting environment. No FPS or Lighthouse score is
claimed. The standalone HTML preview embeds artwork for portability; deploy the
multi-file ZIP version so files can be cached independently.
