document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('celebrationForm');
  const submit=document.getElementById('submitBtn');
  if(!form) return;

  const prices={basic:499,premium:999,ultimate:1999};
  const read=()=>Object.fromEntries(new FormData(form).entries());
  const save=()=>{
    const data=read();
    const key='cv_step5_draft';
    try{localStorage.setItem(key,JSON.stringify({...data,price:prices[data.package]||0,savedAt:new Date().toISOString()}));}catch(e){}
    document.dispatchEvent(new CustomEvent('cv:changed'));
  };

  form.querySelectorAll('.package-option').forEach(card=>{
    card.addEventListener('click',()=>{
      const value=card.dataset.value;
      const input=document.getElementById('package');
      if(input){input.value=value; input.dispatchEvent(new Event('change',{bubbles:true}));}
      form.querySelectorAll('.package-option').forEach(x=>x.classList.toggle('selected',x===card));
      const preview=document.getElementById('previewPackage');
      if(preview) preview.textContent=`${value.charAt(0).toUpperCase()+value.slice(1)} – ₹${prices[value].toLocaleString('en-IN')}`;
      save();
    });
  });

  form.addEventListener('change',save);
  form.addEventListener('input',()=>{clearTimeout(window.__cvStep5Save);window.__cvStep5Save=setTimeout(save,350);});

  // Temporary completion flow: payment is intentionally deferred until final launch.
  form.addEventListener('submit',e=>{
    e.preventDefault(); e.stopImmediatePropagation();
    save();
    const data=read();
    if(!data.package){alert('Please select a package first.'); return;}
    try{localStorage.setItem('cv_pending_checkout',JSON.stringify({...data,price:prices[data.package],status:'payment_pending'}));}catch(err){}
    if(submit){submit.disabled=false;submit.innerHTML='Saved! Payment will be enabled at final launch <i class="fa-solid fa-check"></i>';}
    alert(`Your ${data.package} package has been saved. Real payment will be added at the final launch stage.`);
  },true);
});