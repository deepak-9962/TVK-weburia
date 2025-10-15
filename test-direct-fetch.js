// Simple member loader - replace the fetch logic in member-photos.html
// This bypasses Supabase JS client and uses direct REST API

async function fetchMembersSimple() {
    try {
        console.log('Fetching members using direct REST API...');
        
        const url = 'https://cbcuhojwffwppocnoxel.supabase.co/rest/v1/bla_members?select=*&limit=90';
        const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiY3Vob2p3ZmZ3cHBvY25veGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5ODY3NDYsImV4cCI6MjA3NDU2Mjc0Nn0.yYdiAY297k7dA2uUYnIlePy8xE0k8veUu_LoVae_QvI';
        
        const response = await fetch(url, {
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✅ Loaded ${data.length} members`);
        return data;
        
    } catch (error) {
        console.error('❌ Failed to load members:', error);
        throw error;
    }
}

// Test it
fetchMembersSimple().then(data => {
    console.log('First member:', data[0]);
});
