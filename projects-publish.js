/* CelebrateVerse Projects / Save / Publish / Export v18 */
document.addEventListener('DOMContentLoaded', () => {
  const preview = document.getElementById('cvPreviewContent');
  const toolbar = document.querySelector('.edbar');
  if (!preview || !toolbar || document.getElementById('cvSaveProject')) return;

  const KEY='celebrateVerseProjects';
  const IDKEY='celebrateVerseActiveProject';
  const VERSION=18;
  let id=localStorage.getItem(IDKEY) || `cv-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  localStorage.setItem(IDKEY,id);

  const read=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch{return[]}};
  const editor=()=>window.CelebrateVerseEditor;
  const cleanHTML=()=>{const c=preview.cloneNode(true);c.querySelectorAll('.ed-resize-handle,.ed-guides').forEach(x=>x.remove());return c.innerHTML};
  const formData=()=>Object.fromEntries([...document.querySelectorAll('#celebrationForm input,#celebrationForm textarea, #celebrationForm select')].filter(x=>x.id && x.type!=='file').map(x=>[x.id,x.value]));
  const snapshot=()=>({pages:editor()?.getPages?.()||[[]],html:cleanHTML(),background:preview.style.background||'',form:formData(),editorVersion:VERSION});

  const save=()=>{
    const list=read();
    const old=list.find(x=>x.id===id);
    const data={...(old||{}),id,name:document.getElementById('personName')?.value?.trim()||old?.name||'Untitled Celebration',updatedAt:new Date().toISOString(),...snapshot()};
    const i=list.findIndex(x=>x.id===id); if(i>=0) list[i]=data; else list.unshift(data);
    try{localStorage.setItem(KEY,JSON.stringify(list.slice(0,50)));}
    catch(e){console.warn('Project storage full',e);}
    const s=document.getElementById('cvSaveStatus'); if(s){s.textContent='✓ All changes saved';clearTimeout(s._t);s._t=setTimeout(()=>s.textContent='',1800)}
    return data;
  };

  const loadProject=(p)=>{
    id=p.id;localStorage.setItem(IDKEY,id);
    for(const [k,v] of Object.entries(p.form||{})){const el=document.getElementById(k);if(el)el.value=v;}
    preview.innerHTML=p.html||'';preview.style.background=p.background||'';
    if(editor()?.loadPages && p.pages) editor().loadPages(p.pages);
    else if(editor()?.loadSnapshot) editor().loadSnapshot((p.pages||[[]])[0]);
    document.dispatchEvent(new CustomEvent('cv:projectLoaded',{detail:p}));
    const status=document.getElementById('cvSaveStatus');if(status)status.textContent='✓ Project loaded';
  };

  const showProjects=()=>{
    const list=read();
    if(!list.length)return alert('My Projects\n\nNo saved projects yet.');
    const choice=prompt('My Projects\n\n'+list.map((x,i)=>`${i+1}. ${x.name} — ${new Date(x.updatedAt).toLocaleString()}`).join('\n')+'\n\nEnter project number:');
    const p=list[Number(choice)-1];if(p)loadProject(p);
  };

  const encode=o=>btoa(unescape(encodeURIComponent(JSON.stringify(o))));
  const publish=()=>{
    const p=save();
    const payload=encode({version:VERSION,name:p.name,html:p.html,background:p.background,form:p.form,pages:p.pages});
    const url=new URL('celebration.html',location.href);url.searchParams.set('data',payload);
    navigator.clipboard?.writeText(url.href).catch(()=>{});
    prompt('Shareable celebration link (copied when browser allows):',url.href);
  };

  const loadLib=src=>new Promise((resolve,reject)=>{if(document.querySelector(`script[src="${src}"]`))return resolve();const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)});
  const exportImage=async type=>{try{await loadLib('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');const c=await html2canvas(preview,{backgroundColor:null,scale:2,useCORS:true});const a=document.createElement('a');a.download=`celebrateverse.${type}`;a.href=c.toDataURL(type==='jpg'?'image/jpeg':'image/png',.92);a.click();}catch(e){console.error(e);alert('Image export failed.');}};
  const exportPDF=async()=>{try{await loadLib('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');await loadLib('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');const c=await html2canvas(preview,{scale:2,useCORS:true});const pdf=new jspdf.jsPDF({orientation:c.width>c.height?'landscape':'portrait',unit:'px',format:[c.width,c.height]});pdf.addImage(c.toDataURL('image/png'),'PNG',0,0,c.width,c.height);pdf.save('celebrateverse.pdf');}catch(e){console.error(e);window.print();}};
  const exportZIP=async()=>{try{await loadLib('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js');const p=save();const zip=new JSZip();zip.file('index.html',`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${String(p.name).replace(/[<>]/g,'')}</title><style>body{margin:0;font-family:Arial,sans-serif;background:#111;color:#fff}.celebration{max-width:1000px;margin:20px auto;padding:30px;border-radius:24px;min-height:70vh;box-sizing:border-box}.editem{position:absolute;box-sizing:border-box}</style></head><body><main class="celebration" style="position:relative;background:${p.background||'linear-gradient(135deg,#3b0764,#831843)'}">${p.html}</main></body></html>`);const blob=await zip.generateAsync({type:'blob'});const a=document.createElement('a');a.download='celebrateverse-website.zip';a.href=URL.createObjectURL(blob);a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}catch(e){console.error(e);alert('ZIP export failed.');}};

  toolbar.insertAdjacentHTML('beforeend','<button id="cvSaveProject" type="button">💾 Save</button><button id="cvProjects" type="button">📁 Projects</button><button id="cvPublish" type="button">🚀 Publish</button><button id="cvPNG" type="button">PNG</button><button id="cvJPG" type="button">JPG</button><button id="cvPDF" type="button">PDF</button><button id="cvZIP" type="button">ZIP</button><span id="cvSaveStatus" role="status" aria-live="polite"></span>');
  cvSaveProject.onclick=save;cvProjects.onclick=showProjects;cvPublish.onclick=publish;cvPNG.onclick=()=>exportImage('png');cvJPG.onclick=()=>exportImage('jpg');cvPDF.onclick=exportPDF;cvZIP.onclick=exportZIP;
  let timer;const schedule=()=>{clearTimeout(timer);timer=setTimeout(save,800)};
  document.getElementById('celebrationForm')?.addEventListener('input',schedule);
  document.getElementById('celebrationForm')?.addEventListener('change',schedule);
  document.addEventListener('cv:changed',schedule);
  window.addEventListener('beforeunload',()=>{clearTimeout(timer);save()});
  setTimeout(save,0);
});
