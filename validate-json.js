// Validate members-data.json format
const fs = require('fs');

console.log('🔍 Validating members-data.json...\n');

try {
    // Check if file exists
    if (!fs.existsSync('members-data.json')) {
        console.log('❌ File not found: members-data.json');
        console.log('💡 Please export data from Supabase first!');
        console.log('   See MANUAL_EXPORT_GUIDE.md for instructions\n');
        process.exit(1);
    }
    
    // Read and parse JSON
    const fileContent = fs.readFileSync('members-data.json', 'utf8');
    const data = JSON.parse(fileContent);
    
    console.log('✅ JSON syntax is valid!\n');
    
    // Check structure
    const issues = [];
    
    if (!data.exportDate) {
        issues.push('⚠️  Missing "exportDate" field');
    } else {
        console.log(`📅 Export Date: ${data.exportDate}`);
    }
    
    if (!data.totalMembers) {
        issues.push('⚠️  Missing "totalMembers" field');
    } else {
        console.log(`📊 Total Members (declared): ${data.totalMembers}`);
    }
    
    if (!data.members || !Array.isArray(data.members)) {
        issues.push('❌ Missing or invalid "members" array');
        console.log('\n❌ Critical: No members array found!\n');
        process.exit(1);
    }
    
    console.log(`📊 Actual Members (in array): ${data.members.length}`);
    
    // Check if counts match
    if (data.totalMembers !== data.members.length) {
        issues.push(`⚠️  Count mismatch: declared ${data.totalMembers} but found ${data.members.length}`);
    }
    
    // Check member structure
    if (data.members.length > 0) {
        const firstMember = data.members[0];
        const requiredFields = ['id', 'full_name', 'created_at'];
        const missingFields = requiredFields.filter(field => !firstMember.hasOwnProperty(field));
        
        if (missingFields.length > 0) {
            issues.push(`⚠️  First member missing fields: ${missingFields.join(', ')}`);
        }
        
        console.log('\n📋 First Member Sample:');
        console.log(`   ID: ${firstMember.id || 'N/A'}`);
        console.log(`   Name: ${firstMember.full_name || 'N/A'}`);
        console.log(`   Town: ${firstMember.town || 'N/A'}`);
        console.log(`   Photo: ${firstMember.photo_url ? '✅ Has photo' : '❌ No photo'}`);
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    if (issues.length === 0) {
        console.log('✅ VALIDATION PASSED!');
        console.log('   Your members-data.json file is properly formatted.');
        console.log('   The page will load ' + data.members.length + ' members.');
        console.log('\n🚀 Next: Open http://localhost:3000/member-photos.html');
    } else {
        console.log('⚠️  VALIDATION WARNINGS:');
        issues.forEach(issue => console.log('   ' + issue));
        console.log('\n💡 The file may still work, but please review the warnings.');
    }
    console.log('='.repeat(50) + '\n');
    
} catch (error) {
    console.log('❌ ERROR: ' + error.message);
    
    if (error instanceof SyntaxError) {
        console.log('\n💡 JSON syntax error! Your file has invalid JSON.');
        console.log('   Fix it using: https://jsonlint.com\n');
    }
    
    process.exit(1);
}
