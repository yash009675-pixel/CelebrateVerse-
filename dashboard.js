const DEMO_DASHBOARD = new URLSearchParams(location.search).get("demo") === "1";

function renderDemoDashboard() {
  const $ = id => document.getElementById(id);
  const escapeHtml = value => String(value ?? "").replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
  if ($("userName")) $("userName").textContent = "Yash";
  if ($("totalCelebrations")) $("totalCelebrations").textContent = "12";
  if ($("totalDrafts")) $("totalDrafts").textContent = "4";
  if ($("totalOrders")) $("totalOrders").textContent = "3";

  document.querySelectorAll(".dashboard-nav-item").forEach(item => item.addEventListener("click", () => {
    document.querySelectorAll(".dashboard-nav-item").forEach(n => n.classList.remove("active"));
    document.querySelectorAll(".dashboard-tab").forEach(t => t.classList.remove("active"));
    item.classList.add("active");
    document.getElementById(item.dataset.tab)?.classList.add("active");
  }));

  const demoDrafts = [
    ["Arpita's Birthday", "Birthday · Purple Romantic"],
    ["Our Anniversary", "Anniversary · Love Story"],
    ["Mom's Special Day", "Special Celebration · Memories"],
    ["Best Friend Surprise", "Surprise · Galaxy Story"]
  ];
  const demoOrders = [
    ["Arpita's Birthday", "Birthday · Premium", "Completed"],
    ["Our Anniversary", "Anniversary · Ultimate", "In Progress"],
    ["Special Celebration", "Special Celebration · Basic", "Completed"]
  ];
  $("draftList") && ($("draftList").innerHTML = demoDrafts.map(x => '<div class="dashboard-item"><div class="dashboard-item-icon">💌</div><div><h3>'+escapeHtml(x[0])+'</h3><p>'+escapeHtml(x[1])+'</p></div><span class="item-action">Demo</span></div>').join(""));
  $("orderList") && ($("orderList").innerHTML = demoOrders.map(x => '<div class="dashboard-item"><div class="dashboard-item-icon">🎊</div><div><h3>'+escapeHtml(x[0])+'</h3><p>'+escapeHtml(x[1])+'</p></div><span class="order-status">'+escapeHtml(x[2])+'</span></div>').join(""));

  const overview = $("overview");
  if (overview) {
    const title = overview.querySelector(".dashboard-section-title");
    if (title && !overview.querySelector(".dashboard-upcoming")) {
      const box = document.createElement("div");
      box.className = "dashboard-upcoming";
      box.innerHTML = '<div><strong>⏳ Next Countdown</strong><h3>Arpita\'s Birthday</h3><p>Birthday · Demo celebration</p></div><span class="dashboard-countdown">39d · 04h · 22m</span>';
      title.insertAdjacentElement("afterend", box);
    }
  }
  document.querySelector(".dashboard-header-actions .secondary-btn")?.setAttribute("href","profile.html?public=1");
  const logout = $("logoutBtn");
  if (logout) {
    logout.innerHTML = '<i class="fa-solid fa-arrow-left"></i> Exit Demo';
    logout.onclick = () => { location.href = "index.html"; };
  }
  const badge = document.createElement("div");
  badge.className = "cv-demo-badge";
  badge.innerHTML = '✨ Demo Mode — no email or password required';
  document.querySelector(".dashboard-header")?.prepend(badge);
}

if (DEMO_DASHBOARD) {
  document.addEventListener("DOMContentLoaded", renderDemoDashboard);
} else {
document.addEventListener("DOMContentLoaded", async () => {
  if (!supabaseClient) { window.location.href = "login.html"; return; }
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) { window.location.href = "login.html"; return; }
  const $ = id => document.getElementById(id);
  const escapeHtml = value => String(value ?? "").replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
  const { data: profile } = await supabaseClient.from("profiles").select("full_name,username,avatar_url").eq("id", user.id).maybeSingle();
  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Creator";
  if ($("userName")) $("userName").textContent = displayName;
  document.querySelectorAll(".dashboard-nav-item").forEach(item => item.addEventListener("click", () => {
    const tabName = item.dataset.tab;
    document.querySelectorAll(".dashboard-nav-item").forEach(n => n.classList.remove("active"));
    document.querySelectorAll(".dashboard-tab").forEach(t => t.classList.remove("active"));
    item.classList.add("active"); $(tabName)?.classList.add("active");
  }));
  const [ordersResult, cardsResult, eventsResult] = await Promise.all([
    supabaseClient.from("orders").select("id,occasion,person_name,customer_name,special_date,package,amount,payment_status,order_status,created_at").eq("email", user.email).order("created_at", { ascending: false }),
    supabaseClient.from("profile_cards").select("id,title,recipient_name,occasion,message,created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabaseClient.from("celebration_events").select("id,title,occasion,person_name,event_date,created_at").eq("user_id", user.id).order("event_date", { ascending: true })
  ]);
  const orders = ordersResult.data || [], cards = cardsResult.data || [], events = eventsResult.data || [];
  if (ordersResult.error) console.error("Orders:", ordersResult.error);
  if (cardsResult.error) console.error("Cards:", cardsResult.error);
  if (eventsResult.error) console.error("Events:", eventsResult.error);
  $("totalDrafts") && ($("totalDrafts").textContent = cards.length);
  $("totalOrders") && ($("totalOrders").textContent = orders.length);
  $("totalCelebrations") && ($("totalCelebrations").textContent = orders.length + events.length);
  const draftList = $("draftList");
  if (draftList) draftList.innerHTML = cards.length ? cards.map(c => "<div class=\"dashboard-item\"><div class=\"dashboard-item-icon\">💌</div><div><h3>"+escapeHtml(c.title || "Untitled Card")+"</h3><p>"+escapeHtml(c.occasion || c.recipient_name || "Celebration Card")+"</p></div><span class=\"item-action\">Saved</span></div>").join("") : "<div class=\"empty-state\"><div class=\"empty-icon\">✨</div><h3>No saved cards yet</h3><p>Create a card from your celebration tools.</p><a href=\"customize.html\" class=\"primary-btn\">Create Celebration</a></div>";
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
}