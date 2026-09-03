# CelebrateVerse Phase 23 — Collaboration

Phase 23 extends the Phase 22 cloud-project snapshot model. It does not change the checkout, order, payment, or package flow.

## One-time Supabase setup

Run `supabase-phase23-collaboration.sql` in the Supabase SQL Editor after the existing Phase 22 SQL. The script adds:

- Permissioned project members: `View`, `Edit`, and `Admin`.
- Bearer share links that an admin can set to expire or revoke.
- Threaded project comments; authors can edit/delete their own comments and admins can moderate all comments.
- Row Level Security policies that grant the owner implicit Admin access and constrain each collaborator to their assigned role.
- A safe `cv_save_project` RPC, preventing editors from changing project ownership.
- Supabase Realtime publication for project snapshots and comments.

## Behaviour

- **View** collaborators can open the shared project and add comments, but editor/form controls are read-only.
- **Edit** collaborators can modify and save the editor, view comments, and use version history; they cannot manage sharing.
- **Admin** collaborators can also create/revoke sharing links and change or remove member permissions.
- Incoming updates are applied live. If a local edit is still in progress when another editor saves, the editor asks whether to load the remote version or keep the local draft.

Anonymous Supabase users are supported, so share links work without exposing the `auth.users` table. For a recognizable commenter identity, use normal signed-in accounts; anonymous users are shown as a short collaborator label.
