/* CelebrateVerse editor recovery v6 — one sidebar controller */
(function(){
  'use strict';
  const MODERN={
    templates:()=>document.querySelector('#stableEditor .cv-ui02-panel[data-ui02-panel="templates"]'),
    elements:()=>document.querySelector('#stableEditor .cv-ui02-panel[data-ui02-panel="elements"]'),
    text:()=>document.querySelector('#stableEditor .cv-ui03-left[data-ui03-left="text"]'),
    uploads:()=>document.querySelector('#stableEditor .cv-ui03-left[data-ui03-left="photos"]'),
    audio:()=>document.querySelector('#stableEditor #ui06AudioPanel'),
    ai:()=>document.querySelector('#stableEditor #ui06AiPanel'),
    pages:()=>document.querySelector('#stableEditor #ui05PagesPanel')
  };

  function allModern(root){
    return [
      ...root.querySelectorAll('.cv-ui02-panel'),
      ...root.querySelectorAll('.cv-ui03-left'),
      ...root.querySelectorAll('.ui06-panel'),
      ...root.querySelectorAll('#ui05PagesPanel')
    ];
  }
  function allLegacy(root){
    return [
      ...root.querySelectorAll('.ed-panel'),
      ...root.querySelectorAll('#p14Manager'),
      ...root.querySelectorAll('#p15AiPanel'),
      ...root.querySelectorAll('#phase10Tools,#phase11Tools,#phase12Library')
    ];
  }
  function setDisplay(el,show){
    if(!el)return;
    if(show){
      el.hidden=false;
      el.style.removeProperty('display');
      el.classList.add('active');
    }else{
      el.hidden=true;
      el.classList.remove('active');
      el.style.setProperty('display','none','important');
    }
  }
  function activate(root,key){
    const target=(MODERN[key]||(()=>null))();
    allLegacy(root).forEach(x=>setDisplay(x,false));
    allModern(root).forEach(x=>setDisplay(x,x===target));
    root.querySelectorAll('.cv-ui01-nav [data-ui01cat]').forEach(b=>{
      const on=b.dataset.ui01cat===key;
      b.classList.toggle('active',on);
      b.setAttribute('aria-selected',on?'true':'false');
    });
    root.dataset.cvActiveCategory=key;
    // UI-03/06/05 scripts may toggle their own panels after the click.
    // Re-assert the selected panel on the next frame.
    requestAnimationFrame(()=>{
      allLegacy(root).forEach(x=>setDisplay(x,false));
      allModern(root).forEach(x=>setDisplay(x,x===target));
    });
  }

  function install(root){
    const nav=root.querySelector('.cv-ui01-nav');
    if(!nav || nav.dataset.cvRecoveryV6==='1')return;
    nav.dataset.cvRecoveryV6='1';

    const handle=e=>{
      const b=e.target.closest('[data-ui01cat]');
      if(!b || !nav.contains(b))return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      activate(root,b.dataset.ui01cat);
    };
    nav.addEventListener('pointerdown',handle,true);
    nav.addEventListener('pointerup',handle,true);
    nav.addEventListener('click',handle,true);

    const observer=new MutationObserver(()=>{
      const key=root.dataset.cvActiveCategory||'templates';
      const target=(MODERN[key]||(()=>null))();
      if(target){
        allLegacy(root).forEach(x=>setDisplay(x,false));
        allModern(root).forEach(x=>setDisplay(x,x===target));
      }
    });
    observer.observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden']});

    activate(root,root.dataset.cvActiveCategory||'templates');
  }

  function start(){
    const timer=setInterval(()=>{
      const root=document.getElementById('stableEditor');
      if(root && root.querySelector('.cv-ui01-nav'))install(root);
    },100);
    setTimeout(()=>clearInterval(timer),20000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();