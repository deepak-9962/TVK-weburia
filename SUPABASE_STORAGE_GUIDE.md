# 📦 Complete Guide: Supabase Storage Bucket Setup

## 🎯 Create Storage Bucket in Supabase

### Step 1: Access Supabase Dashboard

1. Go to https://supabase.com
2. Sign in with your account
3. Select your project: **your-project-id**

### Step 2: Create New Bucket

1. Click **"Storage"** in the left sidebar (database icon with folder)
2. Click **"New bucket"** button (green button at top right)
3. Configure bucket:
   ```
   Name: tvk-storage
   ☑ Public bucket (Check this box!)
   File size limit: 50 MB (default)
   Allowed MIME types: Leave empty (allows all types)
   ```
4. Click **"Create bucket"**

### Step 3: Configure Bucket Policies

After creating the bucket, you need to allow access:

#### Option A: Quick Setup (Recommended)
1. Click on your **tvk-storage** bucket
2. Click **"Policies"** tab
3. Click **"New Policy"** → **"Get started quickly"**
4. Select these templates:
   - ✅ **"Allow public read access"**
   - ✅ **"Allow authenticated uploads"**
5. Click **"Review"** → **"Save policy"**

#### Option B: Manual Setup (Advanced)
If you want to create custom policies:

1. Go to **Storage** → **Policies**
2. Click **"New Policy"**
3. Add these SQL policies:

**Policy 1: Public Read Access**
```sql
CREATE POLICY "Public can view photos"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'tvk-storage' );
```

**Policy 2: Anyone Can Upload**
```sql
CREATE POLICY "Anyone can upload photos"
ON storage.objects FOR INSERT
TO public
WITH CHECK ( bucket_id = 'tvk-storage' );
```

**Policy 3: Allow Updates**
```sql
CREATE POLICY "Anyone can update photos"
ON storage.objects FOR UPDATE
TO public
USING ( bucket_id = 'tvk-storage' );
```

### Step 4: Test the Bucket

1. Go to your bucket in Supabase dashboard
2. Click **"Upload file"** button
3. Upload a test image
4. Click on the uploaded file
5. Copy the **"Public URL"**
6. Paste URL in browser - you should see the image!

## 🔧 How It Works Now

Your updated code has **dual storage strategy**:

### Strategy 1: Supabase Storage (Primary)
- ✅ Uploads photos to `tvk-storage` bucket
- ✅ Stores public URLs in database
- ✅ Photos accessible from anywhere
- ✅ Better for production

### Strategy 2: Base64 (Fallback)
- ✅ Converts photos to base64 if bucket fails
- ✅ Stores directly in database
- ✅ Works without bucket
- ✅ Good for development/testing

## 📊 Bucket Structure

Your photos will be organized like this:
```
tvk-storage/
└── member-photos/
    ├── 1728000000_abc123.jpg
    ├── 1728000001_def456.png
    └── 1728000002_ghi789.jpg
```

## 🎯 What to Do Next

### Option 1: Create Bucket (Recommended for Production)
1. Follow steps above to create **tvk-storage** bucket
2. Set policies for public read access
3. Refresh your form page
4. Submit form - photos will upload to bucket!

### Option 2: Keep Using Base64 (Quick Solution)
- No setup needed
- Works immediately
- Photos stored in database as base64
- Good for testing/small projects

## 🔍 Verify It's Working

After creating the bucket:

1. Refresh your BLA office entry form
2. Fill out the form
3. Upload a photo
4. Submit
5. Check browser console - should see:
   ```
   ✅ "Photo uploaded successfully to storage: https://..."
   ```
6. Go to Supabase → Storage → tvk-storage
7. You should see your uploaded photo!

## ⚠️ Common Issues

### "Bucket not found"
- **Solution**: Create the bucket in Supabase dashboard
- Make sure name is exactly: `tvk-storage`

### "Access Denied"
- **Solution**: Set proper policies (see Step 3)
- Make bucket public for read access

### "File size too large"
- **Solution**: Increase bucket file size limit
- Or compress images before upload

## 💡 Pro Tips

1. **File Naming**: Files are auto-renamed with timestamp to avoid conflicts
2. **Security**: Public read is OK for member photos (they're not sensitive)
3. **Performance**: Storage URLs are faster than base64 for large images
4. **Cost**: Supabase free tier includes 1GB storage (plenty for photos!)

## ✅ Current Code Status

Your code now:
- ✅ **Tries storage first** (if bucket exists)
- ✅ **Falls back to base64** (if bucket doesn't exist)
- ✅ **Never fails** (always stores photo somehow)
- ✅ **Logs everything** (check console to see what's happening)

Just create the bucket and it will automatically start using it! 🚀