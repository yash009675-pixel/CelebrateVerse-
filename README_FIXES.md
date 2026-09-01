# CelebrateVerse – Fixed Build

Implemented:
- Supabase Auth for signup/login/logout; no passwords stored in localStorage.
- Supabase-backed user profiles, celebrations, orders and photo metadata.
- Supabase Storage upload flow with image count/type/size validation.
- Draft save and dashboard loading from live user data.
- Persistent theme preference.
- One Service Worker with online-first caching and offline fallback.
- Payment UI wired for secure Razorpay server-side order creation and verification.
- Payment success page.

Important:
Run `supabase/schema.sql` before testing database features. Real payment processing also requires secure backend/Edge Functions as described in `PAYMENT_SETUP.md`; this cannot be safely implemented using only static GitHub Pages files because payment secrets must never be exposed in browser code.
