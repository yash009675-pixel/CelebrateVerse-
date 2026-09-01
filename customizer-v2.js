document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `.cv-editor-toolbar{display:flex;align-items:end;gap:14px;flex-wrap:wrap;margin:0 auto 18px;padding:16px;border:1px solid var(--border);border-radius:18px;background:rgba(255,255,255,.045);max-width:720px}.cv-editor-title{display:flex;align-items:center;gap:10px;margin-right:auto}.cv-editor-title span{font-size:22px;color:#e879b7}.cv-editor-title strong,.cv-editor-title small{display:block}.cv-editor-title small{margin-top:3px;opacity:.65;font-size:12px}.cv-editor-toolbar label{display:flex;flex-direction:column;gap:7px;font-size:12px;font-weight:700}.cv-editor-toolbar input,.cv-editor-toolbar select{height:38px;border-radius:10px;border:1px solid var(--border);background:var(--bg-secondary);color:var(--text);padding:4px 9px}.cv-editor-toolbar input[type=color]{width:56px;padding:3px}.cv-editor-actions{display:flex;gap:8px}.cv-editor-actions button{height:38px;border-radius:10px;border:1px solid var(--border);background:transparent;color:var(--text);padding:0 11px;font-weight:700;cursor:pointer}.cv-preview-light{background:#fff!important;color:#17131d!important}.cv-preview-light .cv-preview-message,.cv-preview-light .cv-preview-from{color:#4b4351!important}@media(max-width:700px){.cv-editor-toolbar{align-items:stretch;padding:14px}.cv-editor-title{width:100%}.cv-editor-toolbar label{flex:1;min-width:110px}.cv-editor-actions{width:100%}.cv-editor-actions button{flex:1}}`;
  document.head.appendChild(style);

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
    input.dispatchEvent(new Event('input', { bubbles:true }));
    input.dispatchEvent(new Event('change', { bubbles:true }));
  }

  selectCard('.occasion-selection .selection-card', qs.get('occasion'), occasionInput);
  selectCard('.package-option', qs.get('package'), packageInput);
  selectCard('.theme-card', qs.get('theme'), themeInput);

  if (!preview) return;
  const editor = document.createElement('aside');
  editor.className = 'cv-editor-toolbar';
  editor.innerHTML = `<div class="cv-editor-title"><span>✦</span><div><strong>Quick Design</strong><small>Canva-style controls</small></div></div><label>Accent color <input type="color" id="cvAccent" value="#a855f7"></label><label>Text style <select id="cvFont"><option value="playfair">Elegant</option><option value="sans">Modern</option></select></label><div class="cv-editor-actions"><button type="button" id="cvLight">Light preview</button><button type="button" id="cvDark">Dark preview</button></div>`;
  const liveSection = document.querySelector('.cv-live-preview-section');
  if (liveSection) liveSection.insertBefore(editor, liveSection.querySelector('.cv-live-preview'));

  const accent = editor.querySelector('#cvAccent');
  const font = editor.querySelector('#cvFont');
  function applyAccent(value) { preview.style.background = `radial-gradient(circle at top, ${value}33, transparent 42%),linear-gradient(145deg,#161622,#261829)`; }
  accent.addEventListener('input', e => applyAccent(e.target.value));
  font.addEventListener('change', e => { preview.style.fontFamily = e.target.value === 'sans' ? 'DM Sans,sans-serif' : 'Playfair Display,serif'; });
  editor.querySelector('#cvLight').addEventListener('click', () => { preview.classList.add('cv-preview-light'); });
  editor.querySelector('#cvDark').addEventListener('click', () => { preview.classList.remove('cv-preview-light'); });

  document.querySelectorAll('.theme-card').forEach(card => card.addEventListener('click', () => {
    const colors={romantic:'#ec4899',luxury:'#d4a94f',fun:'#22c55e',minimal:'#94a3b8',space:'#6366f1',custom:'#a855f7'};
    applyAccent(colors[card.dataset.value] || '#a855f7');
  }));
  document.querySelectorAll('.selection-card,.theme-card,.package-option').forEach(card => {
    card.setAttribute('tabindex','0');
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();card.click();}});
  });
});