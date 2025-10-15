# TVK Members Photo Gallery - Deployment Package

## 📦 This folder contains everything needed for deployment

### Files Included:
- `index.html` - Main page (renamed from member-photos.html)
- `members-data.json` - Your member data (currently 2 sample members)
- `bla-styles.css` - Styling (if exists)
- `supabase-config.js` - Configuration (if exists)

---

## 🚀 How to Deploy to Netlify (2 Minutes)

### Step 1: Open Netlify Drop
Go to: https://app.netlify.com/drop

### Step 2: Login/Signup
- Use GitHub, GitLab, or Email
- 100% Free - No credit card needed

### Step 3: Drag & Drop
- Drag this entire `deploy` folder to the Netlify page
- Or click "Browse files" and select this folder

### Step 4: Wait 30 Seconds
- Netlify will upload and deploy your files
- You'll get a random URL like: `https://random-name-12345.netlify.app`

### Step 5: (Optional) Rename Site
- Click "Site settings" → "Change site name"
- Rename to: `tvk-members` or your preferred name
- New URL: `https://tvk-members.netlify.app`

---

## ✅ Done! Your Site is Live!

**Share the URL with anyone and they can access it from anywhere in the world!** 🌍

---

## 🔄 To Update Member Data Later:

1. Replace `members-data.json` in this folder with updated data
2. Go to your Netlify dashboard
3. Drag & drop the `deploy` folder again
4. Site updates in 10 seconds!

---

## ⚠️ IMPORTANT: Before Going Live

**Replace Sample Data:**
- Currently has 2 sample members
- Export your real 90 members from Supabase
- Replace `members-data.json` with real data
- Then deploy!

See `QUICK_START.md` in parent folder for export instructions.

---

## 🔒 Security Note

This site will be PUBLIC by default (anyone with URL can access).

**To add password protection:**
1. In Netlify dashboard, go to: Site settings → Access control
2. Enable "Visitor access" → "Password protection"
3. Set a password
4. Only people with password can view site

---

## 📞 Need Help?

**Common Issues:**

**Q: Files not found errors?**
A: Make sure all files are in this folder before uploading

**Q: Styling not working?**
A: Check if `bla-styles.css` exists and is included

**Q: Data not loading?**
A: Verify `members-data.json` is valid JSON (use validate-json.js)

**Q: Want custom domain?**
A: In Netlify: Domain settings → Add custom domain → Follow instructions

---

## 🎯 What Works After Deployment:

✅ View all members with photos
✅ Filter by town, gender, category, status
✅ Search by name
✅ Date range filtering  
✅ Export to PDF
✅ Export to Excel
✅ Mobile responsive
✅ Fast loading (<1 second worldwide)

---

**Ready to deploy? Just drag this folder to Netlify!** 🚀
