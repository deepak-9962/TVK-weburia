// Data Entry JavaScript for TVK-weburia project

// Supabase configuration
const SUPABASE_URL = 'https://cbcuhojwffwppocnoxel.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiY3Vob2p3ZmZ3cHBvY25veGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5ODY3NDYsImV4cCI6MjA3NDU2Mjc0Nn0.yYdiAY297k7dA2uUYnIlePy8xE0k8veUu_LoVae_QvI';

let supabaseClient;
let currentEmployee = null;
let currentVoterData = null;
let currentStep = 1;

// DOM elements
let statusMessage, employeeName, employeeRole, logoutBtn;
let voterLookupForm, voterIdNumber, voterName, searchVoterBtn, voterDetails, voterInfo;
let memberRegistrationForm, memberName, memberAge, memberGender, memberPhone, memberEmail, memberAddress, memberConstituency, memberDistrict;
let backBtn, nextBtn, submitBtn;
let step1, step2, voterLookupSection, memberRegistrationSection;

// Initialize Supabase
async function initializeSupabase() {
    try {
        // Load Supabase library if not already loaded
        if (!window.supabase) {
            await loadSupabaseLibrary();
        }
        
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase initialized successfully');
        return supabaseClient;
    } catch (error) {
        console.error('Error initializing Supabase:', error);
        throw error;
    }
}

// Load Supabase library from CDN
function loadSupabaseLibrary() {
    return new Promise((resolve, reject) => {
        if (window.supabase) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/dist/umd/supabase.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Supabase library'));
        document.head.appendChild(script);
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Initialize Supabase
        await initializeSupabase();
        
        // Check authentication
        if (!checkAuthentication()) {
            return; // Redirect handled by checkAuthentication
        }
        
        // Get DOM elements
        initializeDOMElements();
        
        // Setup employee info display
        displayEmployeeInfo();
        
        // Add event listeners
        setupEventListeners();
        
        console.log('Data entry page initialized successfully');
        
    } catch (error) {
        console.error('Error initializing data entry page:', error);
        showStatusMessage('பிழை: பயன்பாட்டை தொடங்க முடியவில்லை. மீண்டும் உள்நுழைக்கவும்.', 'error');
        setTimeout(() => {
            window.location.href = 'office-login.html';
        }, 3000);
    }
});

// Initialize DOM elements
function initializeDOMElements() {
    // Status and header elements
    statusMessage = document.getElementById('statusMessage');
    employeeName = document.getElementById('employeeName');
    employeeRole = document.getElementById('employeeRole');
    logoutBtn = document.getElementById('logoutBtn');
    
    // Step elements
    step1 = document.getElementById('step1');
    step2 = document.getElementById('step2');
    voterLookupSection = document.getElementById('voterLookupSection');
    memberRegistrationSection = document.getElementById('memberRegistrationSection');
    
    // Voter lookup elements
    voterLookupForm = document.getElementById('voterLookupForm');
    voterIdNumber = document.getElementById('voterIdNumber');
    voterName = document.getElementById('voterName');
    searchVoterBtn = document.getElementById('searchVoterBtn');
    voterDetails = document.getElementById('voterDetails');
    voterInfo = document.getElementById('voterInfo');
    
    // Member registration elements
    memberRegistrationForm = document.getElementById('memberRegistrationForm');
    memberName = document.getElementById('memberName');
    memberAge = document.getElementById('memberAge');
    memberGender = document.getElementById('memberGender');
    memberPhone = document.getElementById('memberPhone');
    memberEmail = document.getElementById('memberEmail');
    memberAddress = document.getElementById('memberAddress');
    memberConstituency = document.getElementById('memberConstituency');
    memberDistrict = document.getElementById('memberDistrict');
    
    // Navigation buttons
    backBtn = document.getElementById('backBtn');
    nextBtn = document.getElementById('nextBtn');
    submitBtn = document.getElementById('submitBtn');
}

