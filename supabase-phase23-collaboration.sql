-- CelebrateVerse PHASE 23
-- Collaboration: project sharing, View/Edit/Admin permissions, comments and Realtime.
-- Run this once in the Supabase SQL Editor after supabase-phase22.sql.

create extension if not exists pgcrypto;

do $$
begin
  create type public.cv_project_permission as enum ('view', 'edit', 'admin');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.cv_project_collaborators (
  project_id text not null references public.cv_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  permission public.cv_project_permission not null default 'view',
  invited_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

create table if not exists public.cv_project_share_links (
  id uuid primary key default gen_random_uuid(),
  project_id text not null references public.cv_projects(id) on delete cascade,
  token uuid not null unique default gen_random_uuid(),
  permission public.cv_project_permission not null default 'view',
  created_by uuid not null references auth.users(id) on delete cascade,
  expires_at timestamptz,
  max_uses integer check (max_uses is null or max_uses > 0),
  uses_count integer not null default 0 check (uses_count >= 0),
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.cv_project_comments (
  id uuid primary key default gen_random_uuid(),
  project_id text not null references public.cv_projects(id) on delete cascade,
  parent_id uuid references public.cv_project_comments(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  author_label text not null default '',
  body text not null check (char_length(trim(body)) between 1 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cv_collaborators_project_idx on public.cv_project_collaborators(project_id, permission);
create index if not exists cv_share_links_project_idx on public.cv_project_share_links(project_id, created_at desc);
create index if not exists cv_comments_project_created_idx on public.cv_project_comments(project_id, created_at);

-- The owner always has Admin access. These security-definer helpers keep RLS policies
-- simple and avoid exposing collaborator rows to regular viewers/editors.
create or replace function public.cv_my_project_permission(p_project_id text)
returns public.cv_project_permission
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select 'admin'::public.cv_project_permission
       from public.cv_projects p
       where p.id = p_project_id and p.user_id = auth.uid()),
    (select c.permission
       from public.cv_project_collaborators c
      where c.project_id = p_project_id and c.user_id = auth.uid())
  );
$$;

create or replace function public.cv_can_view_project(p_project_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.cv_my_project_permission(p_project_id) is not null;
$$;

create or replace function public.cv_can_edit_project(p_project_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.cv_my_project_permission(p_project_id) in ('edit'::public.cv_project_permission, 'admin'::public.cv_project_permission);
$$;

create or replace function public.cv_can_admin_project(p_project_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.cv_my_project_permission(p_project_id) = 'admin';
$$;

-- Preserve project ownership even when an Editor updates a project through the API.
create or replace function public.cv_guard_project_identity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.id is distinct from old.id or new.user_id is distinct from old.user_id then
    raise exception 'Project identity and ownership cannot be changed';
  end if;
  return new;
end;
$$;

drop trigger if exists cv_guard_project_identity on public.cv_projects;
create trigger cv_guard_project_identity
before update on public.cv_projects
for each row execute function public.cv_guard_project_identity();

-- Project data is saved through this function so a collaborator can save without
-- ever being able to assign themselves (or another user) as the project owner.
create or replace function public.cv_save_project(
  p_project_id text,
  p_name text,
  p_project_data jsonb
)
returns table (id text, updated_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  saved public.cv_projects;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required to save a project';
  end if;
  if nullif(trim(p_project_id), '') is null then
    raise exception 'A project id is required';
  end if;

  select * into saved from public.cv_projects where id = p_project_id;
  if found then
    if not public.cv_can_edit_project(p_project_id) then
      raise exception 'You do not have edit access to this project';
    end if;
    update public.cv_projects
       set name = coalesce(nullif(trim(p_name), ''), 'Untitled Celebration'),
           project_data = coalesce(p_project_data, '{}'::jsonb),
           updated_at = now()
     where cv_projects.id = p_project_id
     returning * into saved;
  else
    insert into public.cv_projects (id, user_id, name, project_data)
    values (
      p_project_id,
      auth.uid(),
      coalesce(nullif(trim(p_name), ''), 'Untitled Celebration'),
      coalesce(p_project_data, '{}'::jsonb)
    )
    returning * into saved;
  end if;

  return query select saved.id, saved.updated_at;
end;
$$;

create or replace function public.cv_create_project_share_link(
  p_project_id text,
  p_permission public.cv_project_permission,
  p_expires_at timestamptz default null
)
returns table (token uuid, permission public.cv_project_permission, expires_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  invitation public.cv_project_share_links;
begin
  if auth.uid() is null or not public.cv_can_admin_project(p_project_id) then
    raise exception 'Only project admins can create sharing links';
  end if;
  if p_expires_at is not null and p_expires_at <= now() then
    raise exception 'The expiration time must be in the future';
  end if;

  insert into public.cv_project_share_links (project_id, permission, created_by, expires_at)
  values (p_project_id, p_permission, auth.uid(), p_expires_at)
  returning * into invitation;

  return query select invitation.token, invitation.permission, invitation.expires_at;
end;
$$;

create or replace function public.cv_accept_project_share_link(p_token uuid)
returns table (project_id text, permission public.cv_project_permission)
language plpgsql
security definer
set search_path = public
as $$
declare
  invitation public.cv_project_share_links;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required to accept a sharing link';
  end if;

  update public.cv_project_share_links
     set uses_count = uses_count + 1
   where token = p_token
     and revoked_at is null
     and (expires_at is null or expires_at > now())
     and (max_uses is null or uses_count < max_uses)
  returning * into invitation;

  if not found then
    raise exception 'This sharing link is expired, revoked, or invalid';
  end if;

  insert into public.cv_project_collaborators (project_id, user_id, permission, invited_by)
  values (invitation.project_id, auth.uid(), invitation.permission, invitation.created_by)
  on conflict (project_id, user_id) do update
     set permission = case
           when public.cv_project_collaborators.permission = 'admin'::public.cv_project_permission
             or excluded.permission = 'admin'::public.cv_project_permission then 'admin'::public.cv_project_permission
           when public.cv_project_collaborators.permission = 'edit'::public.cv_project_permission
             or excluded.permission = 'edit'::public.cv_project_permission then 'edit'::public.cv_project_permission
           else 'view'::public.cv_project_permission
         end,
         updated_at = now();

  return query
    select invitation.project_id,
           public.cv_my_project_permission(invitation.project_id);
end;
$$;

create or replace function public.cv_prepare_project_comment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  parent_project_id text;
begin
  if tg_op = 'INSERT' then
    new.author_id := auth.uid();
    new.author_label := coalesce(
      nullif(auth.jwt() ->> 'email', ''),
      'Collaborator ' || left(auth.uid()::text, 8)
    );
  else
    new.project_id := old.project_id;
    new.author_id := old.author_id;
    new.author_label := old.author_label;
  end if;

  if new.parent_id is not null then
    select project_id into parent_project_id
      from public.cv_project_comments
     where id = new.parent_id;
    if parent_project_id is null or parent_project_id <> new.project_id then
      raise exception 'A comment reply must belong to the same project';
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists cv_prepare_project_comment on public.cv_project_comments;
create trigger cv_prepare_project_comment
before insert or update on public.cv_project_comments
for each row execute function public.cv_prepare_project_comment();

alter table public.cv_projects enable row level security;
alter table public.cv_project_versions enable row level security;
alter table public.cv_project_collaborators enable row level security;
alter table public.cv_project_share_links enable row level security;
alter table public.cv_project_comments enable row level security;

drop policy if exists "cv_projects_select_own" on public.cv_projects;
drop policy if exists "cv_projects_insert_own" on public.cv_projects;
drop policy if exists "cv_projects_update_own" on public.cv_projects;
drop policy if exists "cv_projects_delete_own" on public.cv_projects;
drop policy if exists "cv_projects_select_collaborators" on public.cv_projects;
drop policy if exists "cv_projects_insert_owner" on public.cv_projects;
drop policy if exists "cv_projects_update_editors" on public.cv_projects;
drop policy if exists "cv_projects_delete_owner" on public.cv_projects;

create policy "cv_projects_select_collaborators" on public.cv_projects
  for select using (public.cv_can_view_project(id));
create policy "cv_projects_insert_owner" on public.cv_projects
  for insert with check (auth.uid() = user_id);
create policy "cv_projects_update_editors" on public.cv_projects
  for update using (public.cv_can_edit_project(id))
  with check (public.cv_can_edit_project(id));
create policy "cv_projects_delete_owner" on public.cv_projects
  for delete using (auth.uid() = user_id);

drop policy if exists "cv_versions_select_own" on public.cv_project_versions;
drop policy if exists "cv_versions_insert_own" on public.cv_project_versions;
drop policy if exists "cv_versions_select_collaborators" on public.cv_project_versions;
drop policy if exists "cv_versions_insert_editors" on public.cv_project_versions;

create policy "cv_versions_select_collaborators" on public.cv_project_versions
  for select using (public.cv_can_view_project(project_id));
create policy "cv_versions_insert_editors" on public.cv_project_versions
  for insert with check (auth.uid() = user_id and public.cv_can_edit_project(project_id));

drop policy if exists "cv_collaborators_admin_select" on public.cv_project_collaborators;
drop policy if exists "cv_collaborators_admin_insert" on public.cv_project_collaborators;
drop policy if exists "cv_collaborators_admin_update" on public.cv_project_collaborators;
drop policy if exists "cv_collaborators_admin_delete" on public.cv_project_collaborators;

create policy "cv_collaborators_admin_select" on public.cv_project_collaborators
  for select using (public.cv_can_admin_project(project_id));
create policy "cv_collaborators_admin_insert" on public.cv_project_collaborators
  for insert with check (public.cv_can_admin_project(project_id));
create policy "cv_collaborators_admin_update" on public.cv_project_collaborators
  for update using (public.cv_can_admin_project(project_id))
  with check (public.cv_can_admin_project(project_id));
create policy "cv_collaborators_admin_delete" on public.cv_project_collaborators
  for delete using (public.cv_can_admin_project(project_id));

drop policy if exists "cv_share_links_admin_select" on public.cv_project_share_links;
drop policy if exists "cv_share_links_admin_insert" on public.cv_project_share_links;
drop policy if exists "cv_share_links_admin_update" on public.cv_project_share_links;
drop policy if exists "cv_share_links_admin_delete" on public.cv_project_share_links;

create policy "cv_share_links_admin_select" on public.cv_project_share_links
  for select using (public.cv_can_admin_project(project_id));
create policy "cv_share_links_admin_insert" on public.cv_project_share_links
  for insert with check (public.cv_can_admin_project(project_id));
create policy "cv_share_links_admin_update" on public.cv_project_share_links
  for update using (public.cv_can_admin_project(project_id))
  with check (public.cv_can_admin_project(project_id));
create policy "cv_share_links_admin_delete" on public.cv_project_share_links
  for delete using (public.cv_can_admin_project(project_id));

drop policy if exists "cv_comments_project_viewers_select" on public.cv_project_comments;
drop policy if exists "cv_comments_project_viewers_insert" on public.cv_project_comments;
drop policy if exists "cv_comments_authors_or_admins_update" on public.cv_project_comments;
drop policy if exists "cv_comments_authors_or_admins_delete" on public.cv_project_comments;

create policy "cv_comments_project_viewers_select" on public.cv_project_comments
  for select using (public.cv_can_view_project(project_id));
create policy "cv_comments_project_viewers_insert" on public.cv_project_comments
  for insert with check (auth.uid() = author_id and public.cv_can_view_project(project_id));
create policy "cv_comments_authors_or_admins_update" on public.cv_project_comments
  for update using (author_id = auth.uid() or public.cv_can_admin_project(project_id))
  with check (public.cv_can_view_project(project_id));
create policy "cv_comments_authors_or_admins_delete" on public.cv_project_comments
  for delete using (author_id = auth.uid() or public.cv_can_admin_project(project_id));

grant select, insert, update, delete on public.cv_projects to authenticated;
grant select, insert on public.cv_project_versions to authenticated;
grant select, insert, update, delete on public.cv_project_collaborators to authenticated;
grant select, insert, update, delete on public.cv_project_share_links to authenticated;
grant select, insert, update, delete on public.cv_project_comments to authenticated;
revoke all on function public.cv_my_project_permission(text) from public, anon;
revoke all on function public.cv_can_view_project(text) from public, anon;
revoke all on function public.cv_can_edit_project(text) from public, anon;
revoke all on function public.cv_can_admin_project(text) from public, anon;
revoke all on function public.cv_save_project(text, text, jsonb) from public, anon;
revoke all on function public.cv_create_project_share_link(text, public.cv_project_permission, timestamptz) from public, anon;
revoke all on function public.cv_accept_project_share_link(uuid) from public, anon;
grant execute on function public.cv_my_project_permission(text) to authenticated;
grant execute on function public.cv_can_view_project(text) to authenticated;
grant execute on function public.cv_can_edit_project(text) to authenticated;
grant execute on function public.cv_can_admin_project(text) to authenticated;
grant execute on function public.cv_save_project(text, text, jsonb) to authenticated;
grant execute on function public.cv_create_project_share_link(text, public.cv_project_permission, timestamptz) to authenticated;
grant execute on function public.cv_accept_project_share_link(uuid) to authenticated;

-- Realtime sends full project/comment rows so clients can refresh their local view.
alter table public.cv_projects replica identity full;
alter table public.cv_project_comments replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.cv_projects;
exception
  when duplicate_object then null;
  when undefined_object then raise notice 'supabase_realtime publication is not available; enable Realtime for cv_projects in Supabase.';
end $$;

do $$
begin
  alter publication supabase_realtime add table public.cv_project_comments;
exception
  when duplicate_object then null;
  when undefined_object then raise notice 'supabase_realtime publication is not available; enable Realtime for cv_project_comments in Supabase.';
end $$;
