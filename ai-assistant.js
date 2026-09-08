(function(){
function boot(){
if(window.__cvAIReady)return;
window.__cvAIReady=true;
const style=document.createElement("style");style.textContent=`
#cvAI{position:fixed !important;right:18px !important;bottom:calc(18px + env(safe-area-inset-bottom)) !important;z-index:2147483647 !important;font-family:DM Sans,system-ui,sans-serif}
#cvAI .cv-ai-fab{display:flex;align-items:center;justify-content:center;appearance:none;-webkit-appearance:none;width:58px;height:58px;border:0;border-radius:50%;cursor:pointer;color:#fff;font-size:25px;background:linear-gradient(135deg,#7c3aed,#ec4899);box-shadow:0 12px 35px rgba(124,58,237,.45)}
#cvAI .cv-ai-panel{position:absolute;right:0;bottom:70px;width:min(360px,calc(100vw - 28px));height:min(520px,70vh);display:none;flex-direction:column;overflow:hidden;border:1px solid rgba(255,255,255,.14);border-radius:22px;background:rgba(13,14,25,.97);backdrop-filter:blur(18px);box-shadow:0 25px 80px rgba(0,0,0,.5);color:#f8fafc}
#cvAI.open .cv-ai-panel{display:flex}
#cvAI .cv-ai-head{padding:16px;border-bottom:1px solid rgba(255,255,255,.1);display:flex;align-items:center;gap:10px}
#cvAI .cv-ai-head b{font-size:16px}.cv-ai-head small{display:block;opacity:.6;font-size:11px}
#cvAI .cv-ai-close{margin-left:auto;border:0;background:none;color:#fff;font-size:20px;cursor:pointer}
#cvAI .cv-ai-messages{flex:1;overflow:auto;padding:14px}
#cvAI .cv-ai-msg{max-width:88%;padding:10px 12px;border-radius:14px;margin:7px 0;font-size:13px;line-height:1.5;white-space:pre-wrap}
#cvAI .bot{background:rgba(124,58,237,.16);border:1px solid rgba(124,58,237,.22)}#cvAI .user{margin-left:auto;background:linear-gradient(135deg,#7c3aed,#c026d3)}
#cvAI .cv-ai-quick{display:flex;gap:6px;overflow:auto;padding:0 12px 8px}.cv-ai-quick button{white-space:nowrap;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);color:#fff;border-radius:999px;padding:7px 9px;font-size:11px}
#cvAI .cv-ai-form{display:flex;gap:7px;padding:10px;border-top:1px solid rgba(255,255,255,.1)}#cvAI input{flex:1;min-width:0;border:1px solid rgba(255,255,255,.14);background:#191b29;color:#fff;border-radius:12px;padding:11px}#cvAI .send{border:0;border-radius:12px;padding:0 14px;color:#fff;background:#7c3aed}
@media(max-width:600px){#cvAI{right:12px;bottom:12px}#cvAI .cv-ai-fab{width:54px;height:54px}}
`;document.head.appendChild(style);
const root=document.createElement("div");root.id="cvAI";root.innerHTML=`<div class="cv-ai-panel"><div class="cv-ai-head"><span>✨</span><div><b>CelebrateVerse AI</b><small>Your celebration co-pilot</small></div><button class="cv-ai-close" aria-label="Close">×</button></div><div class="cv-ai-messages"></div><div class="cv-ai-quick"><button data-q="How do I use this page?">How to use</button><button data-q="Help me create a beautiful celebration">Create for me</button><button data-q="Suggest a message">Suggest message</button><button data-q="Something is not working">Fix an issue</button></div><form class="cv-ai-form"><input autocomplete="off" placeholder="Ask CelebrateVerse AI…"><button class="send">Send</button></form></div><button class="cv-ai-fab" aria-label="Open CelebrateVerse AI">✨</button>`;document.body.appendChild(root);
const msgs=root.querySelector(".cv-ai-messages"),input=root.querySelector("input"),add=(who,t)=>{const d=document.createElement("div");d.className="cv-ai-msg "+who;d.textContent=t;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight};
add("bot","Hi! 👋 I can guide you through CelebrateVerse, help write your celebration, suggest designs, or troubleshoot a feature.");
root.querySelector(".cv-ai-fab").onclick=()=>{root.classList.toggle("open");if(root.classList.contains("open"))input.focus()};
root.querySelector(".cv-ai-close").onclick=()=>root.classList.remove("open");
const context=()=>{const data=(()=>{try{return JSON.parse(localStorage.getItem("celebrateVerseCustomization")||"{}")}catch(_){return{}}})();return{page:location.pathname.split("/").pop()||"index.html",language:localStorage.getItem("cv_language")||localStorage.getItem("language")||"en",celebration:data,step:document.querySelector(".progress-step.active")?.dataset.step||null}};
async function ask(q){q=String(q||"").trim();if(!q)return;add("user",q);input.value="";add("bot","Thinking…");const pending=msgs.lastElementChild;try{if(!window.supabase||!supabaseClient)throw Error("AI connection is unavailable on this page.");const {data,error}=await supabaseClient.functions.invoke("celebrate-ai",{body:{message:q,context:context()}});pending.remove();if(error||data?.error)throw Error(data?.error||error?.message||"AI request failed.");add("bot",data.text||"I couldn't generate a response.");}catch(e){pending.textContent="I couldn't connect to AI right now. Please try again in a moment.";pending.title=e.message||""}}
root.querySelector(".cv-ai-form").onsubmit=e=>{e.preventDefault();ask(input.value)};
root.querySelectorAll(".cv-ai-quick button").forEach(b=>b.onclick=()=>ask(b.dataset.q));
})();