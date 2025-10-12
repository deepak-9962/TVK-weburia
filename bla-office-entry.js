// BLA Office Entry JavaScript for TVK-weburia project

async function getSupabaseClient() {
    if (window.supabaseClient) {
        return window.supabaseClient;
    }

    if (typeof initializeSupabase !== 'function') {
        throw new Error('Supabase configuration is not loaded. Include supabase-config.js before bla-office-entry.js.');
    }

    window.supabaseClient = await initializeSupabase();
    return window.supabaseClient;
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
    supabaseClient = await getSupabaseClient();
        
        // Get DOM elements
        form = document.getElementById('officeEntryForm');
        submitBtn = document.getElementById('submitBtn');
        resetBtn = document.getElementById('resetBtn');
        statusMessage = document.getElementById('statusMessage');
        voterNumberInput = document.getElementById('voterNumber');
        partNumberInput = document.getElementById('partNumberInput'); // Fixed ID
        photoInput = document.getElementById('photoInput');
        photoPreview = document.getElementById('photoPreview');
        photoUpload = document.getElementById('photoUpload');
        
        // Parse URL parameters and prefill form
        parseURLParameters();
        
        // Setup part number to area lookup (NEW - Reverse workflow)
        await setupPartNumberLookup();
        
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
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const voterId = urlParams.get('voterId');
        const partNumber = urlParams.get('partNumber');
        const area = urlParams.get('area');
        const ward = urlParams.get('ward');
        
        console.log('URL Parameters detected:', { voterId, partNumber, area, ward });
        
        // Pre-fill Voter ID
        if (voterId && voterNumberInput) {
            voterNumberInput.value = voterId.toUpperCase();
            voterNumberInput.setAttribute('readonly', 'readonly');
            voterNumberInput.style.backgroundColor = '#f0f8ff';
            voterNumberInput.style.cursor = 'not-allowed';
            console.log('Pre-filled Voter ID:', voterId);
        }
        
        // Pre-fill Part Number (LOCKED like Voter ID)
        if (partNumber && partNumberInput) {
            partNumberInput.value = partNumber;
            partNumberInput.setAttribute('readonly', 'readonly');
            partNumberInput.style.backgroundColor = '#f0f8ff'; // Same as Voter ID (blue)
            partNumberInput.style.cursor = 'not-allowed';
            partNumberInput.style.border = '2px solid #2196F3';
            partNumberInput.style.fontWeight = '600';
            
            // Hide the helper text since it's pre-filled
            const helperText = partNumberInput.nextElementSibling;
            if (helperText && helperText.tagName === 'SMALL') {
                helperText.style.display = 'none';
            }
            
            console.log('Pre-filled Part Number (LOCKED):', partNumber);
        }
        
        // Pre-fill Area (from search page)
        const areaInput = document.getElementById('area');
        if (area && areaInput) {
            areaInput.value = decodeURIComponent(area);
            areaInput.setAttribute('readonly', 'readonly');
            areaInput.style.backgroundColor = '#e8f5e9';
            areaInput.style.cursor = 'not-allowed';
            console.log('Pre-filled Area:', area);
        }
        
        // Pre-fill Ward (from search page)
        const wardInput = document.getElementById('ward');
        if (ward && wardInput) {
            wardInput.value = decodeURIComponent(ward);
            wardInput.setAttribute('readonly', 'readonly');
            wardInput.style.backgroundColor = '#e8f5e9';
            wardInput.style.cursor = 'not-allowed';
            console.log('Pre-filled Ward:', ward);
        }
        
        // Show info message if fields were pre-filled from employee search
        if ((voterId || partNumber || area || ward) && statusMessage) {
            const infoMsg = document.createElement('div');
            infoMsg.className = 'employee-prefill-info';
            infoMsg.style.cssText = 'background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); color: #0d47a1; padding: 15px 20px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #2196F3; box-shadow: 0 2px 8px rgba(33, 150, 243, 0.2); font-size: 14px; line-height: 1.6;';
            infoMsg.innerHTML = '<i class="fas fa-info-circle" style="margin-right: 8px;"></i><strong>ஊழியர் தரவு நுழைவு:</strong> வாக்காளர் எண், பாகம் எண், பகுதி மற்றும் வட்டம் ஆகியவை ஊழியர் தேர்விலிருந்து முன்பே நிரப்பப்பட்டுள்ளன. இந்த புலங்களை மாற்ற முடியாது. <i class="fas fa-lock" style="margin-left: 5px;"></i><br><small style="opacity: 0.9;"><i>Employee Data Entry: Voter ID, Part Number, Area and Ward have been pre-filled from employee search and are locked (cannot be modified).</i></small>';
            
            // Insert before the form
            const formContainer = form.parentElement;
            formContainer.insertBefore(infoMsg, form);
            
            console.log('Employee prefill info message added');
        }
    } catch (error) {
        console.error('Error parsing URL parameters:', error);
    }
}

