// BLA Voter Check JavaScript for TVK

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
let voterIdInput, partNumberInput, checkBtn, statusMessage, proceedBtn;
let areaDisplay, wardDisplay, areaGroup, wardGroup;
let currentPartData = null; // Store part number lookup data

// Authentication Guard - Check if employee is logged in
function checkAuthentication() {
    const sessionData = sessionStorage.getItem('bla_employee_session');
    
    if (!sessionData) {
        alert('அங்கீகரிக்கப்படவில்லை. முதலில் உள்நுழைய வேண்டும்.');
        window.location.href = 'office-login.html';
        return false;
    }
    
    try {
        const employee = JSON.parse(sessionData);
        console.log('Employee authenticated:', employee.username);
        return employee;
    } catch (error) {
        console.error('Invalid session data');
        alert('அமர்வு தரவு செல்லாது. மீண்டும் உள்நுழைக்கவும்.');
        window.location.href = 'office-login.html';
        return false;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Check authentication first
        const currentEmployee = checkAuthentication();
        if (!currentEmployee) {
            return; // Redirect handled by checkAuthentication
        }
        
        // Initialize Supabase
        await initializeSupabase();
        
        // Get DOM elements
        voterIdInput = document.getElementById('voterId');
        partNumberInput = document.getElementById('partNumber');
        checkBtn = document.getElementById('checkBtn');
        statusMessage = document.getElementById('statusMessage');
        proceedBtn = document.getElementById('proceedBtn');
        areaDisplay = document.getElementById('areaDisplay');
        wardDisplay = document.getElementById('wardDisplay');
        areaGroup = document.getElementById('areaGroup');
        wardGroup = document.getElementById('wardGroup');
        
        // Add event listeners
        checkBtn.addEventListener('click', checkVoterAvailability);
        proceedBtn.addEventListener('click', proceedToRegistration);
        
        // Add input validation
        voterIdInput.addEventListener('input', validateVoterId);
        partNumberInput.addEventListener('input', validatePartNumber);
        
        // Add part number lookup on input
        let partLookupTimer;
        partNumberInput.addEventListener('input', function(e) {
            clearTimeout(partLookupTimer);
            const partNumber = e.target.value.trim();
            
            if (!partNumber) {
                areaGroup.style.display = 'none';
                wardGroup.style.display = 'none';
                areaDisplay.value = '';
                wardDisplay.value = '';
                currentPartData = null;
                return;
            }
            
            // Debounce lookup
            partLookupTimer = setTimeout(() => {
                lookupPartNumber(partNumber);
            }, 500);
        });
        
        console.log('Voter check page initialized successfully');
        
    } catch (error) {
        console.error('Error initializing voter check page:', error);
        showStatusMessage('பிழை: பயன்பாட்டை தொடங்க முடியவில்லை. பக்கத்தை மீண்டும் ஏற்றவும்.', 'error');
    }
});

// Lookup part number and auto-fill area/ward
async function lookupPartNumber(partNumber) {
    try {
        console.log('Looking up part number:', partNumber);
        
        // Show loading state
        areaDisplay.value = 'தேடுகிறது...';
        wardDisplay.value = 'தேடுகிறது...';
        areaDisplay.style.background = '#fff3cd';
        wardDisplay.style.background = '#fff3cd';
        areaGroup.style.display = 'block';
        wardGroup.style.display = 'block';
        
        // Query database
        const { data: parts, error } = await supabaseClient
            .from('parts')
            .select(`
                part_number,
                ward_circle,
                areas (
                    name
                )
            `)
            .eq('part_number', parseInt(partNumber))
            .limit(1);
        
        if (error) {
            console.error('Error looking up part number:', error);
            areaDisplay.value = 'பிழை!';
            wardDisplay.value = 'பிழை!';
            areaDisplay.style.background = '#ffebee';
            wardDisplay.style.background = '#ffebee';
            currentPartData = null;
            return;
        }
        
        if (!parts || parts.length === 0) {
            console.warn('Part number not found:', partNumber);
            areaDisplay.value = `பாகம் எண் ${partNumber} கண்டறியப்படவில்லை`;
            wardDisplay.value = 'கண்டறியப்படவில்லை';
            areaDisplay.style.background = '#ffebee';
            wardDisplay.style.background = '#ffebee';
            currentPartData = null;
            return;
        }
        
        // Success - store data
        const part = parts[0];
        currentPartData = {
            partNumber: partNumber,
            areaName: part.areas?.name || 'Unknown',
            wardCircle: part.ward_circle || ''
        };
        
        // Display data
        areaDisplay.value = currentPartData.areaName;
        wardDisplay.value = currentPartData.wardCircle;
        areaDisplay.style.background = '#e8f5e9';
        wardDisplay.style.background = '#e8f5e9';
        
        console.log('Part data found:', currentPartData);
        
    } catch (error) {
        console.error('Error in lookupPartNumber:', error);
        areaDisplay.value = 'பிழை ஏற்பட்டது';
        wardDisplay.value = 'பிழை ஏற்பட்டது';
        areaDisplay.style.background = '#ffebee';
        wardDisplay.style.background = '#ffebee';
        currentPartData = null;
    }
}

// Validate voter ID format
function validateVoterId() {
    const voterId = voterIdInput.value.trim().toUpperCase();
    voterIdInput.value = voterId;
    
    // Reset proceed button when input changes
    proceedBtn.disabled = true;
    hideStatusMessage();
}

