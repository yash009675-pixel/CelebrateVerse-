# CelebrateVerse v18 implementation

This build hardens the existing 5-step customizer and its single Stable Editor integration without removing the existing Supabase/payment flow.

## Implemented/hardened in this pass
- Occasion and package URL preselection remains supported.
- Existing five-step customizer remains intact.
- Single `stable-editor.js` is the active editor implementation on Customize.
- Editor save state now persists editor pages, HTML, background and form state.
- Manual Save + debounced Auto Save.
- My Projects can reopen saved editor state without dynamically injecting duplicate editor scripts.
- Publish generates a self-contained `celebration.html?data=...` share URL for the current static deployment.
- PNG/JPG/PDF/ZIP exports retained.
- Resize handles are isolated in `editor-enhancements.js` and removed from saved HTML.
- PWA cache bumped from v17 to v18.
- Customize editor assets use `?v=18` cache busting.

## Important production boundary
A truly public, persistent URL, cloud projects across devices, real-time collaboration, comments, AI API generation, and server-side payment/publish security require backend/API work. The existing Supabase schema is retained rather than pretending localStorage is a cloud backend.

## QA recommendation
Run a fresh deployment and verify:
1. Homepage occasion links.
2. Customize preselection after refresh.
3. Package prices and payment redirect.
4. Add/select/move/resize/delete/duplicate/lock/hide editor elements.
5. Save, refresh, reopen project.
6. Publish/share/export.
7. Browser console and service-worker cache version.
