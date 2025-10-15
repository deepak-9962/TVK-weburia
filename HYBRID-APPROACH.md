// Hybrid approach - use JSON for viewing, Supabase for editing

// In member-photos.html (viewing page)
// - Load from members-data.json (fast)
// - Show a "Refresh Data" button

// In bla-office-entry.html (data entry page)  
// - Use Supabase directly (for adding new members)
// - After adding, run sync-members.js automatically

// This way:
// ✅ Viewing is instant (from JSON)
// ✅ Adding members still works (via Supabase)
// ✅ Sync manually or automatically after entries
