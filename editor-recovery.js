/* CelebrateVerse UI bridge v2 — deterministic navigation for the seven editor categories. */
(function(){
  'use strict';
  function mount(){
    const root=document.getElementById('stableEditor');
    const nav=root?.querySelector('.cv-ui01-nav');
    const left=root?.querySelector('.ed-left');
    if(!root||!nav||!left||root.dataset.cvNavBridge==='2')return !!root;
    root.dataset.cvNavBridge='2';

    const allPanels=()=>[...left.children].filter(el=>{
      if(el===nav)return false;
      return el.matches('.ed-panel,.cv-ui02-panel,.cv-ui03-left,.ui06-panel,.ui05-panel,[id^="phase"],[id^="p14"],[id^="p15"],[id^="p16"]');
    });

    function show(key){
      // Hide every feature panel first. This prevents old/new UI layers from
      // overlapping and guarantees one visible panel for each category.
      allPanels().forEach(p=>{
        p.hidden=true;
        p.classList.remove('active');
        p.style.display='none';
      });

      const pick=sel=>left.querySelector(sel);
      let targets=[];
      if(key==='templates') targets=[
        pick('.cv-ui02-panel[data-ui02-panel="templates"]'),
        pick('.ed-panel[data-panel="templates"]')
      ];
      if(key==='elements') targets=[
        pick('.cv-ui02-panel[data-ui02-panel="elements"]'),
        pick('.ed-panel[data-panel="elements"]')
      ];
      if(key==='text') targets=[
        pick('.cv-ui03-left[data-mode="text"]'),
        pick('.cv-ui03-left'),
        pick('.ed-panel[data-panel="text"]')
      ];
      if(key==='uploads') targets=[
        pick('.cv-ui03-left[data-mode="photo"]'),
        pick('.cv-ui03-left'),
        pick('.ed-panel[data-panel="uploads"]')
      ];
      if(key==='audio') targets=[
        pick('#ui06AudioPanel'),
        pick('.ed-panel[data-panel="audio"]')
      ];
      if(key==='ai') targets=[
        pick('#ui06AiPanel'),
        pick('.ed-panel[data-panel="ai"]')
      ];
      if(key==='pages') targets=[
        pick('.ui05-panel'),
        pick('.ed-panel[data-panel="pages"]')
      ];

      // Prefer the newest enhanced panel. If it does not exist, fall back to
      // the stable legacy panel so no feature becomes inaccessible.
      const target=targets.find(Boolean);
      if(target){
        target.hidden=false;
        target.classList.add('active');
        target.style.display='';
        target.scrollTop=0;
      }
      nav.querySelectorAll('[data-ui01cat]').forEach(b=>{
        b.classList.toggle('active',b.dataset.ui01cat===key);
        b.setAttribute('aria-selected',b.dataset.ui01cat===key?'true':'false');
      });
      root.dataset.activeTool=key;
    }

    // Capture phase runs before the individual enhancement listeners, so this
    // bridge remains authoritative even when an older layer has a stale handler.
    nav.addEventListener('click',e=>{
      const b=e.target.closest('[data-ui01cat]');
      if(!b)return;
      e.preventDefault();
      e.stopImmediatePropagation();
      show(b.dataset.ui01cat);
    },true);

    // Also expose a small API for other editor modules.
    window.CelebrateVerseNav={show};
    show('templates');
    return true;
  }
  function boot(){
    const r=mount();
    if(r){
      const root=document.getElementById('stableEditor');
      if(root?.querySelector('.cv-ui01-nav')) return;
    }
  }
  document.addEventListener('DOMContentLoaded',()=>{let n=0;const t=setInterval(()=>{boot();if(document.querySelector('#stableEditor .cv-ui01-nav')||++n>100)clearInterval(t)},100)});
})();