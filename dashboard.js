document.addEventListener("DOMContentLoaded", async () => {
  if (!supabaseClient) { window.location.href = "login.html"; return; }

  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) { window.location.href = "login.html"; return; }

  const userName = document.getElementById("userName");
  const { data: profile } = await supabaseClient.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
  if (userName) userName.textContent = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

  document.querySelectorAll(".dashboard-nav-item").forEach(item => {
    item.addEventListener("click", () => {
      const tabName = item.dataset.tab;
      document.querySelectorAll(".dashboard-nav-item").forEach(n => n.classList.remove("active"));
      document.querySelectorAll(".dashboard-tab").forEach(t => t.classList.remove("active"));
      item.classList.add("active");
      document.getElementById(tabName)?.classList.add("active");
    });
  });

  const [{ data: drafts, error: draftsError }, { data: orders, error: ordersError }] = await Promise.all([
    supabaseClient.from("celebrations").select("*").eq("user_id", user.id).eq("status", "draft").order("updated_at", { ascending: false }),
    supabaseClient.from("orders").select("*, celebrations(*)").eq("user_id", user.id).order("created_at", { ascending: false })
  ]);

  if (draftsError) console.error(draftsError);
  if (ordersError) console.error(ordersError);

  const safeDrafts = drafts || [];
  const safeOrders = orders || [];

  document.getElementById("totalDrafts") && (document.getElementById("totalDrafts").textContent = safeDrafts.length);
  document.getElementById("totalOrders") && (document.getElementById("totalOrders").textContent = safeOrders.length);
  document.getElementById("totalCelebrations") && (document.getElementById("totalCelebrations").textContent = safeDrafts.length + safeOrders.length);

  const draftList = document.getElementById("draftList");
  if (draftList) {
    draftList.innerHTML = safeDrafts.length ? safeDrafts.map(d => `
      <div class="dashboard-item">
        <div class="dashboard-item-icon">🎉</div>
        <div><h3>${escapeHtml(d.person_name || "Untitled Celebration")}</h3><p>${escapeHtml(d.occasion || "Custom Celebration")}</p></div>
        <a href="customize.html?draft=${encodeURIComponent(d.id)}" class="item-action">Continue</a>
      </div>`).join("") :
      `<div class="empty-state"><div class="empty-icon">✨</div><h3>No drafts yet</h3><p>Start creating your first celebration.</p><a href="customize.html" class="primary-btn">Create Celebration</a></div>`;
  }

  const orderList = document.getElementById("orderList");
  if (orderList) {
    orderList.innerHTML = safeOrders.length ? safeOrders.map(o => `
      <div class="dashboard-item">
        <div class="dashboard-item-icon">🎊</div>
        <div><h3>${escapeHtml(o.celebrations?.person_name || "CelebrateVerse Order")}</h3><p>Order #${escapeHtml(o.order_number || o.id.slice(0, 8))} · ${escapeHtml(o.status || "Processing")}</p></div>
        <span class="order-status">${escapeHtml(o.status || "Processing")}</span>
      </div>`).join("") :
      `<div class="empty-state"><div class="empty-icon">📦</div><h3>No orders yet</h3><p>Your completed celebration orders will appear here.</p></div>`;
  }

  document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.href = "index.html";
  });

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  }
});
