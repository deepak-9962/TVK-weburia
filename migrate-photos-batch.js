// Batch Migration - Fetch members in small chunks to avoid timeout
// This will process photos in batches of 10 members at a time

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Supabase configuration
const SUPABASE_URL = 'https://cbcuhojwffwppocnoxel.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiY3Vob2p3ZmZ3cHBvY25veGVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODk4Njc0NiwiZXhwIjoyMDc0NTYyNzQ2fQ.RH25RJm5tQU7Q7nCjUr_IDCZ_e-i2JJ_PuibbmJxA0M';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BUCKET_NAME = 'member-photos';
const BATCH_SIZE = 5; // Process 5 members at a time

// Statistics
const stats = {
  total: 0,
  processed: 0,
  uploaded: 0,
  skipped: 0,
  errors: 0,
  startTime: Date.now()
};

// Convert base64 to buffer
function base64ToBuffer(base64String) {
  const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string');
  }
  return {
    mimeType: matches[1],
    buffer: Buffer.from(matches[2], 'base64')
  };
}

// Get file extension from mime type
function getExtension(mimeType) {
  const extensions = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp'
  };
  return extensions[mimeType] || 'jpg';
}

// Process a single member
async function processMember(member, index, total) {
  console.log(`\n📸 Processing ${index}/${total}: ${member.full_name} (ID: ${member.id})`);
  
  // Skip if no photo_url
  if (!member.photo_url) {
    console.log('  ⏭️  No photo - skipping');
    stats.skipped++;
    return;
  }

  // Check if it's a base64 photo (not a URL yet)
  if (!member.photo_url.startsWith('data:image')) {
    console.log('  ✅ Already migrated (has URL) - skipping');
    stats.skipped++;
    return;
  }

  try {
    // Step 1: Backup old photo data (base64) into backup column
    console.log('  💾 Backing up old photo data...');
    const { error: backupError } = await supabase
      .from('bla_members')
      .update({ photo_url_backup: member.photo_url })
      .eq('id', member.id);

    if (backupError) {
      console.log('  ⚠️  Backup failed:', backupError.message);
    }

    // Step 2: Convert base64 to buffer
    console.log('  🔄 Converting base64 to image...');
    const { mimeType, buffer } = base64ToBuffer(member.photo_url);
    const extension = getExtension(mimeType);
    const fileName = `member_${member.id}_${Date.now()}.${extension}`;
    const filePath = `members/${fileName}`;

    console.log(`  📤 Uploading to Storage (${(buffer.length / 1024).toFixed(1)} KB)...`);
    
    // Step 3: Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: mimeType,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.log('  ❌ Upload failed:', uploadError.message);
      stats.errors++;
      return;
    }

    // Step 4: Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;
    console.log('  🔗 Public URL:', publicUrl.substring(0, 60) + '...');

    // Step 5: Update database with new URL (replace base64 with URL!)
    console.log('  💾 Updating database...');
    const { error: updateError } = await supabase
      .from('bla_members')
      .update({ 
        photo_url: publicUrl  // Replace base64 with actual URL!
      })
      .eq('id', member.id);

    if (updateError) {
      console.log('  ❌ Database update failed:', updateError.message);
      stats.errors++;
      return;
    }

    console.log('  ✅ SUCCESS! Photo migrated');
    stats.uploaded++;

  } catch (error) {
    console.log('  ❌ Error:', error.message);
    stats.errors++;
  }
}

// Main migration function
async function migratePhotos() {
  console.log('🚀 Starting Batch Photo Migration\n');
  console.log('============================================================\n');

  // Check bucket exists
  console.log('🔍 Checking bucket...');
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets.find(b => b.name === BUCKET_NAME)) {
    console.log('❌ Bucket not found!');
    return;
  }
  console.log('✅ Bucket found\n');

  let offset = 0;
  let hasMore = true;
  let totalFetched = 0;

  while (hasMore) {
    console.log(`\n📦 Fetching batch (offset: ${offset}, limit: ${BATCH_SIZE})...`);
    
    // Fetch only ID, full_name, photo_url (which currently has base64!), photo_url_backup in batches
    const { data: members, error } = await supabase
      .from('bla_members')
      .select('id, full_name, photo_url, photo_url_backup')
      .range(offset, offset + BATCH_SIZE - 1)
      .order('id');

    if (error) {
      console.log('❌ Error fetching batch:', error.message);
      break;
    }

    if (!members || members.length === 0) {
      console.log('✅ No more members to process');
      hasMore = false;
      break;
    }

    console.log(`✅ Fetched ${members.length} members`);
    totalFetched += members.length;

    // Process each member in this batch
    for (let i = 0; i < members.length; i++) {
      await processMember(members[i], totalFetched - members.length + i + 1, '?');
      stats.processed++;
    }

    offset += BATCH_SIZE;

    // Stop if we got fewer members than requested (reached the end)
    if (members.length < BATCH_SIZE) {
      hasMore = false;
    }
  }

  // Print final statistics
  const duration = ((Date.now() - stats.startTime) / 1000).toFixed(1);
  
  console.log('\n\n============================================================');
  console.log('📊 MIGRATION COMPLETE!');
  console.log('============================================================\n');
  console.log(`✅ Successfully uploaded: ${stats.uploaded} photos`);
  console.log(`⏭️  Skipped: ${stats.skipped} members`);
  console.log(`❌ Errors: ${stats.errors}`);
  console.log(`📦 Total processed: ${stats.processed} members`);
  console.log(`⏱️  Time taken: ${duration} seconds`);
  console.log('\n🎉 Photos are now in Supabase Storage!');
  console.log('🗄️  Your database is now much smaller and faster!');
  
  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    stats,
    duration: `${duration}s`
  };
  
  fs.writeFileSync(
    'migration-report.json',
    JSON.stringify(report, null, 2)
  );
  console.log('\n📄 Report saved to: migration-report.json');
}

// Run migration
migratePhotos().catch(error => {
  console.error('\n❌ FATAL ERROR:', error);
  process.exit(1);
});
