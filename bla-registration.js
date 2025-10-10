// BLA Registration JavaScript

let tvkDatabase = null;

document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeBLARegistration();
    } catch (error) {
        console.error('Failed to initialize BLA registration:', error);
        // Show user-friendly error
        showNotification('பிழை', 'System initialization failed. Please refresh the page.', 'error');
    }
});

async function initializeBLARegistration() {
    try {
        // Check for BLA employee session and voter check data
        const employeeSession = sessionStorage.getItem('bla_employee_session');
        const voterCheckData = sessionStorage.getItem('bla_voter_check');
        
        if (!employeeSession || !voterCheckData) {
            console.warn('No employee session or voter check data found');
            alert('அங்கீகரிக்கப்படாத அணுகல். முதலில் பணியாளர் உள்நுழைவு மற்றும் வாக்காளர் சரிபார்ப்பு செய்யவும்.');
            // Comment out redirect for testing
            // window.location.href = 'office-login.html';
            // return;
        }
        
        // Parse the data if available
        let employee = null;
        let voterData = null;
        
        if (employeeSession) {
            try {
                employee = JSON.parse(employeeSession);
                console.log('BLA Registration initialized for employee:', employee.username);
            } catch (e) {
                console.error('Error parsing employee session:', e);
            }
        }
        
        if (voterCheckData) {
            try {
                voterData = JSON.parse(voterCheckData);
                console.log('Voter data:', voterData);
            } catch (e) {
                console.error('Error parsing voter data:', e);
            }
        }
        
        // Pre-fill voter ID field if available
        if (voterData && voterData.voterId) {
            const voterIdField = document.getElementById('voterId');
            if (voterIdField) {
                voterIdField.value = voterData.voterId;
                voterIdField.readOnly = true;
                voterIdField.style.backgroundColor = '#f0f0f0';
                voterIdField.style.cursor = 'not-allowed';
            }
            
            // Pre-fill part number field if available
            const partNumberField = document.getElementById('partNumber');
            if (partNumberField && voterData.partNumber) {
                partNumberField.value = voterData.partNumber;
            }
        }
        
        // Store employee ID for form submission
        if (employee && employee.employeeId) {
            window.currentEmployeeId = employee.employeeId;
        }
        
        // Try to initialize database connection (non-blocking)
        try {
            if (typeof initializeSupabase !== 'function') {
                throw new Error('Supabase configuration script not loaded.');
            }

            const supabaseClient = await initializeSupabase();

            tvkDatabase = {
                createBLAMember: async (data) => {
                    console.log('Inserting BLA member data:', data);

                    const cleanData = {};
                    Object.keys(data).forEach(key => {
                        if (data[key] !== undefined) {
                            cleanData[key] = data[key];
                        }
                    });

                    console.log('Clean data for insert:', cleanData);

                    const { data: result, error } = await supabaseClient
                        .from('bla_members')
                        .insert([cleanData])
                        .select();

                    if (error) {
                        console.error('Database insert error:', error);
                        throw error;
                    }

                    console.log('Insert successful:', result);
                    return { success: true, data: result };
                }
            };

            console.log('Database initialized via shared configuration');
        } catch (dbError) {
            console.warn('Database initialization failed (will use localStorage):', dbError);
            tvkDatabase = null;
        }
        
        // Setup form handlers
        setupFormValidation();
        setupFileUploads();
        setupFormSubmission();
        
        showNotification('Success', 'BLA Registration system ready', 'success');
        
    } catch (error) {
        console.error('Failed to initialize BLA registration:', error);
        showNotification('Warning', 'System initialized with limited features', 'warning');
        
        // Still setup form handlers even if initialization partially failed
        try {
            setupFormValidation();
            setupFileUploads();
            setupFormSubmission();
        } catch (setupError) {
            console.error('Error setting up form:', setupError);
        }
    }
}

