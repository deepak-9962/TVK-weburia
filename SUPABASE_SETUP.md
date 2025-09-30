# Supabase Setup Guide for TVK Political Party App

## 🚀 Quick Setup Instructions

### Step 1: Create Supabase Project
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Name**: TVK Political Party
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
4. Wait for project creation (2-3 minutes)

### Step 2: Configure Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the entire content from `database-schema.sql`
3. Click **"Run"** to execute the SQL commands
4. This will create all necessary tables, indexes, and policies

### Step 3: Create Storage Buckets
1. Go to **Storage** in the left sidebar
2. Click **"Create bucket"**
3. Create bucket named: `member-documents`
   - Make it **public**
4. Create another bucket named: `activity-media`
   - Make it **public**

### Step 4: Configure Row Level Security (RLS)
The SQL script already enables RLS policies, but you can modify them:

1. Go to **Authentication** > **Policies**
2. Review the policies for each table:
   - `bla_members`
   - `complaints` 
   - `activities`
   - `office_tasks`

### Step 5: Get API Keys
Your API keys are already configured in `supabase-config.js`:
- **Project URL**: `https://cbcuhojwffwppocnoxel.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (already added)
- **Service Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (already added)

---

## 📊 Database Tables Overview

### 1. **bla_members** - BLA Member Information
- Personal details (name, father's name, DOB, etc.)
- Contact information (mobile, email, address)
- Political information (voter ID, constituency, interests)
- Document URLs (photo, ID proof)
- Status tracking

### 2. **complaints** - Complaint Management
- Complainant information
- Complaint details and categorization
- Priority levels (low, medium, high, urgent)
- Status tracking (pending, in-progress, resolved, etc.)
- Auto-generated complaint numbers

### 3. **activities** - Party Activities
- Event information (meetings, registrations, services)
- Scheduling details (date, time, venue)
- Participant tracking
- Status management

### 4. **office_tasks** - Administrative Tasks
- Task details and descriptions
- Assignment and priority management
- Progress tracking (0-100%)
- Due date management

---

## 🔒 Security Features

### Row Level Security (RLS)
- All tables have RLS enabled
- Currently set to public access for development
- **Production**: Implement proper authentication-based policies

### File Upload Security
- Secure file upload to Supabase Storage
- Automatic file URL generation
- Public access for member documents and activity media

### API Key Management
- Anon key for client-side operations
- Service key for admin operations (use carefully)
- Environment-based configuration recommended

---

## 🎯 App Integration Status

### ✅ **Integrated Features**
- **Database Connection**: Auto-initializes on app load
- **BLA Registration**: Saves to `bla_members` table
- **Complaint System**: Saves to `complaints` table
- **File Upload**: Photos and documents to Storage
- **Statistics**: Real-time data from database
- **Fallback**: Local storage if database fails

### 🔄 **Automatic Features**
- **Complaint Numbers**: Auto-generated timestamps
- **Timestamps**: Created/updated timestamps
- **Progress Tracking**: For tasks and activities
- **Status Management**: For all entities

---

## 🚧 Production Recommendations

### Security Enhancements
1. **Authentication**: Implement user login system
2. **Authorization**: Role-based access control
3. **API Keys**: Use environment variables
4. **RLS Policies**: Restrict based on user roles

### Performance Optimization
1. **Indexes**: Already created for common queries
2. **Pagination**: Implement for large datasets
3. **Caching**: Consider Redis for frequently accessed data
4. **CDN**: Use for static assets

### Monitoring & Backup
1. **Logging**: Enable Supabase logging
2. **Monitoring**: Set up alerts for errors
3. **Backup**: Configure automatic backups
4. **Analytics**: Track usage patterns

---

## 🔧 Troubleshooting

### Common Issues

**1. Database Connection Failed**
- Check internet connection
- Verify Supabase project is active
- Confirm API keys are correct

**2. File Upload Errors**
- Ensure storage buckets exist
- Check file size limits (default: 50MB)
- Verify bucket policies

**3. Data Not Saving**
- Check browser console for errors
- Verify RLS policies allow operations
- Ensure required fields are provided

### Error Handling
The app includes comprehensive error handling:
- Database failures fall back to localStorage
- User-friendly Tamil error messages
- Console logging for debugging

---

## 📞 Support

For technical support:
1. Check Supabase documentation
2. Review browser console errors
3. Verify database schema matches expected structure
4. Test API keys in Supabase dashboard

---

**Ready to go! Your TVK Political Party app is now powered by Supabase! 🎉**