/* CelebrateVerse Editor Enhancements v18
 * Resize handles, accessible selection helpers and safe change events.
 * The main editor owns history/state; this file only adds UI behavior.
 */
document.addEventListener('DOMContentLoaded', () => {
  const preview = document.getElementById('cvPreviewContent');
  if (!preview) return;

  const style = document.createElement('style');
  style.textContent = `
    #stableEditor .editem{position:absolute;box-sizing:border-box}
    #stableEditor .ed-resize-handle{position:absolute;width:10px;height:10px;border:2px solid currentColor;background:#fff;border-radius:3px;z-index:9999}
    #stableEditor .ed-resize-handle.nw{left:-6px;top:-6px;cursor:nwse-resize}
    #stableEditor .ed-resize-handle.n{left:50%;top:-6px;transform:translateX(-50%);cursor:ns-resize}
    #stableEditor .ed-resize-handle.ne{right:-6px;top:-6px;cursor:nesw-resize}
    #stableEditor .ed-resize-handle.e{right:-6px;top:50%;transform:translateY(-50%);cursor:ew-resize}
    #stableEditor .ed-resize-handle.se{right:-6px;bottom:-6px;cursor:nwse-resize}
    #stableEditor .ed-resize-handle.s{left:50%;bottom:-6px;transform:translateX(-50%);cursor:ns-resize}
    #stableEditor .ed-resize-handle.sw{left:-6px;bottom:-6px;cursor:nesw-resize}
    #stableEditor .ed-resize-handle.w{left:-6px;top:50%;transform:translateY(-50%);cursor:ew-resize}
  `;
  document.head.appendChild(style);

  let active = null;
  const remove = () => {
    preview.querySelectorAll('.ed-resize-handle').forEach(h => h.remove());
    active = null;
  };
  const attach = el => {
    if (!el || !el.classList.contains('editem')) return;
    preview.querySelectorAll('.ed-resize-handle').forEach(h => h.remove());
    active = el;
    if (el.dataset.lock === '1') return;
    ['nw','n','ne','e','se','s','sw','w'].forEach(pos => {
      const h = document.createElement('i');
      h.className = `ed-resize-handle ${pos}`;
      h.setAttribute('aria-label', `Resize ${pos}`);
      h.addEventListener('pointerdown', ev => {
        ev.preventDefault(); ev.stopPropagation();
        const startX=ev.clientX,startY=ev.clientY;
        const startW=el.offsetWidth,startH=el.offsetHeight;
        const startL=el.offsetLeft,startT=el.offsetTop;
        const move = e => {
          let w=startW,hgt=startH,l=startL,t=startT;
          const dx=e.clientX-startX,dy=e.clientY-startY;
          if(pos.includes('e')) w=startW+dx;
          if(pos.includes('s')) hgt=startH+dy;
          if(pos.includes('w')) {w=startW-dx;l=startL+dx;}
          if(pos.includes('n')) {hgt=startH-dy;t=startT+dy;}
          w=Math.max(28,w);hgt=Math.max(28,hgt);
          el.style.width=`${w}px`;el.style.height=`${hgt}px`;
          if(pos.includes('w')) el.style.left=`${Math.max(0,l)}px`;
          if(pos.includes('n')) el.style.top=`${Math.max(0,t)}px`;
        };
        const up=()=>{
          document.removeEventListener('pointermove',move);
          document.removeEventListener('pointerup',up);
          document.dispatchEvent(new CustomEvent('cv:changed'));
        };
        document.addEventListener('pointermove',move);document.addEventListener('pointerup',up);
      });
      el.appendChild(h);
    });
  };

  const sync=()=>attach(preview.querySelector('.editem.active'));
  const observer=new MutationObserver(sync);
  observer.observe(preview,{subtree:true,attributes:true,attributeFilter:['class','data-lock']});
  preview.addEventListener('click',e=>{
    const el=e.target.closest('.editem');
    if(el) setTimeout(()=>attach(el),0); else remove();
  });
  window.addEventListener('resize',sync);
  setTimeout(sync,0);
});
