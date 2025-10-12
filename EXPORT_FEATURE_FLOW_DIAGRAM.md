# 📊 Advanced Report Export - Feature Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TVK ADMIN DASHBOARD                                  │
│                      (admin-dashboard.html)                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    📊 அறிக்கை மற்றும் தரவு ஏற்றுமதி                         │
│                   (Reports & Data Export Section)                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
    ┌───────────────────────────┐   ┌──────────────────────────┐
    │   👥 உறுப்பினர்கள்        │   │   ⚠️ புகார்கள்           │
    │   (MEMBERS TAB)            │   │   (COMPLAINTS TAB)       │
    └───────────────────────────┘   └──────────────────────────┘
                    │                               │
                    ▼                               ▼
    ┌───────────────────────────┐   ┌──────────────────────────┐
    │   FILTER PANEL             │   │   FILTER PANEL           │
    │   ├─ District              │   │   ├─ Complaint Type      │
    │   ├─ Gender                │   │   ├─ Priority            │
    │   ├─ Status                │   │   ├─ Status              │
    │   ├─ Category              │   │   ├─ Assigned To         │
    │   └─ Date Range            │   │   └─ Date Range          │
    └───────────────────────────┘   └──────────────────────────┘
                    │                               │
                    ▼                               ▼
    ┌───────────────────────────┐   ┌──────────────────────────┐
    │  REAL-TIME PROCESSING      │   │  REAL-TIME PROCESSING    │
    │  getFilteredMembers()      │   │  getFilteredComplaints() │
    │         │                  │   │         │                │
    │         ▼                  │   │         ▼                │
    │  Supabase Query            │   │  Supabase Query          │
    │         │                  │   │         │                │
    │         ▼                  │   │         ▼                │
    │  Filter Results            │   │  Filter Results          │
    └───────────────────────────┘   └──────────────────────────┘
                    │                               │
                    ▼                               ▼
    ┌───────────────────────────┐   ┌──────────────────────────┐
    │   PREVIEW PANEL            │   │   PREVIEW PANEL          │
    │   ├─ Count: X records      │   │   ├─ Count: X records    │
    │   └─ Table: First 10       │   │   └─ Table: First 10     │
    └───────────────────────────┘   └──────────────────────────┘
                    │                               │
                    ▼                               ▼
    ┌───────────────────────────┐   ┌──────────────────────────┐
    │   EXPORT OPTIONS           │   │   EXPORT OPTIONS         │
    │   ├─ 📄 PDF Button         │   │   ├─ 📄 PDF Button       │
    │   ├─ 📊 Excel Button       │   │   ├─ 📊 Excel Button     │
    │   └─ 🔄 Reset Button       │   │   └─ 🔄 Reset Button     │
    └───────────────────────────┘   └──────────────────────────┘
            │             │                   │             │
            │             │                   │             │
     ┌──────┘             └──────┐     ┌──────┘             └──────┐
     │                           │     │                           │
     ▼                           ▼     ▼                           ▼
┌─────────┐              ┌─────────┐ ┌─────────┐           ┌─────────┐
│   PDF   │              │  EXCEL  │ │   PDF   │           │  EXCEL  │
│  EXPORT │              │ EXPORT  │ │  EXPORT │           │ EXPORT  │
└─────────┘              └─────────┘ └─────────┘           └─────────┘
     │                           │     │                           │
     ▼                           ▼     ▼                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        EXPORT LIBRARIES                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   jsPDF      │  │ jsPDF-Auto   │  │   SheetJS    │             │
│  │              │  │   Table      │  │    (xlsx)    │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
        ┌───────────────────────┐       ┌───────────────────────┐
        │  TVK_Members_Report   │       │  TVK_Complaints_      │
        │  _2025-10-12.pdf      │       │  Report_2025-10-12    │
        │                       │       │  .xlsx                │
        └───────────────────────┘       └───────────────────────┘
```

---

## Data Flow Sequence

### Members Export Flow:

```
1. USER INTERACTION
   └─> Click "Members" Tab
       └─> switchReportTab('members')

2. INITIALIZATION
   └─> loadMemberFilters()
       ├─> Fetch unique districts from bla_members
       ├─> Fetch unique categories from bla_members
       └─> Populate dropdown menus

3. FILTER APPLICATION
   └─> User selects filters
       └─> onChange event triggers updateMemberCount()
           └─> getFilteredMembersAdvanced()
               ├─> Build Supabase query with filters
               ├─> Execute query: supabase.from('bla_members').select(...)
               └─> Return filtered data array

4. PREVIEW UPDATE
   └─> updateMemberCount()
       ├─> Display record count
       ├─> Generate preview table (first 10 records)
       └─> Update UI with status badges

5. EXPORT TRIGGER
   └─> User clicks export button
       ├─> PDF Export Path:
       │   └─> exportMembersPDF()
       │       ├─> Get filtered data
       │       ├─> Initialize jsPDF (landscape A4)
       │       ├─> Add title and metadata
       │       ├─> Create table with autoTable plugin
       │       ├─> Add page numbers
       │       └─> Save file: TVK_Members_Report_[DATE].pdf
       │
       └─> Excel Export Path:
           └─> exportMembersExcel()
               ├─> Get filtered data
               ├─> Format data as JSON array
               ├─> Create workbook with XLSX.utils
               ├─> Set column widths
               └─> Save file: TVK_Members_Report_[DATE].xlsx
```

### Complaints Export Flow:

```
1. USER INTERACTION
   └─> Click "Complaints" Tab
       └─> switchReportTab('complaints')

