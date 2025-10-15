# 🔑 Get Supabase Service Role Key for Migration

## Why We Need This:
The anon key can't list storage buckets for security reasons.
The migration script needs the **service_role** key (has admin access).

---

## 📋 How to Get Service Role Key:

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your project

### Step 2: Go to API Settings
1. Click **Settings** (gear icon in left sidebar)
2. Click **API** section

### Step 3: Find Service Role Key
You'll see two keys:
- `anon` / `public` - For client-side (limited access) ❌
- **`service_role`** - For server-side (full access) ✅ **We need this!**

### Step 4: Copy the Service Role Key
1. Find the **service_role** key section
2. Click the **Copy** button
3. It looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...` (very long)

---

## 🔧 Update Migration Script:

### Option 1: Quick Fix (Edit the file directly)

Open `migrate-photos-to-storage.js` in VS Code

Find line 8:
```javascript
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // OLD anon key
```

Replace with your service_role key:
```javascript
const SUPABASE_KEY = 'YOUR_SERVICE_ROLE_KEY_HERE';
```

Save the file.

---

### Option 2: Environment Variable (More secure)

Create a `.env` file:
```bash
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

Then I'll update the script to use it.

---

## ⚠️ IMPORTANT Security Notes:

**Service Role Key:**
- ✅ Use for: Server-side scripts, migrations, admin tasks
- ❌ NEVER use in: Client-side code, browser, public websites
- ❌ NEVER commit to Git: Add to .gitignore
- ✅ Keep secret: Full database access!

**After Migration:**
- Delete the key from the script
- Or keep in .env file (add .env to .gitignore)

---

## 🚀 After Getting the Key:

1. **Copy your service_role key** from Supabase dashboard
2. **Tell me:** "I have the key" 
3. **I'll update the script** with the key
4. **Run migration:** `node migrate-photos-to-storage.js`
5. **Done!** Photos migrate automatically

---

## 📸 Where to Find It:

```
Supabase Dashboard
  └─ Settings (⚙️ gear icon)
      └─ API
          └─ Project API keys
              └─ service_role
                  └─ [Copy] button ← Click this!
```

---

**Go grab your service_role key and paste it here!** 🔑

I'll update the script for you immediately.
