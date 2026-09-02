document.addEventListener('DOMContentLoaded', () => {
  const preview = document.getElementById('cvPreviewContent');
  const top = document.querySelector('.edbar');
  if (!preview || !top || document.getElementById('cvSaveProject')) return;

  const KEY = 'celebrateVerseProjects';
  const IDKEY = 'celebrateVerseActiveProject';
  let id = localStorage.getItem(IDKEY) || `cv-${Date.now()}`;
  localStorage.setItem(IDKEY, id);

  const getProjects = () => {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (_) {
      return [];
    }
  };

  const save = () => {
    const projects = getProjects();
    const name = document.getElementById('personName')?.value?.trim() || 'Untitled Celebration';
    const data = {
      id,
      name,
      updatedAt: new Date().toISOString(),
      preview: preview.innerHTML,
      form: {
        personName: document.getElementById('personName')?.value || '',
        customerName: document.getElementById('customerName')?.value || '',
        specialDate: document.getElementById('specialDate')?.value || '',
        email: document.getElementById('email')?.value || '',
        message: document.getElementById('message')?.value || ''
      }
    };
    const index = projects.findIndex(item => item.id === id);
    if (index >= 0) projects[index] = data;
    else projects.unshift(data);
    localStorage.setItem(KEY, JSON.stringify(projects.slice(0, 50)));
    const status = document.getElementById('cvSaveStatus');
    if (status) {
      status.textContent = '✓ Saved';
      clearTimeout(status._timer);
      status._timer = setTimeout(() => { status.textContent = ''; }, 1800);
    }
  };

  top.insertAdjacentHTML(
    'beforeend',
    '<button id="cvSaveProject" type="button">💾 Save</button>' +
    '<button id="cvProjects" type="button">📁 Projects</button>' +
    '<button id="cvPublish" type="button">🚀 Publish</button>' +
    '<span id="cvSaveStatus" role="status" aria-live="polite"></span>'
  );

  document.getElementById('cvSaveProject').addEventListener('click', save);
  document.getElementById('cvProjects').addEventListener('click', () => {
    const projects = getProjects();
    const text = projects.length
      ? projects.map((item, index) => `${index + 1}. ${item.name}`).join('\n')
      : 'No saved projects yet.';
    alert(`My Projects\n\n${text}`);
  });
  document.getElementById('cvPublish').addEventListener('click', () => {
    save();
    alert('Your design is saved. Permanent public publishing requires backend/cloud storage.');
  });

  let timer;
  const scheduleSave = () => {
    clearTimeout(timer);
    timer = setTimeout(save, 700);
  };
  document.getElementById('celebrationForm')?.addEventListener('input', scheduleSave);
  document.addEventListener('cv:changed', scheduleSave);
  window.addEventListener('beforeunload', save);
  save();
});