// Test BLA Form Fields - Run this in the BLA form page console

function testBLAFormFields() {
    console.log('🔍 Testing BLA Form Fields Mapping...');
    
    // Check if we're on the right page
    const form = document.getElementById('blaRegistrationForm');
    if (!form) {
        console.error('❌ BLA Registration Form not found! Are you on the correct page?');
        return false;
    }
    
    console.log('✅ BLA Registration Form found');
    
    // Get all form inputs
    const inputs = form.querySelectorAll('input, select, textarea');
    console.log(`📝 Found ${inputs.length} form fields`);
    
    // List all form fields
    console.log('\n📋 Form Fields:');
    inputs.forEach((input, index) => {
        console.log(`${index + 1}. ${input.name || input.id || 'unnamed'} (${input.type}) - Required: ${input.required}`);
    });
    
    // Test form data collection
    const formData = new FormData(form);
    console.log('\n📊 Current Form Data:');
    for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
            console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
        } else {
            console.log(`${key}: ${value}`);
        }
    }
    
    // Check database schema mapping
    const dbColumns = [
        'membership_number', 'full_name', 'father_name', 'date_of_birth', 'gender', 
        'occupation', 'education', 'mobile', 'alt_mobile', 'email', 'address', 
        'district', 'pincode', 'voter_id', 'part_number', 'constituency', 
        'previous_party', 'interests', 'aadhaar_number', 'religion', 
        'member_category', 'photo_url', 'id_proof_url', 'status', 
        'registered_by_employee_id', 'area_union_city', 'ward_village'
    ];
    
    console.log('\n🗃️ Database Schema Check:');
    dbColumns.forEach(col => {
        const hasField = formData.has(col) || 
                        formData.has(col.replace('_', '')) ||
                        document.querySelector(`[name="${col}"], [name="${col.replace('_', '')}"]`);
        console.log(`${hasField ? '✅' : '⚠️'} ${col}`);
    });
    
    return true;
}

// Test membership number generation
function testMembershipNumber() {
    const membershipNumber = 'TVK' + Date.now();
    console.log('🎫 Generated membership number:', membershipNumber);
    return membershipNumber;
}

// Test interest collection
function testInterests() {
    const interestCheckboxes = document.querySelectorAll('input[name="interests"]:checked');
    const interests = Array.from(interestCheckboxes).map(cb => cb.value);
    console.log('🎯 Selected interests:', interests);
    return interests;
}

// Run all tests
function runAllBLATests() {
    console.clear();
    console.log('🚀 Running BLA Form Tests...\n');
    
    testBLAFormFields();
    testMembershipNumber();
    testInterests();
    
    console.log('\n✅ All tests completed! Check the output above for any issues.');
}

console.log('🧪 BLA Form Test Tools Loaded!');
console.log('Run: runAllBLATests() to test everything');
console.log('Or run individual tests: testBLAFormFields(), testMembershipNumber(), testInterests()');