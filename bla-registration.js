// BLA Registration JavaScript

let tvkDatabase = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeBLARegistration();
});

async function initializeBLARegistration() {
    try {
        // Initialize database connection
        await initializeDatabase();
        tvkDatabase = window.tvkDB = tvkDB;
        
        setupFormValidation();
        setupFileUploads();
        setupFormSubmission();
        
        showNotification('Connection', 'Database connected successfully!', 'success');
    } catch (error) {
        console.error('Failed to initialize database:', error);
        showNotification('Warning', 'Database connection failed. Registration will be saved locally.', 'warning');
        
        setupFormValidation();
        setupFileUploads();
        setupFormSubmission();
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

// Form Submission
function setupFormSubmission() {
    const form = document.getElementById('blaRegistrationForm');
    form.addEventListener('submit', handleFormSubmission);
}

async function handleFormSubmission(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        showNotification('பிழை', 'தயவுசெய்து அனைத்து தவறுகளையும் சரிசெய்யவும்', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> சமர்ப்பிக்கிறது...';
    submitBtn.disabled = true;
    
    try {
        const formData = new FormData(e.target);
        const memberData = await processMemberData(formData);
        
        // Save member data
        await saveMemberData(memberData);
        
        // Show success
        showSuccessModal(memberData.membership_number || memberData.membershipNumber);
        
        // Reset form
        resetForm();
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showNotification('பிழை', 'பதிவு செய்யும்போது பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.', 'error');
    } finally {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function validateForm() {
    const form = document.getElementById('blaRegistrationForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'இந்த புலம் அவசியம்');
            isValid = false;
        }
    });
    
    // Validate file uploads
    const photoUpload = document.getElementById('photoUpload');
    const idProof = document.getElementById('idProof');
    
    if (!photoUpload.files.length) {
        showFieldError(photoUpload, 'புகைப்படம் தேவை');
        isValid = false;
    }
    
    if (!idProof.files.length) {
        showFieldError(idProof, 'அடையாள சான்று தேவை');
        isValid = false;
    }
    
    return isValid;
}

async function processMemberData(formData) {
    const membershipNumber = 'TVK' + Date.now();
    const interests = formData.getAll('interests');
    
    // Upload files if database is available
    let photoUrl = null;
    let idProofUrl = null;
    
    if (tvkDatabase) {
        try {
            const photoFile = formData.get('photoUpload');
            const idProofFile = formData.get('idProof');
            
            if (photoFile && photoFile.size > 0) {
                const photoPath = `photos/${membershipNumber}_photo_${Date.now()}`;
                const photoResult = await tvkDatabase.uploadFile('member-documents', photoPath, photoFile);
                if (photoResult.success) {
                    const urlResult = await tvkDatabase.getFileUrl('member-documents', photoPath);
                    if (urlResult.success) {
                        photoUrl = urlResult.url;
                    }
                }
            }
            
            if (idProofFile && idProofFile.size > 0) {
                const idProofPath = `id-proofs/${membershipNumber}_id_${Date.now()}`;
                const idProofResult = await tvkDatabase.uploadFile('member-documents', idProofPath, idProofFile);
                if (idProofResult.success) {
                    const urlResult = await tvkDatabase.getFileUrl('member-documents', idProofPath);
                    if (urlResult.success) {
                        idProofUrl = urlResult.url;
                    }
                }
            }
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    }
    
    const memberData = {
        membership_number: membershipNumber,
        full_name: formData.get('fullName'),
        father_name: formData.get('fatherName'),
        date_of_birth: formData.get('dateOfBirth'),
        gender: formData.get('gender'),
        occupation: formData.get('occupation'),
        education: formData.get('education'),
        mobile: formData.get('mobile'),
        alt_mobile: formData.get('altMobile'),
        email: formData.get('email'),
        address: formData.get('address'),
        district: formData.get('district'),
        pincode: formData.get('pincode'),
        voter_id: formData.get('voterId'),
        constituency: formData.get('constituency'),
        previous_party: formData.get('previousParty'),
        interests: interests,
        photo_url: photoUrl,
        id_proof_url: idProofUrl,
        status: 'pending'
    };
    
    return memberData;
}

async function saveMemberData(memberData) {
    try {
        if (tvkDatabase) {
            // Save to Supabase
            const result = await tvkDatabase.createBLAMember(memberData);
            if (!result.success) {
                throw new Error(result.error);
            }
            console.log('Member saved to database:', result.data);
        } else {
            // Fallback to localStorage
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
        }
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
});

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