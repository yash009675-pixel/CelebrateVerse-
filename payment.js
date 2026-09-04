document.addEventListener("DOMContentLoaded", () => {
  const prices = { basic: 199, premium: 399, ultimate: 699 };
  const params = new URLSearchParams(window.location.search);

  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem("celebrateVerseOrder") || localStorage.getItem("celebrateVerseCustomization") || "{}");
  } catch (error) {
    console.warn("Unable to read saved celebration data", error);
  }

  const normalizePackage = value => String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z-]/g, "")
    .replace(/-+/g, "-");

  const packageAliases = {
    basic: "basic",
    "basic-package": "basic",
    premium: "premium",
    "premium-package": "premium",
    ultimate: "ultimate",
    "ultimate-package": "ultimate"
  };

  const rawPackage = params.get("package") || saved.package || saved.selectedPackage || saved.plan || "";
  const selectedPackage = packageAliases[normalizePackage(rawPackage)] || normalizePackage(rawPackage);
  const price = prices[selectedPackage] || Number(saved.price || saved.amount || 0) || 0;
  const celebrationId = params.get("celebration") || saved.celebrationId || saved.id || "";

  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  const title = value => value
    ? String(value).replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase())
    : "-";

  const money = value => "₹" + Number(value || 0).toLocaleString("en-IN");

  set("summaryPersonName", saved.personName || saved.name || "Your Special Moment");
  set("summaryOccasion", title(saved.occasion));
  set("summaryRelationship", title(saved.relationship));
  set("summaryTheme", title(saved.theme));
  set("summaryPackage", title(selectedPackage));
  set("summaryPrice", money(price));
  set("summaryTotal", money(price));
  set("summaryMessage", saved.message || "-");

  if (saved.specialDate) {
    const date = new Date(saved.specialDate + "T00:00:00");
    set("summaryDate", Number.isNaN(date.getTime())
      ? "-"
      : date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    );
  }

  document.querySelectorAll(".payment-method").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".payment-method").forEach(item => item.classList.remove("active-payment"));
      card.classList.add("active-payment");
    });
  });

  document.getElementById("payButton")?.addEventListener("click", async () => {
    if (!selectedPackage || !price) {
      alert("Please return to the customization page and select a package before continuing.");
      return;
    }

    if (!celebrationId) {
      alert("Your celebration has not been saved yet. Please return to the customization page and submit it again.");
      return;
    }

    if (!window.supabaseClient) {
      alert("Payment service is unavailable. Please refresh the page and try again.");
      return;
    }

    const { data: { user } } = await window.supabaseClient.auth.getUser();
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    const config = window.CELEBRATEVERSE_PAYMENT || {};
    if (!config.createOrderEndpoint || !config.verifyPaymentEndpoint) {
      alert("Secure payment is not configured yet. Your order details are saved, but live payment cannot be started until the payment backend is connected.");
      return;
    }

    const button = document.getElementById("payButton");
    const original = button.innerHTML;
    button.disabled = true;
    button.textContent = "Processing Payment...";

    try {
      const { data: { session } } = await window.supabaseClient.auth.getSession();
      const token = session?.access_token || "";

      const response = await fetch(config.createOrderEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          celebration_id: celebrationId,
          package: selectedPackage,
          amount: price
        })
      });

      const payload = await response.json().catch(() => ({}));
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
          try {
            const verify = await fetch(config.verifyPaymentEndpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({
                celebration_id: celebrationId,
                package: selectedPackage,
                ...payment
              })
            });

            const verified = await verify.json().catch(() => ({}));
            if (!verify.ok || !verified.success) {
              throw new Error(verified.error || "Payment verification failed.");
            }

            localStorage.removeItem("celebrateVerseOrder");
            window.location.href = `success.html?order=${encodeURIComponent(verified.order_number || verified.order_id || "")}`;
          } catch (error) {
            console.error(error);
            alert(error.message || "Payment verification failed. Please contact support before trying again.");
            button.disabled = false;
            button.innerHTML = original;
          }
        },
        modal: {
          ondismiss: () => {
            button.disabled = false;
            button.innerHTML = original;
          }
        }
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
