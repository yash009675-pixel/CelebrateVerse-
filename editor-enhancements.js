document.addEventListener('DOMContentLoaded',()=>{
  const preview=document.getElementById('cvPreviewContent'); if(!preview)return;
  const style=document.createElement('style'); style.textContent='.editem{position:absolute;box-sizing:border-box}.ed-resize-handle{position:absolute;width:10px;height:10px;border:2px solid currentColor;background:#fff;border-radius:3px;z-index:9999;display:block}.ed-resize-handle.nw{left:-6px;top:-6px;cursor:nwse-resize}.ed-resize-handle.n{left:50%;top:-6px;transform:translateX(-50%);cursor:ns-resize}.ed-resize-handle.ne{right:-6px;top:-6px;cursor:nesw-resize}.ed-resize-handle.e{right:-6px;top:50%;transform:translateY(-50%);cursor:ew-resize}.ed-resize-handle.se{right:-6px;bottom:-6px;cursor:nwse-resize}.ed-resize-handle.s{left:50%;bottom:-6px;transform:translateX(-50%);cursor:ns-resize}.ed-resize-handle.sw{left:-6px;bottom:-6px;cursor:nesw-resize}.ed-resize-handle.w{left:-6px;top:50%;transform:translateY(-50%);cursor:ew-resize}'; document.head.append(style);
  let handles=[];
  const removeHandles=()=>{handles.forEach(h=>h.remove());handles=[]};
  const addHandles=el=>{
    removeHandles(); if(!el||!el.classList.contains('editem'))return;
    const positions=['nw','n','ne','e','se','s','sw','w'];
    positions.forEach(pos=>{
      const h=document.createElement('i'); h.className='ed-resize-handle '+pos; h.dataset.resize=pos; h.setAttribute('aria-label','Resize');
      h.addEventListener('pointerdown',e=>{
        e.preventDefault();e.stopPropagation();
        const startX=e.clientX,startY=e.clientY,startW=el.offsetWidth,startH=el.offsetHeight,startL=el.offsetLeft,startT=el.offsetTop;
        const move=v=>{
          const dx=v.clientX-startX,dy=v.clientY-startY; let w=startW,h=startH,l=startL,t=startT;
          if(pos.includes('e'))w=startW+dx;if(pos.includes('w')){w=startW-dx;l=startL+dx}
          if(pos.includes('s'))h=startH+dy;if(pos.includes('n')){h=startH-dy;t=startT+dy}
          w=Math.max(40,w);h=Math.max(40,h);el.style.width=w+'px';el.style.height=h+'px';
          if(pos.includes('w'))el.style.left=Math.max(0,l)+'px'; if(pos.includes('n'))el.style.top=Math.max(0,t)+'px';
        };
        const up=()=>{document.removeEventListener('pointermove',move);document.removeEventListener('pointerup',up);document.dispatchEvent(new CustomEvent('cv:changed'))};
        document.addEventListener('pointermove',move);document.addEventListener('pointerup',up);
      }); el.append(h);
    }); handles=[...el.querySelectorAll('.ed-resize-handle')];
  };
  const sync=()=>{const active=preview.querySelector('.editem.active');addHandles(active)};
  new MutationObserver(sync).observe(preview,{subtree:true,attributes:true,attributeFilter:['class']});
  preview.addEventListener('click',e=>{const el=e.target.closest('.editem');if(el)setTimeout(()=>addHandles(el),0);else removeHandles()});
  window.addEventListener('resize',sync); sync();
});