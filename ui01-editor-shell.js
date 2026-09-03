/* CelebrateVerse UI-01 — Canva-style editor shell */
(function(){
  'use strict';
  const wait=fn=>{if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(fn,250));else setTimeout(fn,250)};
  function mount(){
    const root=document.getElementById('stableEditor');
    if(!root||root.dataset.ui01==='1')return;
    root.dataset.ui01='1';
    const ed=root.querySelector('.ed');
    const left=root.querySelector('.ed-left');
    const main=root.querySelector('.ed-main');
    const right=root.querySelector('.ed-right');
    if(!ed||!left||!main||!right)return;

    const style=document.createElement('style');
    style.id='cv-ui01-style';
    style.textContent=`
      #stableEditor.cv-ui01{margin:0!important;font-family:DM Sans,system-ui,sans-serif;color:#f8fafc;--ui01-border:rgba(255,255,255,.10);--ui01-panel:#11131d;--ui01-panel2:#171925;--ui01-muted:#9ca3b5;--ui01-accent:#8b5cf6;--ui01-top:58px;}
      #stableEditor.cv-ui01 .ed-head{height:var(--ui01-top);margin:0;padding:0 14px;border:1px solid var(--ui01-border);border-radius:12px;background:rgba(17,19,29,.96);display:flex;align-items:center;gap:14px;position:sticky;top:0;z-index:80;box-sizing:border-box;backdrop-filter:blur(14px)}
      #stableEditor.cv-ui01 .ed-head .ed-kicker{display:none} #stableEditor.cv-ui01 .ed-head h2{font-size:16px;margin:0;font-weight:800;white-space:nowrap}
      #stableEditor.cv-ui01 .ed-head h2:before{content:'Celebrate';color:#fff} #stableEditor.cv-ui01 .ed-head h2{font-size:0} #stableEditor.cv-ui01 .ed-head h2:after{content:'Verse Studio';font-size:16px;color:#c4b5fd}
      #stableEditor.cv-ui01 .ed-head .ed-status{margin-left:auto;font-size:11px;padding:6px 9px;background:rgba(34,197,94,.10);border:1px solid rgba(34,197,94,.18);color:#bbf7d0}
      .cv-ui01-top-actions{display:flex;align-items:center;gap:4px;flex:1}.cv-ui01-top-actions button{border:0!important;background:transparent!important;color:#cbd5e1!important;padding:7px 8px!important;border-radius:7px!important;font-size:12px!important}.cv-ui01-top-actions button:hover{background:rgba(255,255,255,.07)!important;color:#fff!important}.cv-ui01-spacer{flex:1}.cv-ui01-top-primary{background:#8b5cf6!important;color:#fff!important;padding:8px 12px!important}
      #stableEditor.cv-ui01 .ed{grid-template-columns:92px minmax(0,1fr) 300px;gap:0;min-height:720px;background:#0b0d14;border:1px solid var(--ui01-border);border-radius:12px;overflow:hidden}
      #stableEditor.cv-ui01 .ed-left{padding:8px 6px;border:0;border-right:1px solid var(--ui01-border);border-radius:0;background:#10121a;max-height:none;overflow:auto}
      #stableEditor.cv-ui01 .ed-main{padding:0;border:0;border-radius:0;background:#0b0d14;overflow:hidden;display:flex;flex-direction:column;min-width:0}
      #stableEditor.cv-ui01 .ed-right{padding:16px;border:0;border-left:1px solid var(--ui01-border);border-radius:0;background:#11131d;max-height:none;overflow:auto}
      .cv-ui01-nav{display:grid;gap:5px}.cv-ui01-nav button{border:0!important;background:transparent!important;color:#aeb6c7!important;border-radius:9px!important;padding:9px 4px!important;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:10px!important}.cv-ui01-nav button span{font-size:20px;line-height:1}.cv-ui01-nav button.active,.cv-ui01-nav button:hover{background:rgba(139,92,246,.14)!important;color:#fff!important}.cv-ui01-pro{font-size:8px;color:#fbbf24;margin-left:2px}
      #stableEditor.cv-ui01 .ed-tabs{display:none!important}.cv-ui01-category{display:none!important}.cv-ui01-category.active{display:block!important}.cv-ui01-category .ed-panel{margin:0!important}.cv-ui01-category .ed-layers{margin-top:14px!important}
      #stableEditor.cv-ui01 .edbar{margin:0;padding:9px 12px;border-bottom:1px solid var(--ui01-border);background:#11131d;min-height:42px;box-sizing:border-box;align-items:center;overflow:auto;flex-wrap:nowrap}.cv-ui01 .edbar button{white-space:nowrap}.cv-ui01 .ed-align{padding:7px 12px;margin:0;border-bottom:1px solid var(--ui01-border);background:#0f1119}
      #stableEditor.cv-ui01 #edCanvasWrap{flex:1;min-height:560px;margin:0;border-radius:0;padding:24px;background:#090b11;display:flex;align-items:center;justify-content:center;overflow:auto}
      #stableEditor.cv-ui01 #edCanvas{min-height:540px;width:min(100%,900px);box-shadow:0 18px 55px rgba(0,0,0,.35)}
      .cv-ui01-bottom{height:48px;border-top:1px solid var(--ui01-border);background:#11131d;display:flex;align-items:center;gap:8px;padding:0 12px;box-sizing:border-box}.cv-ui01-bottom .cv-ui01-page-label{font-size:11px;color:#aeb6c7}.cv-ui01-bottom button{border:1px solid var(--ui01-border);background:#181b27;color:#dbe2ef;border-radius:7px;padding:6px 9px;cursor:pointer;font-size:11px}.cv-ui01-bottom .cv-ui01-zoom{margin-left:auto;display:flex;align-items:center;gap:5px}
      .cv-ui01-context-title{font-size:11px;letter-spacing:.12em;color:#9ca3b5;font-weight:800;margin-bottom:12px}.cv-ui01-right-section{display:none}.cv-ui01-right-section.active{display:block}.cv-ui01 .ed-right>hr{opacity:.5}.cv-ui01 .ed-right>button{width:100%;margin:4px 0}
      #stableEditor.cv-ui01 .ed-layers{border-top:1px solid var(--ui01-border);padding-top:12px}.cv-ui01 .ed-panel>b,.cv-ui01 .ed-layers>b{font-size:10px;color:#9ca3b5}
      #stableEditor.cv-ui01 .cv-p24-panel{margin:0!important}.cv-ui01 .cv-p23-panel{margin:0!important}
      #celebrationForm.cv-ui01-form{display:contents!important} .customizer-page.cv-ui01-page{padding-top:16px!important}.customizer-page.cv-ui01-page .customizer-container{max-width:1500px!important;display:block!important}.customizer-page.cv-ui01-page .customizer-header,.customizer-page.cv-ui01-page .progress-wrapper{display:none!important}.customizer-page.cv-ui01-page .form-step,.customizer-page.cv-ui01-page .form-navigation{display:none!important}
      @media(max-width:900px){#stableEditor.cv-ui01 .ed{grid-template-columns:74px minmax(0,1fr)}#stableEditor.cv-ui01 .ed-right{grid-column:1/-1;max-height:360px;border-left:0;border-top:1px solid var(--ui01-border)}#stableEditor.cv-ui01 #edCanvasWrap{min-height:460px}.cv-ui01-nav button{font-size:9px!important}}
      @media(max-width:600px){#stableEditor.cv-ui01 .ed{grid-template-columns:1fr;display:flex;flex-direction:column}.cv-ui01 .ed-left{order:2;border-right:0;border-top:1px solid var(--ui01-border);overflow-x:auto}.cv-ui01-nav{display:flex;overflow-x:auto}.cv-ui01-nav button{min-width:66px}.cv-ui01 .ed-main{order:1}.cv-ui01 .ed-right{order:3}.cv-ui01 .ed-head{position:relative}.cv-ui01-top-actions button:nth-child(1),.cv-ui01-top-actions button:nth-child(2),.cv-ui01-top-actions button:nth-child(3){display:none!important}}
    `;
    document.head.appendChild(style);
    root.classList.add('cv-ui01');
    document.querySelector('.customizer-page')?.classList.add('cv-ui01-page');
    document.getElementById('celebrationForm')?.classList.add('cv-ui01-form');

    const head=root.querySelector('.ed-head');
    const status=head.querySelector('.ed-status');
    const actions=document.createElement('div');actions.className='cv-ui01-top-actions';
    actions.innerHTML='<button type="button" data-ui01="file">File</button><button type="button" data-ui01="edit">Edit</button><button type="button" data-ui01="view">View</button><button type="button" data-ui01="undo">↶ Undo</button><button type="button" data-ui01="redo">↷ Redo</button><span class="cv-ui01-spacer"></span><button type="button" data-ui01="save">Save</button><button type="button" data-ui01="share" class="cv-ui01-top-primary">Share</button>';
    head.insertBefore(actions,status);
    const clickText=t=>[...root.querySelectorAll('button')].find(b=>b.textContent.trim().toLowerCase().includes(t));
    actions.querySelector('[data-ui01=undo]').onclick=()=>clickText('↶')?.click();
    actions.querySelector('[data-ui01=redo]').onclick=()=>clickText('↷')?.click();
    actions.querySelector('[data-ui01=save]').onclick=()=>clickText('save')?.click();
    actions.querySelector('[data-ui01=share]').onclick=()=>{const b=clickText('share');if(b&&b!==actions.querySelector('[data-ui01=share]'))b.click();else window.navigator.clipboard?.writeText(location.href)};
    actions.querySelectorAll('[data-ui01=file],[data-ui01=edit],[data-ui01=view]').forEach(b=>b.onclick=()=>{b.classList.toggle('active');});

    const oldTabs=left.querySelector('.ed-tabs');
    const panels=[...left.querySelectorAll('.ed-panel')];
    const layers=left.querySelector('.ed-layers');
    const nav=document.createElement('nav');nav.className='cv-ui01-nav';
    const cats=[['templates','▦','Templates'],['elements','◇','Elements'],['text','T','Text'],['uploads','↑','Uploads'],['photos','▣','Photos'],['audio','♪','Audio'],['ai','✦','AI'],['pages','▤','Pages']];
    cats.forEach(([key,icon,label],i)=>{const b=document.createElement('button');b.type='button';b.dataset.ui01cat=key;b.innerHTML='<span>'+icon+'</span>'+label+(key==='ai'||key==='audio'?'<sup class="cv-ui01-pro">PRO</sup>':'');if(i===0)b.classList.add('active');nav.appendChild(b)});
    left.insertBefore(nav,oldTabs||left.firstChild); oldTabs?.remove();
    const showPanel=(key)=>{
      nav.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.ui01cat===key));
      panels.forEach(p=>p.classList.remove('active'));
      if(key==='templates'){panels[0]?.classList.add('active');}
      if(key==='elements'){panels[0]?.classList.add('active');panels[0]?.querySelectorAll('b,hr').forEach(x=>{x.style.display=(x.textContent?.trim()==='TEMPLATES'||x.tagName==='HR')?'none':''});}
      if(key==='text'){panels[0]?.classList.add('active');}
      if(key==='uploads'||key==='photos'||key==='audio'){panels[1]?.classList.add('active');}
      if(key==='pages'){panels[2]?.classList.add('active');}
      if(key==='ai'){right.querySelector('#edAiText')?.scrollIntoView({block:'center'});}
      if(key==='photos'){right.querySelector('#edPhoto')?.scrollIntoView({block:'center'});}
    };
    nav.querySelectorAll('button').forEach(b=>b.onclick=()=>showPanel(b.dataset.ui01cat));
    showPanel('templates');

    const bottom=document.createElement('div');bottom.className='cv-ui01-bottom';bottom.innerHTML='<span class="cv-ui01-page-label">Pages</span><button type="button" data-ui01bottom="add">＋</button><button type="button" data-ui01bottom="pages">☷ Manage</button><span class="cv-ui01-zoom"><button type="button" data-ui01bottom="minus">−</button><span id="cvUi01Zoom">100%</span><button type="button" data-ui01bottom="plus">＋</button><button type="button" data-ui01bottom="fit">Fit</button></span>';
    main.appendChild(bottom);
    bottom.querySelector('[data-ui01bottom=minus]').onclick=()=>clickText('−')?.click();
    bottom.querySelector('[data-ui01bottom=plus]').onclick=()=>clickText('＋')?.click();
    bottom.querySelector('[data-ui01bottom=fit]').onclick=()=>clickText('fit')?.click();
    bottom.querySelector('[data-ui01bottom=add]').onclick=()=>clickText('＋ Add Page')?.click();
    bottom.querySelector('[data-ui01bottom=pages]').onclick=()=>showPanel('pages');

    const title=root.querySelector('.ed-head h2');
    if(title) title.setAttribute('aria-label','CelebrateVerse Studio');
    const observer=new MutationObserver(()=>{const z=root.querySelector('#edZoom');const out=root.querySelector('#cvUi01Zoom');if(z&&out)out.textContent=z.textContent});
    observer.observe(root,{subtree:true,childList:true,characterData:true});
  }
  wait(()=>{const timer=setInterval(()=>{if(document.getElementById('stableEditor')){clearInterval(timer);mount()}},150);setTimeout(()=>clearInterval(timer),8000)});
})();
