document.addEventListener('DOMContentLoaded',()=>{
  const wait=()=>{
    const root=document.getElementById('stableEditor');
    const preview=document.getElementById('cvPreviewContent');
    if(!root||!preview) return setTimeout(wait,80);

    const items=()=>[...preview.querySelectorAll('.editem')];
    const selected=()=>items().filter(x=>x.classList.contains('active'));
    const changed=()=>document.dispatchEvent(new CustomEvent('cv:changed'));

    // Make selection state consistent after dynamically added/cloned elements.
    preview.addEventListener('click',e=>{
      const el=e.target.closest('.editem');
      if(!el) return;
      setTimeout(()=>{
        if(!el.classList.contains('active')) return;
        root.querySelectorAll('.editem.active').forEach(x=>{ if(x!==el && !e.shiftKey) x.classList.remove('active'); });
      },0);
    },true);

    // Keyboard fallback for core operations without replacing the existing editor.
    document.addEventListener('keydown',e=>{
      if(e.target.matches('input,textarea,select')) return;
      const list=selected();
      if(!list.length) return;
      if(e.key==='Delete' || e.key==='Backspace'){
        e.preventDefault(); list.forEach(x=>x.remove()); changed(); return;
      }
      if(e.key==='Escape'){
        list.forEach(x=>x.classList.remove('active')); return;
      }
      if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){
        e.preventDefault();
        const step=e.shiftKey?5:1;
        list.forEach(el=>{
          if(e.key==='ArrowLeft') el.style.left=((parseFloat(el.style.left)||0)-step)+'%';
          if(e.key==='ArrowRight') el.style.left=((parseFloat(el.style.left)||0)+step)+'%';
          if(e.key==='ArrowUp') el.style.top=((parseFloat(el.style.top)||0)-step)+'%';
          if(e.key==='ArrowDown') el.style.top=((parseFloat(el.style.top)||0)+step)+'%';
        });
        changed();
      }
    });

    // Keep layers refreshed whenever canvas content changes.
    const observer=new MutationObserver(()=>{
      root.querySelectorAll('.editem').forEach(el=>{el.dataset.coreReady='1';});
    });
    observer.observe(preview,{childList:true,subtree:true});

    root.dataset.phase18Core='ready';
  };
  wait();
});