// Check authentication
function checkAuthentication() {
    const sessionData = sessionStorage.getItem('tvk_employee_session');
    
    if (!sessionData) {
        showStatusMessage('அங்கீकரிக்கப்படவில்லை. உள்நுழைக்கவும்.', 'error');
        setTimeout(() => {
            window.location.href = 'office-login.html';
        }, 2000);
        return false;
    }
    
    try {
        const session = JSON.parse(sessionData);
        const now = new Date().getTime();
        
        // Check if session is expired
        if (session.expiresAt && now >= session.expiresAt) {
            sessionStorage.removeItem('tvk_employee_session');
            showStatusMessage('அமர்வு காலாவதியாகிவிட்டது. மீண்டும் உள்நுழைக்கவும்.', 'error');
            setTimeout(() => {
                window.location.href = 'office-login.html';
            }, 2000);
            return false;
        }
        
        currentEmployee = session;
        return true;
        
    } catch (error) {
        console.error('Error parsing session data:', error);
        sessionStorage.removeItem('tvk_employee_session');
        showStatusMessage('அமர்வு தரவு செல்லாது. மீண்டும் உள்நுழைக்கவும்.', 'error');
        setTimeout(() => {
            window.location.href = 'office-login.html';
        }, 2000);
        return false;
    }
}

// Display employee info
function displayEmployeeInfo() {
    if (currentEmployee) {
        employeeName.textContent = currentEmployee.fullName || currentEmployee.username;
        
        // Translate role to Tamil
        const roleTamil = {
            'admin': 'நிர்வாகி',
            'manager': 'மேலாளர்',
            'data_entry': 'தரவு உள்ளீடு'
        };
        employeeRole.textContent = roleTamil[currentEmployee.role] || currentEmployee.role;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Logout button
    logoutBtn.addEventListener('click', handleLogout);
    
    // Voter lookup form
    voterLookupForm.addEventListener('submit', handleVoterLookup);
    
    // Member registration form
    memberRegistrationForm.addEventListener('submit', handleMemberRegistration);
    
    // Navigation buttons
    nextBtn.addEventListener('click', handleNext);
    backBtn.addEventListener('click', handleBack);
    submitBtn.addEventListener('click', handleSubmit);
    
    // Member category checkboxes
    const categoryCheckboxes = document.querySelectorAll('input[name="memberCategory"]');
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleCategoryChange);
    });
    
    // Auto-format voter ID
    voterIdNumber.addEventListener('input', formatVoterIdNumber);
    
    // Phone number validation
    memberPhone.addEventListener('input', formatPhoneNumber);
}

