
const SUPABASE_URL = "https://mfyvybsmifumchhvoqyz.supabase.co";

const SUPABASE_KEY = "sb_publishable_vBcOGKwB47nRdcjgvGdaVA_X7EuvwjJ";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

console.log("GameVerse Supabase connected!");
