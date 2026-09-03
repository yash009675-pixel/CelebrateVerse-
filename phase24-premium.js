/* CelebrateVerse PHASE 24 — Premium */
(function(){
  'use strict';
  const KEY='celebrateVersePremiumSettings';
  const state=Object.assign({unlocked:false,brandingRemoved:false,template:'romantic',animation:'cinematic',music:'soft-piano',frame:'rounded',customDomain:''},safeRead());
  function safeRead(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{return{}}}
  function save(){localStorage.setItem(KEY,JSON.stringify(state))}
  const $=id=>document.getElementById(id);
  const preview=()=>$('cvPreviewContent');
  const toast=(m)=>window.showToast?window.showToast(m,'celebration'):alert(m);
  const templates={romantic:['❤️ Romantic','Soft romantic celebration'],luxury:['✨ Luxury','Elegant gold-style layout'],galaxy:['🌌 Galaxy','Cosmic celebration'],birthday:['🎂 Birthday','Playful birthday layout'],anniversary:['💍 Anniversary','Elegant anniversary layout'],minimal:['🤍 Minimal','Clean modern layout']};
  const animations={fade:['Fade','Soft entrance'],zoom:['Zoom','Smooth scale entrance'],flip:['Flip','3D card entrance'],cinematic:['Cinematic','Premium cinematic reveal']};
  const music={soft-piano:['🎹 Soft Piano','Calm background music'],celebration:['🎉 Celebration','Upbeat celebration track'],romantic:['❤️ Romantic','Gentle romantic track'],none:['🔇 None','No background music']};
  const frames={circle:['⭕ Circle','Circular photo crop'],square:['⬜ Square','Clean square frame'],rounded:['▣ Rounded','Rounded photo corners'],heart:['❤️ Heart','Heart-shaped frame'],star:['⭐ Star','Star-shaped frame'],polaroid:['📷 Polaroid','Classic polaroid frame'],film:['🎞️ Film','Film-strip style frame']};
  function cardHtml(group,selected){return Object.entries(group).map(([key,v])=>`<button type="button" class="cv-p24-card ${selected===key?'selected':''}" data-p24-value="${key}"><span>${v[0]}</span><small>${v[1]}</small><span class="cv-p24-lock">${state.unlocked?'':'🔒'}</span></button>`).join('')}
  function requirePremium(action){if(state.unlocked)return true;toast('✨ Premium preview is locked. Use “Preview Premium” to test Phase 24 features.');return false}
  function applyTemplate(key){state.template=key;save();const p=preview();if(!p)return;const classes=[...p.classList].filter(x=>x.startsWith('cv-p24-template-'));classes.forEach(x=>p.classList.remove(x));p.classList.add('cv-p24-template-'+key);p.dataset.p24Template=key;toast(`Applied ${templates[key]?.[0]||'premium template'} ✨`)}
  function applyAnimation(key){state.animation=key;save();const p=preview();if(!p)return;if(!requirePremium())return;p.classList.remove('cv-p24-premium-anim','cv-p24-fade','cv-p24-zoom','cv-p24-flip','cv-p24-cinematic');if(key!=='none'){p.classList.add('cv-p24-premium-anim','cv-p24-'+key)}toast(`${animations[key]?.[0]||key} animation applied 🎬`)}
  function applyFrame(key){state.frame=key;save();if(!requirePremium())return;document.querySelectorAll('#previewPhotos img').forEach(img=>{img.style.borderRadius=key==='circle'?'50%':key==='rounded'?'18px':'0';img.style.clipPath=key==='heart'?'polygon(50% 0,61% 12%,75% 7%,88% 17%,94% 32%,91% 48%,50% 100%,9% 48%,6% 32%,12% 17%,25% 7%,39% 12%)':key==='star'?'polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 95%,50% 72%,21% 95%,32% 57%,2% 35%,39% 35%)':'none';img.style.padding=key==='polaroid'?'10px 10px 28px':'0';img.style.boxShadow=key==='film'?'inset 0 0 0 5px #222,0 0 0 2px rgba(255,255,255,.4)':'0 8px 24px rgba(0,0,0,.18)'})}
  function branding(){if(!requirePremium())return;state.brandingRemoved=!state.brandingRemoved;save();document.body.classList.toggle('cv-p24-branding-off',state.brandingRemoved);$('cvP24BrandBtn').textContent=state.brandingRemoved?'✓ Branding Removed':'Remove Branding';toast(state.brandingRemoved?'CelebrateVerse branding hidden. ✨':'CelebrateVerse branding restored.')}
  function domain(){if(!requirePremium())return;const input=$('cvP24Domain');const value=input.value.trim().toLowerCase().replace(/^https?:\\/\\//,'').replace(/\\/.*$/,'');state.customDomain=value;save();$('cvP24DomainStatus').textContent=value?`Saved domain: ${value}. Connect this domain in your hosting/GitHub Pages settings.`:'No custom domain saved.';toast(value?'Custom domain saved 🌐':'Custom domain cleared.')}
  function musicChoice(key){state.music=key;save();if(!requirePremium())return;let audio=$('cvP24Audio');if(!audio){audio=document.createElement('audio');audio.id='cvP24Audio';audio.loop=true;document.body.appendChild(audio)}if(key==='none'){audio.pause();return}toast(`Premium music selected: ${music[key][0]}`);}
  function render(tab='templates'){
    const host=$('cvP24Content');if(!host)return;let html='';
    if(tab==='templates')html=`<div class="cv-p24-grid">${cardHtml(templates,state.template)}</div>`;
    if(tab==='animations')html=`<div class="cv-p24-grid">${cardHtml(animations,state.animation)}</div>`;
    if(tab==='music')html=`<div class="cv-p24-grid">${cardHtml(music,state.music)}</div>`;
    if(tab==='frames')html=`<div class="cv-p24-grid">${cardHtml(frames,state.frame)}</div>`;
    if(tab==='domain')html=`<div class="cv-p24-controls"><input id="cvP24Domain" placeholder="yourdomain.com" value="${String(state.customDomain).replace(/"/g,'&quot;')}"><button class="cv-p24-btn primary" id="cvP24SaveDomain">Save Domain</button></div><div class="cv-p24-domain-note">Custom domain configuration is stored with the project. Final DNS/hosting connection is completed at your hosting provider.</div><div class="cv-p24-status" id="cvP24DomainStatus">${state.customDomain?`Saved domain: ${state.customDomain}.`:'No custom domain saved.'}</div>`;
    host.innerHTML=html;
    host.querySelectorAll('[data-p24-value]').forEach(btn=>btn.onclick=()=>{const k=btn.dataset.p24Value;if(tab==='templates')applyTemplate(k);if(tab==='animations')applyAnimation(k);if(tab==='music')musicChoice(k);if(tab==='frames')applyFrame(k);render(tab)});
    $('cvP24SaveDomain')?.addEventListener('click',domain);
  }
  function mount(){if($('cvP24Panel'))return;const anchor=document.querySelector('.edbar')||document.querySelector('.customizer-header')||document.querySelector('main');if(!anchor)return;const panel=document.createElement('section');panel.id='cvP24Panel';panel.className='cv-p24-panel';panel.innerHTML=`<div class="cv-p24-head"><div><div class="cv-p24-title">✨ Premium Studio</div><div class="cv-p24-status">Phase 24 premium controls</div></div><span class="cv-p24-badge" id="cvP24Badge">${state.unlocked?'Premium Preview':'Premium Locked'}</span></div><div class="cv-p24-tabs"><button class="cv-p24-tab active" data-p24-tab="templates">Templates</button><button class="cv-p24-tab" data-p24-tab="animations">Animations</button><button class="cv-p24-tab" data-p24-tab="music">Music</button><button class="cv-p24-tab" data-p24-tab="frames">Frames</button><button class="cv-p24-tab" data-p24-tab="domain">Custom Domain</button></div><div id="cvP24Content"></div><div class="cv-p24-controls"><button type="button" class="cv-p24-btn primary" id="cvP24PreviewPremium">✨ Preview Premium</button><button type="button" class="cv-p24-btn" id="cvP24BrandBtn">${state.brandingRemoved?'✓ Branding Removed':'Remove Branding'}</button></div><div class="cv-p24-domain-note">Premium features are available in preview mode now. Real payment/unlock is intentionally left for the final payment phase.</div>`;anchor.parentNode.insertBefore(panel,anchor.nextSibling);
    panel.querySelectorAll('[data-p24-tab]').forEach(tab=>tab.onclick=()=>{panel.querySelectorAll('.cv-p24-tab').forEach(x=>x.classList.remove('active'));tab.classList.add('active');render(tab.dataset.p24Tab)});
    $('cvP24PreviewPremium').onclick=()=>{state.unlocked=!state.unlocked;save();$('cvP24Badge').textContent=state.unlocked?'Premium Preview':'Premium Locked';$('cvP24PreviewPremium').textContent=state.unlocked?'✓ Premium Preview On':'✨ Preview Premium';render('templates');toast(state.unlocked?'Premium preview enabled — all Phase 24 controls are testable.':'Premium preview locked.');};
    $('cvP24BrandBtn').onclick=branding;render('templates');
    if(state.brandingRemoved)document.body.classList.add('cv-p24-branding-off');
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,500));
  document.addEventListener('cv:projectLoaded',()=>setTimeout(mount,100));
  window.CelebrateVersePremium={state,applyTemplate,applyAnimation,applyFrame,branding};
})();
