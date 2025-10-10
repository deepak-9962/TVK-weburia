# TVK Political Party Website

A comprehensive political party website for **TVK தமிழ் வெற்றிக் கழகம்** with complaint management and BLA member registration system, powered by **Supabase**.

## 🎯 Features

### Main Dashboard
1. **BLA Member Registration System**
   - Comprehensive member registration form
   - Document upload functionality
   - Member management system
   - **Database storage** with Supabase

2. **Complaint Management System**
   - Online complaint submission
   - Priority-based categorization
   - Status tracking
   - **Real-time data** from database

### BLA Section (3 Main Areas)
1. **Admin Section (நிர்வாக பிரிவு)**
   - Member statistics from database
   - Member list management
   - Complaint overview
   - Report generation

2. **BLA Activities (BLA செயல்பாடுகள்)**
   - Upcoming events management
   - Completed activities tracking
   - Meeting schedules
   - Activity planning

3. **Office Activities (அலுவலக செயல்பாடுகள்)**
   - Daily task management
   - Document management
   - Resource allocation
   - Administrative workflows

## 🗄️ Database Integration

### Supabase Backend
- **Real-time database** with PostgreSQL
- **File storage** for documents and photos
- **Automatic backups** and scaling
- **Row-level security** for data protection

### API Keys Configuration
- **Anon Key**: For client-side operations (stored in `.env`)
- **Service Key**: Keep server-side only if required for privileged tasks
- **Project URL**: Configure via environment variables

### Tables Structure
- `bla_members` - Member registration data
- `complaints` - Complaint management
- `activities` - Party events and activities
- `office_tasks` - Administrative tasks

## 📁 File Structure

```
tvk/
├── index.html                # Main dashboard page
├── bla-registration.html     # BLA member registration form
├── styles.css               # Main stylesheet
├── bla-styles.css          # Registration page styles
├── script.js               # Main JavaScript functionality
├── bla-registration.js     # BLA registration specific scripts
├── supabase-config.js      # 🆕 Database configuration
├── demo-data.js            # Sample data for testing
├── database-schema.sql     # 🆕 Database schema
├── SUPABASE_SETUP.md      # 🆕 Database setup guide
├── images/
│   └── tvk-logo.svg       # Party logo
└── README.md              # This file
```

## 🚀 Technologies Used

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Grid and Flexbox
- **JavaScript (ES6+)** - Interactive functionality
- **Font Awesome** - Icons
- **Responsive Design** - Mobile-first approach

### Backend
- **Supabase** - Database and authentication
- **PostgreSQL** - Relational database
- **Storage** - File upload and management
- **Real-time** - Live data updates

### Features
- **Tamil Language Support** - Complete Tamil interface
- **File Upload** - Photos and documents with preview
- **Offline Capability** - LocalStorage fallback
- **Error Handling** - Graceful degradation

## ⚡ Quick Start

### 1. Database Setup
1. Follow instructions in `SUPABASE_SETUP.md`
2. Run SQL commands from `database-schema.sql`
3. Create storage buckets for file uploads

### 2. Local Development
1. Copy `.env.example` to `.env` and fill in your Supabase URL and anon key
2. Generate the runtime config with `npm run generate:env`
3. Open `index.html` in a modern web browser
4. No server setup required - runs locally
5. Database will auto-connect on page load

### 3. Testing
- Click "Demo Data" button to load sample data
- Test member registration and complaint forms
- All data saves to Supabase database

## 🔄 Data Flow

### Registration Process
1. User fills BLA registration form
2. Files uploaded to Supabase Storage
3. Member data saved to `bla_members` table
4. Confirmation with membership number

### Complaint Process
1. User submits complaint form
2. Data saved to `complaints` table
3. Auto-generated complaint number
4. Real-time status tracking

### Admin Features
1. View statistics from database
2. Manage member applications
3. Track complaint resolution
4. Generate reports

## 🔒 Security Features

- **Row Level Security (RLS)** enabled
- **API key management** for secure access
- **File upload validation** and size limits
- **Input sanitization** and validation
- **Error logging** for debugging

## 🌐 Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## 📱 Responsive Design

- **Mobile-first** approach
- **Tablet** optimized layouts
- **Desktop** enhanced experience
- **Touch-friendly** interface

## 🔮 Future Enhancements

- User authentication system
- Role-based access control
- Email/SMS notifications
- Payment integration for donations
- Mobile app version
- Advanced analytics dashboard
- Multi-language support
- API endpoints for third-party integration

## 🛠️ Development

### Local Storage Fallback
The app gracefully handles database connection issues by falling back to localStorage, ensuring functionality even when offline.

### File Upload
- Supports images (JPG, PNG) and PDFs
- Auto-preview for images
- Secure upload to Supabase Storage
- URL generation for database storage

### Error Handling
- User-friendly Tamil error messages
- Console logging for developers
- Graceful degradation for failed operations
- Retry mechanisms for network issues

---

## 🎉 **Ready to Use!**

Your TVK Political Party website is now fully integrated with Supabase database! 

- **Real-time data storage** ✅
- **File upload capability** ✅
- **Secure backend** ✅
- **Tamil language support** ✅
- **Mobile responsive** ✅

**TVK தமிழ் வெற்றிக் கழகம்**  
*மக்களின் குரல், மக்களின் கட்சி*