// ============================================
// PART NUMBER TO AREA AUTO-FILL FUNCTIONALITY
// ============================================

let areaDisplay, wardDisplay;

// Setup part number input listener
async function setupPartNumberLookup() {
    try {
        partNumberInput = document.getElementById('partNumberInput');
        areaDisplay = document.getElementById('area');  // Changed from 'areaDisplay'
        wardDisplay = document.getElementById('ward');
        
        if (!partNumberInput) {
            console.warn('Part number input not found');
            return;
        }
        
        // Skip setup if part number is already pre-filled (readonly)
        if (partNumberInput.hasAttribute('readonly')) {
            console.log('Part number already pre-filled from search page - skipping lookup setup');
            return;
        }

        console.log('Setting up part number lookup...');

        // Add input event listener with debounce
        let debounceTimer;
        partNumberInput.addEventListener('input', function(e) {
            clearTimeout(debounceTimer);
            
            const partNumber = e.target.value.trim();
            
            // Clear fields if part number is empty
            if (!partNumber) {
                if (areaDisplay) areaDisplay.value = '';
                if (wardDisplay) wardDisplay.value = '';
                return;
            }

            // Debounce to avoid too many requests
            debounceTimer = setTimeout(() => {
                lookupAreaByPartNumber(partNumber);
            }, 500);
        });

        // Also trigger on blur (when user leaves the field)
        partNumberInput.addEventListener('blur', function(e) {
            const partNumber = e.target.value.trim();
            if (partNumber) {
                lookupAreaByPartNumber(partNumber);
            }
        });

        console.log('Part number lookup initialized');

    } catch (error) {
        console.error('Error setting up part number lookup:', error);
    }
}

// Lookup area by part number
async function lookupAreaByPartNumber(partNumber) {
    try {
        console.log('Looking up details for part number:', partNumber);

        // Show loading state
        if (areaDisplay) {
            areaDisplay.value = 'தேடுகிறது... (Searching...)';
            areaDisplay.style.background = '#fff3cd';
        }
        if (wardDisplay) {
            wardDisplay.value = 'தேடுகிறது...';
            wardDisplay.style.background = '#fff3cd';
        }

        // Query database to find all details for this part number
        const { data: parts, error } = await supabaseClient
            .from('parts')
            .select(`
                part_number,
                ward_circle,
                serial_number,
                area_id,
                areas (
                    id,
                    name
                )
            `)
            .eq('part_number', parseInt(partNumber))
            .limit(1);

        if (error) {
            console.error('Error looking up part number:', error);
            if (areaDisplay) {
                areaDisplay.value = 'பிழை! (Error)';
                areaDisplay.style.background = '#ffebee';
            }
            if (wardDisplay) {
                wardDisplay.value = 'பிழை!';
                wardDisplay.style.background = '#ffebee';
            }
            showStatus('பாகம் எண் தேடுவதில் பிழை (Error looking up part number)', 'error');
            return;
        }

        if (!parts || parts.length === 0) {
            console.warn('Part number not found:', partNumber);
            if (areaDisplay) {
                areaDisplay.value = `பாகம் எண் ${partNumber} கண்டறியப்படவில்லை`;
                areaDisplay.style.background = '#ffebee';
            }
            if (wardDisplay) {
                wardDisplay.value = 'கண்டறியப்படவில்லை';
                wardDisplay.style.background = '#ffebee';
            }
            showStatus(`பாகம் எண் ${partNumber} தரவுத்தளத்தில் இல்லை`, 'error');
            return;
        }

        // Get the details
        const part = parts[0];
        const areaName = part.areas?.name || 'Unknown Area';
        const wardCircle = part.ward_circle || '';
        
        console.log('Details found:', { areaName, wardCircle });

        // Auto-fill Area field (பகுதி / ஒன்றியம் / நகரம்)
        if (areaDisplay) {
            areaDisplay.value = areaName;
            areaDisplay.style.background = '#e8f5e9';
        }
        
        // Auto-fill Ward/Circle field (வட்டம் / ஊராட்சி / வார்டு)
        if (wardDisplay) {
            wardDisplay.value = wardCircle;
            wardDisplay.style.background = '#e8f5e9';
        }

        // Show success message with all details
        showStatus(`✓ பாகம் எண் ${partNumber} - ${areaName} ${wardCircle ? `(வட்டம்: ${wardCircle})` : ''}`, 'success');

    } catch (error) {
        console.error('Error in lookupAreaByPartNumber:', error);
        showStatus('பாகம் எண் தேடுவதில் பிழை', 'error');
    }
}

