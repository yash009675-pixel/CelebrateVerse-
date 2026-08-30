const SUPABASE_URL = "https://supabase.com/dashboard/project/mpokuqbsetuthljjhnba/sql/e271bd55-0c34-4b69-9431-bb886f6429c8;

const SUPABASE_ANON_KEY =
    "sb_publishable_nC1HX6hNaskkRtDtfDg1qQ_FHQmnZ4P";


const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );
