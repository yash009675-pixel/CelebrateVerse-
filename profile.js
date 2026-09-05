document.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabaseClient) { location.href="login.html"; return; }
  const { data:{ user } } = await supabaseClient.auth.getUser();
  if (!user) { location.href="login.html"; return; }

  const $ = id => document.getElementById(id);
  const escapeHtml = v => String(v ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const setMessage = (m, ok=false) => { $("profileMessage").textContent=m; $("profileMessage").className="cv-profile-message "+(ok?"success":"error"); };

  let { data: profile } = await supabaseClient.from("profiles").select("*").eq("id",user.id).maybeSingle();
  if (!profile) {
    const fallback = user.user_metadata?.full_name || user.email?.split("@")[0] || "CelebrateVerse User";
    const { data } = await supabaseClient.from("profiles").insert({id:user.id,full_name:fallback}).select("*").single();
    profile=data || {id:user.id,full_name:fallback,bio:"",favorite_occasions:[],language:"en"};
  }

  const initials = (profile.full_name || "CV").trim().split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase();
  $("avatarPreview").innerHTML = profile.avatar_url ? '<img src="'+escapeHtml(profile.avatar_url)+'" alt="Profile photo">' : '<span>'+escapeHtml(initials)+'</span>';
  $("profileName").textContent=profile.full_name||"Your Profile";
  $("profileUsername").textContent=profile.username ? "@"+profile.username : "@username";
  $("profileBio").textContent=profile.bio || "Create memories. Celebrate every moment. ✨";
  $("fullName").value=profile.full_name||"";
  $("username").value=profile.username||"";
  $("bio").value=profile.bio||"";
  $("avatarUrl").value=profile.avatar_url||"";
  $("language").value=profile.language||"en";
  const favs=profile.favorite_occasions||[];
  document.querySelectorAll("#occasionPicks input").forEach(x=>x.checked=favs.includes(x.value));

  // The current backend has no dedicated celebrations/cards/memories tables yet.
  // Use authenticated orders as the existing source of created celebration records.
  const { data: orders } = await supabaseClient.from("orders").select("id,occasion,person_name,special_date,created_at,order_status").eq("email",user.email).order("created_at",{ascending:false});
  const celebrations=orders||[];
  $("statCelebrations").textContent=celebrations.length;
  $("statCards").textContent=celebrations.length;
  $("statMemories").textContent=0;
  $("statShared").textContent=0;

  const renderCelebrations=()=>{
    if(!celebrations.length) return '<div class="cv-empty-profile"><div>✨</div><h2>Your Celebrations</h2><p>Your created celebrations will appear here.</p><a href="customize.html" class="primary-btn">Create Celebration</a></div>';
    return '<div class="cv-celebration-grid">'+celebrations.map(o=>'<article class="cv-celebration-item"><div class="cv-celebration-icon">🎉</div><div class="cv-celebration-main"><h3>'+escapeHtml(o.person_name||o.occasion||"Celebration")+'</h3><p>'+escapeHtml(o.occasion||"Special occasion")+'</p><small>'+escapeHtml(o.special_date||"")+'</small><span class="cv-order-status">'+escapeHtml(o.order_status||"Created")+'</span></div><div class="cv-celebration-actions"><button type="button" data-share-order="'+o.id+'">↗ Share</button></div></article>').join("")+'</div>';
  };
  $("profileTabContent").innerHTML=renderCelebrations();
  const renderCards=async()=>{const el=$("profileTabContent");if(!el)return;el.innerHTML='<div class="cv-card-panel"><form id="cardForm" class="cv-card-form"><input id="cardTitle" required placeholder="Card title"><input id="cardRecipient" placeholder="Recipient name"><input id="cardOccasion" placeholder="Occasion"><textarea id="cardMessage" placeholder="Write your message"></textarea><button class="primary-btn" type="submit">💌 Save Card</button></form><div id="cardList" class="cv-card-grid"></div></div>';const list=$("cardList"),form=$("cardForm");const load=async()=>{const {data,error}=await supabaseClient.from("profile_cards").select("*").eq("user_id",user.id).order("created_at",{ascending:false});if(error){list.textContent="Could not load cards.";return}list.innerHTML=data?.length?data.map(c=>'<article class="cv-card-item"><div><h3>💌 '+escapeHtml(c.title)+'</h3><p>'+escapeHtml(c.recipient_name||c.occasion||"Special card")+'</p><small>'+escapeHtml(c.message||"")+'</small></div><button type="button" data-delete-card="'+c.id+'">🗑️</button></article>').join(""):'<div class="cv-empty-profile"><div>💌</div><h2>No saved cards</h2><p>Create your first celebration card.</p></div>';list.querySelectorAll("[data-delete-card]").forEach(b=>b.onclick=async()=>{await supabaseClient.from("profile_cards").delete().eq("id",b.dataset.deleteCard).eq("user_id",user.id);load()})};form.onsubmit=async e=>{e.preventDefault();const {error}=await supabaseClient.from("profile_cards").insert({user_id:user.id,title:$("cardTitle").value.trim(),recipient_name:$("cardRecipient").value.trim()||null,occasion:$("cardOccasion").value.trim()||null,message:$("cardMessage").value.trim()});if(error){setMessage("Could not save card: "+error.message);return}form.reset();setMessage("Card saved. 💌",true);load()};load()};
  const bindCelebrationActions=()=>document.querySelectorAll("[data-share-order]").forEach(btn=>btn.onclick=async()=>{
    const url=window.location.origin+window.location.pathname.replace(/profile\.html$/,"")+"?celebration="+encodeURIComponent(btn.dataset.shareOrder);
    try{if(navigator.share) await navigator.share({title:"CelebrateVerse Celebration",url});else await navigator.clipboard.writeText(url);setMessage(navigator.share?"":"Celebration link copied. 🔗",true)}catch(err){if(err.name!=="AbortError")setMessage("Could not share this celebration.")}});
  bindCelebrationActions();

  $("editProfileBtn").onclick=()=>{$("profileForm").hidden=false;$("editProfileBtn").hidden=true;$("profileMessage").textContent=""};
  $("cancelEditBtn").onclick=()=>{$("profileForm").hidden=true;$("editProfileBtn").hidden=false};

  const uploadAvatar = async (userId) => {
    const input=$("avatarFile"), status=$("avatarUploadStatus");
    if(!input?.files?.length) return $("avatarUrl").value.trim() || null;
    const file=input.files[0];
    if(file.size>5*1024*1024) throw new Error("Profile photo must be 5 MB or smaller.");
    if(!["image/jpeg","image/png","image/webp"].includes(file.type)) throw new Error("Please choose a JPG, PNG or WebP image.");
    status.textContent="Uploading photo…";
    const ext=(file.name.split(".").pop()||"jpg").toLowerCase();
    const path=userId+"/"+crypto.randomUUID()+"."+ext;
    const {error:uploadError}=await supabaseClient.storage.from("avatars").upload(path,file,{upsert:false,contentType:file.type});
    if(uploadError) throw uploadError;
    const {data}=supabaseClient.storage.from("avatars").getPublicUrl(path);
    status.textContent="Photo uploaded successfully. ✨";
    return data.publicUrl;
  };

  $("profileForm").addEventListener("submit",async e=>{
    e.preventDefault();
    const username=$("username").value.trim().toLowerCase();
    if(username && !/^[a-z0-9_]{3,30}$/.test(username)) return setMessage("Username must be 3–30 characters using letters, numbers or underscores.");
    const favorite_occasions=[...document.querySelectorAll("#occasionPicks input:checked")].map(x=>x.value);
    let avatar_url; try { avatar_url=await uploadAvatar(user.id); } catch(err) { return setMessage(err.message||"Could not upload profile photo."); }
    const payload={full_name:$("fullName").value.trim(),username:username||null,bio:$("bio").value.trim(),avatar_url,language:$("language").value,favorite_occasions,updated_at:new Date().toISOString()};
    const {data,error}=await supabaseClient.from("profiles").update(payload).eq("id",user.id).select("*").single();
    if(error) return setMessage(error.code==="23505"?"That username is already taken. Choose another one.":"Could not save profile: "+error.message);
    profile=data;
    $("profileName").textContent=data.full_name||"Your Profile";
    $("profileUsername").textContent=data.username?"@"+data.username:"@username";
    $("profileBio").textContent=data.bio||"Create memories. Celebrate every moment. ✨";
    const i=(data.full_name||"CV").trim().split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase();
    $("avatarPreview").innerHTML=data.avatar_url?'<img src="'+escapeHtml(data.avatar_url)+'" alt="Profile photo">':'<span>'+escapeHtml(i)+'</span>';
    $("profileForm").hidden=true;$("editProfileBtn").hidden=false;setMessage("Profile saved successfully. ✨",true);
  });

  const eventForm=$("eventForm"), eventList=$("eventList");
  const loadEvents=async()=>{
    if(!eventList)return;
    const {data,error}=await supabaseClient.from("celebration_events").select("*").eq("user_id",user.id).order("event_date",{ascending:true});
    if(error){eventList.innerHTML='<p class="cv-profile-message error">Could not load events.</p>';return;}
    eventList.innerHTML=data?.length?data.map(e=>'<article class="cv-event-item"><div><h3>⏳ '+escapeHtml(e.title)+'</h3><p>'+escapeHtml(e.occasion)+(e.person_name?' · '+escapeHtml(e.person_name):'')+'</p><time datetime="'+escapeHtml(e.event_date)+'" data-countdown="'+e.id+'"></time></div><button type="button" data-delete-event="'+e.id+'" aria-label="Delete event">🗑️</button></article>').join(""):'<div class="cv-empty-profile"><div>⏳</div><h2>No upcoming events</h2><p>Add a special date to start a countdown.</p></div>';
    const tick=()=>data?.forEach(e=>{const el=eventList.querySelector('[data-countdown="'+e.id+'"]');if(!el)return;const ms=new Date(e.event_date).getTime()-Date.now();if(ms<=0){el.textContent="🎉 Today!";return}const d=Math.floor(ms/86400000),h=Math.floor(ms%86400000/3600000),m=Math.floor(ms%3600000/60000),sec=Math.floor(ms%60000/1000);el.textContent=d+"d · "+h+"h · "+m+"m · "+sec+"s"});tick();clearInterval(loadEvents.timer);loadEvents.timer=setInterval(tick,1000);
    eventList.querySelectorAll("[data-delete-event]").forEach(b=>b.onclick=async()=>{await supabaseClient.from("celebration_events").delete().eq("id",b.dataset.deleteEvent).eq("user_id",user.id);loadEvents()});
  };
  eventForm?.addEventListener("submit",async e=>{e.preventDefault();const payload={user_id:user.id,title:$("eventTitle").value.trim(),occasion:$("eventOccasion").value.trim(),person_name:$("eventPerson").value.trim()||null,event_date:new Date($("eventDate").value).toISOString()};const {error}=await supabaseClient.from("celebration_events").insert(payload);if(error){setMessage("Could not save event: "+error.message);return}eventForm.reset();setMessage("Countdown added. ⏳",true);loadEvents()});
  loadEvents();

  const tabInfo={
    celebrations:["Your Celebrations","Your created celebrations will appear here.","customize.html"],
    cards:["Your Cards","Your greeting cards will appear here.","customize.html"],
    memories:["Celebration Memories","Your saved celebration memories will appear here.","customize.html"],
    countdowns:["Your Countdowns","Your active and upcoming countdowns will appear here.","customize.html"],
    saved:["Saved Celebrations","Your saved celebrations will appear here.","customize.html"]
  };
  document.querySelectorAll(".cv-profile-tabs button").forEach(btn=>btn.onclick=()=>{
    document.querySelectorAll(".cv-profile-tabs button").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
    const [title,text,href]=tabInfo[btn.dataset.tab];
    if(btn.dataset.tab==="countdowns"){ $("profileTabContent").innerHTML='<div class="cv-event-panel">'+eventForm.outerHTML+'<div id="eventList" class="cv-event-list"></div></div>'; const f=$("profileTabContent").querySelector("#eventForm"); f.addEventListener("submit",async e=>{e.preventDefault();const payload={user_id:user.id,title:$("eventTitle").value.trim(),occasion:$("eventOccasion").value.trim(),person_name:$("eventPerson").value.trim()||null,event_date:new Date($("eventDate").value).toISOString()};const {error}=await supabaseClient.from("celebration_events").insert(payload);if(error)return setMessage("Could not save event: "+error.message);f.reset();setMessage("Countdown added. ⏳",true);loadEvents()}); loadEvents(); }
    else if(btn.dataset.tab==="celebrations") $("profileTabContent").innerHTML=renderCelebrations();
    else if(btn.dataset.tab==="cards") renderCards();
    else $("profileTabContent").innerHTML='<div class="cv-empty-profile"><div>✨</div><h2>'+escapeHtml(title)+'</h2><p>'+escapeHtml(text)+'</p><a href="'+href+'" class="primary-btn">Create Celebration</a></div>';
  });
});