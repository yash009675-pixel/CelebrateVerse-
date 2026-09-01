const SUPABASE_URL = "https://mpokuqbsetuthljjhnba.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_nC1HX6hNaskkRtDtfDg1qQ_FHQmnZ4P";

if (!window.supabase) {
  console.error("Supabase SDK failed to load.");
}

const supabaseClient = window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    })
  : null;
