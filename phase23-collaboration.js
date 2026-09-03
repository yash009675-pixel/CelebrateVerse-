/* CelebrateVerse PHASE 23 — Sharing, collaboration, comments and permissions */
(function () {
  'use strict';

  const PROJECTS = 'cv_projects';
  const MEMBERS = 'cv_project_collaborators';
  const LINKS = 'cv_project_share_links';
  const COMMENTS = 'cv_project_comments';
  const ACTIVE_KEY = 'celebrateVerseActiveProject';
  const REMOTE_SETTLE_MS = 3200;

  let projectId = localStorage.getItem(ACTIVE_KEY) || null;
  let user = null;
  let permission = null;
  let channel = null;
  let comments = [];
  let replyTo = null;
  let pendingRemote = null;
  let lastLocalChangeAt = 0;

  const $ = id => document.getElementById(id);
  const phase22 = () => window.CelebrateVersePhase22;
  const client = () => window.supabaseClient;
  const isAdmin = () => permission === 'admin';
  const canEdit = () => permission !== 'view';
  const canComment = () => Boolean(permission);
  const permissionLabel = value => ({ view: 'View', edit: 'Edit', admin: 'Admin' }[value] || 'Local');
  const shortId = value => value ? `${String(value).slice(0, 8)}…` : 'Unknown collaborator';

  function setStatus(message, state) {
    const status = $('cvCollabStatus');
    if (!status) return;
    status.textContent = message;
    status.dataset.state = state || 'neutral';
  }

  function showNotice(message, error) {
    const notice = $('cvP23Notice');
    if (!notice) return;
    notice.hidden = false;
    notice.textContent = message;
    notice.dataset.state = error ? 'error' : 'ok';
  }

  function clearNotice() {
    const notice = $('cvP23Notice');
    if (notice) notice.hidden = true;
  }

  async function ensureUser() {
    if (user) return user;
    if (!client()) return null;
    try {
      const current = await client().auth.getUser();
      if (current.data?.user) {
        user = current.data.user;
        return user;
      }
      const anonymous = await client().auth.signInAnonymously?.();
      user = anonymous?.data?.user || null;
      return user;
    } catch (error) {
      console.warn('Phase 23 collaboration auth unavailable:', error);
      return null;
    }
  }

  function setReadOnly(readOnly) {
    document.body.classList.toggle('cv-p23-readonly', readOnly);
    document.querySelector('#stableEditor')?.classList.toggle('cv-p23-editor-readonly', readOnly);
    document.querySelectorAll('#celebrationForm input, #celebrationForm textarea, #celebrationForm select').forEach(element => {
      if (!element.dataset.cvP23Disabled) element.dataset.cvP23Disabled = element.disabled ? '1' : '0';
      element.disabled = readOnly || element.dataset.cvP23Disabled === '1';
    });
    const editorStatus = $('edStatus');
    if (readOnly && editorStatus) editorStatus.textContent = '👁 View-only access';
  }

  function refreshPermissionUI() {
    const chip = $('cvPermissionChip');
    if (chip) chip.textContent = permission ? `${permissionLabel(permission)} access` : 'Local draft';
    const share = $('cvShareProject');
    if (share) share.hidden = !isAdmin();
    const panel = $('cvP23Panel');
    if (panel) panel.dataset.permission = permission || 'local';
    setReadOnly(permission === 'view');
  }

  function serialiseComparable(snapshot) {
    if (!snapshot) return '';
    const copy = JSON.parse(JSON.stringify(snapshot));
    delete copy.updatedAt;
    return JSON.stringify(copy);
  }

  function currentMatches(snapshot) {
    try {
      const current = phase22()?.getSnapshot?.();
      return current && serialiseComparable(current) === serialiseComparable(snapshot);
    } catch (_) {
      return false;
    }
  }

  function subscribe(project) {
    if (!client() || !project) return;
    if (channel) client().removeChannel(channel);
    channel = client()
      .channel(`cv-phase23-${project}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: PROJECTS, filter: `id=eq.${project}`
      }, payload => receiveRemoteProject(payload.new))
      .on('postgres_changes', {
        event: '*', schema: 'public', table: COMMENTS, filter: `project_id=eq.${project}`
      }, () => fetchComments())
      .subscribe(status => {
        if (status === 'SUBSCRIBED') setStatus(`● Live · ${permissionLabel(permission)}`);
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') setStatus('○ Changes will sync when online', 'warning');
      });
  }

  function receiveRemoteProject(record) {
    const snapshot = record?.project_data;
    if (!snapshot || record.id !== projectId || currentMatches(snapshot)) return;
    if (Date.now() - lastLocalChangeAt < REMOTE_SETTLE_MS) {
      pendingRemote = snapshot;
      showNotice('A collaborator has newer changes. Choose whether to load them or keep your draft.');
      const conflict = $('cvP23Conflict');
      if (conflict) conflict.hidden = false;
      return;
    }
    applyRemote(snapshot);
  }

  function applyRemote(snapshot) {
    if (!snapshot) return;
    pendingRemote = null;
    phase22()?.applySnapshot?.(snapshot);
    clearNotice();
    const conflict = $('cvP23Conflict');
    if (conflict) conflict.hidden = true;
    setStatus('● Live · collaborator changes loaded');
  }

  async function keepLocal() {
    pendingRemote = null;
    clearNotice();
    const conflict = $('cvP23Conflict');
    if (conflict) conflict.hidden = true;
    await phase22()?.saveNow?.({ version: true });
    setStatus('● Live · kept your changes');
  }

  async function fetchPermission(project) {
    const currentUser = await ensureUser();
    if (!client() || !currentUser || !project) return null;
    const { data: projectRow, error: projectError } = await client()
      .from(PROJECTS)
      .select('id,user_id')
      .eq('id', project)
      .maybeSingle();
    if (projectError) throw projectError;
    if (!projectRow) return 'admin'; // New local project; Phase 22 creates it on first cloud save.
    if (projectRow.user_id === currentUser.id) return 'admin';
    const { data, error } = await client().rpc('cv_my_project_permission', { p_project_id: project });
    if (error) throw error;
    return data || 'view';
  }

  async function startProject(nextProject) {
    projectId = nextProject || localStorage.getItem(ACTIVE_KEY) || projectId;
    if (!projectId) return;
    localStorage.setItem(ACTIVE_KEY, projectId);
    try {
      permission = await fetchPermission(projectId);
      refreshPermissionUI();
      refreshDrawerPermissions();
      subscribe(projectId);
      await fetchComments();
      setStatus(permission ? `● Live · ${permissionLabel(permission)}` : '○ Local draft');
    } catch (error) {
      // If the Phase 23 SQL has not been applied yet, never grant a remote project edit access.
      console.warn('Phase 23 access check unavailable:', error);
      permission = 'view';
      refreshPermissionUI();
      refreshDrawerPermissions();
      setStatus('○ Collaboration setup is incomplete', 'warning');
    }
  }

  async function acceptInviteFromUrl() {
    const url = new URL(location.href);
    const token = url.searchParams.get('cvShare');
    if (!token || !client()) return;
    try {
      await ensureUser();
      const { data, error } = await client().rpc('cv_accept_project_share_link', { p_token: token });
      if (error) throw error;
      const accepted = Array.isArray(data) ? data[0] : data;
      if (!accepted?.project_id) throw new Error('The share link did not return a project.');
      url.searchParams.delete('cvShare');
      history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`);
      const { data: projectRow, error: projectError } = await client()
        .from(PROJECTS)
        .select('project_data')
        .eq('id', accepted.project_id)
        .single();
      if (projectError) throw projectError;
      const snapshot = projectRow.project_data || { id: accepted.project_id };
      snapshot.id = accepted.project_id;
      phase22()?.applySnapshot?.(snapshot);
      await startProject(accepted.project_id);
      showNotice(`Shared project opened with ${permissionLabel(accepted.permission)} access.`);
    } catch (error) {
      console.warn('Phase 23 invite acceptance failed:', error);
      showNotice(error.message || 'This sharing link could not be accepted.', true);
    }
  }

  async function fetchComments() {
    if (!client() || !projectId || !canComment()) {
      comments = [];
      renderComments();
      return;
    }
    const { data, error } = await client()
      .from(COMMENTS)
      .select('id,parent_id,author_id,author_label,body,created_at,updated_at')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
    if (error) {
      console.warn('Phase 23 comments unavailable:', error);
      return;
    }
    comments = data || [];
    renderComments();
  }

  function formatTime(value) {
    try { return new Date(value).toLocaleString(); } catch (_) { return ''; }
  }

  function commentCard(comment, nested) {
    const card = document.createElement('article');
    card.className = `cv-p23-comment${nested ? ' cv-p23-comment-reply' : ''}`;
    const head = document.createElement('div');
    head.className = 'cv-p23-comment-head';
    const name = document.createElement('strong');
    name.textContent = comment.author_id === user?.id ? 'You' : (comment.author_label || shortId(comment.author_id));
    const date = document.createElement('time');
    date.dateTime = comment.created_at;
    date.textContent = formatTime(comment.created_at);
    head.append(name, date);
    const body = document.createElement('p');
    body.textContent = comment.body;
    const actions = document.createElement('div');
    actions.className = 'cv-p23-comment-actions';
    const reply = document.createElement('button');
    reply.type = 'button';
    reply.textContent = 'Reply';
    reply.disabled = !canComment();
    reply.onclick = () => setReply(comment);
    actions.append(reply);
    if (comment.author_id === user?.id) {
      const edit = document.createElement('button');
      edit.type = 'button';
      edit.textContent = 'Edit';
      edit.onclick = () => editComment(comment);
      actions.append(edit);
    }
    if (comment.author_id === user?.id || isAdmin()) {
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'cv-p23-danger-button';
      remove.textContent = 'Delete';
      remove.onclick = () => deleteComment(comment.id);
      actions.append(remove);
    }
    card.append(head, body, actions);
    return card;
  }

  function renderComments() {
    const list = $('cvCommentsList');
    const empty = $('cvCommentsEmpty');
    if (!list || !empty) return;
    list.replaceChildren();
    const byParent = new Map();
    comments.forEach(comment => {
      const key = comment.parent_id || '__root__';
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key).push(comment);
    });
    const rendered = new Set();
    const appendThread = (comment, depth) => {
      if (rendered.has(comment.id)) return;
      rendered.add(comment.id);
      list.append(commentCard(comment, depth > 0));
      (byParent.get(comment.id) || []).forEach(reply => appendThread(reply, depth + 1));
    };
    (byParent.get('__root__') || []).forEach(comment => appendThread(comment, 0));
    // A removed parent should not hide a surviving comment if legacy data has one.
    comments.forEach(comment => { if (!rendered.has(comment.id)) appendThread(comment, 0); });
    empty.hidden = comments.length > 0;
  }

  function setReply(comment) {
    replyTo = comment;
    const state = $('cvCommentReplyState');
    if (state) {
      state.hidden = false;
      state.textContent = `Replying to ${comment.author_id === user?.id ? 'yourself' : (comment.author_label || 'a collaborator')}`;
    }
    $('cvCommentBody')?.focus();
  }

  function clearReply() {
    replyTo = null;
    const state = $('cvCommentReplyState');
    if (state) state.hidden = true;
  }

  async function addComment(event) {
    event.preventDefault();
    const input = $('cvCommentBody');
    const body = input?.value.trim();
    if (!body || !client() || !projectId || !canComment()) return;
    const submit = $('cvCommentSubmit');
    if (submit) submit.disabled = true;
    try {
      const { error } = await client().from(COMMENTS).insert({
        project_id: projectId,
        parent_id: replyTo?.id || null,
        author_id: user?.id,
        body
      });
      if (error) throw error;
      input.value = '';
      clearReply();
      await fetchComments();
    } catch (error) {
      console.warn('Phase 23 comment save failed:', error);
      showNotice(error.message || 'Comment could not be saved.', true);
    } finally {
      if (submit) submit.disabled = false;
    }
  }

  async function deleteComment(id) {
    if (!client() || !id || !confirm('Delete this comment and its replies?')) return;
    const { error } = await client().from(COMMENTS).delete().eq('id', id);
    if (error) {
      showNotice(error.message || 'Comment could not be deleted.', true);
      return;
    }
    await fetchComments();
  }

  async function editComment(comment) {
    const body = prompt('Edit comment:', comment.body);
    if (body === null) return;
    const nextBody = body.trim();
    if (!nextBody) {
      showNotice('A comment cannot be empty.', true);
      return;
    }
    const { error } = await client().from(COMMENTS).update({ body: nextBody }).eq('id', comment.id);
    if (error) {
      showNotice(error.message || 'Comment could not be updated.', true);
      return;
    }
    await fetchComments();
  }

  function selectPermission(selected) {
    const select = document.createElement('select');
    ['view', 'edit', 'admin'].forEach(value => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = permissionLabel(value);
      option.selected = selected === value;
      select.append(option);
    });
    return select;
  }

  async function loadAdminData() {
    if (!client() || !projectId || !isAdmin()) return;
    const [membersResult, linksResult] = await Promise.all([
      client().from(MEMBERS).select('user_id,permission,created_at').eq('project_id', projectId).order('created_at', { ascending: true }),
      client().from(LINKS).select('id,permission,expires_at,revoked_at,uses_count,created_at').eq('project_id', projectId).order('created_at', { ascending: false })
    ]);
    if (membersResult.error || linksResult.error) {
      showNotice((membersResult.error || linksResult.error).message || 'Sharing controls are unavailable.', true);
      return;
    }
    renderMembers(membersResult.data || []);
    renderLinks(linksResult.data || []);
  }

  function renderMembers(members) {
    const list = $('cvMembersList');
    if (!list) return;
    list.replaceChildren();
    if (!members.length) {
      const empty = document.createElement('p');
      empty.className = 'cv-p23-muted';
      empty.textContent = 'No invited collaborators yet.';
      list.append(empty);
      return;
    }
    members.forEach(member => {
      const row = document.createElement('div');
      row.className = 'cv-p23-member';
      const label = document.createElement('span');
      label.textContent = member.user_id === user?.id ? 'You (invite record)' : shortId(member.user_id);
      const role = selectPermission(member.permission);
      role.setAttribute('aria-label', `Permission for ${shortId(member.user_id)}`);
      role.onchange = () => updateMember(member.user_id, role.value);
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'cv-p23-danger-button';
      remove.textContent = 'Remove';
      remove.onclick = () => removeMember(member.user_id);
      row.append(label, role, remove);
      list.append(row);
    });
  }

  function renderLinks(links) {
    const list = $('cvLinksList');
    if (!list) return;
    list.replaceChildren();
    const active = links.filter(link => !link.revoked_at);
    if (!active.length) {
      const empty = document.createElement('p');
      empty.className = 'cv-p23-muted';
      empty.textContent = 'No active share links.';
      list.append(empty);
      return;
    }
    active.forEach(link => {
      const row = document.createElement('div');
      row.className = 'cv-p23-link';
      const label = document.createElement('span');
      label.textContent = `${permissionLabel(link.permission)} · ${link.expires_at ? `expires ${formatTime(link.expires_at)}` : 'never expires'}`;
      const revoke = document.createElement('button');
      revoke.type = 'button';
      revoke.className = 'cv-p23-danger-button';
      revoke.textContent = 'Revoke';
      revoke.onclick = () => revokeLink(link.id);
      row.append(label, revoke);
      list.append(row);
    });
  }

  async function updateMember(memberId, nextPermission) {
    const { error } = await client().from(MEMBERS)
      .update({ permission: nextPermission, updated_at: new Date().toISOString() })
      .eq('project_id', projectId)
      .eq('user_id', memberId);
    if (error) showNotice(error.message || 'Permission could not be updated.', true);
    else await loadAdminData();
  }

  async function removeMember(memberId) {
    if (!confirm('Remove this collaborator from the project?')) return;
    const { error } = await client().from(MEMBERS)
      .delete().eq('project_id', projectId).eq('user_id', memberId);
    if (error) showNotice(error.message || 'Collaborator could not be removed.', true);
    else await loadAdminData();
  }

  async function revokeLink(linkId) {
    const { error } = await client().from(LINKS)
      .update({ revoked_at: new Date().toISOString() })
      .eq('id', linkId).eq('project_id', projectId);
    if (error) showNotice(error.message || 'Share link could not be revoked.', true);
    else await loadAdminData();
  }

  async function createShareLink() {
    if (!isAdmin() || !projectId || !client()) return;
    const button = $('cvCreateShareLink');
    if (button) button.disabled = true;
    try {
      // Persist the current editor before a new collaborator can open it.
      await phase22()?.saveNow?.({ version: true });
      const permissionValue = $('cvSharePermission')?.value || 'view';
      const days = Number($('cvShareExpiry')?.value || 0);
      const expiresAt = days > 0 ? new Date(Date.now() + days * 86400000).toISOString() : null;
      const { data, error } = await client().rpc('cv_create_project_share_link', {
        p_project_id: projectId,
        p_permission: permissionValue,
        p_expires_at: expiresAt
      });
      if (error) throw error;
      const invite = Array.isArray(data) ? data[0] : data;
      if (!invite?.token) throw new Error('The sharing link could not be created.');
      const url = new URL(location.href);
      url.searchParams.set('cvShare', invite.token);
      const output = $('cvShareLinkOutput');
      if (output) {
        output.hidden = false;
        output.value = url.href;
        output.select();
      }
      await navigator.clipboard?.writeText(url.href);
      showNotice(`${permissionLabel(permissionValue)} link created and copied. Anyone with this link can join until it is revoked or expires.`);
      await loadAdminData();
    } catch (error) {
      console.warn('Phase 23 sharing link failed:', error);
      showNotice(error.message || 'Share link could not be created.', true);
    } finally {
      if (button) button.disabled = false;
    }
  }

  function openDrawer(tab) {
    const drawer = $('cvCollaborationDrawer');
    if (!drawer) return;
    drawer.hidden = false;
    switchDrawerTab(tab || 'comments');
    if (isAdmin()) loadAdminData();
    fetchComments();
  }

  function closeDrawer() {
    const drawer = $('cvCollaborationDrawer');
    if (drawer) drawer.hidden = true;
  }

  function switchDrawerTab(tab) {
    document.querySelectorAll('[data-cv-p23-tab]').forEach(button => {
      button.classList.toggle('active', button.dataset.cvP23Tab === tab);
    });
    document.querySelectorAll('[data-cv-p23-pane]').forEach(pane => {
      pane.hidden = pane.dataset.cvP23Pane !== tab;
    });
  }

  function injectUI() {
    const toolbar = document.querySelector('.edbar');
    if (!toolbar || $('cvP23Panel')) return;
    const panel = document.createElement('span');
    panel.id = 'cvP23Panel';
    panel.className = 'cv-p23-panel';
    panel.innerHTML = '<button type="button" id="cvOpenComments">💬 Comments</button><button type="button" id="cvShareProject">🔗 Share</button><span id="cvPermissionChip" class="cv-p23-chip">Local draft</span><span id="cvCollabStatus" class="cv-p23-status" role="status" aria-live="polite"></span>';
    toolbar.append(panel);

    const drawer = document.createElement('aside');
    drawer.id = 'cvCollaborationDrawer';
    drawer.className = 'cv-p23-drawer';
    drawer.hidden = true;
    drawer.setAttribute('aria-label', 'Project collaboration');
    drawer.innerHTML = `
      <div class="cv-p23-drawer-head"><div><span class="cv-p23-eyebrow">PHASE 23</span><h2>Collaboration</h2></div><button type="button" id="cvCloseCollaboration" aria-label="Close collaboration panel">×</button></div>
      <p id="cvP23Notice" class="cv-p23-notice" hidden></p>
      <div class="cv-p23-conflict" id="cvP23Conflict" hidden></div>
      <div class="cv-p23-tabs"><button type="button" class="active" data-cv-p23-tab="comments">Comments</button><button type="button" data-cv-p23-tab="sharing" id="cvSharingTab">Sharing</button></div>
      <section data-cv-p23-pane="comments"><p id="cvCommentsEmpty" class="cv-p23-muted">No comments yet. Start the conversation.</p><div id="cvCommentsList" class="cv-p23-comments"></div><form id="cvCommentForm" class="cv-p23-comment-form"><p id="cvCommentReplyState" class="cv-p23-reply-state" hidden></p><textarea id="cvCommentBody" maxlength="2000" rows="4" placeholder="Leave a comment…"></textarea><div><button type="button" id="cvCancelReply" class="cv-p23-text-button">Cancel reply</button><button type="submit" id="cvCommentSubmit">Comment</button></div></form></section>
      <section data-cv-p23-pane="sharing" hidden><div id="cvShareAdmin"><p class="cv-p23-muted">Create a permissioned link. You can change access or revoke links at any time.</p><div class="cv-p23-share-options"><label>Access<select id="cvSharePermission"><option value="view">View</option><option value="edit">Edit</option><option value="admin">Admin</option></select></label><label>Expires<select id="cvShareExpiry"><option value="7">In 7 days</option><option value="30">In 30 days</option><option value="0">Never</option></select></label><button type="button" id="cvCreateShareLink">Create link</button></div><input id="cvShareLinkOutput" class="cv-p23-link-output" readonly hidden aria-label="New sharing link"><h3>Collaborators</h3><div id="cvMembersList"></div><h3>Active links</h3><div id="cvLinksList"></div></div><p id="cvShareNotAdmin" class="cv-p23-muted" hidden>Only project admins can manage sharing.</p></section>
    `;
    document.body.append(drawer);

    $('cvOpenComments').onclick = () => openDrawer('comments');
    $('cvShareProject').onclick = () => openDrawer('sharing');
    $('cvCloseCollaboration').onclick = closeDrawer;
    $('cvCommentForm').addEventListener('submit', addComment);
    $('cvCancelReply').onclick = clearReply;
    $('cvCreateShareLink').onclick = createShareLink;
    document.querySelectorAll('[data-cv-p23-tab]').forEach(button => {
      button.onclick = () => switchDrawerTab(button.dataset.cvP23Tab);
    });
    const conflict = $('cvP23Conflict');
    conflict.innerHTML = '<span>New remote changes are waiting.</span><button type="button" id="cvLoadRemote">Load theirs</button><button type="button" id="cvKeepLocal">Keep mine</button>';
    $('cvLoadRemote').onclick = () => applyRemote(pendingRemote);
    $('cvKeepLocal').onclick = keepLocal;
  }

  function refreshDrawerPermissions() {
    const admin = $('cvShareAdmin');
    const message = $('cvShareNotAdmin');
    if (admin) admin.hidden = !isAdmin();
    if (message) message.hidden = isAdmin();
    const commentInput = $('cvCommentBody');
    const commentSubmit = $('cvCommentSubmit');
    if (commentInput) commentInput.disabled = !canComment();
    if (commentSubmit) commentSubmit.disabled = !canComment();
  }

  function init() {
    injectUI();
    refreshPermissionUI();
    refreshDrawerPermissions();
    document.addEventListener('cv:changed', () => { lastLocalChangeAt = Date.now(); });
    document.addEventListener('keydown', event => {
      if (permission !== 'view' || event.target.closest('#cvCollaborationDrawer')) return;
      const editorShortcut = event.key === 'Delete' || event.key.startsWith('Arrow') ||
        ((event.ctrlKey || event.metaKey) && ['z', 'y', 'c', 'v'].includes(event.key.toLowerCase()));
      if (editorShortcut) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
    document.addEventListener('cv:projectLoaded', event => {
      const next = event.detail?.id || localStorage.getItem(ACTIVE_KEY);
      if (next && next !== projectId) startProject(next);
    });
    window.addEventListener('beforeunload', () => { if (channel) client()?.removeChannel(channel); });
    startProject(projectId);
    acceptInviteFromUrl();
  }

  window.CelebrateVerseCollaboration = {
    canEdit,
    getPermission: () => permission,
    openComments: () => openDrawer('comments'),
    openSharing: () => openDrawer('sharing'),
    startProject
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
