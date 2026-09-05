/* CelebrateVerse editor navigation — v5 single-controller fix */
(function(){
  'use strict';
  const PANEL={
    templates:()=>document.querySelector('#stableEditor .cv-ui02-panel[data-ui02-panel="templates"]'),
    elements:()=>document.querySelector('#stableEditor .cv-ui02-panel[data-ui02-panel="elements"]'),
    text:()=>document.querySelector('#stableEditor .cv-ui03-left[data-ui03-left="text"]'),
    uploads:()=>document.querySelector('#stableEditor .cv-ui03-left[data-ui03-left="photos"]'),
    audio:()=>document.querySelector('#stableEditor #ui06AudioPanel'),
    ai:()=>document.querySelector('#stableEditor #ui06AiPanel'),
    pages:()=>document.querySelector('#stableEditor #ui05PagesPanel')
  };

  function boot(){
    const root=document.getElementById('stableEditor');
    if(!root)return false;
    const nav=root.querySelector('.cv-ui01-nav');
    if(!nav)return false;

    function activate(key){
      const target=(PANEL[key]||(()=>null))();
      const panels=[
        ...root.querySelectorAll('.cv-ui02-panel'),
        ...root.querySelectorAll('.cv-ui03-left'),
        ...root.querySelectorAll('.ui06-panel'),
        ...root.querySelectorAll('#ui05PagesPanel')
      ];

      // Also hide the original legacy editor panels so two implementations
      // can never render underneath one another.
      const legacy=[...root.querySelectorAll('.ed-left > .ed-panel')];
      [...panels,...legacy].forEach(p=>{
        p.classList.remove('active');
        p.hidden=true;
        p.style.setProperty('display','none','important');
      });

      if(target){
        target.hidden=false;
        target.classList.add('active');
        target.style.setProperty('display','block','important');
      }

      nav.querySelectorAll('[data-ui01cat]').forEach(b=>{
        const active=b.dataset.ui01cat===key;
        b.classList.toggle('active',active);
        b.setAttribute('aria-selected',active?'true':'false');
      });
      root.dataset.cvActiveCategory=key;
    }

    if(nav.dataset.cvSingleController!=='5'){
      nav.dataset.cvSingleController='5';
      nav.addEventListener('click',function(e){
        const btn=e.target.closest('[data-ui01cat]');
        if(!btn||!nav.contains(btn))return;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        activate(btn.dataset.ui01cat);
      },true);

      nav.addEventListener('pointerup',function(e){
        const btn=e.target.closest('[data-ui01cat]');
        if(!btn||!nav.contains(btn))return;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        activate(btn.dataset.ui01cat);
      },true);
    }

    const wanted=root.dataset.cvActiveCategory||'templates';
    activate(wanted);
    return true;
  }

  function start(){
    let n=0;
    const timer=setInterval(()=>{
      if(boot()||++n>200)clearInterval(timer);
    },100);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();