document.addEventListener('DOMContentLoaded', () => {
  const qs = new URLSearchParams(window.location.search);
  const occasionInput = document.getElementById('occasion');
  const packageInput = document.getElementById('package');
  const themeInput = document.getElementById('theme');
  const preview = document.getElementById('cvPreviewContent');

  function selectCard(selector, value, input) {
    if (!value || !input) return;
    const cards = [...document.querySelectorAll(selector)];
    const card = cards.find(item => item.dataset.value === value);
    if (!card) return;
    cards.forEach(item => item.classList.remove('selected'));
    card.classList.add('selected');
    input.value = value;
    card.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /* Make homepage cards and pricing links actually preselect their values. */
  const requestedOccasion = qs.get('occasion');
  const requestedPackage = qs.get('package');
  const requestedTheme = qs.get('theme');
  selectCard('.occasion-selection .selection-card', requestedOccasion, occasionInput);
  selectCard('.package-option', requestedPackage, packageInput);
  selectCard('.theme-card', requestedTheme, themeInput);

  if (!preview) return;

  const editor = document.createElement('aside');
  editor.className = 'cv-editor-toolbar';
  editor.innerHTML = `
    <div class="cv-editor-title"><span>✦</span><div><strong>Quick Design</strong><small>Canva-style controls</small></div></div>
    <label>Accent color <input type="color" id="cvAccent" value="#a855f7"></label>
    <label>Text style <select id="cvFont"><option value="playfair">Elegant</option><option value="sans">Modern</option></select></label>
    <div class="cv-editor-actions"><button type="button" id="cvLight">Light preview</button><button type="button" id="cvDark">Dark preview</button></div>
  `;

  const liveSection = document.querySelector('.cv-live-preview-section');
  if (liveSection) liveSection.insertBefore(editor, liveSection.querySelector('.cv-live-preview'));

  const accent = editor.querySelector('#cvAccent');
  const font = editor.querySelector('#cvFont');
  const light = editor.querySelector('#cvLight');
  const dark = editor.querySelector('#cvDark');

  function applyAccent(value) {
    preview.style.setProperty('--cv-accent', value);
    preview.style.setProperty('background', `radial-gradient(circle at top, ${value}33, transparent 42%), linear-gradient(145deg, #161622, #261829)`);
  }
  accent.addEventListener('input', e => applyAccent(e.target.value));
  font.addEventListener('change', e => {
    preview.style.fontFamily = e.target.value === 'sans' ? 'DM Sans, sans-serif' : 'Playfair Display, serif';
  });
  light.addEventListener('click', () => {
    preview.classList.add('cv-preview-light');
    preview.classList.remove('cv-preview-dark');
  });
  dark.addEventListener('click', () => {
    preview.classList.remove('cv-preview-light');
    preview.classList.add('cv-preview-dark');
  });

  /* Theme cards also visibly affect the live preview. */
  document.querySelectorAll('.theme-card').forEach(card => {
    card.addEventListener('click', () => {
      const value = card.dataset.value || 'romantic';
      preview.dataset.theme = value;
      const themes = {
        romantic: '#ec4899', luxury: '#d4a94f', fun: '#22c55e', minimal: '#94a3b8', space: '#6366f1', custom: '#a855f7'
      };
      applyAccent(themes[value] || '#a855f7');
    });
  });

  /* Occasion cards remain keyboard friendly and advance naturally with existing form controls. */
  document.querySelectorAll('.selection-card, .theme-card, .package-option').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });
  });
});
