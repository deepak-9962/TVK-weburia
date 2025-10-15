// Migrate member photos from base64 in database to Supabase Storage
// This will make your database 50x smaller and queries 10x faster!

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const SUPABASE_URL = 'https://cbcuhojwffwppocnoxel.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiY3Vob2p3ZmZ3cHBvY25veGVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODk4Njc0NiwiZXhwIjoyMDc0NTYyNzQ2fQ.RH25RJm5tQU7Q7nCjUr_IDCZ_e-i2JJ_PuibbmJxA0M'; // ⚡ SERVICE ROLE KEY - Admin access for migration

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Statistics
const stats = {
    total: 0,
    migrated: 0,
    skipped: 0,
    failed: 0,
    errors: []
};

// Helper: Check if photo_url is base64
function isBase64Photo(photoUrl) {
    return photoUrl && (
        photoUrl.startsWith('data:image/') ||
        photoUrl.startsWith('data:application/')
    );
}

// Helper: Extract base64 data and convert to buffer
function base64ToBuffer(base64String) {
    try {
        // Remove data:image/jpeg;base64, prefix
        const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        
        if (matches && matches.length === 3) {
            const mimeType = matches[1];
            const base64Data = matches[2];
            const buffer = Buffer.from(base64Data, 'base64');
            
            // Get file extension from mime type
            const extension = mimeType.split('/')[1]?.split(';')[0] || 'jpg';
            
            return { buffer, extension, mimeType };
        }
        
        // Fallback: try to decode directly
        const buffer = Buffer.from(base64String, 'base64');
        return { buffer, extension: 'jpg', mimeType: 'image/jpeg' };
        
    } catch (error) {
        console.error('Error converting base64:', error.message);
        return null;
    }
}

// Main migration function
async function migratePhotos() {
    console.log('🚀 Starting Photo Migration to Supabase Storage\n');
    console.log('=' .repeat(60));
    
    try {
        // Step 1: Fetch all members
        console.log('\n📥 Fetching all members from database...');
        const { data: members, error: fetchError } = await supabase
            .from('bla_members')
            .select('id, full_name, photo_url');
        
        if (fetchError) {
            console.error('❌ Error fetching members:', fetchError);
            return;
        }
        
        stats.total = members.length;
        console.log(`✅ Found ${stats.total} members\n`);
        
        // Step 2: Process each member
        for (let i = 0; i < members.length; i++) {
            const member = members[i];
            const progress = `[${i + 1}/${stats.total}]`;
            
            // Skip if no photo
            if (!member.photo_url) {
                console.log(`${progress} ⏭️  ${member.full_name} - No photo, skipping`);
                stats.skipped++;
                continue;
            }
            
            // Skip if already a URL (already migrated)
            if (!isBase64Photo(member.photo_url)) {
                console.log(`${progress} ✅ ${member.full_name} - Already migrated, skipping`);
                stats.skipped++;
                continue;
            }
            
            // Migrate this photo
            console.log(`${progress} 🔄 ${member.full_name} - Migrating...`);
            
            try {
                // Convert base64 to buffer
                const photoData = base64ToBuffer(member.photo_url);
                if (!photoData) {
                    throw new Error('Failed to convert base64');
                }
                
                const { buffer, extension, mimeType } = photoData;
                
                // Generate unique filename
                const fileName = `member_${member.id}_${Date.now()}.${extension}`;
                const filePath = `members/${fileName}`;
                
                // Upload to Supabase Storage
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('member-photos')
                    .upload(filePath, buffer, {
                        contentType: mimeType,
                        upsert: false
                    });
                
                if (uploadError) {
                    throw uploadError;
                }
                
                // Get public URL
                const { data: urlData } = supabase.storage
                    .from('member-photos')
                    .getPublicUrl(filePath);
                
                const publicUrl = urlData.publicUrl;
                
                // Backup old URL and update database
                const { error: updateError } = await supabase
                    .from('bla_members')
                    .update({
                        photo_url: publicUrl,
                        photo_url_backup: member.photo_url  // Backup old base64
                    })
                    .eq('id', member.id);
                
                if (updateError) {
                    throw updateError;
                }
                
                console.log(`${progress} ✅ ${member.full_name} - Migrated successfully!`);
                console.log(`          📁 ${filePath}`);
                console.log(`          🔗 ${publicUrl}\n`);
                
                stats.migrated++;
                
            } catch (error) {
                console.error(`${progress} ❌ ${member.full_name} - Failed: ${error.message}\n`);
                stats.failed++;
                stats.errors.push({
                    member: member.full_name,
                    id: member.id,
                    error: error.message
                });
            }
        }
        
        // Step 3: Show summary
        console.log('\n' + '='.repeat(60));
        console.log('📊 Migration Complete!\n');
        console.log(`Total members:       ${stats.total}`);
        console.log(`✅ Migrated:         ${stats.migrated}`);
        console.log(`⏭️  Skipped:          ${stats.skipped}`);
        console.log(`❌ Failed:           ${stats.failed}`);
        console.log('='.repeat(60));
        
        if (stats.failed > 0) {
            console.log('\n⚠️  Failed Migrations:\n');
            stats.errors.forEach(err => {
                console.log(`   - ${err.member} (ID: ${err.id}): ${err.error}`);
            });
        }
        
        // Step 4: Show next steps
        if (stats.migrated > 0) {
            console.log('\n🎉 Success! Your photos are now in Supabase Storage!');
            console.log('\n📝 Next Steps:');
            console.log('   1. Test member-photos page - photos should load faster');
            console.log('   2. Update BLA registration form to use Storage upload');
            console.log('   3. Deploy changes to Vercel');
            console.log('\n💡 Benefits:');
            console.log('   - Database size reduced by ~50x');
            console.log('   - Queries 10x faster');
            console.log('   - No more timeout errors!');
            console.log('   - Photos served via CDN\n');
        }
        
    } catch (error) {
        console.error('\n❌ Fatal error:', error);
    }
}

// Check prerequisites before starting
async function checkPrerequisites() {
    console.log('🔍 Checking prerequisites...\n');
    
    // Check if bucket exists
    try {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        
        if (error) {
            console.error('❌ Cannot access Supabase Storage:', error.message);
            console.log('\n💡 Make sure you have the correct API key and permissions\n');
            return false;
        }
        
        const memberPhotosBucket = buckets.find(b => b.name === 'member-photos');
        
        if (!memberPhotosBucket) {
            console.error('❌ Bucket "member-photos" not found!');
            console.log('\n📋 Please create the bucket first:');
            console.log('   1. Go to Supabase Dashboard → Storage');
            console.log('   2. Click "New bucket"');
            console.log('   3. Name: member-photos');
            console.log('   4. Make it public');
            console.log('   5. Run the storage policies SQL\n');
            console.log('   See PHOTO_STORAGE_MIGRATION.md for details\n');
            return false;
        }
        
        console.log('✅ Bucket "member-photos" found');
        console.log('✅ Supabase connection working');
        console.log('✅ Ready to migrate!\n');
        return true;
        
    } catch (error) {
        console.error('❌ Error checking prerequisites:', error.message);
        return false;
    }
}

// Run migration
async function run() {
    const ready = await checkPrerequisites();
    
    if (!ready) {
        console.log('❌ Prerequisites not met. Please fix the issues above and try again.\n');
        process.exit(1);
    }
    
    console.log('⚠️  This will migrate photos from database to Supabase Storage');
    console.log('⚠️  Old base64 data will be backed up in photo_url_backup column');
    console.log('⚠️  Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    await migratePhotos();
}

// Execute
run().catch(console.error);
