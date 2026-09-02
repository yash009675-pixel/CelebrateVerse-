document.addEventListener('DOMContentLoaded',()=>{
  const wait=()=>{
    const root=document.getElementById('stableEditor');
    const preview=document.getElementById('cvPreviewContent');
    if(!root||!preview) return setTimeout(wait,80);

    const items=()=>[...preview.querySelectorAll('.editem')];
    const selected=()=>items().filter(x=>x.classList.contains('active'));
    const changed=()=>document.dispatchEvent(new CustomEvent('cv:changed'));
    const status=msg=>{const el=root.querySelector('#edStatus');if(el)el.textContent=msg;};

    // STEP 2: Core editing consistency.
    preview.addEventListener('click',e=>{
      const el=e.target.closest('.editem');
      if(!el) return;
      setTimeout(()=>{
        if(!el.classList.contains('active')) return;
        root.querySelectorAll('.editem.active').forEach(x=>{if(x!==el&&!e.shiftKey)x.classList.remove('active');});
      },0);
    },true);

    document.addEventListener('keydown',e=>{
      if(e.target.matches('input,textarea,select')) return;
      const list=selected();
      if(!list.length) return;
      if(e.key==='Delete'||e.key==='Backspace'){
        e.preventDefault();list.forEach(x=>x.remove());changed();status('● Unsaved changes');return;
      }
      if(e.key==='Escape'){list.forEach(x=>x.classList.remove('active'));return;}
      if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){
        e.preventDefault();const step=e.shiftKey?5:1;
        list.forEach(el=>{
          if(e.key==='ArrowLeft')el.style.left=((parseFloat(el.style.left)||0)-step)+'%';
          if(e.key==='ArrowRight')el.style.left=((parseFloat(el.style.left)||0)+step)+'%';
          if(e.key==='ArrowUp')el.style.top=((parseFloat(el.style.top)||0)-step)+'%';
          if(e.key==='ArrowDown')el.style.top=((parseFloat(el.style.top)||0)+step)+'%';
        });
        changed();status('● Unsaved changes');
      }
    });

    // STEP 3: Make Design/Assets tabs reliable on the live editor.
    root.querySelectorAll('.ed-tab').forEach(tab=>tab.addEventListener('click',()=>{
      const name=tab.dataset.tab;
      root.querySelectorAll('.ed-tab').forEach(x=>x.classList.toggle('active',x===tab));
      root.querySelectorAll('.ed-panel').forEach(panel=>panel.hidden=panel.dataset.panel!==name);
    }));

    // Ensure template, typography and animation changes are saved even when changed rapidly.
    root.querySelectorAll('[data-template]').forEach(btn=>btn.addEventListener('click',()=>{
      setTimeout(()=>{changed();status('✓ Template applied');},0);
    }));
    ['edSize','edColor','edOpacity','edSpacing','edRotation','edFont','edAnim','edShadow','edRounded','edCircle','edFrame'].forEach(id=>{
      const el=root.querySelector('#'+id);
      if(el)el.addEventListener('change',()=>{changed();status('● Design updated');});
    });

    // Photo upload: report a clear live state and keep existing editor upload logic untouched.
    const photo=root.querySelector('#edFile');
    if(photo)photo.addEventListener('change',()=>{
      if(photo.files&&photo.files.length)status('✓ Photo added to canvas');
      setTimeout(changed,0);
    });

    // Music controls: keep loop state and save design changes.
    const music=root.querySelector('#edMusicFile');
    const loop=root.querySelector('#edLoop');
    if(music)music.addEventListener('change',()=>{
      if(music.files&&music.files.length){changed();status('✓ Music added');}
    });
    if(loop)loop.addEventListener('change',()=>{changed();status(loop.checked?'✓ Music loop on':'✓ Music loop off');});

    // Preview input compatibility: the current HTML uses these IDs while older customizer code uses legacy IDs.
    const person=document.getElementById('personName');
    const message=document.getElementById('message');
    const sender=document.getElementById('customerName');
    const recipientPreview=document.getElementById('previewRecipientName')||document.getElementById('previewPersonName');
    const messagePreview=document.getElementById('previewMessage');
    const senderPreview=document.getElementById('previewSenderName');
    if(person&&recipientPreview)person.addEventListener('input',()=>recipientPreview.textContent=person.value.trim()||'Someone Special');
    if(message&&messagePreview)message.addEventListener('input',()=>messagePreview.textContent=message.value.trim()||'Your beautiful message will appear here.');
    if(sender&&senderPreview)sender.addEventListener('input',()=>senderPreview.textContent=sender.value.trim()||'Someone Special');

    const observer=new MutationObserver(()=>{
      root.querySelectorAll('.editem').forEach(el=>el.dataset.coreReady='1');
    });
    observer.observe(preview,{childList:true,subtree:true});

    root.dataset.phase18Core='ready';
    root.dataset.phase18Design='ready';
    status('✓ Phase 1–8 editor ready');
  };
  wait();
});