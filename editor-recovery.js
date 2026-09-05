/* CelebrateVerse editor navigation recovery v3
   Keeps the enhanced feature panels reachable without allowing legacy editor
   handlers to overlap them. */
(function(){
  'use strict';

  function mount(){
    const root=document.getElementById('stableEditor');
    const nav=root?.querySelector('.cv-ui01-nav');
    if(!root||!nav||root.dataset.cvNavBridge==='3') return false;
    root.dataset.cvNavBridge='3';

    const q=(s)=>root.querySelector(s);

    function panels(){
      return [
        ...root.querySelectorAll(
          '.ed-left > .ed-panel,'+
          '.cv-ui02-panel,'+
          '.cv-ui03-left,'+
          '.ui06-panel,'+
          '#ui05PagesPanel'
        )
      ];
    }

    function setVisible(el,on){
      if(!el)return;
      el.hidden=!on;
      el.classList.toggle('active',on);
      el.style.display=on?'':'none';
    }

    function show(key){
      panels().forEach(p=>setVisible(p,false));

      let target=null;

      if(key==='templates'){
        target=q('.cv-ui02-panel[data-ui02-panel="templates"]')
          ||q('.ed-panel[data-panel="templates"]');
      }else if(key==='elements'){
        target=q('.cv-ui02-panel[data-ui02-panel="elements"]')
          ||q('.ed-panel[data-panel="elements"]');
      }else if(key==='text'){
        target=q('.cv-ui03-left[data-ui03-left="text"]')
          ||q('.ed-panel[data-panel="text"]');
      }else if(key==='uploads'){
        target=q('.cv-ui03-left[data-ui03-left="photos"]')
          ||q('.ed-panel[data-panel="uploads"]');
      }else if(key==='audio'){
        target=q('#ui06AudioPanel')
          ||q('.ed-panel[data-panel="audio"]');
      }else if(key==='ai'){
        target=q('#ui06AiPanel')
          ||q('.ed-panel[data-panel="ai"]');
      }else if(key==='pages'){
        target=q('#ui05PagesPanel')
          ||q('.ed-panel[data-panel="pages"]');
      }

      if(target)setVisible(target,true);

      nav.querySelectorAll('[data-ui01cat]').forEach(btn=>{
        const active=btn.dataset.ui01cat===key;
        btn.classList.toggle('active',active);
        btn.setAttribute('aria-selected',active?'true':'false');
      });

      root.dataset.activeTool=key;
    }

    /* Capture-phase handler deliberately owns navigation. Older modules
       attach their own click listeners to the same buttons; stopping them
       prevents the legacy panel and enhanced panel from fighting each other. */
    nav.addEventListener('click',function(e){
      const btn=e.target.closest('[data-ui01cat]');
      if(!btn)return;
      e.preventDefault();
      e.stopImmediatePropagation();
      show(btn.dataset.ui01cat);
    },true);

    window.CelebrateVerseNav={show};
    show('templates');
    return true;
  }

  function boot(){
    if(mount()){
      const root=document.getElementById('stableEditor');
      if(root?.dataset.cvNavBridge==='3') return true;
    }
    return false;
  }

  document.addEventListener('DOMContentLoaded',function(){
    let tries=0;
    const timer=setInterval(function(){
      if(boot()||++tries>120) clearInterval(timer);
    },100);
  });
})();