2. FILTER APPLICATION
   └─> User selects filters
       └─> onChange event triggers updateComplaintCount()
           └─> getFilteredComplaints()
               ├─> Build Supabase query with filters
               ├─> Execute query: supabase.from('complaints').select(...)
               └─> Return filtered data array

3. PREVIEW UPDATE
   └─> updateComplaintCount()
       ├─> Display record count
       ├─> Generate preview table (first 10 records)
       └─> Update UI with priority/status badges

4. EXPORT TRIGGER
   └─> User clicks export button
       ├─> PDF Export Path:
       │   └─> exportComplaintsPDF()
       │       ├─> Get filtered data
       │       ├─> Initialize jsPDF (landscape A4)
       │       ├─> Add title and metadata
       │       ├─> Create table with autoTable plugin
       │       ├─> Add page numbers
       │       └─> Save file: TVK_Complaints_Report_[DATE].pdf
       │
       └─> Excel Export Path:
           └─> exportComplaintsExcel()
               ├─> Get filtered data
               ├─> Format data as JSON array
               ├─> Create workbook with XLSX.utils
               ├─> Set column widths
               └─> Save file: TVK_Complaints_Report_[DATE].xlsx
```

---

## Component Architecture

```
┌────────────────────────────────────────────────────────────┐
│                     admin-dashboard.html                    │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    HTML STRUCTURE                     │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  <div class="report-tabs">                           │  │
│  │    <button class="report-tab">Members</button>       │  │
│  │    <button class="report-tab">Complaints</button>    │  │
│  │  </div>                                              │  │
│  │                                                       │  │
│  │  <div id="membersExportSection">                     │  │
│  │    <div class="filter-panel">...</div>               │  │
│  │    <div class="preview-panel">...</div>              │  │
│  │  </div>                                              │  │
│  │                                                       │  │
│  │  <div id="complaintsExportSection">                  │  │
│  │    <div class="filter-panel">...</div>               │  │
│  │    <div class="preview-panel">...</div>              │  │
│  │  </div>                                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                     CSS STYLING                       │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  • .report-tabs (Tab container)                      │  │
│  │  • .report-tab (Tab buttons + hover effects)         │  │
│  │  • .export-section-container (Main container)        │  │
│  │  • .filter-panel (Filter area)                       │  │
│  │  • .filter-grid-advanced (Responsive grid)           │  │
│  │  • .preview-panel (Preview area)                     │  │
│  │  • .preview-table (Data table styling)               │  │
│  │  • .status-badge (Status indicators)                 │  │
│  │  • .export-btn (Export buttons)                      │  │
│  │  • @media queries (Mobile responsive)                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 JAVASCRIPT LOGIC                      │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  Tab Management:                                     │  │
│  │    • switchReportTab(tab)                            │  │
│  │                                                       │  │
│  │  Members Functions:                                  │  │
│  │    • loadMemberFilters()                             │  │
│  │    • getFilteredMembersAdvanced()                    │  │
│  │    • updateMemberCount()                             │  │
│  │    • resetMemberFilters()                            │  │
│  │    • exportMembersPDF()                              │  │
│  │    • exportMembersExcel()                            │  │
│  │                                                       │  │
│  │  Complaints Functions:                               │  │
│  │    • getFilteredComplaints()                         │  │
│  │    • updateComplaintCount()                          │  │
│  │    • resetComplaintFilters()                         │  │
│  │    • exportComplaintsPDF()                           │  │
│  │    • exportComplaintsExcel()                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 EXTERNAL LIBRARIES                    │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  • jsPDF v2.5.1 (PDF generation)                     │  │
│  │  • jsPDF-AutoTable v3.5.31 (PDF tables)              │  │
│  │  • SheetJS xlsx v0.20.0 (Excel export)               │  │
│  │  • Supabase Client (Database queries)                │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

---

## Database Query Pattern

### Members Query:
```javascript
let query = supabase
    .from('bla_members')
    .select('*')
    .order('created_at', { ascending: false });

// Apply filters conditionally
if (district) query = query.eq('district', district);
if (gender) query = query.eq('gender', gender);
if (status) query = query.eq('status', status);
if (category) query = query.eq('member_category', category);
if (fromDate) query = query.gte('created_at', fromDate + 'T00:00:00');
if (toDate) query = query.lte('created_at', toDate + 'T23:59:59');

const { data, error } = await query;
```

### Complaints Query:
```javascript
let query = supabase
    .from('complaints')
    .select('*')
    .order('created_at', { ascending: false });

// Apply filters conditionally
if (type) query = query.eq('complaint_type', type);
if (priority) query = query.eq('priority', priority);
if (status) query = query.eq('status', status);
if (assigned) query = query.ilike('assigned_to', `%${assigned}%`);
if (fromDate) query = query.gte('created_at', fromDate + 'T00:00:00');
if (toDate) query = query.lte('created_at', toDate + 'T23:59:59');

const { data, error } = await query;
```

---

## State Management

```
┌─────────────────────────────────────┐
│     Application State               │
├─────────────────────────────────────┤
│  • currentReportTab: 'members'      │
│  • memberFilters: {                 │
│      district: '',                  │
│      gender: '',                    │
│      status: '',                    │
│      category: '',                  │
│      fromDate: '',                  │
│      toDate: ''                     │
│    }                                │
│  • complaintFilters: {              │
│      type: '',                      │
│      priority: '',                  │
│      status: '',                    │
│      assigned: '',                  │
│      fromDate: '',                  │
│      toDate: ''                     │
│    }                                │
│  • previewData: []                  │
│  • isExporting: false               │
└─────────────────────────────────────┘
```

---

**Created for:** TVK Political Party Admin Dashboard  
**Feature Version:** 1.0  
**Last Updated:** October 12, 2025