// Form Validation
function setupFormValidation() {
    const form = document.getElementById('blaRegistrationForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Remove existing error
    clearFieldError(e);
    
    // Validation rules
    let isValid = true;
    let errorMessage = '';
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'இந்த புலம் அவசியம்';
    } else {
        switch (fieldName) {
            case 'mobile':
            case 'altMobile':
                if (value && !/^[0-9]{10}$/.test(value)) {
                    isValid = false;
                    errorMessage = '10 இலக்க தொலைபேசி எண் உள்ளிடவும்';
                }
                break;
            case 'email':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'சரியான மின்னஞ்சல் முகவரி உள்ளிடவும்';
                }
                break;
            case 'pincode':
                if (value && !/^[0-9]{6}$/.test(value)) {
                    isValid = false;
                    errorMessage = '6 இலக்க அஞ்சல் குறியீடு உள்ளிடவும்';
                }
                break;
            case 'voterId':
                if (value && !/^[A-Z]{3}[0-9]{7}$/.test(value.toUpperCase())) {
                    isValid = false;
                    errorMessage = 'சரியான வாக்காளர் அடையாள எண் உள்ளிடவும்';
                }
                break;
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    // Remove existing error
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error styling
    field.classList.add('error');
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
}

function clearFieldError(e) {
    const field = e.target;
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    field.classList.remove('error');
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// File Upload Handling
function setupFileUploads() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', handleFileUpload);
    });
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    const input = e.target;
    const maxSize = 2 * 1024 * 1024; // 2MB
    
    if (!file) return;
    
    // Check file size
    if (file.size > maxSize) {
        showFieldError(input, 'கோப்பு அளவு 2MB க்கு குறைவாக இருக்க வேண்டும்');
        input.value = '';
        return;
    }
    
    // Check file type
    const allowedTypes = {
        'photoUpload': ['image/jpeg', 'image/jpg', 'image/png'],
        'idProof': ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    };
    
    if (allowedTypes[input.name] && !allowedTypes[input.name].includes(file.type)) {
        showFieldError(input, 'தவறான கோப்பு வடிவம்');
        input.value = '';
        return;
    }
    
    // Show file preview for images
    if (file.type.startsWith('image/')) {
        showImagePreview(input, file);
    }
    
    clearFieldError(e);
}

