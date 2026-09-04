/* CelebrateVerse package flow — selection only.
   The main customize.js submit handler owns checkout creation. */
document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('celebrationForm');
  if(!form) return;

  const prices={basic:199,premium:399,ultimate:699};
  const input=document.getElementById('package');
  const preview=document.getElementById('previewPackage');

  const save=()=>{
    const data={package:input?.value||'',price:prices[input?.value]||0,savedAt:new Date().toISOString()};
    try{
      const existing=JSON.parse(localStorage.getItem('celebrateVerseCustomization')||'{}');
      localStorage.setItem('celebrateVerseCustomization',JSON.stringify({...existing,...data}));
    }catch(e){}
    document.dispatchEvent(new CustomEvent('cv:changed'));
  };

  form.querySelectorAll('.package-option').forEach(card=>{
    card.addEventListener('click',()=>{
      const value=card.dataset.value;
      if(input){
        input.value=value;
        input.dispatchEvent(new Event('change',{bubbles:true}));
      }
      form.querySelectorAll('.package-option').forEach(x=>x.classList.toggle('selected',x===card));
      if(preview) preview.textContent=value.charAt(0).toUpperCase()+value.slice(1)+' – ₹'+prices[value].toLocaleString('en-IN');
      save();
    });
  });

  if(input?.value){
    form.querySelector('.package-option[data-value="'+CSS.escape(input.value)+'"]')?.classList.add('selected');
  }
});
