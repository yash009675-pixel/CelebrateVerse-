document.addEventListener('DOMContentLoaded',()=>{
  const wait=()=>{
    const root=document.getElementById('stableEditor');
    const preview=document.getElementById('cvPreviewContent');
    const save=document.getElementById('cvSaveProject');
    const projects=document.getElementById('cvProjects');
    const publish=document.getElementById('cvPublish');
    if(!root||!preview||!save||!projects||!publish) return setTimeout(wait,120);

    let autosaveTimer;
    const status=document.getElementById('cvSaveStatus');
    const setStatus=(text)=>{ if(status){status.textContent=text;clearTimeout(status._phase18);status._phase18=setTimeout(()=>{if(status.textContent===text)status.textContent='';},2200);} };
    const markChanged=()=>{
      if(status) status.textContent='● Changes pending';
      clearTimeout(autosaveTimer);
      autosaveTimer=setTimeout(()=>save.click(),900);
    };

    document.addEventListener('cv:changed',markChanged);
    preview.addEventListener('input',markChanged,true);
    preview.addEventListener('change',markChanged,true);
    document.getElementById('celebrationForm')?.addEventListener('input',markChanged,true);

    save.addEventListener('click',()=>setStatus('✓ All changes saved'));
    projects.addEventListener('click',()=>setStatus('✓ Projects checked'));
    publish.addEventListener('click',()=>{
      save.click();
      setStatus('✓ Celebration link ready');
    });

    window.addEventListener('storage',e=>{
      if(e.key==='celebrateVerseProjects'&&status) setStatus('✓ Project data updated');
    });
    root.dataset.projectsReady='true';
  };
  wait();
});