// Validate part number format
function validatePartNumber() {
    const partNumber = partNumberInput.value.trim();
    partNumberInput.value = partNumber;
    
    // Reset proceed button when input changes
    proceedBtn.disabled = true;
    hideStatusMessage();
}

// Check voter ID availability
async function checkVoterAvailability() {
    const voterId = voterIdInput.value.trim().toUpperCase();
    const partNumber = partNumberInput.value.trim();
    
    // Validation
    if (!voterId || !partNumber) {
        showStatusMessage('⚠️ கிருपया வாக்காளர் எண் மற்றும் பாகம் எண் இரண்டையும் உள்ளிடவும்', 'error');
        return;
    }
    
    if (voterId.length < 8 || voterId.length > 20) {
        showStatusMessage('⚠️ வாக்காளர் எண் 8-20 எழுத்துகள் வரை இருக்க வேண்டும்', 'error');
        return;
    }
    
    if (partNumber.length < 1 || partNumber.length > 10) {
        showStatusMessage('⚠️ பாகம் எண் சரியான வடிவத்தில் இல்லை', 'error');
        return;
    }
    
    try {
        // Show loading state
        showStatusMessage('சரிபார்க்கப்படுகிறது...', 'loading');
        checkBtn.disabled = true;
        checkBtn.innerHTML = '<div class="loading-spinner"></div> சரிபார்க்கப்படுகிறது...';
        
        // Check if voter ID exists in database
        const { data, error, count } = await supabaseClient
            .from('bla_members')
            .select('voter_id', { count: 'exact' })
            .eq('voter_id', voterId)
            .limit(1);
        
        if (error) {
            throw error;
        }
        
        // Check results
        if (data && data.length > 0) {
            // Voter ID already exists
            showStatusMessage('⚠️ இந்த வாக்காளர் எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது', 'error');
            proceedBtn.disabled = true;
        } else {
            // Voter ID is available
            showStatusMessage('✅ இந்த வாக்காளர் எண் கிடைக்கிறது', 'success');
            proceedBtn.disabled = false;
        }
        
    } catch (error) {
        console.error('Error checking voter availability:', error);
        showStatusMessage('❌ சரிபார்ப்பதில் பிழை. மீண்டும் முயற்சிக்கவும்.', 'error');
        proceedBtn.disabled = true;
        
    } finally {
        // Reset check button
        checkBtn.disabled = false;
        checkBtn.innerHTML = '<i class="fas fa-search"></i> <span>கிடைக்குமா என சரிபார்க்கவும்</span>';
    }
}

// Proceed to registration
function proceedToRegistration() {
    const voterId = voterIdInput.value.trim().toUpperCase();
    const partNumber = partNumberInput.value.trim();
    
    // Validate inputs before proceeding
    if (!voterId || !partNumber) {
        showStatusMessage('⚠️ கிருபया வாக்காளர் எண் மற்றும் பாகம் எண் இரண்டையும் உள்ளிடவும்', 'error');
        return;
    }
    
    // Check if part data is available
    if (!currentPartData) {
        showStatusMessage('⚠️ பாகம் எண் தகவல் கண்டறியப்படவில்லை. சரியான பாகம் எண்ணை உள்ளிடவும்', 'error');
        return;
    }
    
    // Create URL with ALL parameters (voterId, partNumber, area, ward)
    const registrationUrl = `bla-office-entry.html?voterId=${encodeURIComponent(voterId)}&partNumber=${encodeURIComponent(partNumber)}&area=${encodeURIComponent(currentPartData.areaName)}&ward=${encodeURIComponent(currentPartData.wardCircle)}`;
    
    // Show loading state
    proceedBtn.disabled = true;
    proceedBtn.innerHTML = '<div class="loading-spinner"></div> பதிவுக்கு தொடர்கிறது...';
    
    // Redirect to registration form
    setTimeout(() => {
        window.location.href = registrationUrl;
    }, 1000);
}

// Show status message
function showStatusMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            if (statusMessage.classList.contains('success')) {
                hideStatusMessage();
            }
        }, 5000);
    }
}

// Hide status message
function hideStatusMessage() {
    statusMessage.style.display = 'none';
    statusMessage.className = 'status-message';
}

// Utility functions
function formatVoterId(value) {
    // Remove any non-alphanumeric characters and convert to uppercase
    return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

function formatPartNumber(value) {
    // Remove any non-numeric characters
    return value.replace(/[^0-9]/g, '');
}

// Enhanced input formatting
voterIdInput?.addEventListener('input', function() {
    this.value = formatVoterId(this.value);
});

partNumberInput?.addEventListener('input', function() {
    this.value = formatPartNumber(this.value);
});

// Handle Enter key press
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        if (!proceedBtn.disabled) {
            proceedToRegistration();
        } else if (!checkBtn.disabled) {
            checkVoterAvailability();
        }
    }
});

// Error handling for network issues
window.addEventListener('online', function() {
    showStatusMessage('✅ இணைய இணைப்பு மீண்டும் கிடைத்துள்ளது', 'success');
});

window.addEventListener('offline', function() {
    showStatusMessage('⚠️ இணைய இணைப்பு துண்டிக்கப்பட்டது', 'error');
});