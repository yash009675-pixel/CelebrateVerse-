const SUPABASE_URL =
    "https://mpokuqbsetuthljjhnba.supabase.co";


const SUPABASE_ANON_KEY =
    "sb_publishable_nC1HX6hNaskkRtDtfDg1qQ_FHQmnZ4P";


const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


console.log(
    "Supabase Connected:",
    supabaseClient
);
