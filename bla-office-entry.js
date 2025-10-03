// BLA Office Entry JavaScript for TVK-weburia project

// Supabase configuration
const SUPABASE_URL = 'https://cbcuhojwffwppocnoxel.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiY3Vob2p3ZmZ3cHBvY25veGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5ODY3NDYsImV4cCI6MjA3NDU2Mjc0Nn0.yYdiAY297k7dA2uUYnIlePy8xE0k8veUu_LoVae_QvI';

let supabaseClient;

// Initialize Supabase
async function initializeSupabase() {
    try {
        // Load Supabase library from CDN
        if (!window.supabase) {
            await loadSupabaseLibrary();
        }
        
        // Create Supabase client
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

// DOM elements
let form, submitBtn, resetBtn, statusMessage;
let voterNumberInput, partNumberInput, photoInput, photoPreview, photoUpload;

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Check if user is logged in (admin or employee)
        // First check for BLA employee session, then fall back to admin session
        let userSession = sessionStorage.getItem('bla_employee_session');
        let isEmployee = false;
        
        if (!userSession) {
            // Check for admin session
            userSession = sessionStorage.getItem('tvk_admin_user');
            if (!userSession) {
                // Neither employee nor admin logged in
                alert('நீங்கள் உள்நுழைய வேண்டும். தயவுசெய்து முதலில் உள்நுழைக.\nYou must be logged in. Please login first.');
                window.location.href = 'office-login.html';
                return;
            }
        } else {
            isEmployee = true;
        }
        
        // Verify the user session
        try {
            const user = JSON.parse(userSession);
            console.log('Logged in as:', user.username || user.full_name, '(ID:', user.id || user.employeeId, ')');
            console.log('User type:', isEmployee ? 'Employee' : 'Admin');
            
            // Display logged-in user info if there's a header element
            const userDisplay = document.getElementById('loggedInUser');
            if (userDisplay) {
                userDisplay.textContent = `உள்நுழைந்தவர்: ${user.fullName || user.full_name || user.username}`;
            }
        } catch (e) {
            console.error('Invalid session:', e);
            sessionStorage.removeItem('bla_employee_session');
            sessionStorage.removeItem('tvk_admin_user');
            window.location.href = 'office-login.html';
            return;
        }
        
        // Initialize Supabase
        await initializeSupabase();
        
        // Get DOM elements
        form = document.getElementById('officeEntryForm');
        submitBtn = document.getElementById('submitBtn');
        resetBtn = document.getElementById('resetBtn');
        statusMessage = document.getElementById('statusMessage');
        voterNumberInput = document.getElementById('voterNumber');
        partNumberInput = document.getElementById('partNumber');
        photoInput = document.getElementById('photoInput');
        photoPreview = document.getElementById('photoPreview');
        photoUpload = document.getElementById('photoUpload');
        
        // Parse URL parameters and prefill form
        parseURLParameters();
        
        // Add event listeners
        form.addEventListener('submit', handleFormSubmission);
        resetBtn.addEventListener('click', resetForm);
        
        // Photo upload functionality
        setupPhotoUpload();
        
        // Input validation
        setupInputValidation();
        
        console.log('Office entry form initialized successfully');
        
    } catch (error) {
        console.error('Error initializing office entry form:', error);
        showStatusMessage('பிழை: பயன்பாட்டை தொடங்க முடியவில்லை. பக்கத்தை மீண்டும் ஏற்றவும்.', 'error');
    }
});

// Parse URL parameters and prefill form
function parseURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const voterId = urlParams.get('voterId');
    const partNumber = urlParams.get('partNumber');
    
    if (voterId && partNumber) {
        voterNumberInput.value = voterId;
        partNumberInput.value = partNumber;
        
        // Make these fields read-only
        voterNumberInput.readOnly = true;
        partNumberInput.readOnly = true;
        
        console.log('Pre-filled voter ID and part number from URL parameters');
    } else {
        console.warn('No URL parameters found for voter ID and part number');
    }
}

// Setup photo upload functionality
function setupPhotoUpload() {
    // Click to upload
    photoUpload.addEventListener('click', () => {
        photoInput.click();
    });
    
    // File input change
    photoInput.addEventListener('change', handlePhotoSelection);
    
    // Drag and drop functionality
    photoUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        photoUpload.classList.add('dragover');
    });
    
    photoUpload.addEventListener('dragleave', () => {
        photoUpload.classList.remove('dragover');
    });
    
    photoUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        photoUpload.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handlePhotoFile(files[0]);
        }
    });
}

// Handle photo selection
function handlePhotoSelection(e) {
    const file = e.target.files[0];
    if (file) {
        handlePhotoFile(file);
    }
}

