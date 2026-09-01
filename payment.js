document.addEventListener("DOMContentLoaded", () => {
  const prices = { basic: 499, premium: 999, ultimate: 1999 };
  const params = new URLSearchParams(location.search);
  const saved = JSON.parse(localStorage.getItem("celebrateVerseOrder") || "{}");
  const celebrationId = params.get("celebration") || saved.celebrationId;
  const selectedPackage = String(params.get("package") || saved.package || "").trim().toLowerCase();
  const price = prices[selectedPackage] || 0;

  const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
  const title = v => v ? String(v).replace(/-/g," ").replace(/\b\w/g, x => x.toUpperCase()) : "-";
  const money = n => "₹" + Number(n || 0).toLocaleString("en-IN");

  set("summaryPersonName", saved.personName || "Your Special Moment");
  set("summaryOccasion", title(saved.occasion));
  set("summaryRelationship", title(saved.relationship));
  set("summaryTheme", title(saved.theme));
  set("summaryPackage", title(selectedPackage));
  set("summaryPrice", money(price));
  set("summaryTotal", money(price));
  set("summaryMessage", saved.message || "-");
  if (saved.specialDate) {
    const d = new Date(saved.specialDate + "T00:00:00");
    set("summaryDate", isNaN(d) ? "-" : d.toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}));
  }

  document.querySelectorAll(".payment-method").forEach(card => card.addEventListener("click", () => {
    document.querySelectorAll(".payment-method").forEach(x => x.classList.remove("active-payment"));
    card.classList.add("active-payment");
  }));

  document.getElementById("payButton")?.addEventListener("click", async () => {
    if (!celebrationId || !price) return alert("Your celebration details are missing. Please return to the customization page.");
    if (!supabaseClient) return alert("Payment service is unavailable.");

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) { location.href = "login.html"; return; }

    const config = window.CELEBRATEVERSE_PAYMENT || {};
    if (!config.createOrderEndpoint || !config.verifyPaymentEndpoint) {
      alert("Payment backend setup is required before live payments can be accepted. Add your secure server/Edge Function URLs in payment-config.js.");
      return;
    }

    const button = document.getElementById("payButton");
    const original = button.innerHTML;
    button.disabled = true;
    button.textContent = "Processing Payment...";

    try {
      const response = await fetch(config.createOrderEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${(await supabaseClient.auth.getSession()).data.session?.access_token || ""}` },
        body: JSON.stringify({ celebration_id: celebrationId, package: selectedPackage })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to start payment.");

      if (!window.Razorpay) throw new Error("Payment gateway failed to load.");
      const razorpay = new Razorpay({
        key: payload.key_id,
        amount: payload.amount,
        currency: payload.currency || "INR",
        name: "CelebrateVerse",
        description: `CelebrateVerse ${title(selectedPackage)}`,
        order_id: payload.order_id,
        handler: async payment => {
          const verify = await fetch(config.verifyPaymentEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${(await supabaseClient.auth.getSession()).data.session?.access_token || ""}` },
            body: JSON.stringify({ celebration_id: celebrationId, package: selectedPackage, ...payment })
          });
          const verified = await verify.json();
          if (!verify.ok || !verified.success) throw new Error(verified.error || "Payment verification failed.");
          localStorage.removeItem("celebrateVerseOrder");
          location.href = `success.html?order=${encodeURIComponent(verified.order_number || verified.order_id || "")}`;
        },
        modal: { ondismiss: () => { button.disabled = false; button.innerHTML = original; } }
      });
      razorpay.open();
    } catch (error) {
      console.error(error);
      alert(error.message || "Payment could not be completed. Please try again.");
      button.disabled = false;
      button.innerHTML = original;
    }
  });
});
