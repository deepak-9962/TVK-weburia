// Migrate admins to Supabase Auth (requires admin email)
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

async function run() {
  console.log('Fetching admins...');
  const { data: admins, error } = await supabase
    .from('admins')
    .select('id, email, username, full_name, password, auth_user_id')
    .order('id', { ascending: true });
  if (error) throw error;

  for (const a of admins) {
    const email = a.email || `${a.username}@example.local`; // fallback if missing email
    if (a.auth_user_id) { console.log(`Skip id=${a.id} already linked`); continue; }
    if (!email || !a.password) { console.warn(`Skip id=${a.id} missing email/password`); continue; }

    console.log(`Creating auth user for ${email}`);
    const { data: au, error: aerr } = await supabase.auth.admin.createUser({
      email,
      password: a.password,
      email_confirm: true,
      user_metadata: { full_name: a.full_name, username: a.username, source: 'migration' }
    });
    if (aerr) { console.error('Auth create failed for', email, aerr.message); continue; }

    const uid = au.user?.id;
    if (!uid) { console.error('No user id returned'); continue; }

    const { error: uerr } = await supabase
      .from('admins')
      .update({ auth_user_id: uid })
      .eq('id', a.id);
    if (uerr) { console.error('Failed linking auth_user_id for', a.id, uerr.message); continue; }

    console.log(`Linked admin ${a.id} -> ${uid}`);
  }

  console.log('Admins migration complete');
}

run().catch(err => { console.error(err); process.exit(1); });
