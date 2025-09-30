// Copy this file to supabase-config.js and fill in your real keys.
// Never commit real keys to GitHub.

const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-KEY";

let supabaseClient;

async function initializeSupabase() {
  if (!window.supabase) {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/dist/umd/supabase.min.js';
      s.onload = resolve;
      s.onerror = () => reject(new Error('Failed to load Supabase library'));
      document.head.appendChild(s);
    });
  }
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabaseClient;
}

class TVKDatabase { /* ... keep same class from supabase-config.js ... */ }

let tvkDB;
async function initializeDatabase() {
  const client = await initializeSupabase();
  tvkDB = new TVKDatabase(client);
  return tvkDB;
}

if (typeof window !== 'undefined') {
  window.TVKDatabase = TVKDatabase;
  window.initializeDatabase = initializeDatabase;
  window.tvkDB = null;
}
