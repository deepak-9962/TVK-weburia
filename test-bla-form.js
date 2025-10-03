// Quick test for BLA registration form
// Run this in browser console to test form submission

function testBLAFormData() {
    console.log('Testing BLA form data mapping...');
    
    // Get form element
    const form = document.getElementById('blaRegistrationForm');
    if (!form) {
        console.error('BLA form not found!');
        return;
    }
    
    // Create test FormData
    const formData = new FormData();
    formData.set('fullName', 'Test Member');
    formData.set('fatherName', 'Test Father');
    formData.set('dateOfBirth', '1990-01-01');
    formData.set('gender', 'male');
    formData.set('occupation', 'Software Developer');
    formData.set('education', 'graduate');
    formData.set('mobile', '9876543210');
    formData.set('altMobile', '9876543211');
    formData.set('email', 'test@example.com');
    formData.set('address', 'Test Address, Chennai');
    formData.set('district', 'chennai');
    formData.set('pincode', '600001');
    formData.set('voterId', 'ABC1234567');
    formData.set('constituency', 'Test Constituency');
    formData.set('previousParty', 'None');
    formData.append('interests', 'youth');
    formData.append('interests', 'social');
    
    // Test member data processing
    const membershipNumber = 'TVK' + Date.now();
    const interests = formData.getAll('interests');
    
    const memberData = {
        membership_number: membershipNumber,
        full_name: formData.get('fullName'),
        father_name: formData.get('fatherName'),
        date_of_birth: formData.get('dateOfBirth'),
        gender: formData.get('gender'),
        occupation: formData.get('occupation'),
        education: formData.get('education') || null,
        mobile: formData.get('mobile'),
        alt_mobile: formData.get('altMobile') || null,
        email: formData.get('email') || null,
        address: formData.get('address'),
        district: formData.get('district'),
        pincode: formData.get('pincode'),
        voter_id: formData.get('voterId') || null,
        part_number: formData.get('partNumber') || null,
        constituency: formData.get('constituency') || null,
        previous_party: formData.get('previousParty') || null,
        interests: interests.length > 0 ? interests : null,
        aadhaar_number: formData.get('aadhaarNumber') || null,
        religion: formData.get('religion') || null,
        member_category: formData.get('memberCategory') || null,
        area_union_city: formData.get('areaUnionCity') || null,
        ward_village: formData.get('wardVillage') || null,
        photo_url: null,
        id_proof_url: null,
        registered_by_employee_id: null,
        status: 'active'
    };
    
    console.log('Test member data:', memberData);
    
    // Validate required fields
    const requiredFields = ['membership_number', 'full_name', 'father_name', 'date_of_birth', 'gender', 'occupation', 'mobile', 'address', 'district', 'pincode'];
    const missingFields = requiredFields.filter(field => !memberData[field]);
    
    if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
    } else {
        console.log('✅ All required fields present');
    }
    
    // Test database connection
    if (window.supabaseClient) {
        console.log('✅ Supabase client available');
        
        // Test insert (without actually inserting)
        console.log('Would insert this data:', JSON.stringify(memberData, null, 2));
    } else {
        console.error('❌ Supabase client not available');
    }
    
    return memberData;
}

// Run the test
console.log('BLA Form Test loaded. Run testBLAFormData() to test form data mapping.');