// Handle photo file
function handlePhotoFile(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showStatusMessage('⚠️ கிருபया செல்லுபடியாகும் படக் கோப்பை தேர்ந்தெடுக்கவும் (PNG, JPG, JPEG)', 'error');
        return;
    }
    
    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        showStatusMessage('⚠️ படக் கோப்பு 5MB-க்கு அதிகமாக இருக்க கூடாது', 'error');
        return;
    }
    
    // Create file reader for preview
    const reader = new FileReader();
    reader.onload = function(e) {
        photoPreview.src = e.target.result;
        photoPreview.style.display = 'block';
        
        // Update upload area to show selected file
        const uploadContent = photoUpload.querySelector('.photo-upload-content');
        uploadContent.innerHTML = `
            <i class="fas fa-check-circle" style="color: #28a745;"></i>
            <p><strong>படம் தேர்ந்தெடுக்கப்பட்டது</strong></p>
            <p>${file.name}</p>
            <p><small>மாற்ற கிளிக் செய்யவும்</small></p>
        `;
    };
    reader.readAsDataURL(file);
    
    // Set the file input
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    photoInput.files = dataTransfer.files;
}

// Setup input validation
function setupInputValidation() {
    // Phone number validation
    const phoneInput = document.getElementById('phoneNumber');
    phoneInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '').substring(0, 10);
    });
    
    // Aadhaar number validation
    const aadhaarInput = document.getElementById('aadhaarNumber');
    aadhaarInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '').substring(0, 12);
    });
    
    // Name validation (allow Tamil and English letters only)
    const nameInputs = ['fullName', 'fatherName'];
    nameInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        input.addEventListener('input', function() {
            // Allow Tamil Unicode range, English letters, spaces, and common punctuation
            this.value = this.value.replace(/[^a-zA-Z\u0B80-\u0BFF\s\.\-]/g, '');
        });
    });
}

// Handle form submission
async function handleFormSubmission(e) {
    e.preventDefault();
    
    try {
        // Show loading state
        showStatusMessage('படிவம் சமர்ப்பிக்கப்படுகிறது...', 'loading');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="loading-spinner"></div> சமர்ப்பிக்கப்படுகிறது...';
        
        // Validate required fields
        if (!validateForm()) {
            return;
        }
        
        // Collect form data
        const formData = collectFormData();
        
        // Upload photo if selected
        let photoUrl = null;
        if (photoInput.files.length > 0) {
            photoUrl = await uploadPhoto(photoInput.files[0]);
        }
        
        // Generate membership number
        const membershipNumber = await generateMembershipNumber();
        
        // Get logged-in employee/admin ID from session
        let registeredByEmployeeId = null;
        try {
            // First check for BLA employee session
            let userSession = sessionStorage.getItem('bla_employee_session');
            if (userSession) {
                const employee = JSON.parse(userSession);
                registeredByEmployeeId = employee.employeeId || employee.id;
                console.log('Registered by BLA employee ID:', registeredByEmployeeId);
            } else {
                // Fall back to admin session
                const adminUser = sessionStorage.getItem('tvk_admin_user');
                if (adminUser) {
                    const user = JSON.parse(adminUser);
                    registeredByEmployeeId = user.id;
                    console.log('Registered by admin ID:', registeredByEmployeeId);
                }
            }
        } catch (e) {
            console.warn('Could not get employee ID from session:', e);
        }
        
        // Prepare data for database
        const memberData = {
            membership_number: membershipNumber,
            full_name: formData.fullName,
            father_name: formData.fatherName,
            date_of_birth: formData.dateOfBirth,
            mobile: formData.phoneNumber,
            address: formData.address,
            voter_id: formData.voterNumber,
            part_number: formData.partNumber,
            aadhaar_number: formData.aadhaarNumber || null,
            religion: formData.religion || null,
            member_category: formData.memberCategories.join(', ') || null,
            photo_url: photoUrl,
            district: formData.area,
            pincode: '600000', // Default pincode for Madhavaram
            gender: formData.gender, // Get gender from form
            occupation: 'Not specified', // Default
            education: null, // Set to null instead of invalid value
            status: 'active',
            registered_by_employee_id: registeredByEmployeeId // Add employee ID who registered this member
        };
        
        // Check if voter ID already exists
        if (memberData.voter_id) {
            const { data: existing, error: checkError } = await supabaseClient
                .from('bla_members')
                .select('id')
                .eq('voter_id', memberData.voter_id)
                .single();
            
            if (existing) {
                throw new Error('இந்த வாக்காளர் அடையாள எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது. வேறு எண்ணை பயன்படுத்தவும்.');
            }
        }
        
        // Insert into database
        const { data, error } = await supabaseClient
            .from('bla_members')
            .insert([memberData])
            .select();
        
        if (error) {
            // Check if it's a duplicate voter ID error
            if (error.message && error.message.includes('bla_members_voter_id_unique')) {
                throw new Error('இந்த வாக்காளர் அடையாள எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது.');
            }
            throw error;
        }
        
        // Success
        showStatusMessage('✅ வெற்றிகரமாக பதிவு செய்யப்பட்டது! உங்கள் உறுப்பினர் எண்: ' + membershipNumber, 'success');
        
        // Reset form after successful submission
        setTimeout(() => {
            resetForm();
        }, 3000);
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showStatusMessage('❌ பதிவு செய்வதில் பிழை. மீண்டும் முயற்சிக்கவும்.', 'error');
        
    } finally {
        // Reset submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>சமர்ப்பிக்கவும்</span>';
    }
}