// Handle logout
function handleLogout() {
    if (confirm('நீங்கள் உறுதியாக வெளியேற விரும்புகிறீர்களா?')) {
        sessionStorage.removeItem('tvk_employee_session');
        showStatusMessage('வெற்றிகரமாக வெளியேறினீர்கள்.', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Handle voter lookup
async function handleVoterLookup(e) {
    e.preventDefault();
    
    const voterId = voterIdNumber.value.trim().toUpperCase();
    const voterNameValue = voterName.value.trim();
    
    if (!voterId || !voterNameValue) {
        showStatusMessage('⚠️ வாக்காளர் அடையாள எண் மற்றும் பெயர் இரண்டையும் உள்ளிடவும்', 'error');
        return;
    }
    
    if (voterId.length < 8) {
        showStatusMessage('⚠️ வாக்காளர் அடையாள எண் குறைந்தது 8 எழுத்துகள் இருக்க வேண்டும்', 'error');
        return;
    }
    
    try {
        // Show loading
        showStatusMessage('வாக்காளர் தகவல் தேடப்படுகிறது...', 'loading');
        searchVoterBtn.disabled = true;
        searchVoterBtn.innerHTML = '<div class="loading-spinner"></div> தேடப்படுகிறது...';
        
        // Check if member already exists
        const existingMember = await checkExistingMember(voterId);
        if (existingMember) {
            showStatusMessage('⚠️ இந்த வாக்காளர் ஏற்கனவே உறுப்பினராக பதிவு செய்யப்பட்டுள்ளார்', 'error');
            return;
        }
        
        // Simulate voter lookup (in production, this would call a real API)
        const voterData = await simulateVoterLookup(voterId, voterNameValue);
        
        if (voterData) {
            currentVoterData = voterData;
            displayVoterDetails(voterData);
            showStatusMessage('✅ வாக்காளர் தகவல் வெற்றிகரமாக கண்டறியப்பட்டது', 'success');
        } else {
            showStatusMessage('❌ வாக்காளர் தகவல் கண்டறியப்படவில்லை. விவரங்களை சரிபார்த்து மீண்டும் முயற்சிக்கவும்.', 'error');
        }
        
    } catch (error) {
        console.error('Voter lookup error:', error);
        showStatusMessage('❌ வாக்காளர் தகவல் தேடுவதில் பிழை. மீண்டும் முயற்சிக்கவும்.', 'error');
        
    } finally {
        searchVoterBtn.disabled = false;
        searchVoterBtn.innerHTML = '<i class="fas fa-search"></i> தேடு';
    }
}

// Check if member already exists
async function checkExistingMember(voterId) {
    try {
        const { data, error } = await supabaseClient
            .from('bla_members')
            .select('id, voter_id_number, full_name')
            .eq('voter_id_number', voterId)
            .limit(1);
        
        if (error) {
            console.error('Error checking existing member:', error);
            return null;
        }
        
        return data && data.length > 0 ? data[0] : null;
        
    } catch (error) {
        console.error('Error checking existing member:', error);
        return null;
    }
}

// Simulate voter lookup (replace with real API in production)
async function simulateVoterLookup(voterId, voterNameValue) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock voter database - in production, this would be a real API call
    const mockVoterDatabase = {
        'ABC1234567': {
            id: 'ABC1234567',
            name: 'முருகன் கண்ணன்',
            age: 35,
            gender: 'ஆண்',
            fatherName: 'கண்ணன் சுப்ரமணியன்',
            address: '123, மெயின் ஸ்ட்ரீட், சென்னை - 600001',
            constituency: 'டி.நகர்',
            district: 'சென்னை',
            pollingStation: 'அரசு உயர்நிலைப் பள்ளி, டி.நகர்'
        },
        'XYZ9876543': {
            id: 'XYZ9876543',
            name: 'கவிதா ராமன்',
            age: 28,
            gender: 'பெண்',
            fatherName: 'ராமன் வெங்கடேஷ்',
            address: '456, பார்க் ரோடு, கோயம்பத்தூர் - 641001',
            constituency: 'கோயம்பத்தூர் தெற்கு',
            district: 'கோயம்பத்தூர்',
            pollingStation: 'அரசு தொடக்கப் பள்ளி, ராமநகர்'
        },
        'DEF5555555': {
            id: 'DEF5555555',
            name: 'ராஜேஷ் குமார்',
            age: 42,
            gender: 'ஆண்',
            fatherName: 'குமார் பாலசுப்ரமணியன்',
            address: '789, காந்தி நகர், மதுரை - 625001',
            constituency: 'மதுரை மத்திய',
            district: 'மதுரை',
            pollingStation: 'அரசு உயர்நிலைப் பள்ளி, காந்தி நகர்'
        }
    };
    
    // Look for exact voter ID match
    let voterData = mockVoterDatabase[voterId];
    
    // If exact match not found, try to find a similar match based on name
    if (!voterData) {
        for (const [id, data] of Object.entries(mockVoterDatabase)) {
            if (data.name.toLowerCase().includes(voterNameValue.toLowerCase()) || 
                voterNameValue.toLowerCase().includes(data.name.toLowerCase())) {
                // Update the voter ID to match the search
                voterData = { ...data, id: voterId };
                break;
            }
        }
    }
    
    // If still no match, generate a random voter for demo purposes
    if (!voterData) {
        const genders = ['ஆண்', 'பெண்', 'மூன்றாம் பாலினம்'];
        const constituencies = ['சென்னை வடக்கு', 'சென்னை தெற்கு', 'டி.நகர்', 'கோயம்பத்தூர் தெற்கு', 'மதுரை மத்திய'];
        const districts = ['சென்னை', 'கோயம்பத்தூர்', 'மதுரை', 'திருச்சி', 'சேலம்'];
        
        voterData = {
            id: voterId,
            name: voterNameValue,
            age: Math.floor(Math.random() * 50) + 18,
            gender: genders[Math.floor(Math.random() * genders.length)],
            fatherName: 'பெயர் கிடைக்கவில்லை',
            address: 'முகவரி கிடைக்கவில்லை',
            constituency: constituencies[Math.floor(Math.random() * constituencies.length)],
            district: districts[Math.floor(Math.random() * districts.length)],
            pollingStation: 'வாக்குச் சாவடி தகவல் கிடைக்கவில்லை'
        };
    }
    
    return voterData;
}

// Display voter details
function displayVoterDetails(voterData) {
    const voterInfoHTML = `
        <div class="voter-field">
            <strong>வாக்காளர் அடையாள எண்:</strong>
            ${voterData.id}
        </div>
        <div class="voter-field">
            <strong>முழு பெயர்:</strong>
            ${voterData.name}
        </div>
        <div class="voter-field">
            <strong>வயது:</strong>
            ${voterData.age} ஆண்டுகள்
        </div>
        <div class="voter-field">
            <strong>பாலினம்:</strong>
            ${voterData.gender}
        </div>
        <div class="voter-field">
            <strong>தந்தையின் பெயர்:</strong>
            ${voterData.fatherName}
        </div>
        <div class="voter-field">
            <strong>தொகுதி:</strong>
            ${voterData.constituency}
        </div>
        <div class="voter-field">
            <strong>மாவட்டம்:</strong>
            ${voterData.district}
        </div>
        <div class="voter-field">
            <strong>வாக்குச் சாவடி:</strong>
            ${voterData.pollingStation}
        </div>
        <div class="voter-field" style="grid-column: 1 / -1;">
            <strong>முகவரி:</strong>
            ${voterData.address}
        </div>
    `;
    
    voterInfo.innerHTML = voterInfoHTML;
    voterDetails.classList.add('show');
}

// Handle navigation
function handleNext() {
    if (currentStep === 1) {
        if (!currentVoterData) {
            showStatusMessage('⚠️ முதலில் வாக்காளர் தகவல் தேடலை முடிக்கவும்', 'error');
            return;
        }
        
        // Move to step 2
        moveToStep(2);
        populateMemberForm();
    }
}

function handleBack() {
    if (currentStep === 2) {
        moveToStep(1);
    }
}

// Move to specific step
function moveToStep(step) {
    currentStep = step;
    
    // Update step indicators
    step1.classList.toggle('active', step === 1);
    step1.classList.toggle('completed', step > 1);
    
    step2.classList.toggle('active', step === 2);
    
    // Show/hide sections
    voterLookupSection.classList.toggle('active', step === 1);
    memberRegistrationSection.classList.toggle('active', step === 2);
    
    // Update navigation buttons
    backBtn.style.display = step > 1 ? 'inline-flex' : 'none';
    nextBtn.style.display = step === 1 ? 'inline-flex' : 'none';
    submitBtn.style.display = step === 2 ? 'inline-flex' : 'none';
}

// Populate member form with voter data
function populateMemberForm() {
    if (currentVoterData) {
        memberName.value = currentVoterData.name;
        memberAge.value = currentVoterData.age;
        memberGender.value = currentVoterData.gender;
        memberConstituency.value = currentVoterData.constituency;
        memberDistrict.value = currentVoterData.district;
        memberAddress.value = currentVoterData.address;
    }
}

// Handle member registration submission
async function handleSubmit() {
    try {
        // Validate form
        if (!validateMemberForm()) {
            return;
        }
        
        // Show loading
        showStatusMessage('உறுப்பினர் பதிவு செய்யப்படுகிறது...', 'loading');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="loading-spinner"></div> பதிவு செய்யப்படுகிறது...';
        
        // Prepare member data
        const memberData = prepareMemberData();
        
        // Save to database
        const savedMember = await saveMemberToDatabase(memberData);
        
        if (savedMember) {
            showStatusMessage('✅ உறுப்பினர் வெற்றிகரமாக பதிவு செய்யப்பட்டார்!', 'success');
            
            // Reset form after success
            setTimeout(() => {
                resetForm();
            }, 2000);
        } else {
            showStatusMessage('❌ உறுப்பினர் பதிவில் பிழை. மீண்டும் முயற்சிக்கவும்.', 'error');
        }
        
    } catch (error) {
        console.error('Member registration error:', error);
        showStatusMessage('❌ உறுப்பினர் பதிவில் பிழை. மீண்டும் முயற்சிக்கவும்.', 'error');
        
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> பதிவு செய்';
    }
}

// Validate member form
function validateMemberForm() {
    const requiredFields = [
        { field: memberName, name: 'முழு பெயர்' },
        { field: memberAge, name: 'வயது' },
        { field: memberGender, name: 'பாலினம்' },
        { field: memberPhone, name: 'தொலைபேசி எண்' },
        { field: memberAddress, name: 'முகவரி' },
        { field: memberConstituency, name: 'தொகுதி' },
        { field: memberDistrict, name: 'மாவட்டம்' }
    ];
    
    for (const { field, name } of requiredFields) {
        if (!field.value.trim()) {
            showStatusMessage(`⚠️ ${name} கட்டாயம் நிரப்பப்பட வேண்டும்`, 'error');
            field.focus();
            return false;
        }
    }
    
    // Validate phone number
    if (!/^[0-9]{10}$/.test(memberPhone.value.trim())) {
        showStatusMessage('⚠️ தொலைபேசி எண் 10 இலக்கங்கள் இருக்க வேண்டும்', 'error');
        memberPhone.focus();
        return false;
    }
    
    // Validate email if provided
    if (memberEmail.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberEmail.value.trim())) {
        showStatusMessage('⚠️ சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்', 'error');
        memberEmail.focus();
        return false;
    }
    
    // Validate member categories
    const selectedCategories = document.querySelectorAll('input[name="memberCategory"]:checked');
    if (selectedCategories.length === 0) {
        showStatusMessage('⚠️ குறைந்தது ஒரு உறுப்பினர் வகையை தேர்ந்தெடுக்கவும்', 'error');
        return false;
    }
    
    return true;
}

// Prepare member data
function prepareMemberData() {
    const selectedCategories = Array.from(document.querySelectorAll('input[name="memberCategory"]:checked'))
        .map(cb => cb.value);
    
    return {
        voter_id_number: currentVoterData.id,
        full_name: memberName.value.trim(),
        age: parseInt(memberAge.value),
        gender: memberGender.value,
        phone_number: memberPhone.value.trim(),
        email: memberEmail.value.trim() || null,
        address: memberAddress.value.trim(),
        constituency: memberConstituency.value.trim(),
        district: memberDistrict.value.trim(),
        member_categories: selectedCategories,
        registered_by_employee_id: currentEmployee.employeeId,
        membership_date: new Date().toISOString(),
        status: 'active'
    };
}

// Save member to database
async function saveMemberToDatabase(memberData) {
    try {
        const { data, error } = await supabaseClient
            .from('bla_members')
            .insert([memberData])
            .select();
        
        if (error) {
            console.error('Database error:', error);
            return null;
        }
        
        return data && data.length > 0 ? data[0] : null;
        
    } catch (error) {
        console.error('Error saving member:', error);
        return null;
    }
}

// Reset form
function resetForm() {
    // Reset all form fields
    voterLookupForm.reset();
    memberRegistrationForm.reset();
    
    // Reset checkboxes
    document.querySelectorAll('input[name="memberCategory"]').forEach(cb => {
        cb.checked = false;
        cb.parentElement.classList.remove('selected');
    });
    
    // Reset data
    currentVoterData = null;
    
    // Hide voter details
    voterDetails.classList.remove('show');
    
    // Go back to step 1
    moveToStep(1);
    
    hideStatusMessage();
}

// Handle category checkbox changes
function handleCategoryChange(e) {
    const checkbox = e.target;
    const item = checkbox.parentElement;
    
    if (checkbox.checked) {
        item.classList.add('selected');
    } else {
        item.classList.remove('selected');
    }
}

// Format voter ID number
function formatVoterIdNumber() {
    let value = voterIdNumber.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    voterIdNumber.value = value;
}

// Format phone number
function formatPhoneNumber() {
    let value = memberPhone.value.replace(/[^0-9]/g, '');
    if (value.length > 10) {
        value = value.substring(0, 10);
    }
    memberPhone.value = value;
}

// Show status message
function showStatusMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
    
    // Auto-hide non-error messages after 5 seconds
    if (type !== 'error') {
        setTimeout(() => {
            if (statusMessage.classList.contains(type)) {
                hideStatusMessage();
            }
        }, 5000);
    }
    
    // Scroll to top to show message
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Hide status message
function hideStatusMessage() {
    statusMessage.style.display = 'none';
    statusMessage.className = 'status-message';
}

// Handle window beforeunload
window.addEventListener('beforeunload', function(e) {
    if (currentVoterData && currentStep > 1) {
        e.preventDefault();
        e.returnValue = 'நீங்கள் செய்த மாற்றங்கள் சேமிக்கப்படாமல் போகும். நீங்கள் உறுதியாக வெளியேற விரும்புகிறீர்களா?';
    }
});

// Auto-logout on tab close/browser close
window.addEventListener('beforeunload', function() {
    // Don't remove session here - let it expire naturally
    // This prevents accidental logouts when refreshing page
});