/* CelebrateVerse PHASE 22 — Cloud Projects, Version History & Autosave */
(function () {
  'use strict';

  const STORAGE_KEY = 'celebrateVerseProjects';
  const ACTIVE_KEY = 'celebrateVerseActiveProject';
  const DRAFT_KEY = 'celebrateVersePhase22Draft';
  const CLOUD_TABLE = 'cv_projects';
  const VERSION_TABLE = 'cv_project_versions';
  const MAX_VERSIONS = 30;
  const CLOUD_DEBOUNCE = 1400;
  let activeId = localStorage.getItem(ACTIVE_KEY) || `cv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  let cloudTimer = null;
  let autosaveTimer = null;
  let cloudBusy = false;

  const $ = id => document.getElementById(id);
  const editor = () => window.CelebrateVerseEditor;
  const preview = () => $('cvPreviewContent');

  function localProjects() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (_) { return []; }
  }

  function formSnapshot() {
    const data = {};
    document.querySelectorAll('#celebrationForm input, #celebrationForm textarea, #celebrationForm select').forEach(el => {
      if (el.id && el.type !== 'file') data[el.id] = el.value;
    });
    return data;
  }

  function snapshot() {
    const node = preview();
    const clean = node ? node.cloneNode(true) : null;
    clean?.querySelectorAll('.ed-resize-handle,.ed-guides,.cv-p22-panel').forEach(el => el.remove());
    return {
      schema: 22,
      id: activeId,
      name: ($('personName')?.value || '').trim() || 'Untitled Celebration',
      form: formSnapshot(),
      pages: editor()?.getPages?.() || [[]],
      html: clean?.innerHTML || '',
      background: node?.style.background || '',
      updatedAt: new Date().toISOString()
    };
  }

  function localSave(data, silent) {
    const list = localProjects();
    const index = list.findIndex(p => p.id === data.id);
    if (index >= 0) list[index] = { ...list[index], ...data };
    else list.unshift(data);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
      localStorage.setItem(ACTIVE_KEY, activeId);
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    } catch (error) { console.warn('Phase 22 local backup failed:', error); }
    if (!silent) setStatus('✓ Saved locally');
  }

  function setStatus(text, error) {
    const el = $('cvSaveStatus');
    if (!el) return;
    el.textContent = text;
    el.dataset.state = error ? 'error' : 'ok';
    clearTimeout(el._p22Timer);
    el._p22Timer = setTimeout(() => { if (el.textContent === text) el.textContent = ''; }, 2600);
  }

  async function ensureUser() {
    if (!window.supabaseClient) return null;
    try {
      const { data } = await window.supabaseClient.auth.getUser();
      if (data?.user) return data.user;
      const result = await window.supabaseClient.auth.signInAnonymously?.();
      return result?.data?.user || null;
    } catch (error) {
      console.warn('Phase 22 cloud auth unavailable:', error);
      return null;
    }
  }

  async function cloudSave(data, makeVersion) {
    if (!window.supabaseClient) return false;
    const user = await ensureUser();
    if (!user) return false;
    cloudBusy = true;
    try {
      const payload = {
        id: data.id,
        user_id: user.id,
        name: data.name,
        project_data: data,
        updated_at: data.updatedAt
      };
      const { error } = await window.supabaseClient.from(CLOUD_TABLE).upsert(payload, { onConflict: 'id' });
      if (error) throw error;
      if (makeVersion) {
        const { error: versionError } = await window.supabaseClient.from(VERSION_TABLE).insert({
          project_id: data.id,
          user_id: user.id,
          project_data: data,
          created_at: data.updatedAt
        });
        if (versionError) console.warn('Phase 22 version snapshot skipped:', versionError.message);
      }
      return true;
    } catch (error) {
      console.warn('Phase 22 cloud save unavailable:', error.message || error);
      return false;
    } finally { cloudBusy = false; }
  }

  async function saveNow(options = {}) {
    const data = snapshot();
    localSave(data, true);
    const cloudOK = await cloudSave(data, options.version !== false);
    setStatus(cloudOK ? '☁️ Saved to cloud' : '✓ Backup saved locally', !cloudOK);
    return data;
  }

  function scheduleSave(reason) {
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => saveNow({ version: reason === 'manual' }), CLOUD_DEBOUNCE);
  }

  function applySnapshot(data) {
    if (!data) return;
    activeId = data.id || activeId;
    localStorage.setItem(ACTIVE_KEY, activeId);
    Object.entries(data.form || {}).forEach(([id, value]) => { const el = $(id); if (el) el.value = value; });
    const node = preview();
    if (node) { node.innerHTML = data.html || ''; node.style.background = data.background || ''; }
    if (editor()?.loadPages && data.pages) editor().loadPages(data.pages);
    else if (editor()?.loadSnapshot) editor().loadSnapshot((data.pages || [[]])[0]);
    document.dispatchEvent(new CustomEvent('cv:projectLoaded', { detail: data }));
    setStatus('↩️ Version restored');
  }

  async function getCloudProjectList() {
    const user = await ensureUser();
    if (!user) return [];
    const { data, error } = await window.supabaseClient.from(CLOUD_TABLE).select('id,name,updated_at,project_data').eq('user_id', user.id).order('updated_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(row => row.project_data || { id: row.id, name: row.name, updatedAt: row.updated_at });
  }

  async function openProjects() {
    let list = [];
    try { list = await getCloudProjectList(); } catch (error) { console.warn(error); }
    if (!list.length) list = localProjects();
    if (!list.length) { alert('My Projects\n\nNo saved projects yet.'); return; }
    const choice = prompt('☁️ My Projects\n\n' + list.map((p, i) => `${i + 1}. ${p.name || 'Untitled'} — ${new Date(p.updatedAt || Date.now()).toLocaleString()}`).join('\n') + '\n\nEnter project number:');
    const project = list[Number(choice) - 1];
    if (project) applySnapshot(project);
  }

  async function versions() {
    const user = await ensureUser();
    if (!user) { alert('Version History needs cloud access. Your local backup is still available.'); return; }
    try {
      const { data, error } = await window.supabaseClient.from(VERSION_TABLE).select('id,created_at,project_data').eq('user_id', user.id).eq('project_id', activeId).order('created_at', { ascending: false }).limit(MAX_VERSIONS);
      if (error) throw error;
      if (!data?.length) { alert('Version History\n\nNo previous versions yet.'); return; }
      const choice = prompt('🕐 Version History\n\n' + data.map((v, i) => `${i + 1}. ${new Date(v.created_at).toLocaleString()}`).join('\n') + '\n\nEnter version number to restore:');
      const version = data[Number(choice) - 1];
      if (version?.project_data && confirm('Restore this version? Your current state will be backed up first.')) {
        await saveNow({ version: true });
        applySnapshot(version.project_data);
        await saveNow({ version: true });
      }
    } catch (error) {
      console.warn('Phase 22 history unavailable:', error);
      alert('Version History is not available yet. The local autosave backup is still active.');
    }
  }

  function injectUI() {
    const toolbar = document.querySelector('.edbar');
    if (!toolbar || $('cvPhase22')) return;
    const wrap = document.createElement('span');
    wrap.id = 'cvPhase22';
    wrap.className = 'cv-p22-panel';
    wrap.innerHTML = '<button type="button" id="cvCloudSave">☁️ Save Cloud</button><button type="button" id="cvCloudOpen">📂 Open</button><button type="button" id="cvHistory">🕐 History</button><span class="cv-p22-autosave">Autosave ON</span>';
    toolbar.appendChild(wrap);
    $('cvCloudSave').onclick = () => saveNow({ version: true });
    $('cvCloudOpen').onclick = openProjects;
    $('cvHistory').onclick = versions;
  }

  function init() {
    injectUI();
    document.getElementById('celebrationForm')?.addEventListener('input', () => scheduleSave('change'));
    document.getElementById('celebrationForm')?.addEventListener('change', () => scheduleSave('change'));
    document.addEventListener('cv:changed', () => scheduleSave('change'));
    window.addEventListener('beforeunload', () => {
      clearTimeout(autosaveTimer);
      const data = snapshot();
      localSave(data, true);
    });
    setTimeout(() => saveNow({ version: false }), 900);
    setInterval(() => { if (!cloudBusy) saveNow({ version: false }); }, 60000);
  }

  window.CelebrateVersePhase22 = { saveNow, openProjects, versions, applySnapshot };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