// Validate form
function validateForm() {
    const requiredFields = [
        { id: 'area', name: 'பகுதி' },
        { id: 'ward', name: 'வட்டம்/ஊராட்சி/வார்டு' },
        { id: 'partNumber', name: 'பாகம் எண்' },
        { id: 'voterNumber', name: 'வாக்காளர் எண்' },
        { id: 'fullName', name: 'பெயர்' },
        { id: 'fatherName', name: 'தந்தை/கணவர் பெயர்' },
        { id: 'dateOfBirth', name: 'பிறந்த தேதி' },
        { id: 'phoneNumber', name: 'தொலைபேசி எண்' },
        { id: 'address', name: 'விலாசம்' }
    ];
    
    for (const field of requiredFields) {
        const input = document.getElementById(field.id);
        if (!input.value.trim()) {
            showStatusMessage(`⚠️ ${field.name} கட்டாயமாக நிரப்ப வேண்டும்`, 'error');
            input.focus();
            return false;
        }
    }
    
    // Validate phone number
    const phoneNumber = document.getElementById('phoneNumber').value;
    if (phoneNumber.length !== 10 || !phoneNumber.startsWith('6') && !phoneNumber.startsWith('7') && !phoneNumber.startsWith('8') && !phoneNumber.startsWith('9')) {
        showStatusMessage('⚠️ செல்லுபடியாகும் மொபைல் எண்ணை உள்ளிடவும்', 'error');
        document.getElementById('phoneNumber').focus();
        return false;
    }
    
    // Validate Aadhaar number if provided
    const aadhaarNumber = document.getElementById('aadhaarNumber').value;
    if (aadhaarNumber && aadhaarNumber.length !== 12) {
        showStatusMessage('⚠️ ஆதார் எண் 12 இலக்கங்கள் கொண்டதாக இருக்க வேண்டும்', 'error');
        document.getElementById('aadhaarNumber').focus();
        return false;
    }
    
    // Validate date of birth
    const dob = new Date(document.getElementById('dateOfBirth').value);
    const today = new Date();
    const age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
    
    if (age < 18) {
        showStatusMessage('⚠️ 18 வயதுக்கு மேற்பட்டவர்கள் மட்டுமே பதிவு செய்ய முடியும்', 'error');
        document.getElementById('dateOfBirth').focus();
        return false;
    }
    
    if (age > 120) {
        showStatusMessage('⚠️ செல்லுபடியாகும் பிறந்த தேதியை உள்ளிடவும்', 'error');
        document.getElementById('dateOfBirth').focus();
        return false;
    }
    
    return true;
}

// Collect form data
function collectFormData() {
    const memberCategories = [];
    document.querySelectorAll('input[name="memberCategory"]:checked').forEach(checkbox => {
        memberCategories.push(checkbox.value);
    });
    
    return {
        area: document.getElementById('area').value.trim(),
        ward: document.getElementById('ward').value.trim(),
        partNumber: document.getElementById('partNumber').value.trim(),
        voterNumber: document.getElementById('voterNumber').value.trim(),
        fullName: document.getElementById('fullName').value.trim(),
        fatherName: document.getElementById('fatherName').value.trim(),
        dateOfBirth: document.getElementById('dateOfBirth').value,
        gender: document.getElementById('gender').value, // Added gender field
        phoneNumber: document.getElementById('phoneNumber').value.trim(),
        aadhaarNumber: document.getElementById('aadhaarNumber').value.trim(),
        religion: document.getElementById('religion').value,
        address: document.getElementById('address').value.trim(),
        memberCategories: memberCategories
    };
}

