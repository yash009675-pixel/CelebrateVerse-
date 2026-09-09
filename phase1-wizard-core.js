/* CelebrateVerse — Phase 1 Wizard Core
   One controller for the 1→5 guided flow.
   Loaded after customize.js so it owns the visible navigation. */
(function(){
  "use strict";
  function boot(){
    const form=document.getElementById("celebrationForm");
    if(!form) return;

    let step=1, total=5;
    const $=id=>document.getElementById(id);
    const occasion=$("occasion"), relationship=$("relationship"), theme=$("theme");
    const person=$("personName"), customer=$("customerName"), date=$("specialDate"), email=$("email");

    const oldNext=$("nextBtn"), oldPrev=$("prevBtn");
    if(!oldNext||!oldPrev) return;
    const next=oldNext.cloneNode(true), prev=oldPrev.cloneNode(true);
    oldNext.replaceWith(next); oldPrev.replaceWith(prev);

    function cards(selector,input){
      form.querySelectorAll(selector).forEach(card=>{
        card.addEventListener("click",function(e){
          e.preventDefault();
          form.querySelectorAll(selector).forEach(x=>x.classList.remove("selected"));
          this.classList.add("selected");
          if(input) input.value=this.dataset.value||"";
          localStorage.setItem("celebrateVerseCustomization",JSON.stringify({
            ...(JSON.parse(localStorage.getItem("celebrateVerseCustomization")||"{}")),
            ...(input===occasion?{occasion:input.value}:{}),
            ...(input===relationship?{relationship:input.value}:{}),
            ...(input===theme?{theme:input.value}:{})
          }));
        });
      });
    }
    cards(".occasion-selection .selection-card",occasion);
    cards(".relationship-selection .selection-card",relationship);
    cards(".theme-card",theme);

    function valid(){
      if(step===1 && !occasion?.value){alert("Please select an occasion.");return false;}
      if(step===2 && !relationship?.value){alert("Please select who this celebration is for.");return false;}
      if(step===3 && !theme?.value){alert("Please choose a website style.");return false;}
      if(step===4){
        if(!person?.value.trim()||!customer?.value.trim()||!date?.value||!email?.value.trim()){
          alert("Please complete all required details."); return false;
        }
        if(!email.checkValidity()){alert("Please enter a valid email address.");email.focus();return false;}
      }
      return true;
    }

    function render(){
      form.querySelectorAll(".form-step").forEach(s=>{
        const active=Number(s.dataset.step)===step;
        s.classList.toggle("active",active);
        s.style.display=active?"block":"none";
        s.style.visibility=active?"visible":"hidden";
        s.style.opacity=active?"1":"0";
        s.style.pointerEvents=active?"auto":"none";
      });
      form.querySelectorAll(".progress-step").forEach(p=>{
        const n=Number(p.dataset.step), active=n===step;
        p.classList.toggle("active",n<=step);
        p.style.cursor=(n<=step+1)?"pointer":"default";
      });
      const fill=$("progressFill");
      if(fill) fill.style.width=(((step-1)/(total-1))*100)+"%";
      prev.textContent=step===1?"Back to Home":"Back";
      next.textContent=step===total?"✨ Open Live Edit Studio":"Continue";
      next.disabled=false; prev.disabled=false;
      window.scrollTo({top:0,behavior:"smooth"});
    }

    next.addEventListener("click",e=>{
      e.preventDefault(); e.stopImmediatePropagation();
      if(step<total){ if(valid()){step++;render();} }
      else if(valid()){ form.dispatchEvent(new CustomEvent("celebrateverse:open-edit-studio",{bubbles:true,detail:{source:"phase1",step:5}})); }
    });
    prev.addEventListener("click",e=>{
      e.preventDefault(); e.stopImmediatePropagation();
      if(step===1) location.href="index.html"; else {step--;render();}
    });

    form.querySelectorAll(".progress-step").forEach(p=>{
      const clone=p.cloneNode(true); p.replaceWith(clone);
      clone.addEventListener("click",e=>{
        e.preventDefault();
        const target=Number(clone.dataset.step);
        if(!target||target===step) return;
        if(target>step){
          // Allow moving forward only after the current step is complete.
          if(!valid()) return;
        }
        step=target; render();
      });
    });

    // Restore saved card selections without relying on another script's state.
    try{
      const saved=JSON.parse(localStorage.getItem("celebrateVerseCustomization")||"{}");
      [[occasion,saved.occasion,".occasion-selection .selection-card"],
       [relationship,saved.relationship,".relationship-selection .selection-card"],
       [theme,saved.theme,".theme-card"]].forEach(([input,val,sel])=>{
        if(input&&val){input.value=val; const c=form.querySelector(sel+'[data-value="'+CSS.escape(val)+'"]'); if(c)c.classList.add("selected");}
      });
    }catch(_){}
    // Customize is intentionally a setup page, never an editor workspace.
    document.querySelectorAll("#stableEditor,#celebrationLivePreview,.cv-live-preview-section,[data-editor-shell]").forEach(el=>{
      el.style.display="none";
    });
    render();
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot,{once:true}); else boot();
})();