// Setup photo upload functionality
function setupPhotoUpload() {
    // Click/Touch to upload
    photoUpload.addEventListener('click', (e) => {
        // Prevent double-trigger on mobile
        if (e.target === photoInput) return;
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Photo upload area clicked');
        photoInput.click();
    });
    
    // Touch support for mobile
    photoUpload.addEventListener('touchend', (e) => {
        if (e.target === photoInput) return;
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Photo upload area touched');
        photoInput.click();
    });
    
    // File input change
    photoInput.addEventListener('change', handlePhotoSelection);
    
    // Drag and drop functionality (desktop only)
    if (!('ontouchstart' in window)) {
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
}

// Handle photo selection
function handlePhotoSelection(e) {
    console.log('Photo selection triggered');
    console.log('Files selected:', e.target.files.length);
    
    const file = e.target.files[0];
    if (file) {
        console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
        handlePhotoFile(file);
    } else {
        console.warn('No file selected');
        showStatusMessage('⚠️ எந்த படமும் தேர்ந்தெடுக்கப்படவில்லை', 'warning');
    }
}

// Handle photo file
function handlePhotoFile(file) {
    console.log('Processing photo file:', file.name);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        console.error('Invalid file type:', file.type);
        showStatusMessage('⚠️ கிருபया செல்லுபடியாகும் படக் கோப்பை தேர்ந்தெடுக்கவும் (PNG, JPG, JPEG)', 'error');
        return;
    }
    
    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        console.error('File too large:', file.size, 'bytes');
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        showStatusMessage(`⚠️ படக் கோப்பு ${sizeMB}MB. அதிகபட்சம் 5MB மட்டுமே அனுமதிக்கப்படும்`, 'error');
        return;
    }
    
    // Show loading state
    const uploadContent = photoUpload.querySelector('.photo-upload-content');
    uploadContent.innerHTML = `
        <i class="fas fa-spinner fa-spin" style="color: #DC143C;"></i>
        <p><strong>படம் ஏற்றப்படுகிறது...</strong></p>
    `;
    
    // Create file reader for preview
    const reader = new FileReader();
    
    reader.onload = function(e) {
        console.log('Photo loaded successfully');
        photoPreview.src = e.target.result;
        photoPreview.style.display = 'block';
        
        // Update upload area to show selected file
        const fileSizeKB = (file.size / 1024).toFixed(2);
        uploadContent.innerHTML = `
            <i class="fas fa-check-circle" style="color: #28a745; font-size: 2rem;"></i>
            <p><strong>படம் தேர்ந்தெடுக்கப்பட்டது ✓</strong></p>
            <p style="font-size: 0.9rem;">${file.name}</p>
            <p><small>${fileSizeKB} KB</small></p>
            <p><small>மாற்ற மீண்டும் தொடவும்</small></p>
        `;
        
        showStatusMessage('✅ படம் வெற்றிகரமாக தேர்ந்தெடுக்கப்பட்டது', 'success');
    };
    
    reader.onerror = function(error) {
        console.error('Error reading file:', error);
        uploadContent.innerHTML = `
            <i class="fas fa-camera"></i>
            <p><strong>புகைப்படத்தை பதிவேற்ற தொடவும்</strong></p>
            <p class="desktop-only">அல்லது இங்கே இழுத்து விடவும்</p>
            <p><small>PNG, JPG, JPEG வடிவங்கள் மட்டுமே (அதிகபட்சம் 5MB)</small></p>
        `;
        showStatusMessage('❌ படத்தை படிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்', 'error');
    };
    
    reader.readAsDataURL(file);
    
    // Note: We don't manually set photoInput.files on mobile as it may cause issues
    // The file is already in photoInput.files from the change event
    console.log('Photo file processed, ready for upload');
}

