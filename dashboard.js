document.addEventListener("DOMContentLoaded", async () => {
  if (!supabaseClient) { window.location.href = "login.html"; return; }
  const { data: { session } } = await supabaseClient.auth.getSession();
  const user = session?.user;
  if (!user) { window.location.href = "login.html"; return; }
  const $ = id => document.getElementById(id);
  const escapeHtml = value => String(value ?? "").replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
  const { data: profile } = await supabaseClient.from("profiles").select("full_name,username,avatar_url").eq("id", user.id).maybeSingle();
  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Creator";
  if ($("userName")) $("userName").textContent = displayName;
  const avatar = $("dashboardAvatar");
  if (avatar) {
    const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || "";
    const initials = displayName.trim().split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase() || "CV";
    avatar.innerHTML = avatarUrl
      ? '<img src="'+escapeHtml(avatarUrl)+'" alt="Profile photo">'
      : '<span>'+escapeHtml(initials)+'</span>';
  }
  document.querySelectorAll(".dashboard-nav-item").forEach(item => item.addEventListener("click", () => {
    const tabName = item.dataset.tab;
    document.querySelectorAll(".dashboard-nav-item").forEach(n => n.classList.remove("active"));
    document.querySelectorAll(".dashboard-tab").forEach(t => t.classList.remove("active"));
    item.classList.add("active"); $(tabName)?.classList.add("active");
  }));
  const [ordersResult, cardsResult, eventsResult, celebrationsResult] = await Promise.all([
    supabaseClient.from("orders").select("id,occasion,person_name,customer_name,special_date,package,amount,payment_status,order_status,created_at").eq("email", user.email).order("created_at", { ascending: false }),
    supabaseClient.from("profile_cards").select("id,title,recipient_name,occasion,message,created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabaseClient.from("celebration_events").select("id,title,occasion,person_name,event_date,created_at").eq("user_id", user.id).order("event_date", { ascending: true }),
    supabaseClient.from("celebrations").select("id,occasion,relationship,theme,person_name,customer_name,special_date,package,status,created_at").eq("user_id", user.id).order("created_at", { ascending: false })
  ]);
  const orders = ordersResult.data || [], cards = cardsResult.data || [], events = eventsResult.data || [], celebrations = celebrationsResult.data || [];
  if (ordersResult.error) console.error("Orders:", ordersResult.error);
  if (cardsResult.error) console.error("Cards:", cardsResult.error);
  if (eventsResult.error) console.error("Events:", eventsResult.error);
  const celebrationList = $("celebrationList");
  if (celebrationList) {
    celebrationList.innerHTML = celebrations.length ? celebrations.map(c => {
      const title = c.person_name ? c.person_name + "'s " + (c.occasion || "Celebration") : (c.occasion || "Untitled Celebration");
      const meta = [c.theme, c.package ? c.package.toUpperCase() : ""].filter(Boolean).join(" · ");
      return "<div class=\"dashboard-item cv-celebration-item\"><div class=\"dashboard-item-icon\">🎉</div><div><h3>"+escapeHtml(title)+"</h3><p>"+escapeHtml(meta || "Celebration")+" · "+escapeHtml(c.status || "Draft")+"</p></div><a class=\"primary-btn\" href=\"edit-studio.html?celebration="+encodeURIComponent(c.id)+"\">🎨 Edit Studio</a></div>";
    }).join("") : "<div class=\"empty-state\"><div class=\"empty-icon\">✨</div><h3>No celebrations yet</h3><p>Create your first celebration and it will appear here.</p><a href=\"customize.html\" class=\"primary-btn\">Create Celebration</a></div>";
  }

  $("totalDrafts") && ($("totalDrafts").textContent = celebrations.filter(x => String(x.status || "draft").toLowerCase() === "draft").length + cards.length);
  $("totalOrders") && ($("totalOrders").textContent = orders.length);
  $("totalCelebrations") && ($("totalCelebrations").textContent = celebrations.length);
  const draftList = $("draftList");
  if (draftList) {
    const celebrationDrafts = celebrations.filter(x => String(x.status || "draft").toLowerCase() === "draft");
    const celebrationHtml = celebrationDrafts.map(x => {
      const title = x.person_name ? x.person_name + "'s " + (x.occasion || "Celebration") : (x.occasion || "Untitled Celebration");
      const meta = [x.theme, x.package ? x.package.toUpperCase() : "DRAFT"].filter(Boolean).join(" · ");
      return '<div class="dashboard-item"><div class="dashboard-item-icon">🎨</div><div><h3>'+escapeHtml(title)+'</h3><p>'+escapeHtml(meta)+'</p></div><a class="primary-btn" href="edit-studio.html?celebration='+encodeURIComponent(x.id)+'">Continue Editing</a></div>';
    }).join("");
    const cardHtml = cards.map(x => '<div class="dashboard-item"><div class="dashboard-item-icon">💌</div><div><h3>'+escapeHtml(x.title || "Untitled Card")+'</h3><p>'+escapeHtml(x.occasion || x.recipient_name || "Celebration Card")+'</p></div><span class="item-action">Saved</span></div>').join("");
    draftList.innerHTML = (celebrationHtml + cardHtml) || '<div class="empty-state"><div class="empty-icon">✨</div><h3>No drafts yet</h3><p>Create your first celebration and continue editing it anytime.</p><a href="customize.html" class="primary-btn">Create Celebration</a></div>';
  }

  const orderList = $("orderList");
  if (orderList) orderList.innerHTML = orders.length ? orders.map(o => "<div class=\"dashboard-item\"><div class=\"dashboard-item-icon\">🎊</div><div><h3>"+escapeHtml(o.person_name || o.customer_name || o.occasion || "CelebrateVerse Order")+"</h3><p>"+escapeHtml(o.occasion || "Celebration")+" · "+escapeHtml(o.package || "Package")+"</p></div><span class=\"order-status\">"+escapeHtml(o.order_status || o.payment_status || "New")+"</span></div>").join("") : "<div class=\"empty-state\"><div class=\"empty-icon\">📦</div><h3>No orders yet</h3><p>Your CelebrateVerse orders will appear here.</p></div>";
  const upcoming = events.filter(e => new Date(e.event_date).getTime() >= Date.now());
  const title = $("overview")?.querySelector(".dashboard-section-title");
  if (title && upcoming.length && !$("overview").querySelector(".dashboard-upcoming")) {
    const box = document.createElement("div"); box.className = "dashboard-upcoming";
    box.innerHTML = "<div><strong>⏳ Next Countdown</strong><h3>"+escapeHtml(upcoming[0].title)+"</h3><p>"+escapeHtml(upcoming[0].occasion || "Special day")+"</p></div><span class=\"dashboard-countdown\"></span>";
    title.insertAdjacentElement("afterend", box);
    const tick = () => { const ms = new Date(upcoming[0].event_date).getTime() - Date.now(); const el=box.querySelector(".dashboard-countdown"); if(ms<=0){el.textContent="🎉 Today!";return;} const d=Math.floor(ms/86400000),h=Math.floor(ms%86400000/3600000),m=Math.floor(ms%3600000/60000); el.textContent=d+"d · "+h+"h · "+m+"m"; };
    tick(); setInterval(tick,1000);
  }
  $("logoutBtn")?.addEventListener("click", async () => { await supabaseClient.auth.signOut(); window.location.href = "index.html"; });
});
