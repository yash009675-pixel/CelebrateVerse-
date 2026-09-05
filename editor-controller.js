/* CelebrateVerse — final editor sidebar controller
   Loaded after all UI modules so one click cannot be hijacked by older modules. */
(function () {
  'use strict';
  const labels = {
    templates: 'Templates', elements: 'Elements', text: 'Text', uploads: 'Uploads & Photos',
    audio: 'Audio', ai: 'AI Assistant', pages: 'Pages'
  };
  const selectors = {
    templates: '.cv-ui02-panel[data-ui02-panel="templates"]',
    elements: '.cv-ui02-panel[data-ui02-panel="elements"]',
    text: '.cv-ui03-left[data-ui03-left="text"]',
    uploads: '.cv-ui03-left[data-ui03-left="photos"]',
    audio: '#ui06AudioPanel', ai: '#ui06AiPanel', pages: '#ui05PagesPanel'
  };
  function get(key) { return document.querySelector('#stableEditor ' + selectors[key]); }
  function hide(root) {
    root.querySelectorAll('.cv-ui02-panel,.cv-ui03-left,.ui06-panel,#ui05PagesPanel,.ed-panel').forEach(p => {
      p.hidden = true;
      p.classList.remove('active');
      p.style.setProperty('display', 'none', 'important');
    });
  }
  function activate(root, key) {
    const target = get(key);
    if (!target) return false;
    hide(root);
    target.hidden = false;
    target.classList.add('active');
    target.style.setProperty('display', 'block', 'important');
    root.querySelectorAll('.cv-ui01-nav [data-ui01cat]').forEach(b => {
      const on = b.dataset.ui01cat === key;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    const title = root.querySelector('.cv-ui01-panel-title');
    if (title) title.textContent = labels[key] || 'Design';
    root.dataset.cvActiveCategory = key;
    return true;
  }
  function mount() {
    const root = document.getElementById('stableEditor');
    const nav = root && root.querySelector('.cv-ui01-nav');
    if (!root || !nav) return false;
    if (nav.dataset.cvFinalController === '1') return true;
    nav.dataset.cvFinalController = '1';
    const handle = function (e) {
      const btn = e.target.closest('[data-ui01cat]');
      if (!btn || !nav.contains(btn)) return;
      const key = btn.dataset.ui01cat;
      if (!get(key)) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      activate(root, key);
    };
    nav.addEventListener('click', handle, true);
    nav.addEventListener('pointerup', handle, true);
    // Modules may mount panels asynchronously. Re-activate the selected panel
    // once it becomes available, but never steal the user's selection.
    const observer = new MutationObserver(() => {
      const key = root.dataset.cvActiveCategory;
      if (key && get(key)) activate(root, key);
    });
    observer.observe(root, { childList: true, subtree: true });
    activate(root, root.dataset.cvActiveCategory || 'templates');
    return true;
  }
  function start() {
    let n = 0;
    const timer = setInterval(() => {
      if (mount() || ++n > 120) clearInterval(timer);
    }, 100);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
