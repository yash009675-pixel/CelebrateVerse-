/* CelebrateVerse UI-06 — AI Assistant + Audio workspace */
(function(){
  'use strict';
  const wait=fn=>{if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(fn,250));else setTimeout(fn,250)};
  const css=`
    #stableEditor.cv-ui06 .ui06-panel{display:none;padding:10px 8px;color:#e5e7eb}
    #stableEditor.cv-ui06 .ui06-panel.active{display:block}
    #stableEditor.cv-ui06 .ui06-panel h3{margin:3px 0 10px;font-size:15px;color:#fff}
    #stableEditor.cv-ui06 .ui06-panel p{font-size:11px;line-height:1.45;color:#9ca3af}
    #stableEditor.cv-ui06 .ui06-panel label{display:block;font-size:10px;color:#aeb6c7;margin:9px 0 5px}
    #stableEditor.cv-ui06 .ui06-panel textarea,#stableEditor.cv-ui06 .ui06-panel input,#stableEditor.cv-ui06 .ui06-panel select{width:100%;box-sizing:border-box;border:1px solid rgba(255,255,255,.10);background:#0b0d14;color:#f8fafc;border-radius:8px;padding:8px;font:inherit;font-size:11px;outline:none}
    #stableEditor.cv-ui06 .ui06-panel textarea{resize:vertical;min-height:72px}
    #stableEditor.cv-ui06 .ui06-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
    #stableEditor.cv-ui06 .ui06-btn{width:100%;border:1px solid rgba(255,255,255,.10);background:#181b27;color:#e5e7eb;border-radius:8px;padding:8px 7px;cursor:pointer;font-size:10px;font-weight:700}
    #stableEditor.cv-ui06 .ui06-btn:hover{background:#24283a;border-color:rgba(139,92,246,.45)}
    #stableEditor.cv-ui06 .ui06-btn.primary{background:#8b5cf6;border-color:#8b5cf6;color:#fff}
    #stableEditor.cv-ui06 .ui06-status{margin-top:8px;padding:8px;border-radius:8px;background:rgba(255,255,255,.04);font-size:10px;color:#cbd5e1;line-height:1.45;min-height:16px}
    #stableEditor.cv-ui06 .ui06-swatches{display:flex;gap:5px;flex-wrap:wrap;margin-top:7px}
    #stableEditor.cv-ui06 .ui06-swatch{width:31px;height:31px;border-radius:7px;border:1px solid rgba(255,255,255,.16);cursor:pointer}
    #stableEditor.cv-ui06 .ui06-audio-list{display:grid;gap:6px;margin-top:8px}
    #stableEditor.cv-ui06 .ui06-track{border:1px solid rgba(255,255,255,.08);background:#151824;border-radius:9px;padding:8px;display:flex;align-items:center;gap:7px}
    #stableEditor.cv-ui06 .ui06-track .meta{min-width:0;flex:1}.ui06-track strong{display:block;font-size:10px;color:#fff}.ui06-track small{display:block;color:#8f98aa;font-size:9px;margin-top:2px}
    #stableEditor.cv-ui06 .ui06-lock{font-size:8px;color:#fbbf24;border:1px solid rgba(251,191,36,.25);border-radius:5px;padding:2px 4px}
    #stableEditor.cv-ui06 .ui06-player{margin-top:10px;padding:9px;border:1px solid rgba(255,255,255,.08);border-radius:10px;background:#0d1018}
    #stableEditor.cv-ui06 .ui06-player-row{display:flex;align-items:center;gap:6px}.ui06-time{font-size:9px;color:#9ca3af;min-width:34px;text-align:center}
    #stableEditor.cv-ui06 .ui06-player input[type=range]{padding:0;border:0;background:transparent}
    #stableEditor.cv-ui06 .ui06-seek{width:100%;margin:7px 0}.ui06-volume{width:74px!important}
    @media(max-width:600px){#stableEditor.cv-ui06 .ui06-grid{grid-template-columns:1fr}}
  `;
  function makeWav(kind){
    const rate=22050,dur=5,n=rate*dur,buf=new ArrayBuffer(44+n*2),v=new DataView(buf),freq=kind==='Birthday Spark'?[523.25,659.25,783.99]:kind==='Memory Lane'?[261.63,329.63,392]:[220,277.18,329.63];
    const ws=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i))};
    ws(0,'RIFF');v.setUint32(4,36+n*2,true);ws(8,'WAVE');ws(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,rate,true);v.setUint32(28,rate*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);ws(36,'data');v.setUint32(40,n*2,true);
    for(let i=0;i<n;i++){const t=i/rate,env=Math.min(1,t*8,(dur-t)*5),f=freq[Math.floor(t*2)%freq.length],sample=Math.sin(2*Math.PI*f*t)*.22*env+Math.sin(2*Math.PI*f*2*t)*.07*env;v.setInt16(44+i*2,Math.max(-1,Math.min(1,sample))*32767,true)}
    return URL.createObjectURL(new Blob([buf],{type:'audio/wav'}));
  }
  function mount(){
    const root=document.getElementById('stableEditor'),left=root?.querySelector('.ed-left'),preview=document.getElementById('cvPreviewContent');
    if(!root||!left||!preview||root.dataset.ui06==='1')return false;
    root.dataset.ui06='1';root.classList.add('cv-ui06');
    const style=document.createElement('style');style.id='cv-ui06-style';style.textContent=css;document.head.appendChild(style);
    const oldAi=document.getElementById('p15AiPanel');if(oldAi)oldAi.style.display='none';
    const ai=document.createElement('section');ai.id='ui06AiPanel';ai.className='ui06-panel';
    ai.innerHTML=`<h3>AI Assistant ✦</h3><p>Describe the mood or result you want. Your existing editor tools stay in control.</p><label>Design prompt</label><textarea id="ui06Prompt" placeholder="Create a romantic purple anniversary design"></textarea><div class="ui06-grid"><button class="ui06-btn primary" id="ui06Design">✨ Design Assistant</button><button class="ui06-btn" id="ui06Suggest">💡 Suggestions</button><button class="ui06-btn" id="ui06Auto">↔ Auto Layout</button><button class="ui06-btn" id="ui06Colors">🎨 Colors from Photo</button></div><label>AI text generator</label><select id="ui06TextType"><option value="love">Love Letter</option><option value="birthday">Birthday Wish</option><option value="anniversary">Anniversary Message</option><option value="surprise">Surprise Message</option></select><button class="ui06-btn primary" id="ui06Text" style="margin-top:6px">✨ Generate Text</button><div class="ui06-swatches" id="ui06Swatches"></div><div class="ui06-status" id="ui06Status">Ready.</div>`;
    const audio=document.createElement('section');audio.id='ui06AudioPanel';audio.className='ui06-panel';
    audio.innerHTML=`<h3>Audio ♪</h3><label>Search audio</label><input id="ui06AudioSearch" placeholder="Search music or mood…"><div class="ui06-grid" style="margin-top:6px"><button class="ui06-btn active" data-ui06filter="free">Free</button><button class="ui06-btn" data-ui06filter="pro">PRO 🔒</button></div><div class="ui06-audio-list" id="ui06AudioList"></div><label>Upload your audio</label><input id="ui06AudioUpload" type="file" accept="audio/*"><div class="ui06-player"><div class="ui06-player-row"><button class="ui06-btn" id="ui06Play" style="width:58px">▶ Play</button><span class="ui06-time" id="ui06Current">0:00</span><input class="ui06-seek" id="ui06Seek" type="range" min="0" max="100" value="0"><span class="ui06-time" id="ui06Duration">0:00</span></div><div class="ui06-player-row"><button class="ui06-btn" id="ui06Loop" style="width:58px">Loop</button><input class="ui06-volume" id="ui06Volume" type="range" min="0" max="1" step=".01" value=".8"><span style="font-size:9px;color:#9ca3af">Volume</span></div><audio id="ui06Audio" preload="metadata"></audio></div><div class="ui06-status" id="ui06AudioStatus">Choose a track or upload audio.</div>`;
    left.append(ai,audio);
    const nav=()=>root.querySelectorAll('.cv-ui01-nav button');
    function show(kind){ai.classList.toggle('active',kind==='ai');audio.classList.toggle('active',kind==='audio');nav().forEach(b=>b.classList.toggle('active',b.dataset.ui01cat===kind));}
    nav().forEach(b=>{b.addEventListener('click',()=>{const k=b.dataset.ui01cat;if(k==='ai'||k==='audio')show(k);else{ai.classList.remove('active');audio.classList.remove('active')}})});
    const status=ai.querySelector('#ui06Status');
    const fire=()=>document.dispatchEvent(new CustomEvent('cv:changed'));
    function design(){const p=ai.querySelector('#ui06Prompt').value.toLowerCase();let bg='linear-gradient(135deg,#5b0b45,#1b102b)',color='#fce7f3',m='romantic';if(p.includes('purple')){bg='linear-gradient(135deg,#4c1d95,#7e22ce)';color='#f3e8ff';m='purple'}else if(p.includes('birthday')){bg='linear-gradient(135deg,#f97316,#ec4899)';color='#fff7ed';m='birthday'}else if(p.includes('minimal')){bg='linear-gradient(135deg,#fff,#e5e7eb)';color='#111827';m='minimal'}else if(p.includes('galaxy')||p.includes('space')){bg='radial-gradient(circle at 20% 10%,#312e81,#020617 70%)';color='#c4b5fd';m='galaxy'}preview.style.background=bg;preview.style.color=color;status.textContent='Design mood applied: '+m+'. Colors and visual direction updated.';fire()}
    ai.querySelector('#ui06Design').onclick=design;
    ai.querySelector('#ui06Suggest').onclick=()=>{const n=preview.querySelectorAll('.editem').length;status.textContent=n<3?'Suggestion: add a heading, photo and one decorative element for a balanced celebration.':'Suggestion: your canvas has good content. Try Auto Layout to balance spacing.'};
    ai.querySelector('#ui06Auto').onclick=()=>{const els=[...preview.querySelectorAll('.editem')];if(!els.length){status.textContent='Add elements first.';return}const cols=Math.ceil(Math.sqrt(els.length));els.forEach((e,i)=>{e.style.left=(8+(i%cols)*(82/Math.max(cols-1,1)))+'%';e.style.top=(10+Math.floor(i/cols)*22)+'%'});status.textContent='Auto Layout applied.';fire()};
    ai.querySelector('#ui06Text').onclick=()=>{const type=ai.querySelector('#ui06TextType').value;const texts={love:'Every moment with you feels like my favourite memory. Forever & Always ❤️',birthday:'Happy Birthday! May your day be filled with love, laughter and beautiful memories 🎂✨',anniversary:'Happy Anniversary to our beautiful journey. Here’s to every memory and every tomorrow ❤️',surprise:'A little surprise, made especially for you. Get ready for something magical 🎁✨'};const target=root.querySelector('#edText');const active=root.querySelector('.editem.active');if(target&&active){target.value=texts[type];target.dispatchEvent(new Event('input',{bubbles:true}))}else{const el=document.createElement('div');el.className='editem';el.textContent=texts[type];el.dataset.text=texts[type];el.style.left='12%';el.style.top='45%';el.style.fontSize='28px';preview.append(el);el.click?.()}status.textContent='Text generated and added to your design.';fire()};
    ai.querySelector('#ui06Colors').onclick=()=>{const img=preview.querySelector('.editem.photo img')||preview.querySelector('img');if(!img){status.textContent='Select or upload a photo first.';return}try{const c=document.createElement('canvas'),x=c.getContext('2d');c.width=c.height=32;x.drawImage(img,0,0,32,32);const d=x.getImageData(0,0,32,32).data,cols=[];for(let i=0;i<d.length;i+=64)cols.push(`rgb(${d[i]},${d[i+1]},${d[i+2]})`);const unique=[...new Set(cols)].slice(0,5),sw=ai.querySelector('#ui06Swatches');sw.innerHTML='';unique.forEach(col=>{const b=document.createElement('button');b.className='ui06-swatch';b.title=col;b.style.background=col;b.onclick=()=>{preview.style.background=col;fire()};sw.append(b)});status.textContent='Palette extracted from the selected photo.'}catch(e){status.textContent='Palette extraction needs a locally available photo.'}};
    const tracks=[['Soft Piano','Calm • Romantic','free'],['Memory Lane','Warm • Memories','free'],['Birthday Spark','Bright • Celebration','free'],['Cinematic Heart','Cinematic • Emotional','pro'],['Luxury Evening','Elegant • Premium','pro'],['Galaxy Dream','Ambient • Premium','pro']];
    let filter='free',audioEl=audio.querySelector('#ui06Audio'),currentUrl='';
    function renderTracks(){const q=audio.querySelector('#ui06AudioSearch').value.toLowerCase(),list=audio.querySelector('#ui06AudioList');list.innerHTML='';tracks.filter(t=>(t[2]===filter)&&(!q||t[0].toLowerCase().includes(q)||t[1].toLowerCase().includes(q))).forEach(t=>{const row=document.createElement('div');row.className='ui06-track';row.innerHTML=`<div class="meta"><strong>${t[0]}</strong><small>${t[1]}</small></div>${t[2]==='pro'?'<span class="ui06-lock">🔒 PRO</span>':'<button class="ui06-btn" style="width:52px">Play</button>'}`;if(t[2]==='free')row.querySelector('button').onclick=()=>loadTrack(t[0]);list.append(row)})}
    function loadTrack(name){if(currentUrl)URL.revokeObjectURL(currentUrl);currentUrl=makeWav(name);audioEl.src=currentUrl;audioEl.loop=false;audioEl.play().catch(()=>{});audio.querySelector('#ui06Play').textContent='❚❚ Pause';audio.querySelector('#ui06AudioStatus').textContent='Playing: '+name;localStorage.setItem('celebrateVerseAudio',JSON.stringify({name,type:'generated'}));fire()}
    audio.querySelectorAll('[data-ui06filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.ui06filter;audio.querySelectorAll('[data-ui06filter]').forEach(x=>x.classList.toggle('active',x===b));renderTracks()});audio.querySelector('#ui06AudioSearch').oninput=renderTracks;
    audio.querySelector('#ui06AudioUpload').onchange=e=>{const f=e.target.files?.[0];if(!f)return;if(currentUrl)URL.revokeObjectURL(currentUrl);currentUrl=URL.createObjectURL(f);audioEl.src=currentUrl;audio.querySelector('#ui06AudioStatus').textContent='Loaded: '+f.name;audioEl.play().catch(()=>{});audio.querySelector('#ui06Play').textContent='❚❚ Pause';fire()};
    audio.querySelector('#ui06Play').onclick=()=>{if(!audioEl.src){audio.querySelector('#ui06AudioStatus').textContent='Choose a track or upload audio first.';return}if(audioEl.paused){audioEl.play();audio.querySelector('#ui06Play').textContent='❚❚ Pause'}else{audioEl.pause();audio.querySelector('#ui06Play').textContent='▶ Play'}};
    audio.querySelector('#ui06Loop').onclick=()=>{audioEl.loop=!audioEl.loop;audio.querySelector('#ui06Loop').classList.toggle('active',audioEl.loop)};
    audio.querySelector('#ui06Volume').oninput=e=>audioEl.volume=Number(e.target.value);
    const fmt=s=>{s=Number(s)||0;return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0')};
    audioEl.addEventListener('loadedmetadata',()=>audio.querySelector('#ui06Duration').textContent=fmt(audioEl.duration));audioEl.addEventListener('timeupdate',()=>{audio.querySelector('#ui06Current').textContent=fmt(audioEl.currentTime);audio.querySelector('#ui06Seek').value=audioEl.duration?(audioEl.currentTime/audioEl.duration)*100:0});audioEl.addEventListener('ended',()=>audio.querySelector('#ui06Play').textContent='▶ Play');audio.querySelector('#ui06Seek').oninput=e=>{if(audioEl.duration)audioEl.currentTime=(Number(e.target.value)/100)*audioEl.duration};
    renderTracks();show('ai');
    return true;
  }
  wait(()=>{const timer=setInterval(()=>{if(mount())clearInterval(timer)},150);setTimeout(()=>clearInterval(timer),10000)});
})();