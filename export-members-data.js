// One-time script to export members from Supabase to local JSON
// Run this with: node export-members-data.js

const fs = require('fs');

const SUPABASE_URL = 'https://cbcuhojwffwppocnoxel.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiY3Vob2p3ZmZ3cHBvY25veGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5ODY3NDYsImV4cCI6MjA3NDU2Mjc0Nn0.yYdiAY297k7dA2uUYnIlePy8xE0k8veUu_LoVae_QvI';

async function exportMembers() {
    try {
        console.log('🔄 Fetching members from Supabase...');
        
        // Try to fetch in small batches
        let allMembers = [];
        let offset = 0;
        const batchSize = 20; // Very small batch
        let attempts = 0;
        const maxAttempts = 10;
        
        while (attempts < maxAttempts) {
            console.log(`   Loading batch ${attempts + 1} (offset: ${offset})...`);
            
            try {
                const response = await fetch(
                    `${SUPABASE_URL}/rest/v1/bla_members?select=*&limit=${batchSize}&offset=${offset}`,
                    {
                        headers: {
                            'apikey': SUPABASE_KEY,
                            'Authorization': `Bearer ${SUPABASE_KEY}`
                        }
                    }
                );
                
                if (!response.ok) {
                    console.error(`   ❌ Batch failed: ${response.status} ${response.statusText}`);
                    break;
                }
                
                const batch = await response.json();
                console.log(`   ✅ Loaded ${batch.length} members`);
                
                if (batch.length === 0) {
                    break;
                }
                
                allMembers = allMembers.concat(batch);
                offset += batchSize;
                attempts++;
                
                // If we got less than batchSize, we're done
                if (batch.length < batchSize) {
                    break;
                }
                
                // Wait a bit between requests to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (error) {
                console.error(`   ❌ Error in batch: ${error.message}`);
                break;
            }
        }
        
        if (allMembers.length === 0) {
            console.error('❌ No members fetched. The database might be timing out.');
            console.log('\n💡 Alternative: Export data manually from Supabase dashboard:');
            console.log('   1. Go to Table Editor → bla_members');
            console.log('   2. Click "..." menu → Export to JSON');
            console.log('   3. Save as members-data.json in this folder');
            process.exit(1);
        }
        
        // Save to JSON file
        const jsonData = {
            exportDate: new Date().toISOString(),
            totalMembers: allMembers.length,
            members: allMembers
        };
        
        fs.writeFileSync('members-data.json', JSON.stringify(jsonData, null, 2));
        
        console.log(`\n✅ Successfully exported ${allMembers.length} members to members-data.json`);
        console.log(`📅 Export date: ${jsonData.exportDate}`);
        console.log('\n💡 Now your member-photos.html will load data from this cached file!');
        
    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    }
}

exportMembers();
