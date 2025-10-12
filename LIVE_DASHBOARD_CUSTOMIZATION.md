# Live Dashboard - Quick Customization Guide

## 🎛️ Easy Customization Options

### ⏱️ Change Refresh Rate

**Location**: Line ~1850 in `admin-dashboard.html`

**Default**: 10 seconds (10000ms)

```javascript
// Current (10 seconds)
refreshInterval = setInterval(() => {
    loadStatistics();
}, 10000);

// For 30 seconds
}, 30000);

// For 5 seconds (faster, more server load)
}, 5000);

// For 1 minute
}, 60000);
```

### 🎨 Change Union Colors

**Location**: Lines ~320-340 in `admin-dashboard.html`

```css
/* Puzhal - Currently Blue */
.union-card:nth-child(1) {
    border-left-color: #3b82f6;  /* Change this */
}

/* Villivakkam - Currently Purple */
.union-card:nth-child(2) {
    border-left-color: #8b5cf6;  /* Change this */
}

/* Sholavaram - Currently Pink */
.union-card:nth-child(3) {
    border-left-color: #ec4899;  /* Change this */
}

/* Senguntram - Currently Orange */
.union-card:nth-child(4) {
    border-left-color: #f59e0b;  /* Change this */
}
```

**Popular Color Options**:
- Red: `#ef4444`
- Green: `#10b981`
- Yellow: `#f59e0b`
- Blue: `#3b82f6`
- Purple: `#8b5cf6`
- Pink: `#ec4899`
- Cyan: `#06b6d4`
- Indigo: `#6366f1`

### 📏 Adjust Number Sizes

**Location**: Lines ~260-270 in `admin-dashboard.html`

```css
/* Main total members number */
.stat-number {
    font-size: 48px !important;  /* Change this (default 48px) */
}

/* Union card numbers */
.count-number {
    font-size: 42px;  /* Change this (default 42px) */
}
```

### 🔔 Add Sound Notification

**Location**: After line ~1720 in `admin-dashboard.html`

Add this function:
```javascript
function playNotificationSound() {
    const audio = new Audio('notification.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
}
```

Then modify `updateStatWithAnimation`:
```javascript
if (diff > 0) {
    changeElement.className = 'stat-change positive';
    changeElement.innerHTML = `<i class="fas fa-arrow-up"></i> +${diff}`;
    changeElement.style.display = 'inline-flex';
    playNotificationSound();  // Add this line
}
```

### 📊 Add More Unions/Towns

**Step 1**: Add HTML card (after line ~1339)
```html
<div class="union-card">
    <div class="union-header">
        <div class="union-icon">
            <i class="fas fa-map-marker-alt"></i>
        </div>
        <div class="union-name">
            <h4>New Union Name Tamil</h4>
            <p>New Union Name English</p>
        </div>
    </div>
    <div class="union-stats">
        <div class="union-count">
            <h2 id="newUnionCount" class="count-number">0</h2>
            <div class="stat-change" id="newUnionChange"></div>
        </div>
        <div class="union-percentage">
            <span id="newUnionPercent">0%</span> மொத்தத்தில்
        </div>
    </div>
</div>
```

**Step 2**: Add to CSS (after line ~360)
```css
.union-card:nth-child(5) {
    border-left-color: #06b6d4;  /* Cyan color */
}

.union-card:nth-child(5) .union-icon {
    background: linear-gradient(135deg, #06b6d4, #0891b2);
}
```

**Step 3**: Add to previousStats (line ~1665)
```javascript
let previousStats = {
    total: 0,
    puzhal: 0,
    villivakkam: 0,
    sholavaram: 0,
    senguntram: 0,
    newUnion: 0  // Add this
};
```

**Step 4**: Add query in loadUnionStats (after line ~1760)
```javascript
// New Union
const { count: newUnionCount } = await supabase
    .from('bla_members')
    .select('*', { count: 'exact', head: true })
    .or('town.ilike.%newtown%,town.ilike.%புதியஊர்%');

if (newUnionCount !== null) {
    updateStatWithAnimation('newUnionCount', newUnionCount, previousStats.newUnion);
    updatePercentage('newUnionPercent', newUnionCount, totalMembers);
    previousStats.newUnion = newUnionCount;
}
```

### 🎬 Change Animation Speed

**Location**: Line ~1810 in `admin-dashboard.html`

```javascript
// Function signature
updateStatWithAnimation(elementId, newValue, oldValue)

// Inside the function, find this line:
animateValue(element, parseInt(element.textContent) || 0, newValue, 800);
//                                                              ↑
//                                                       Change this number

// Faster animation (400ms)
animateValue(element, parseInt(element.textContent) || 0, newValue, 400);

// Slower animation (1200ms)
animateValue(element, parseInt(element.textContent) || 0, newValue, 1200);
```

### 🔕 Disable Auto-Refresh

**Location**: Line ~1581 in `admin-dashboard.html`

