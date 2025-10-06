# 🔄 Auto-Fill Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER INTERACTION                              │
└─────────────────────────────────────────────────────────────────────┘

    Employee opens BLA Registration Form
              ↓
    ┌────────────────────────┐
    │  Types பாகம் எண்       │
    │  (Part Number: 145)    │
    └────────────────────────┘
              ↓
    
┌─────────────────────────────────────────────────────────────────────┐
│                     JAVASCRIPT EVENT HANDLER                         │
└─────────────────────────────────────────────────────────────────────┘

    partNumberInput.addEventListener('input', ...)
              ↓
    ⏱️ Debounce Timer (500ms)
              ↓
    lookupAreaByPartNumber(145)
              ↓

┌─────────────────────────────────────────────────────────────────────┐
│                        DATABASE QUERY                                │
└─────────────────────────────────────────────────────────────────────┘

    SELECT parts.*, areas.name
    FROM parts
    JOIN areas ON parts.area_id = areas.id
    WHERE parts.part_number = 145
              ↓
    
    ┌──────────────────────────────┐
    │  Result from Supabase:       │
    │  {                           │
    │    part_number: 145,         │
    │    ward_circle: "17",        │
    │    areas: {                  │
    │      name: "மாதவரம்"         │
    │    }                         │
    │  }                           │
    └──────────────────────────────┘
              ↓

┌─────────────────────────────────────────────────────────────────────┐
│                        AUTO-FILL FIELDS                              │
└─────────────────────────────────────────────────────────────────────┘

    document.getElementById('area').value = "மாதவரம்"
              ↓
    document.getElementById('ward').value = "17"
              ↓
    Both fields turn GREEN (success color)
              ↓

┌─────────────────────────────────────────────────────────────────────┐
│                        USER SEES RESULT                              │
└─────────────────────────────────────────────────────────────────────┘

    ┌───────────────────────────────────────┐
    │ பாகம் எண் *                          │
    │ [ 145                    ]            │
    └───────────────────────────────────────┘
    
    ┌───────────────────────────────────────┐
    │ பகுதி / ஒன்றியம் / நகரம் *           │
    │ [ மாதவரம்              ] ✅ GREEN    │
    │ ✓ தானாக நிரப்பப்பட்டது               │
    └───────────────────────────────────────┘
    
    ┌───────────────────────────────────────┐
    │ வட்டம் / ஊராட்சி / வார்டு *          │
    │ [ 17                     ] ✅ GREEN    │
    │ ✓ தானாக நிரப்பப்பட்டது               │
    └───────────────────────────────────────┘
    
    Employee continues filling remaining fields...
```

---

## 🎨 Color States

### 🟦 Initial State (Empty)
```
[ _________________________ ]  (White background)
ℹ️ பாகம் எண் உள்ளிடவும்
```

### 🟡 Loading State (Searching)
```
[ தேடுகிறது... Searching... ]  (Yellow background)
⏳ Database query in progress
```

### 🟢 Success State (Found)
```
[ மாதவரம்                  ]  (Green background)
✅ Successfully auto-filled
```

### 🔴 Error State (Not Found)
```
[ பாகம் எண் 999 கண்டறியப்  ]  (Red background)
    படவில்லை
❌ Part number not in database
```

---

## 📊 Database Relationship

```
┌──────────────────────┐
│   areas              │
│──────────────────────│
│  id (PK)      │  1   │
│  name         │ மாத  │
│               │ வரம் │
└──────────────────────┘
         ↑
         │ Foreign Key
         │ Relationship
         │
┌──────────────────────┐
│   parts              │
│──────────────────────│
│  id (PK)        │ 1  │
│  part_number    │145 │
│  area_id (FK)   │ 1 ─┘
│  ward_circle    │"17"│
│  serial_number  │ 1  │
└──────────────────────┘
```

---

## 🔄 Data Flow

```
PDF Data → Database Tables → Form Auto-Fill
───────────────────────────────────────────

Step 1: PDF Extraction
┌─────────────────────────────────┐
│ வரி │ பகுதி  │ வட்டம் │ பாகம்  │
│ சை  │        │        │ எண்     │
│─────┼────────┼────────┼─────────│
│ 1   │மாதவரம்│   16   │ 1-12   │
│ 1   │மாதவரம்│   17   │145-147 │
│ 1   │மாதவரம்│   19   │166-193 │
└─────────────────────────────────┘
         ↓ Manual Entry
         
Step 2: Database Storage
┌──────────────────────────────┐
│ INSERT INTO areas...         │
│ INSERT INTO parts...         │
└──────────────────────────────┘
         ↓ Supabase
         
Step 3: Form Lookup
┌──────────────────────────────┐
│ User enters: 145             │
│ System queries database      │
│ Returns: மாதவரம், ward 17    │
└──────────────────────────────┘
         ↓ JavaScript
         
Step 4: Auto-Fill
┌──────────────────────────────┐
│ Area field ← "மாதவரம்"       │
│ Ward field ← "17"            │
│ Background ← GREEN           │
└──────────────────────────────┘
```

---

## ⚡ Performance Optimization

```
User Types: 1 → 4 → 5

Without Debouncing:
├─ Query for "1"     (unnecessary)
├─ Query for "14"    (unnecessary)
└─ Query for "145"   ✓

With Debouncing (500ms):
├─ Type "1"    ⏱️ Timer starts
├─ Type "4"    ⏱️ Timer resets
├─ Type "5"    ⏱️ Timer resets
└─ 500ms wait  ✓ Query for "145"

Result: Only 1 database query instead of 3!
```

---

## 🎯 Form Field Dependencies

```
பாகம் எண் (Part Number) ─────────┐
    │ User Input                    │
    │                               │
    └──> Database Lookup            │
            │                       │
            ├──> பகுதி (Area)       │
            │    AUTO-FILLED        │
            │    (மாதவரம்)          │
            │                       │
            └──> வட்டம் (Ward)      │
                 AUTO-FILLED        │
                 (17)               │
                                    │
                                    ↓
                            Form Continues:
                            - Name
                            - Address
                            - Phone
                            - etc.
```

---

## 📱 Mobile Responsive

The form is optimized for mobile use:

```
┌──────────────────┐
│  Mobile Phone    │
├──────────────────┤
│ பாகம் எண் *      │
│ [145______]      │
│ ℹ️ Auto-fills    │
├──────────────────┤
│ பகுதி *          │
│ [மாதவரம்   ] ✓  │
├──────────────────┤
│ வட்டம் *         │
│ [17        ] ✓   │
├──────────────────┤
│ ...              │
└──────────────────┘

✓ Touch-friendly
✓ Large input fields
✓ Clear visual feedback
✓ Works offline after data loads
```

---

## 🔐 Security

```
Row Level Security (RLS) Enabled
         ↓
┌────────────────────────────────┐
│ Policy: "Enable read access"   │
│ FOR SELECT                     │
│ USING (true)                   │
└────────────────────────────────┘
         ↓
All users can READ data
No users can WRITE data
(without additional permissions)
```

---

**Visual Guide Version**: 1.0  
**Last Updated**: October 6, 2025  
**File**: WORKFLOW-DIAGRAM.md