// Setup input validation
function setupInputValidation() {
    // Phone number validation
    const phoneInput = document.getElementById('phoneNumber');
    phoneInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '').substring(0, 10);
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
            religion: formData.religion,
            voter_id: formData.voterNumber,
            part_number: formData.partNumber,
            ward_circle: formData.ward, // Ward/Circle/Uraatchi information
            member_category: formData.memberCategories.join(', ') || null,
            photo_url: photoUrl,
            town: formData.area, // Changed from 'district' to 'town'
            address: null, // Address not collected in form
            pincode: '600000', // Default pincode for Madhavaram
            gender: formData.gender,
            occupation: 'Not specified', // Default
            education: null,
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
        { id: 'partNumberInput', name: 'பாகம் எண்' },
        { id: 'voterNumber', name: 'வாக்காளர் எண்' },
        { id: 'fullName', name: 'பெயர்' },
        { id: 'fatherName', name: 'தந்தை/கணவர் பெயர்' },
        { id: 'dateOfBirth', name: 'பிறந்த தேதி' },
        { id: 'phoneNumber', name: 'தொலைபேசி எண்' },
        { id: 'religion', name: 'மதம்' }
    ];
    
    for (const field of requiredFields) {
        const input = document.getElementById(field.id);
        if (!input) {
            console.warn(`Field ${field.id} not found in form`);
            continue; // Skip if field doesn't exist
        }
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
        console.log('Checked category:', checkbox.value); // Debug log
    });
    
    console.log('All member categories collected:', memberCategories); // Debug log
    
    return {
        area: document.getElementById('area').value.trim(),
        ward: document.getElementById('ward').value.trim(),
        partNumber: document.getElementById('partNumberInput').value.trim(),
        voterNumber: document.getElementById('voterNumber').value.trim(),
        fullName: document.getElementById('fullName').value.trim(),
        fatherName: document.getElementById('fatherName').value.trim(),
        dateOfBirth: document.getElementById('dateOfBirth').value,
        gender: document.getElementById('gender').value,
        phoneNumber: document.getElementById('phoneNumber').value.trim(),
        religion: document.getElementById('religion').value,
        memberCategories: memberCategories
    };
}

// Upload photo to Supabase Storage
async function uploadPhoto(file) {
    try {
        console.log('=== PHOTO UPLOAD START ===');
        console.log('File details:', {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: new Date(file.lastModified)
        });
        
        // Show upload progress message
        showStatusMessage('📤 படம் பதிவேற்றப்படுகிறது...', 'loading');
        
        // Option 1: Upload to Supabase Storage (if bucket exists)
        // First, try to upload to storage bucket
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `member-photos/${fileName}`;
            
            console.log('Attempting upload to Supabase storage...');
            console.log('Storage path:', filePath);
            
            const { data: uploadData, error: uploadError } = await supabaseClient.storage
                .from('tvk-storage')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });
            
            if (uploadError) {
                console.warn('Storage upload failed:', uploadError);
                console.warn('Error details:', {
                    message: uploadError.message,
                    statusCode: uploadError.statusCode
                });
                throw uploadError;
            }
            
            console.log('Storage upload successful:', uploadData);
            
            // Get public URL
            const { data: urlData } = supabaseClient.storage
                .from('tvk-storage')
                .getPublicUrl(filePath);
            
            console.log('Public URL obtained:', urlData.publicUrl);
            console.log('=== PHOTO UPLOAD SUCCESS (STORAGE) ===');
            
            showStatusMessage('✅ படம் வெற்றிகரமாக பதிவேற்றப்பட்டது', 'success');
            return urlData.publicUrl;
            
        } catch (storageError) {
            // Option 2: Fallback to base64 if storage fails
            console.log('Storage failed, using base64 fallback');
            console.log('Fallback reason:', storageError.message);
            
            showStatusMessage('⚠️ படம் base64 வடிவத்தில் சேமிக்கப்படுகிறது...', 'loading');
            
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                
                reader.onloadstart = () => {
                    console.log('Starting base64 conversion...');
                };
                
                reader.onprogress = (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        console.log(`Base64 conversion progress: ${percentComplete.toFixed(2)}%`);
                    }
                };
                
                reader.onload = () => {
                    const base64String = reader.result;
                    console.log('Base64 conversion successful');
                    console.log('Base64 string length:', base64String.length);
                    console.log('=== PHOTO UPLOAD SUCCESS (BASE64) ===');
                    
                    showStatusMessage('✅ படம் சேமிக்கப்பட்டது (base64)', 'success');
                    resolve(base64String);
                };
                
                reader.onerror = (error) => {
                    console.error('Base64 conversion error:', error);
                    console.error('FileReader error:', reader.error);
                    
                    showStatusMessage('⚠️ படம் செயலாக்குவதில் பிழை. படம் இல்லாமல் தொடர்கிறது.', 'warning');
                    
                    // Don't reject, just return null to allow form submission without photo
                    resolve(null);
                };
                
                // Start reading the file
                console.log('Starting FileReader.readAsDataURL...');
                reader.readAsDataURL(file);
            });
        }
        
    } catch (error) {
        console.error('=== PHOTO UPLOAD FAILED ===');
        console.error('Unexpected error:', error);
        console.error('Error stack:', error.stack);
        
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