```javascript
// Comment out these lines:
// startAutoRefresh();
// console.log('Live statistics auto-refresh started (every 10 seconds)');

// Or keep first load only (no refresh):
await loadStatistics();
// Don't call startAutoRefresh()
```

### 🎨 Change Live Indicator Color

**Location**: Lines ~150-160 in `admin-dashboard.html`

```css
.live-indicator {
    /* Current: Red */
    background: linear-gradient(135deg, #ff0000, #ff4444);
    
    /* Green alternative */
    background: linear-gradient(135deg, #10b981, #34d399);
    
    /* Blue alternative */
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
}
```

### 📱 Adjust Mobile Breakpoint

**Location**: Line ~1154 in `admin-dashboard.html`

```css
/* Current: 768px */
@media (max-width: 768px) {
    /* Mobile styles */
}

/* For tablets (1024px) */
@media (max-width: 1024px) {
    /* Tablet styles */
}

/* For large phones (640px) */
@media (max-width: 640px) {
    /* Phone styles */
}
```

### 🕐 Change Time Format

**Location**: Line ~1860 in `admin-dashboard.html`

```javascript
// Current: 24-hour format
const timeString = now.toLocaleTimeString('ta-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
});

// 12-hour format with AM/PM
const timeString = now.toLocaleTimeString('ta-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: true  // Add this
});

// Without seconds
const timeString = now.toLocaleTimeString('ta-IN', { 
    hour: '2-digit', 
    minute: '2-digit'
    // Remove second line
});
```

### 🎯 Add More Statistics Cards

**Location**: After line ~1387 in `admin-dashboard.html`

```html
<!-- Add another stat card -->
<div class="stat-card">
    <div class="stat-icon" style="background: linear-gradient(135deg, #34d399, #10b981);">
        <i class="fas fa-user-check"></i>
    </div>
    <div class="stat-content">
        <h3 id="verifiedMembers">0</h3>
        <p>சரிபார்க்கப்பட்ட உறுப்பினர்கள்</p>
    </div>
</div>
```

Then add query in `loadStatistics()`:
```javascript
const { count: verifiedCount } = await supabase
    .from('bla_members')
    .select('*', { count: 'exact', head: true })
    .eq('verified', true);

if (verifiedCount !== null) {
    document.getElementById('verifiedMembers').textContent = verifiedCount;
}
```

### 📊 Export Statistics Function

**Location**: After line ~1875 in `admin-dashboard.html`

```javascript
// Add this function
async function exportLiveStats() {
    const stats = {
        timestamp: new Date().toISOString(),
        total: document.getElementById('totalMembers').textContent,
        puzhal: document.getElementById('puzhalCount').textContent,
        villivakkam: document.getElementById('villivakkamCount').textContent,
        sholavaram: document.getElementById('sholavaramCount').textContent,
        senguntram: document.getElementById('senguntramCount').textContent
    };
    
    const dataStr = JSON.stringify(stats, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `live-stats-${Date.now()}.json`;
    a.click();
}
```

Add button in HTML:
```html
<button onclick="exportLiveStats()" class="export-btn">
    <i class="fas fa-download"></i> Export Stats
</button>
```

## 🔧 Common Customizations

### Make Changes Badge Stay Visible
**Line ~1825**: Remove `setTimeout` to hide badge
```javascript
// Don't auto-hide the badge
// Comment out or remove any setTimeout code
```

### Add Percentage to Total Members
**Line ~1118**: Add this after the number
```html
<h3 id="totalMembers" class="stat-number">0</h3>
<div class="stat-sublabel">100% from all unions</div>
```

### Add Chart/Graph
Integrate Chart.js library and add canvas element
```html
<canvas id="unionChart"></canvas>
```

## 📝 Testing Your Changes

1. **Save file** after making changes
2. **Hard refresh** browser (Ctrl + Shift + R)
3. **Check console** for errors (F12)
4. **Wait 10 seconds** to see auto-refresh
5. **Test mobile view** (F12 → Device toolbar)

## ⚠️ Important Notes

- Always backup before making changes
- Test on multiple browsers
- Check mobile responsiveness
- Verify database queries work
- Monitor performance impact
- Keep refresh rate reasonable (5-60 seconds)

## 🎨 Color Palette Reference

```css
/* TVK Official Colors */
--tvk-primary: #DC143C    (Crimson Red)
--tvk-secondary: #FFD700  (Gold)
--tvk-accent: #FFA500     (Orange)

/* Status Colors */
Success/Growth: #10b981   (Green)
Warning: #f59e0b          (Amber)
Error: #ef4444            (Red)
Info: #3b82f6             (Blue)
Neutral: #6b7280          (Gray)

/* Union Colors (Current) */
Puzhal: #3b82f6           (Blue)
Villivakkam: #8b5cf6      (Purple)
Sholavaram: #ec4899       (Pink)
Senguntram: #f59e0b       (Orange)
```

Happy customizing! 🎉
