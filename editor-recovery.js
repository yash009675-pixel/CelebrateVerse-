/* CelebrateVerse editor navigation recovery v4 */
(function(){
  'use strict';

  function mount(){
    const root=document.getElementById('stableEditor');
    const nav=root?.querySelector('.cv-ui01-nav');
    if(!root||!nav)return false;

    const q=s=>root.querySelector(s);
    const allPanels=()=>[...root.querySelectorAll(
      '.ed-left > .ed-panel,.cv-ui02-panel,.cv-ui03-left,.ui06-panel,#ui05PagesPanel'
    )];

    function show(key){
      /* Important: force the actual rendered panel state. The editor has
         several legacy modules which otherwise overwrite display/classes. */
      allPanels().forEach(p=>{
        p.hidden=true;
        p.classList.remove('active');
        p.style.setProperty('display','none','important');
      });

      const selectors={
        templates:[
          '.cv-ui02-panel[data-ui02-panel="templates"]',
          '.ed-panel[data-panel="templates"]'
        ],
        elements:[
          '.cv-ui02-panel[data-ui02-panel="elements"]',
          '.ed-panel[data-panel="elements"]'
        ],
        text:[
          '.cv-ui03-left[data-ui03-left="text"]',
          '.ed-panel[data-panel="text"]'
        ],
        uploads:[
          '.cv-ui03-left[data-ui03-left="photos"]',
          '.ed-panel[data-panel="uploads"]'
        ],
        audio:[
          '#ui06AudioPanel',
          '.ed-panel[data-panel="audio"]'
        ],
        ai:[
          '#ui06AiPanel',
          '.ed-panel[data-panel="ai"]'
        ],
        pages:[
          '#ui05PagesPanel',
          '.ed-panel[data-panel="pages"]'
        ]
      };

      const target=(selectors[key]||[]).map(q).find(Boolean);
      if(target){
        target.hidden=false;
        target.classList.add('active');
        target.style.setProperty('display','block','important');
      }

      nav.querySelectorAll('[data-ui01cat]').forEach(b=>{
        const on=b.dataset.ui01cat===key;
        b.classList.toggle('active',on);
        b.setAttribute('aria-selected',on?'true':'false');
      });
      root.dataset.activeTool=key;
      return !!target;
    }

    function bind(){
      nav.querySelectorAll('[data-ui01cat]').forEach(btn=>{
        const key=btn.dataset.ui01cat;
        if(btn.dataset.cvBound==='4')return;
        btn.dataset.cvBound='4';

        /* Direct handlers work even if another module registered an older
           navigation listener. */
        btn.onclick=e=>{
          e.preventDefault();
          e.stopPropagation();
          show(key);
        };
        btn.onpointerup=e=>{
          if(e.button!==0)return;
          e.preventDefault();
          show(key);
        };
      });
    }

    bind();

    if(root.dataset.cvNavBridge==='4')return true;
    root.dataset.cvNavBridge='4';
    window.CelebrateVerseNav={show};

    /* Other feature modules mount asynchronously. Keep the buttons bound and
       refresh the currently selected panel whenever one is added. */
    const observer=new MutationObserver(()=>{
      bind();
      const active=root.dataset.activeTool;
      if(active)show(active);
    });
    observer.observe(root,{childList:true,subtree:true});

    show('templates');
    return true;
  }

  function boot(){
    return mount();
  }

  function start(){
    let tries=0;
    const timer=setInterval(()=>{
      if(boot()||++tries>150)clearInterval(timer);
    },100);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',start,{once:true});
  }else start();
})();