const CACHE_NAME="celebrateverse-v40";
const APP_SHELL=[
  "./","./index.html","./login.html","./signup.html","./dashboard.html","./profile.html","./account.html","./customize.html","./celebration.html","./payment.html","./success.html","./offline.html",
  "./style.css","./mobile-fix.css","./canva-editor.css","./stable-editor.css",
  "./main.js","./auth.js","./dashboard.js","./profile.js","./customize.js","./stable-editor.js","./projects-publish.js","./editor-enhancements.js","./editor-mobile-polish.js",
  "./ui01-editor-shell.js","./ui02-templates-elements.js","./ui03-text-photo.js","./ui04-contextual-properties.js","./ui05-pages-timeline.js","./ui06-ai-audio.js","./ui07-11-workspace.js",
  "./phase16-ready-blocks.js","./phase17-colors-branding.js","./phase18-responsive-design.js","./phase19-interactions.js","./phase20-export-system.js","./phase21-qr-sharing.js",
  "./phase22-cloud-version-history.js","./phase23-collaboration.js","./phase24-premium.js","./supabase.js","./manifest.json"
];

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache=>{
      await Promise.allSettled(APP_SHELL.map(async url=>{
        try{const r=await fetch(url,{cache:"no-cache"});if(r.ok)await cache.put(url,r);}catch(_){}
      }));
    }).then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  const url=new URL(event.request.url);
  if(url.origin!==location.origin)return;

  // Never turn a normal online page navigation into the offline screen just
  // because a query string/version changed. Always try the live page first.
  if(event.request.mode==="navigate"){
    event.respondWith(
      fetch(event.request,{cache:"no-cache"})
        .then(response=>{
          if(response.ok){
            const copy=response.clone();
            caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));
          }
          return response;
        })
        .catch(async()=>{
          const cache=await caches.open(CACHE_NAME);
          const cached=await cache.match(event.request,{ignoreSearch:true});
          return cached||await cache.match("./offline.html");
        })
    );
    return;
  }

  // Static files: live first, then cache. This prevents stale JS/CSS from
  // trapping the editor after a deployment.
  event.respondWith(
    fetch(event.request,{cache:"no-cache"})
      .then(response=>{
        if(response.ok){
          const copy=response.clone();
          caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));
        }
        return response;
      })
      .catch(()=>caches.match(event.request,{ignoreSearch:true}).then(c=>c||new Response("",{status:503,statusText:"Offline"})))
  );
});