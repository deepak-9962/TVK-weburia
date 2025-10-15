// Auto-sync members from Supabase to members-data.json
// Run this whenever you want to update the local JSON file

const fs = require('fs');
const path = require('path');

async function syncMembers() {
    try {
        console.log('🔄 Syncing members from Supabase...');
        
        const SUPABASE_URL = 'https://cbcuhojwffwppocnoxel.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiY3Vob2p3ZmZ3cHBvY25veGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5ODY3NDYsImV4cCI6MjA3NDU2Mjc0Nn0.yYdiAY297k7dA2uUYnIlePy8xE0k8veUu_LoVae_QvI';
        
        const response = await fetch(`${SUPABASE_URL}/rest/v1/bla_members?select=*&order=created_at.desc`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const members = await response.json();
        
        console.log(`✅ Fetched ${members.length} members from Supabase`);
        
        // Save to members-data.json
        const filePath = path.join(__dirname, 'members-data.json');
        fs.writeFileSync(filePath, JSON.stringify(members, null, 2), 'utf8');
        
        console.log(`✅ Saved to members-data.json`);
        console.log(`📊 Total members: ${members.length}`);
        console.log(`📸 With photos: ${members.filter(m => m.photo_url).length}`);
        
    } catch (error) {
        console.error('❌ Sync failed:', error.message);
        process.exit(1);
    }
}

// Run the sync
syncMembers();
