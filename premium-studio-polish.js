/* CelebrateVerse — Premium Studio visual layer */
(function(){
  'use strict';
  function mount(){
    if(document.getElementById('cvPremiumStudioStyle')) return;
    const root=document.getElementById('stableEditor');
    if(!root) return setTimeout(mount,120);
    const s=document.createElement('style');s.id='cvPremiumStudioStyle';s.textContent=`
      :root{--cvp-violet:#8b5cf6;--cvp-pink:#ec4899;--cvp-panel:rgba(17,19,29,.82)}
      body{background:#070811!important}
      #stableEditor.cv-ui01{margin:18px auto 50px!important;max-width:1500px!important}
      #stableEditor.cv-ui01 .ed-head{
        height:72px!important;padding:0 20px!important;border-radius:18px!important;
        background:linear-gradient(135deg,rgba(24,20,42,.96),rgba(13,15,26,.96))!important;
        border:1px solid rgba(255,255,255,.12)!important;
        box-shadow:0 20px 70px rgba(0,0,0,.38),inset 0 1px rgba(255,255,255,.06)!important
      }
      #stableEditor.cv-ui01 .ed-head h2:after{font-size:19px!important;letter-spacing:-.02em}
      #stableEditor.cv-ui01 .ed-head:after{content:'LIVE DESIGN STUDIO  •  Your changes appear instantly';margin-left:auto;font-size:10px;font-weight:700;letter-spacing:.08em;color:#c4b5fd;padding:8px 12px;border:1px solid rgba(167,139,250,.22);border-radius:999px;background:rgba(139,92,246,.09)}
      #stableEditor.cv-ui01 .ed{
        margin-top:12px!important;border-radius:20px!important;
        border:1px solid rgba(255,255,255,.11)!important;
        background:linear-gradient(145deg,#0d0f18,#090a10)!important;
        box-shadow:0 30px 100px rgba(0,0,0,.45)!important;overflow:hidden!important
      }
      #stableEditor.cv-ui01 .ed-left{background:linear-gradient(180deg,#121421,#0e1018)!important}
      #stableEditor.cv-ui01 .ed-right{background:linear-gradient(180deg,#141621,#10121b)!important}
      #stableEditor.cv-ui01 .ed-main{background:#080a11!important}
      #stableEditor.cv-ui01 .edbar{height:52px!important;padding:0 14px!important;background:rgba(15,17,26,.94)!important}
      #stableEditor.cv-ui01 .ed-align{min-height:44px!important;background:rgba(10,12,19,.94)!important}
      #stableEditor.cv-ui01 #edCanvasWrap{
        min-height:680px!important;padding:34px!important;
        background:
          radial-gradient(circle at 50% 35%,rgba(139,92,246,.10),transparent 34%),
          radial-gradient(circle at 85% 80%,rgba(236,72,153,.07),transparent 28%),
          #070910!important
      }
      #stableEditor.cv-ui01 #edCanvas{
        width:min(760px,92%)!important;min-height:600px!important;
        border-radius:26px!important;
        border:1px solid rgba(255,255,255,.16)!important;
        box-shadow:0 35px 100px rgba(0,0,0,.58),0 0 0 8px rgba(255,255,255,.018)!important;
        background:linear-gradient(145deg,#191426,#090b14)!important
      }
      #stableEditor.cv-ui01 #edCanvas:after{
        content:'Drag, drop & design';position:absolute;bottom:14px;left:50%;transform:translateX(-50%);
        font:600 9px system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;
        color:rgba(255,255,255,.35);pointer-events:none
      }
      #stableEditor.cv-ui01 .cv-ui01-nav button{
        min-height:62px!important;border:1px solid transparent!important;
        transition:.2s ease!important
      }
      #stableEditor.cv-ui01 .cv-ui01-nav button.active{
        background:linear-gradient(135deg,rgba(139,92,246,.25),rgba(236,72,153,.12))!important;
        border-color:rgba(167,139,250,.25)!important;box-shadow:inset 0 0 24px rgba(139,92,246,.07)!important
      }
      #stableEditor.cv-ui01 .cv-ui01-top-primary{
        background:linear-gradient(135deg,#7c3aed,#ec4899)!important;
        box-shadow:0 8px 24px rgba(139,92,246,.28)!important;border-radius:10px!important
      }
      #stableEditor.cv-ui01 .ed-right .ed-panel,#stableEditor.cv-ui01 .ed-right .ed-layers{
        background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);
        border-radius:14px;padding:12px;margin-bottom:10px
      }
      #stableEditor.cv-ui01 .ed button{transition:transform .15s ease,background .15s ease,border-color .15s ease}
      #stableEditor.cv-ui01 .ed button:hover{transform:translateY(-1px)}
      @media(max-width:600px){
        #stableEditor.cv-ui01{margin:8px 0 35px!important}
        #stableEditor.cv-ui01 .ed-head{height:auto!important;min-height:70px!important;padding:14px!important;flex-wrap:wrap!important}
        #stableEditor.cv-ui01 .ed-head:after{width:100%;margin:0!important;text-align:center;box-sizing:border-box}
        #stableEditor.cv-ui01 #edCanvasWrap{min-height:620px!important;padding:18px 10px!important}
        #stableEditor.cv-ui01 #edCanvas{width:calc(100% - 8px)!important;min-height:560px!important;border-radius:20px!important}
        #stableEditor.cv-ui01 .edbar{overflow-x:auto!important}
      }
    `;document.head.appendChild(s);
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,1600));
})();