// Upload photo to Supabase Storage
async function uploadPhoto(file) {
    try {
        // Option 1: Upload to Supabase Storage (if bucket exists)
        // First, try to upload to storage bucket
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `member-photos/${fileName}`;
            
            console.log('Uploading photo to Supabase storage...');
            const { data: uploadData, error: uploadError } = await supabaseClient.storage
                .from('tvk-storage')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });
            
            if (uploadError) {
                console.warn('Storage upload failed, using base64 fallback:', uploadError.message);
                throw uploadError;
            }
            
            // Get public URL
            const { data: urlData } = supabaseClient.storage
                .from('tvk-storage')
                .getPublicUrl(filePath);
            
            console.log('Photo uploaded successfully to storage:', urlData.publicUrl);
            return urlData.publicUrl;
            
        } catch (storageError) {
            // Option 2: Fallback to base64 if storage fails
            console.log('Using base64 fallback for photo storage');
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    console.log('Photo converted to base64 successfully');
                    resolve(reader.result);
                };
                reader.onerror = (error) => {
                    console.error('Error reading photo:', error);
                    showStatusMessage('⚠️ படம் செயலாக்குவதில் பிழை. படம் இல்லாமல் தொடர்கிறது.', 'warning');
                    resolve(null);
                };
                reader.readAsDataURL(file);
            });
        }
        
    } catch (error) {
        console.error('Error processing photo:', error);
        showStatusMessage('⚠️ படம் செயலாக்குவதில் பிழை. படம் இல்லாமல் தொடர்கிறது.', 'warning');
        return null;
    }
}

// Generate membership number
async function generateMembershipNumber() {
    try {
        // Get count of existing members to generate next number
        const { count, error } = await supabaseClient
            .from('bla_members')
            .select('*', { count: 'exact', head: true });
        
        if (error) {
            throw error;
        }
        
        const nextNumber = (count || 0) + 1;
        return `TVK-MAD-${nextNumber.toString().padStart(6, '0')}`;
        
    } catch (error) {
        console.error('Error generating membership number:', error);
        // Fallback to timestamp-based number
        return `TVK-MAD-${Date.now().toString().slice(-6)}`;
    }
}

// Reset form
function resetForm() {
    // Reset all form fields except read-only ones
    const inputs = form.querySelectorAll('input:not([readonly]), select, textarea');
    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });
    
    // Reset photo upload
    photoPreview.style.display = 'none';
    const uploadContent = photoUpload.querySelector('.photo-upload-content');
    uploadContent.innerHTML = `
        <i class="fas fa-cloud-upload-alt"></i>
        <p><strong>புகைப்படத்தை பதிவேற்ற கிளிக் செய்யவும்</strong></p>
        <p>அல்லது இங்கே இழுத்து விடவும்</p>
        <p><small>PNG, JPG, JPEG வடிவங்கள் மட்டுமே (அதிகபட்சம் 5MB)</small></p>
    `;
    
    // Hide status message
    hideStatusMessage();
    
    // Focus on first input
    document.getElementById('area').focus();
}

// Show status message
function showStatusMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
    
    // Auto-hide non-error messages after 5 seconds
    if (type !== 'error') {
        setTimeout(() => {
            hideStatusMessage();
        }, 5000);
    }
    
    // Scroll to message
    statusMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Hide status message
function hideStatusMessage() {
    statusMessage.style.display = 'none';
    statusMessage.className = 'status-message';
}

// Utility functions
function formatPhoneNumber(value) {
    return value.replace(/[^0-9]/g, '').substring(0, 10);
}

function formatAadhaarNumber(value) {
    return value.replace(/[^0-9]/g, '').substring(0, 12);
}

// Error handling for network issues
window.addEventListener('online', function() {
    showStatusMessage('✅ இணைய இணைப்பு மீண்டும் கிடைத்துள்ளது', 'success');
});

window.addEventListener('offline', function() {
    showStatusMessage('⚠️ இணைய இணைப்பு துண்டிக்கப்பட்டது', 'error');
});

// Auto-save draft functionality (optional)
let autoSaveInterval;

function startAutoSave() {
    autoSaveInterval = setInterval(() => {
        const formData = collectFormData();
        localStorage.setItem('bla_form_draft', JSON.stringify(formData));
    }, 30000); // Save every 30 seconds
}

function loadDraft() {
    const draft = localStorage.getItem('bla_form_draft');
    if (draft) {
        try {
            const formData = JSON.parse(draft);
            // Fill form with draft data (implement if needed)
            console.log('Draft data available:', formData);
        } catch (error) {
            console.error('Error loading draft:', error);
        }
    }
}

function clearDraft() {
    localStorage.removeItem('bla_form_draft');
}

// Initialize auto-save on form interaction
form?.addEventListener('input', () => {
    if (!autoSaveInterval) {
        startAutoSave();
    }
}, { once: true });