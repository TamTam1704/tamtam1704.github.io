# V2.2

- Reformatted HTML, CSS, JavaScript and SVG into readable source; added .editorconfig.
- Extended Content Studio with editable public UI copy, flexible profile sections, media uploads and byte-preserving ZIP export.
- Added video/gallery media types: 15 linked video samples and three Design galleries.
- Added six original illustrative GIFs, pause posters, and responsive side-by-side tip readers.
- Replaced the old motion-curve playground with an independent browser eye rig.
- Kept existing hash routes, category filtering, search, themes, bookmarks, contact compose, and local draft editing.
- Added reduced-motion handling and lifecycle cleanup for GIFs and the eye rig.
- Fixed a clipboard-error message name collision discovered during testing.
- Local preview server now uses stable port 8765 for consistent browser-draft storage.
- V2.2 uses a separate local draft key; import an earlier content.json intentionally rather than silently replacing the new defaults.
