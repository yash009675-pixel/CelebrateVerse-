/* CelebrateVerse UI-02 — Templates + Elements library */
(function(){
  'use strict';
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',()=>setTimeout(fn,350)):setTimeout(fn,350);
  const DATA={
    shapes:[['Circle','●','free'],['Square','■','free'],['Rectangle','▬','free'],['Triangle','▲','free'],['Heart','♥','free'],['Star','★','free'],['Line','━','free'],['Arrow','➜','free']],
    stickers:[['Love','💕','free'],['Birthday','🎂','free'],['Party','🎉','free'],['Anniversary','💍','free'],['Wedding','💒','pro'],['Flowers','🌸','free'],['Couple','💑','pro'],['Gift','🎁','free']],
    icons:[['Heart','♡','free'],['Camera','📷','free'],['Music','♫','pro'],['Gift','🎁','free'],['Cake','🎂','free'],['Crown','♛','pro'],['Flowers','✿','free'],['Stars','✦','free'],['Sparkles','✨','free'],['Balloon','🎈','free'],['Ring','💍','pro'],['Smile','☺','free']]
  };
  const TEMPLATES=[
    ['Welcome','❤️','welcome'],['Our Story','📖','story'],['Gallery','📸','gallery'],['Love Letter','💌','letter'],['Surprise','🎁','surprise'],['Countdown','⏳','countdown']
  ];
  function mount(){
    const root=document.getElementById('stableEditor');
    if(!root||root.dataset.ui02==='1')return;
    const nav=root.querySelector('.cv-ui01-nav');
    const left=root.querySelector('.ed-left');
    const preview=document.getElementById('cvPreviewContent');
    if(!nav||!left||!preview)return;
    root.dataset.ui02='1';
    const style=document.createElement('style');style.id='cv-ui02-style';style.textContent=`
      #stableEditor.cv-ui01 .cv-ui02-panel{display:none;height:100%;box-sizing:border-box;overflow:auto;padding:12px 10px;background:#10121a}
      #stableEditor.cv-ui01 .cv-ui02-panel.active{display:block}
      .cv-ui02-title{font-size:12px;font-weight:800;color:#fff;margin:2px 2px 10px}.cv-ui02-sub{font-size:10px;color:#8f98aa;margin:-5px 2px 12px}
      .cv-ui02-search{width:100%;box-sizing:border-box;border:1px solid rgba(255,255,255,.11);background:#181b27;color:#fff;border-radius:8px;padding:9px 10px;outline:0;margin-bottom:10px;font-size:11px}.cv-ui02-search:focus{border-color:rgba(139,92,246,.65)}
      .cv-ui02-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin-bottom:10px}.cv-ui02-tabs button,.cv-ui02-template button{border:1px solid rgba(255,255,255,.08);background:#181b27;color:#bfc7d7;border-radius:7px;padding:7px 3px;font-size:10px;cursor:pointer}.cv-ui02-tabs button.active,.cv-ui02-tabs button:hover,.cv-ui02-template button:hover{background:rgba(139,92,246,.18);color:#fff;border-color:rgba(139,92,246,.35)}
      .cv-ui02-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.cv-ui02-item{position:relative;min-height:70px;border:1px solid rgba(255,255,255,.08);background:#171925;border-radius:9px;color:#e5e7eb;cursor:pointer;padding:7px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}.cv-ui02-item:hover{border-color:rgba(139,92,246,.5);transform:translateY(-1px)}.cv-ui02-item .icon{font-size:27px;line-height:1}.cv-ui02-item small{font-size:9px;color:#9ca3b5}.cv-ui02-badge{position:absolute;top:5px;right:5px;font-size:7px;color:#fbbf24}.cv-ui02-section{font-size:9px;color:#8992a4;text-transform:uppercase;letter-spacing:.12em;margin:14px 2px 7px;font-weight:800}.cv-ui02-template{display:grid;gap:7px}.cv-ui02-template button{text-align:left;padding:10px}.cv-ui02-template button strong{display:block;color:#fff;font-size:11px}.cv-ui02-template button span{display:block;color:#8992a4;font-size:9px;margin-top:2px}
      @media(max-width:600px){#stableEditor.cv-ui01 .cv-ui02-panel{max-height:300px}.cv-ui02-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.cv-ui02-item{min-height:64px}}
    `;document.head.appendChild(style);
    const panels={};
    ['templates','elements'].forEach(key=>{const p=document.createElement('section');p.className='cv-ui02-panel';p.dataset.ui02Panel=key;left.appendChild(p);panels[key]=p});
    panels.templates.innerHTML='<div class="cv-ui02-title">Templates</div><div class="cv-ui02-sub">Start with a ready-made celebration design</div><div class="cv-ui02-template"></div><div class="cv-ui02-section">More templates</div><div class="cv-ui02-sub">Premium templates will show a PRO badge when available.</div>';
    const tg=panels.templates.querySelector('.cv-ui02-template');
    TEMPLATES.forEach(([name,emoji,key])=>{const b=document.createElement('button');b.type='button';b.innerHTML=`<strong>${emoji} ${name}</strong><span>Ready-made page template</span>`;b.onclick=()=>{const legacy=document.querySelector(`#p14Manager [data-t="${key}"]`);if(legacy)legacy.click();else{preview.innerHTML=`<div class="p14-template"><h1>${emoji} ${name}</h1><div>Create something beautiful for your celebration ✨</div></div>`;document.dispatchEvent(new CustomEvent('cv:changed'))}};tg.appendChild(b)});
    panels.elements.innerHTML='<div class="cv-ui02-title">Elements</div><div class="cv-ui02-sub">Add simple design elements to your canvas</div><input class="cv-ui02-search" placeholder="Search elements..." autocomplete="off"><div class="cv-ui02-tabs"><button data-ui02tab="shapes" class="active">Shapes</button><button data-ui02tab="stickers">Stickers</button><button data-ui02tab="icons">Icons</button></div><div class="cv-ui02-grid"></div>';
    const search=panels.elements.querySelector('.cv-ui02-search'),grid=panels.elements.querySelector('.cv-ui02-grid');let tab='shapes';
    function add(name,char,type){const el=document.createElement('div');el.className='editem ui02-element';el.dataset.ui02Type=type;el.dataset.ui02Name=name;Object.assign(el.style,{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',minWidth:'44px',minHeight:'44px',display:'grid',placeItems:'center',fontSize:type==='shapes'?'64px':'54px',cursor:'move',userSelect:'none'});el.textContent=char;if(type==='shapes'&&name==='Line'){el.style.fontSize='44px';el.style.width='150px'}preview.appendChild(el);document.dispatchEvent(new CustomEvent('cv:changed'));el.click()}
    function render(){const q=search.value.trim().toLowerCase();grid.innerHTML='';DATA[tab].filter(x=>x[0].toLowerCase().includes(q)).forEach(([name,char,tier])=>{const b=document.createElement('button');b.type='button';b.className='cv-ui02-item';b.innerHTML=`${tier==='pro'?'<span class="cv-ui02-badge">PRO 🔒</span>':''}<span class="icon">${char}</span><small>${name}</small>`;b.onclick=()=>add(name,char,tab);grid.appendChild(b)})}
    panels.elements.querySelectorAll('[data-ui02tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.ui02tab;panels.elements.querySelectorAll('[data-ui02tab]').forEach(x=>x.classList.toggle('active',x===b));render()});search.addEventListener('input',render);render();
    function show(key){Object.values(panels).forEach(p=>p.classList.toggle('active',p.dataset.ui02Panel===key));}
    nav.querySelectorAll('[data-ui01cat]').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.ui01cat;if(key==='templates')show('templates');else if(key==='elements')show('elements');else Object.values(panels).forEach(p=>p.classList.remove('active'))}));
    show('templates');
  }
  ready(()=>{const timer=setInterval(()=>{if(document.getElementById('stableEditor')){clearInterval(timer);mount()}},150);setTimeout(()=>clearInterval(timer),9000)});
})();
