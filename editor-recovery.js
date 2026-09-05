/* CelebrateVerse editor recovery — keeps the original feature panels usable even if an enhancement layer fails to mount. */
(function(){
  'use strict';
  function boot(){
    const root=document.getElementById('stableEditor');
    if(!root||root.dataset.cvRecovery==='1')return !!root;
    const tabs=[...root.querySelectorAll('.ed-tab')];
    const panels=[...root.querySelectorAll('.ed-panel')];
    if(!tabs.length||!panels.length)return false;
    root.dataset.cvRecovery='1';

    const map=new Map(panels.map(p=>[p.dataset.panel,p]));
    function activate(key){
      tabs.forEach(t=>t.classList.toggle('active',t.dataset.tab===key));
      panels.forEach(p=>{
        const on=p.dataset.panel===key;
        p.hidden=!on;
        p.style.display=on?'':'none';
      });
      root.querySelectorAll('[data-ui02-panel],[data-ui03-left],[.ui05-panel],[.ui06-panel]').forEach(p=>{
        if(p.dataset.ui02Panel===key||p.dataset.ui03Left===key||p.dataset.ui05Panel===key){
          p.style.display='';
        }
      });
      root.dataset.activeTool=key;
    }
    tabs.forEach(t=>{
      t.type='button';
      t.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();activate(t.dataset.tab)},true);
    });
    const style=document.createElement('style');
    style.textContent=`
      #stableEditor .ed-tabs{position:relative;z-index:100;pointer-events:auto}
      #stableEditor .ed-tabs .ed-tab{pointer-events:auto;position:relative;z-index:101}
      #stableEditor .ed-panel[hidden]{display:none!important}
      #stableEditor .ed-panel{position:relative;z-index:5}
    `;
    document.head.appendChild(style);
    activate(tabs.find(t=>t.classList.contains('active'))?.dataset.tab||'templates');

    // If the compact UI layer is available, make its category navigation drive
    // the same underlying panels instead of creating a second competing editor.
    root.querySelectorAll('.cv-ui01-nav button').forEach(b=>{
      b.addEventListener('click',()=>activate(b.dataset.ui01cat),true);
    });
    return true;
  }
  document.addEventListener('DOMContentLoaded',()=>{
    let n=0;
    const timer=setInterval(()=>{if(boot()||++n>80)clearInterval(timer)},150);
  });
})();