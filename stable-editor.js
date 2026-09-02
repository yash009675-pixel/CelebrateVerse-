document.addEventListener('DOMContentLoaded', () => {
  const previewSection = document.querySelector('.cv-live-preview-section');
  const preview = document.getElementById('cvPreviewContent');
  if (!previewSection || !preview || document.getElementById('stableEditor')) return;

  const root = document.createElement('section');
  root.id = 'stableEditor';
  root.innerHTML = `
    <h2 class="ed-title">Design Editor</h2>
    <div class="ed">
      <aside>
        <b>ADD</b>
        <button type="button" data-add="Your text">＋ Text</button>
        <button type="button" data-add="❤️">❤️ Heart</button>
        <button type="button" data-add="✨">✨ Star</button>
        <button type="button" data-add="🎈">🎈 Balloon</button>
        <button type="button" data-add="🌹">🌹 Rose</button>
        <button type="button" data-add="🎁">🎁 Gift</button>
        <button type="button" id="edPhoto">🖼 Upload photo</button>
        <input id="edFile" type="file" accept="image/*" hidden>
        <hr>
        <b>TEMPLATES</b>
        <button type="button" data-bg="linear-gradient(135deg,#3b0764,#831843)">❤️ Romantic</button>
        <button type="button" data-bg="linear-gradient(135deg,#111827,#4c1d95)">✨ Luxury</button>
        <button type="button" data-bg="linear-gradient(135deg,#fce7f3,#ddd6fe)">🌸 Pastel</button>
        <button type="button" data-bg="radial-gradient(circle at top,#312e81,#020617 70%)">🌌 Galaxy</button>
      </aside>
      <main>
        <div class="edbar">
          <button type="button" id="edUndo">↶ Undo</button>
          <button type="button" id="edRedo">↷ Redo</button>
          <button type="button" id="edDesk">💻 Desktop</button>
          <button type="button" id="edMob">📱 Mobile</button>
          <button type="button" id="edConf">🎉 Confetti</button>
          <button type="button" id="edHearts">❤️ Hearts</button>
        </div>
        <div id="edCanvas"></div>
      </main>
      <aside>
        <b>PROPERTIES</b>
        <p id="edEmpty">Select an element.</p>
        <div id="edProps" hidden>
          <label>Text<input id="edText"></label>
          <label>Size<input id="edSize" type="range" min="14" max="120"></label>
          <label>Color<input id="edColor" type="color"></label>
          <label>Font<select id="edFont"><option>DM Sans</option><option>Playfair Display</option><option>Georgia</option><option>Arial</option></select></label>
          <label>Animation<select id="edAnim"><option value="">None</option><option value="float">Float</option><option value="pulse">Pulse</option><option value="bounce">Bounce</option></select></label>
          <button type="button" id="edDuplicate">⧉ Duplicate</button>
          <button type="button" id="edDelete">🗑 Delete</button>
          <button type="button" id="edLock">🔒 Lock</button>
        </div>
        <hr>
        <b>LAYERS</b>
        <div id="edLayers"></div>
      </aside>
    </div>`;

  previewSection.parentNode.insertBefore(root, previewSection);
  const canvas = root.querySelector('#edCanvas');
  canvas.append(previewSection);

  const state = { selected: null, history: [], future: [], restoring: false };
  const $ = id => root.querySelector('#' + id);
  const snapshot = () => [...preview.querySelectorAll('.editem')].map(el => el.outerHTML);

  function renderSnapshot(items) {
    state.restoring = true;
    preview.querySelectorAll('.editem').forEach(el => el.remove());
    items.forEach(html => {
      const holder = document.createElement('div');
      holder.innerHTML = html;
      const el = holder.firstElementChild;
      if (el) { preview.append(el); bind(el); }
    });
    state.restoring = false;
    select(null);
    layers();
  }

  function commit() {
    if (state.restoring) return;
    const current = snapshot();
    const previous = state.history[state.history.length - 1];
    if (JSON.stringify(current) === JSON.stringify(previous)) return;
    state.history.push(current);
    if (state.history.length > 40) state.history.shift();
    state.future = [];
    document.dispatchEvent(new CustomEvent('cv:changed'));
  }

  function layers() {
    const box = $('edLayers');
    if (!box) return;
    box.innerHTML = '';
    [...preview.querySelectorAll('.editem')].reverse().forEach(el => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = el.dataset.text || (el.querySelector('img') ? 'Photo' : 'Element');
      button.onclick = () => select(el);
      box.append(button);
    });
  }

  function select(el) {
    preview.querySelectorAll('.editem').forEach(item => item.classList.remove('active'));
    state.selected = el || null;
    if (!el) {
      $('edEmpty').hidden = false;
      $('edProps').hidden = true;
      layers();
      return;
    }
    el.classList.add('active');
    $('edEmpty').hidden = true;
    $('edProps').hidden = false;
    $('edText').value = el.dataset.text || '';
    $('edSize').value = parseInt(el.style.fontSize, 10) || 32;
    $('edColor').value = el.dataset.color || '#ffffff';
    $('edFont').value = el.dataset.font || 'DM Sans';
    $('edAnim').value = el.dataset.anim || '';
    $('edLock').textContent = el.dataset.lock === '1' ? '🔓 Unlock' : '🔒 Lock';
  }

  function bind(el) {
    if (el.dataset.bound === '1') return;
    el.dataset.bound = '1';
    el.addEventListener('click', event => { event.stopPropagation(); select(el); });
    el.addEventListener('pointerdown', event => {
      if (event.target.closest('.ed-handle') || event.target.closest('.ed-rotate') || el.dataset.lock === '1') return;
      select(el);
      const rect = preview.getBoundingClientRect();
      const sx = event.clientX, sy = event.clientY;
      const startLeft = parseFloat(el.style.left) || 40;
      const startTop = parseFloat(el.style.top) || 40;
      const move = e => {
        const nx = startLeft + ((e.clientX - sx) / rect.width) * 100;
        const ny = startTop + ((e.clientY - sy) / rect.height) * 100;
        el.style.left = Math.max(0, Math.min(95, nx)) + '%';
        el.style.top = Math.max(0, Math.min(95, ny)) + '%';
      };
      const up = () => {
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        commit();
        layers();
      };
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
    });
  }

  function add(text) {
    const el = document.createElement('div');
    el.className = 'editem';
    el.dataset.text = text;
    el.style.left = '42%';
    el.style.top = '42%';
    el.style.fontSize = text === 'Your text' ? '32px' : '36px';
    el.textContent = text;
    preview.append(el);
    bind(el);
    select(el);
    commit();
    layers();
  }

  root.querySelectorAll('[data-add]').forEach(button => button.onclick = () => add(button.dataset.add));
  root.querySelectorAll('[data-bg]').forEach(button => button.onclick = () => { preview.style.background = button.dataset.bg; document.dispatchEvent(new CustomEvent('cv:changed')); });
  $('edPhoto').onclick = () => $('edFile').click();
  $('edFile').onchange = event => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const el = document.createElement('div');
      el.className = 'editem';
      el.dataset.text = 'Photo';
      el.style.left = '35%';
      el.style.top = '25%';
      const img = document.createElement('img');
      img.src = reader.result;
      img.alt = 'Uploaded celebration photo';
      el.append(img);
      preview.append(el);
      bind(el);
      select(el);
      commit();
      layers();
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  $('edText').oninput = event => {
    const el = state.selected;
    if (!el || el.querySelector('img')) return;
    el.dataset.text = event.target.value;
    el.textContent = event.target.value;
    layers();
    document.dispatchEvent(new CustomEvent('cv:changed'));
  };
  $('edSize').onchange = event => { if (state.selected) { state.selected.style.fontSize = event.target.value + 'px'; commit(); } };
  $('edColor').oninput = event => { if (state.selected) { state.selected.style.color = event.target.value; state.selected.dataset.color = event.target.value; document.dispatchEvent(new CustomEvent('cv:changed')); } };
  $('edFont').onchange = event => { if (state.selected) { state.selected.style.fontFamily = event.target.value; state.selected.dataset.font = event.target.value; commit(); } };
  $('edAnim').onchange = event => { if (state.selected) { state.selected.dataset.anim = event.target.value; commit(); } };

  $('edDelete').onclick = () => { if (state.selected) { state.selected.remove(); select(null); commit(); } };
  $('edDuplicate').onclick = () => {
    if (!state.selected) return;
    const copy = state.selected.cloneNode(true);
    copy.dataset.bound = '0';
    copy.style.left = (parseFloat(copy.style.left) + 5) + '%';
    copy.style.top = (parseFloat(copy.style.top) + 5) + '%';
    preview.append(copy);
    bind(copy);
    select(copy);
    commit();
    layers();
  };
  $('edLock').onclick = () => {
    if (!state.selected) return;
    state.selected.dataset.lock = state.selected.dataset.lock === '1' ? '0' : '1';
    select(state.selected);
    commit();
  };

  $('edDesk').onclick = () => canvas.classList.remove('mobile');
  $('edMob').onclick = () => canvas.classList.add('mobile');
  const effect = icon => {
    canvas.querySelector('.edfx')?.remove();
    const layer = document.createElement('div');
    layer.className = 'edfx';
    for (let i = 0; i < 20; i++) {
      const span = document.createElement('span');
      span.textContent = icon;
      span.style.left = (i * 17 % 100) + '%';
      span.style.animationDelay = (i * 0.12) + 's';
      layer.append(span);
    }
    preview.append(layer);
    document.dispatchEvent(new CustomEvent('cv:changed'));
  };
  $('edConf').onclick = () => effect('🎉');
  $('edHearts').onclick = () => effect('❤️');

  $('edUndo').onclick = () => {
    if (state.history.length <= 1) return;
    const current = state.history.pop();
    state.future.push(current);
    renderSnapshot(state.history[state.history.length - 1]);
    document.dispatchEvent(new CustomEvent('cv:changed'));
  };
  $('edRedo').onclick = () => {
    const next = state.future.pop();
    if (!next) return;
    state.history.push(next);
    renderSnapshot(next);
    document.dispatchEvent(new CustomEvent('cv:changed'));
  };

  document.addEventListener('click', event => {
    if (event.target === preview) select(null);
  });
  preview.querySelectorAll('.editem').forEach(bind);
  state.history = [snapshot()];
  layers();
});