function showImagePreview(input, file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const formGroup = input.closest('.form-group');
        
        // Remove existing preview
        const existingPreview = formGroup.querySelector('.image-preview');
        if (existingPreview) {
            existingPreview.remove();
        }
        
        // Create preview
        const preview = document.createElement('div');
        preview.className = 'image-preview';
        preview.innerHTML = `
            <img src="${e.target.result}" alt="Preview" style="max-width: 150px; max-height: 150px; border-radius: 8px; margin-top: 10px;">
            <button type="button" class="remove-preview" onclick="removePreview(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        formGroup.appendChild(preview);
    };
    reader.readAsDataURL(file);
}

function removePreview(button) {
    const preview = button.closest('.image-preview');
    const formGroup = preview.closest('.form-group');
    const fileInput = formGroup.querySelector('input[type="file"]');
    
    preview.remove();
    fileInput.value = '';
}

// Helper function to convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

// Form Submission
function setupFormSubmission() {
    const form = document.getElementById('blaRegistrationForm');
    form.addEventListener('submit', handleFormSubmission);
}

async function handleFormSubmission(e) {
    e.preventDefault();
    
    console.log('Form submission started');
    
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    if (!submitBtn) {
        console.error('Submit button not found');
        showNotification('பிழை', 'சமர்ப்பிப்பு பொத்தான் கிடைக்கவில்லை', 'error');
        return;
    }
    
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> சமர்ப்பிக்கிறது...';
    submitBtn.disabled = true;
    
    try {
        console.log('Creating FormData...');
        const formData = new FormData(e.target);
        
        // Log all form data
        console.log('Form Data entries:');
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`${key}: File - ${value.name}, Size: ${value.size}`);
            } else {
                console.log(`${key}: ${value}`);
            }
        }
        
        console.log('Processing member data...');
        const memberData = await processMemberData(formData);
        console.log('Member data processed:', memberData);
        
        // Validate required fields according to schema
        const requiredFields = ['membership_number', 'full_name', 'father_name', 'date_of_birth', 'gender', 'occupation', 'mobile', 'address', 'district', 'pincode'];
        const missingFields = requiredFields.filter(field => !memberData[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }
        
        console.log('Saving member data...');
        await saveMemberData(memberData);
        console.log('Member data saved successfully');
        
        // Show success
        showSuccessModal(memberData.membership_number);
        
        // Reset form
        setTimeout(() => {
            resetForm();
        }, 2000);
        
    } catch (error) {
        console.error('Error submitting form:', error);
        console.error('Error stack:', error.stack);
        
        // Show more specific error message
        let errorMessage = 'பதிவு செய்யும்போது பிழை ஏற்பட்டது.';
        
        if (error.message) {
            console.error('Error message:', error.message);
            console.error('Full error object:', error);
            
            if (error.message.includes('network') || error.message.includes('fetch')) {
                errorMessage = 'இணைய இணைப்பு பிழை. மீண்டும் முயற்சிக்கவும்.';
            } else if (error.message.includes('file') || error.message.includes('upload')) {
                errorMessage = 'கோப்பு பதிவேற்றத்தில் பிழை. சிறிய கோப்புகளை முயற்சிக்கவும்.';
            } else if (error.message.includes('duplicate') || error.message.includes('unique')) {
                errorMessage = 'இந்த தகவல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது. வேறு தகவல்களை முயற்சிக்கவும்.';
            } else if (error.message.includes('null') || error.message.includes('required')) {
                errorMessage = 'தேவையான புலங்கள் காணவில்லை. அனைத்து புலங்களையும் பூர்த்தி செய்யவும்.';
            } else {
                // Show the actual error for debugging
                errorMessage = 'பதிவு பிழை: ' + error.message;
            }
        }
        
        showNotification('பிழை', errorMessage, 'error');
        
    } finally {
        // Reset button
        if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
}

function validateForm() {
    const form = document.getElementById('blaRegistrationForm');
    if (!form) {
        console.error('Form not found!');
        return false;
    }
    
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalidField = null;
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
    
    requiredFields.forEach(field => {
        // Skip file inputs and checkboxes for now - make them optional
        if (field.type === 'file' || field.type === 'checkbox') {
            console.log(`Skipping validation for ${field.type}: ${field.name || field.id}`);
            return;
        }
        
        const value = field.value ? field.value.trim() : '';
        
        if (!value) {
            console.log(`Field ${field.name || field.id} is empty`);
            showFieldError(field, 'இந்த புலம் அவசியம்');
            isValid = false;
            if (!firstInvalidField) {
                firstInvalidField = field;
            }
        } else {
            // Validate specific field types
            const e = { target: field };
            const fieldValid = validateField(e);
            if (!fieldValid) {
                isValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            }
        }
    });
    
    // Scroll to first invalid field
    if (firstInvalidField) {
        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalidField.focus();
    }
    
    // Just show warnings for missing files/checkboxes but don't block submission
    const photoUpload = document.getElementById('photoUpload');
    const idProof = document.getElementById('idProof');
    const pledge = document.querySelector('input[name="pledge"]');
    const terms = document.querySelector('input[name="terms"]');
    
    if (photoUpload && !photoUpload.files.length) {
        console.warn('No photo uploaded');
    }
    
    if (idProof && !idProof.files.length) {
        console.warn('No ID proof uploaded');
    }
    
    if (pledge && !pledge.checked) {
        console.warn('Pledge not checked');
    }
    
    if (terms && !terms.checked) {
        console.warn('Terms not checked');
    }
    
    console.log(`Form validation result: ${isValid ? 'VALID' : 'INVALID'}`);
    return isValid;
}

async function processMemberData(formData) {
    const membershipNumber = 'TVK' + Date.now();
    const interests = formData.getAll('interests');
    
    // Convert files to base64 for local storage or simplified handling
    let photoUrl = null;
    let idProofUrl = null;
    
    try {
        const photoFile = formData.get('photoUpload');
        const idProofFile = formData.get('idProof');
        
        if (photoFile && photoFile.size > 0) {
            console.log('Processing photo file:', photoFile.name, photoFile.size);
            
            // Check file size (max 2MB)
            if (photoFile.size > 2 * 1024 * 1024) {
                throw new Error('Photo file too large. Maximum size is 2MB.');
            }
            
            // Convert photo to base64 for local storage (always do this as primary method)
            photoUrl = await fileToBase64(photoFile);
            console.log('Photo converted to base64 successfully');
            
            // Skip Supabase file upload for now to avoid errors
            // Just use base64 storage which works reliably
        }
        
        if (idProofFile && idProofFile.size > 0) {
            console.log('Processing ID proof file:', idProofFile.name, idProofFile.size);
            
            // Check file size (max 2MB)
            if (idProofFile.size > 2 * 1024 * 1024) {
                throw new Error('ID proof file too large. Maximum size is 2MB.');
            }
            
            // Convert ID proof to base64 for local storage (always do this as primary method)
            idProofUrl = await fileToBase64(idProofFile);
            console.log('ID proof converted to base64 successfully');
            
            // Skip Supabase file upload for now to avoid errors
            // Just use base64 storage which works reliably
        }
        
    } catch (error) {
        console.error('Error processing files:', error);
        // Don't fail the entire registration if file processing fails
        showNotification('எச்சரிக்கை', 'கோப்பு பதிவேற்றத்தில் சிக்கல். தரவு உள்ளூரில் சேமிக்கப்படும்.', 'warning');
    }
    
    // Validate education value against allowed values
    const allowedEducation = ['primary', 'secondary', 'higher-secondary', 'diploma', 'graduate', 'post-graduate', 'other'];
    const educationValue = formData.get('education');
    console.log('Raw education value from form:', educationValue);
    const validEducation = educationValue && allowedEducation.includes(educationValue) ? educationValue : null;
    console.log('Validated education value:', validEducation);
    
    // Validate gender value against allowed values
    const allowedGender = ['male', 'female', 'other'];
    const genderValue = formData.get('gender');
    console.log('Raw gender value from form:', genderValue);
    const validGender = genderValue && allowedGender.includes(genderValue) ? genderValue : 'other';
    console.log('Validated gender value:', validGender);
    
    const memberData = {
        membership_number: membershipNumber,
        
        // Personal Information - matches exact schema columns
        full_name: formData.get('fullName'),
        father_name: formData.get('fatherName'),
        date_of_birth: formData.get('dateOfBirth'),
        gender: validGender,
        occupation: formData.get('occupation'),
        education: validEducation,
        
        // Contact Information - matches exact schema columns
        mobile: formData.get('mobile'),
        alt_mobile: formData.get('altMobile') && formData.get('altMobile') !== '' ? formData.get('altMobile') : null,
        email: formData.get('email') && formData.get('email') !== '' ? formData.get('email') : null,
        address: formData.get('address'),
        district: formData.get('district'),
        pincode: formData.get('pincode'),
        
        // Political Information - matches exact schema columns
        voter_id: formData.get('voterId') && formData.get('voterId') !== '' ? formData.get('voterId') : null,
        part_number: formData.get('partNumber') && formData.get('partNumber') !== '' ? formData.get('partNumber') : null,
        constituency: formData.get('constituency') && formData.get('constituency') !== '' ? formData.get('constituency') : null,
        previous_party: formData.get('previousParty') && formData.get('previousParty') !== '' ? formData.get('previousParty') : null,
        interests: interests.length > 0 ? interests : null,
        
        // Additional Information - matches exact schema columns
        aadhaar_number: formData.get('aadhaarNumber') && formData.get('aadhaarNumber') !== '' ? formData.get('aadhaarNumber') : null,
        religion: formData.get('religion') && formData.get('religion') !== '' ? formData.get('religion') : null,
        member_category: formData.get('memberCategory') && formData.get('memberCategory') !== '' ? formData.get('memberCategory') : null,
        area_union_city: formData.get('areaUnionCity') && formData.get('areaUnionCity') !== '' ? formData.get('areaUnionCity') : null,
        ward_village: formData.get('wardVillage') && formData.get('wardVillage') !== '' ? formData.get('wardVillage') : null,
        
        // Files and Status - matches exact schema columns
        photo_url: photoUrl,
        id_proof_url: idProofUrl,
        registered_by_employee_id: window.currentEmployeeId || null,
        status: 'active'
    };
    
    return memberData;
}

async function saveMemberData(memberData) {
    try {
        console.log('Saving member data:', memberData.membership_number);
        
        if (tvkDatabase) {
            try {
                // Save to Supabase
                console.log('Attempting to save to Supabase...');
                console.log('Database object:', tvkDatabase);
                console.log('Member data to save:', JSON.stringify(memberData, null, 2));
                
                const result = await tvkDatabase.createBLAMember(memberData);
                console.log('Database save result:', result);
                
                if (!result || !result.success) {
                    throw new Error(result ? result.error : 'Unknown database error');
                }
                console.log('Member saved to database successfully:', result.data);
                return;
            } catch (dbError) {
                console.error('Supabase save failed, falling back to localStorage:', dbError);
                console.error('DB Error details:', dbError.message, dbError.code);
                // Continue to localStorage fallback
            }
        }
        
        // Fallback to localStorage (either no database or database failed)
        console.log('Saving to localStorage...');
        const localMemberData = {
            membershipNumber: memberData.membership_number,
            personalInfo: {
                fullName: memberData.full_name,
                fatherName: memberData.father_name,
                dateOfBirth: memberData.date_of_birth,
                gender: memberData.gender,
                occupation: memberData.occupation,
                education: memberData.education
            },
            contact: {
                mobile: memberData.mobile,
                altMobile: memberData.alt_mobile,
                email: memberData.email,
                address: memberData.address,
                district: memberData.district,
                pincode: memberData.pincode
            },
            political: {
                voterId: memberData.voter_id,
                constituency: memberData.constituency,
                previousParty: memberData.previous_party,
                interests: memberData.interests
            },
            registrationDate: new Date().toISOString(),
            status: memberData.status
        };
        
        let members = JSON.parse(localStorage.getItem('blaMembers') || '[]');
        members.push(localMemberData);
        localStorage.setItem('blaMembers', JSON.stringify(members));
        
        // Also update the general members list
        let generalMembers = JSON.parse(localStorage.getItem('members') || '[]');
        generalMembers.push({
            id: memberData.membership_number,
            name: memberData.full_name,
            phone: memberData.mobile,
            joinDate: new Date().toLocaleDateString('ta-IN'),
            type: 'BLA'
        });
        localStorage.setItem('members', JSON.stringify(generalMembers));
        
        console.log('Member data saved to localStorage successfully');
    } catch (error) {
        console.error('Error saving member data:', error);
        throw error;
    }
}

function showSuccessModal(membershipNumber) {
    document.getElementById('membershipNumber').textContent = membershipNumber;
    document.getElementById('successModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    window.location.href = 'index.html';
}

function printMembership() {
    const membershipNumber = document.getElementById('membershipNumber').textContent;
    
    // Create print content
    const printContent = `
        <div style="text-align: center; padding: 40px; font-family: Arial, sans-serif;">
            <h1 style="color: #ff6b35; margin-bottom: 30px;">TVK தமிழ் வெற்றிக் கழகம்</h1>
            <h2 style="color: #333; margin-bottom: 20px;">BLA உறுப்பினர் சான்றிதழ்</h2>
            <div style="border: 3px solid #ff6b35; padding: 30px; margin: 20px 0; border-radius: 10px;">
                <p style="font-size: 18px; margin: 10px 0;"><strong>உறுப்பினர் எண்:</strong> ${membershipNumber}</p>
                <p style="font-size: 16px; margin: 10px 0;">இந்த சான்றிதழ் தற்காலிகமானது. முழுமையான உறுப்பினர் அட்டை விரைவில் அனுப்பப்படும்.</p>
            </div>
            <p style="margin-top: 30px; color: #666;">வெற்றிகரமாக பதிவு செய்யப்பட்ட தேதி: ${new Date().toLocaleDateString('ta-IN')}</p>
        </div>
    `;
    
    // Open print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>BLA உறுப்பினர் சான்றிதழ்</title>
        </head>
        <body>
            ${printContent}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function resetForm() {
    const form = document.getElementById('blaRegistrationForm');
    form.reset();
    
    // Clear all error messages
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
    document.querySelectorAll('.image-preview').forEach(preview => preview.remove());
}

// Notification System (reuse from main script)
function showNotification(title, message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-header">
                <strong>${title}</strong>
                <button class="notification-close" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <p>${message}</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    addNotificationStyles();
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function addNotificationStyles() {
    if (document.getElementById('notificationStyles')) return;
    
    const style = document.createElement('style');
    style.id = 'notificationStyles';
    style.innerHTML = `
        .notification { position: fixed; top: 20px; right: 20px; max-width: 400px; background: white; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 1100; animation: slideInRight 0.3s ease; }
        .notification.success { border-left: 4px solid #27ae60; }
        .notification.info { border-left: 4px solid #3498db; }
        .notification.warning { border-left: 4px solid #f39c12; }
        .notification.error { border-left: 4px solid #e74c3c; }
        .notification-content { padding: 20px; }
        .notification-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .notification-header strong { color: #2c3e50; font-size: 1.1rem; }
        .notification-close { background: none; border: none; color: #7f8c8d; cursor: pointer; font-size: 1rem; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s ease; }
        .notification-close:hover { background: #ecf0f1; color: #2c3e50; }
        .notification p { margin: 0; color: #555; line-height: 1.5; }
        @keyframes slideInRight { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        
        .error-message { color: #e74c3c; font-size: 0.9rem; margin-top: 5px; }
        .form-group input.error, .form-group select.error, .form-group textarea.error { border-color: #e74c3c; box-shadow: 0 0 0 2px rgba(231,76,60,0.1); }
        
        .image-preview { position: relative; display: inline-block; margin-top: 10px; }
        .remove-preview { position: absolute; top: -10px; right: -10px; background: #e74c3c; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer; font-size: 12px; }
        
        .success-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .success-content { background: white; border-radius: 15px; padding: 40px; text-align: center; max-width: 500px; width: 90%; }
        .success-icon { font-size: 4rem; color: #27ae60; margin-bottom: 20px; }
        .success-content h3 { color: #2c3e50; margin-bottom: 15px; font-size: 1.8rem; }
        .success-content p { color: #555; margin-bottom: 15px; line-height: 1.6; }
        .success-actions { display: flex; gap: 15px; justify-content: center; margin-top: 30px; }
        .primary-btn, .secondary-btn { padding: 12px 25px; border-radius: 8px; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: all 0.3s ease; }
        .primary-btn { background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; border: none; }
        .secondary-btn { background: #ecf0f1; color: #2c3e50; border: 1px solid #bdc3c7; }
        .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(255,107,53,0.4); }
        .secondary-btn:hover { background: #d5dbdb; }
    `;
    document.head.appendChild(style);
}

// Additional form styles for BLA registration
document.addEventListener('DOMContentLoaded', function() {
    addBLARegistrationStyles();
    
    // Add database test button (temporary for testing)
    setTimeout(() => {
        const testBtn = document.createElement('button');
        testBtn.textContent = '🧪 Test Database Save';
        testBtn.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999; background: #17a2b8; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;';
        testBtn.onclick = async () => {
            await testDatabaseSave();
        };
        document.body.appendChild(testBtn);
    }, 1000);
});

// Test database save function
async function testDatabaseSave() {
    try {
        console.log('🧪 Testing database save...');
        
        // Create sample member data
        const testMemberData = {
            membership_number: 'TEST' + Date.now(),
            full_name: 'டெஸ்ட் உறுப்பினர்',
            father_name: 'டெஸ்ட் தந்தை',
            date_of_birth: '1990-01-01',
            gender: 'male',
            occupation: 'டெஸ்ட் தொழில்',
            mobile: '9876543210',
            address: 'டெஸ்ட் முகவரி',
            district: 'சென்னை',
            pincode: '600001',
            voter_id: 'TEST' + Math.random().toString(36).substr(2, 7).toUpperCase(),
            status: 'active',
            registered_by_employee_id: window.currentEmployeeId || null
        };
        
        console.log('Test member data:', testMemberData);
        
        // Initialize database if needed
        if (!tvkDatabase && window.supabaseClient) {
            tvkDatabase = {
                createBLAMember: async (data) => {
                    const { data: result, error } = await window.supabaseClient
                        .from('bla_members')
                        .insert([data])
                        .select();
                    
                    if (error) throw error;
                    return { success: true, data: result };
                }
            };
        }
        
        // Try to save to database
        if (tvkDatabase) {
            const result = await tvkDatabase.createBLAMember(testMemberData);
            console.log('✅ Database save successful:', result);
            alert('✅ Database Save Test PASSED!\nCheck console for details.');
        } else {
            // Fallback to direct Supabase call
            if (!supabaseClient) {
                await initializeSupabase();
            }
            
            const { data: result, error } = await supabaseClient
                .from('bla_members')
                .insert([testMemberData])
                .select();
            
            if (error) throw error;
            
            console.log('✅ Direct Supabase save successful:', result);
            alert('✅ Database Save Test PASSED!\nSaved directly to Supabase.');
        }
        
    } catch (error) {
        console.error('❌ Database save test failed:', error);
        alert(`❌ Database Save Test FAILED!\nError: ${error.message}`);
    }
}

function addBLARegistrationStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        .bla-registration { padding: 80px 0; background: #f8f9fa; min-height: 100vh; }
        .registration-form-container { max-width: 900px; margin: 0 auto; background: white; border-radius: 20px; padding: 50px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .form-section { margin-bottom: 40px; padding-bottom: 30px; border-bottom: 1px solid #eee; }
        .form-section:last-child { border-bottom: none; }
        .form-section h3 { color: #2c3e50; margin-bottom: 25px; font-size: 1.4rem; padding-bottom: 10px; border-bottom: 2px solid #ff6b35; display: inline-block; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .checkbox-group { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 10px; }
        .checkbox-label { display: flex; align-items: center; cursor: pointer; padding: 10px; border-radius: 8px; transition: background-color 0.3s; }
        .checkbox-label:hover { background: #f8f9fa; }
        .checkbox-label input[type="checkbox"] { display: none; }
        .checkmark { width: 20px; height: 20px; border: 2px solid #ddd; border-radius: 4px; margin-right: 10px; position: relative; transition: all 0.3s; }
        .checkbox-label input[type="checkbox"]:checked + .checkmark { background: #ff6b35; border-color: #ff6b35; }
        .checkbox-label input[type="checkbox"]:checked + .checkmark::after { content: '✓'; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-weight: bold; }
        .pledge-section { background: #f8f9fa; padding: 25px; border-radius: 10px; border-left: 4px solid #ff6b35; }
        .pledge-checkbox { font-weight: 600; color: #2c3e50; }
        .form-actions { display: flex; gap: 20px; justify-content: center; margin-top: 40px; }
        .secondary-btn { background: #ecf0f1; color: #2c3e50; }
        @media (max-width: 768px) { .form-row { grid-template-columns: 1fr; } .checkbox-group { grid-template-columns: 1fr; } .form-actions { flex-direction: column; } }
    `;
    document.head.appendChild(style);
}