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

  let celebrations=[];
  try {
    const res=await supabaseClient.from("celebrations").select("id,status").eq("user_id",user.id);
    celebrations=res.data||[];
  } catch(e) {}
  $("statCelebrations").textContent=celebrations.filter(x=>x.status!=="draft").length;
  $("statCards").textContent=celebrations.length;
  $("statMemories").textContent=0;
  $("statShared").textContent=0;

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
    let avatar_url; try { avatar_url=await uploadAvatar(user.id); } catch(err) { return setMessage(err.message||"Could not upload profile photo."); }\n    const payload={full_name:$("fullName").value.trim(),username:username||null,bio:$("bio").value.trim(),avatar_url,language:$("language").value,favorite_occasions,updated_at:new Date().toISOString()};
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

  const tabInfo={
    celebrations:["Your Celebrations","Your created celebrations will appear here.","customize.html"],
    cards:["Your Cards","Your greeting cards will appear here.","customize.html"],
    memories:["Celebration Memories","Your saved celebration memories will appear here.","customize.html"],
    countdowns:["Your Countdowns","Your active and upcoming countdowns will appear here.","customize.html"],
    saved:["Saved Celebrations","Your saved celebrations will appear here.","customize.html"]
  };
  document.querySelectorAll(".cv-profile-tabs button").forEach(btn=>btn.onclick=()=>{
    document.querySelectorAll(".cv-profile-tabs button").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
    const [title,text,href]=tabInfo[btn.dataset.tab];$("profileTabContent").innerHTML='<div class="cv-empty-profile"><div>✨</div><h2>'+escapeHtml(title)+'</h2><p>'+escapeHtml(text)+'</p><a href="'+href+'" class="primary-btn">Create Celebration</a></div>';
  });
});