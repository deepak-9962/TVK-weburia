// Migrate employees to Supabase Auth
// Requirements: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY env vars
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

async function run() {
  console.log('Fetching employees...');
  const { data: emps, error } = await supabase
    .from('employees')
    .select('id, email, full_name, password, auth_user_id')
    .order('id', { ascending: true });
  if (error) throw error;

  for (const e of emps) {
    if (e.auth_user_id) { console.log(`Skip id=${e.id} already linked`); continue; }
    if (!e.email || !e.password) { console.warn(`Skip id=${e.id} missing email/password`); continue; }

    console.log(`Creating auth user for ${e.email}`);
    const { data: au, error: aerr } = await supabase.auth.admin.createUser({
      email: e.email,
      password: e.password,
      email_confirm: true,
      user_metadata: { full_name: e.full_name, source: 'migration' }
    });
    if (aerr) { console.error('Auth create failed for', e.email, aerr.message); continue; }

    const uid = au.user?.id;
    if (!uid) { console.error('No user id returned'); continue; }

    const { error: uerr } = await supabase
      .from('employees')
      .update({ auth_user_id: uid })
      .eq('id', e.id);
    if (uerr) { console.error('Failed linking auth_user_id for', e.id, uerr.message); continue; }

    console.log(`Linked employee ${e.id} -> ${uid}`);
  }

  console.log('Employees migration complete');
}

run().catch(err => { console.error(err); process.exit(1); });
