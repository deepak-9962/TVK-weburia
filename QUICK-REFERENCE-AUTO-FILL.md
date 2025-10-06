# 🎯 Quick Reference - Auto-Fill Workflow

## 📱 User Experience (2-Page Flow)

### Page 1: வாக்காளர் எண் சரிபார்ப்பு
```
Employee opens → voter-check.html

┌─────────────────────────────────────┐
│ 1. வாக்காளர் எண் *                 │
│    [SCY1234567_________] ← Types   │
├─────────────────────────────────────┤
│ 2. பாகம் எண் *                     │
│    [145____________] ← Types        │
│                                     │
│    ↓ AUTO-FILLS (500ms)             │
│                                     │
│ 3. பகுதி / ஒன்றியம் / நகரம்        │
│    [மாதவரம் வடக்கு பகுதி] ✓ AUTO  │
│                                     │
│ 4. வட்டம் / ஊராட்சி / வார்டு       │
│    [17              ] ✓ AUTO        │
├─────────────────────────────────────┤
│ [கிடைக்குமா என சரிபார்க்கவும்]    │
│ [பதிவுக்கு தொடரவும்] ← Click      │
└─────────────────────────────────────┘
```

### Page 2: BLA பதிவு படிவம்
```
Redirects to → bla-office-entry.html

┌─────────────────────────────────────┐
│ ALL 4 FIELDS PRE-FILLED & LOCKED:   │
├─────────────────────────────────────┤
│ பாகம் எண் * [145] 🔒 GREEN         │
│ பகுதி *  [மாதவரம் வடக்கு பகுதி]   │
│         🔒 GREEN                     │
│ வட்டம் * [17] 🔒 GREEN              │
│ வாக்காளர் எண் * [SCY1234567]       │
│                🔒 BLUE               │
├─────────────────────────────────────┤
│ Employee only fills:                │
│ - பெயர் (Name)                      │
│ - முகவரி (Address)                  │
│ - தொலைபேசி (Phone)                 │
│ - புகைப்படம் (Photo)                │
│ - etc.                              │
└─────────────────────────────────────┘
```

---

## 🔧 Technical Summary

### Files Modified (3):
1. **voter-check.html** - Added Area/Ward display fields
2. **voter-check.js** - Added `lookupPartNumber()` function + URL params
3. **bla-office-entry.js** - Updated `parseURLParameters()` to get area/ward

### Database Required:
- `areas` table (10 areas)
- `parts` table (475 parts)
- Run: `complete-parts-schema.sql`

### Key Functions:

#### voter-check.js:
```javascript
lookupPartNumber(partNumber) 
// Queries database, fills area/ward fields

proceedToRegistration()
// Passes: voterId, partNumber, area, ward
```

#### bla-office-entry.js:
```javascript
parseURLParameters()
// Reads URL, pre-fills all 4 fields, locks them
```

---

## 📊 Data Flow (One Line)

```
User types Part# → DB lookup → Auto-fill Area/Ward → Pass to Form → Pre-fill & Lock
```

---

## ✅ Testing (3 Steps)

1. **Search Page**: Type `145` → See "மாதவரம் வடக்கு பகுதி" + "17"
2. **Click Through**: Click "பதிவுக்கு தொடரவும்"
3. **Form Page**: Verify all 4 fields pre-filled & locked (green/blue backgrounds)

---

## 🎨 Visual States

| State | Part Field | Area Field | Ward Field |
|-------|-----------|-----------|-----------|
| **Empty** | White | Hidden | Hidden |
| **Loading** | User typing | Yellow 🟡 | Yellow 🟡 |
| **Success** | User value | Green 🟢 | Green 🟢 |
| **Error** | User value | Red 🔴 | Red 🔴 |
| **Form Page** | Green 🔒 | Green 🔒 | Green 🔒 |

---

## 🚀 Deployment

```bash
1. Run SQL: complete-parts-schema.sql in Supabase
2. Upload 3 files: voter-check.html, voter-check.js, bla-office-entry.js
3. Test with Part #145
4. Done! ✅
```

---

## 📝 Key Points

✅ **Part Number entered ONCE** (on search page)  
✅ **Area/Ward auto-filled** (from database)  
✅ **All 4 fields pre-filled** (on form page)  
✅ **No duplicate data entry**  
✅ **Readonly fields** (cannot edit)  
✅ **Faster workflow** (employee just fills name/address/photo)

---

**Status**: ✅ Complete  
**Version**: 2.0  
**Date**: October 6, 2025
