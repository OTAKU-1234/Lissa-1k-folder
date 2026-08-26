const SUPABASE_URL = "https://dwgcsxwzeebmwatilmso.supabase.co";

const SUPABASE_KEY = "sb_publishable_0PKxrhbq6mUrRdQEldc3LQ_kn6qnXjV";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

window.supabaseClient = supabaseClient;
