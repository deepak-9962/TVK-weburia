// BLA Office Login JavaScript for TVK

async function getSupabaseClient() {
    if (window.supabaseClient) {
        return window.supabaseClient;
    }

    if (typeof initializeSupabase !== 'function') {
        throw new Error('Supabase configuration is not loaded. Include supabase-config.js before office-login.js.');
    }

    window.supabaseClient = await initializeSupabase();
    return window.supabaseClient;
}

// DOM elements
let loginForm, usernameInput, passwordInput, loginBtn, statusMessage, passwordToggle;

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Initialize Supabase
        window.supabaseClient = await getSupabaseClient();
        
        // Get DOM elements
        loginForm = document.getElementById('loginForm');
        usernameInput = document.getElementById('username');
        passwordInput = document.getElementById('password');
        loginBtn = document.getElementById('loginBtn');
        statusMessage = document.getElementById('statusMessage');
        passwordToggle = document.getElementById('passwordToggle');
        
        // Add event listeners
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
        
        if (passwordToggle && passwordInput) {
            passwordToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                togglePasswordVisibility();
            });
        }
        
        // Clear any existing session data
        sessionStorage.removeItem('bla_employee_session');
        sessionStorage.removeItem('bla_voter_check');
        
        console.log('BLA office login page initialized successfully');
        
    } catch (error) {
        console.error('Error initializing office login page:', error);
        showStatusMessage('பிழை: பயன்பாட்டை தொடங்க முடியவில்லை. பக்கத்தை மீண்டும் ஏற்றவும்.', 'error');
    }
});

// Check for existing session
function checkExistingSession() {
    const sessionData = sessionStorage.getItem('tvk_employee_session');
    if (sessionData) {
        try {
            const session = JSON.parse(sessionData);
            const now = new Date().getTime();
            
            // Check if session is still valid (24 hours)
            if (session.expiresAt && now < session.expiresAt) {
                showStatusMessage('ஏற்கனவே உள்நுழைந்துள்ளீர்கள். தரவு உள்ளீட்டுப் பக்கத்திற்கு செல்கிறீர்கள்...', 'success');
                setTimeout(() => {
                    window.location.href = 'data-entry.html';
                }, 2000);
                return;
            } else {
                // Session expired
                sessionStorage.removeItem('tvk_employee_session');
            }
        } catch (error) {
            console.error('Error parsing session data:', error);
            sessionStorage.removeItem('tvk_employee_session');
        }
    }
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    console.log('Login attempt:', { username, passwordLength: password.length });
    
    // Basic validation
    if (!username || !password) {
        showStatusMessage('⚠️ பயனர் பெயர் மற்றும் கடவுச்சொல் இரண்டையும் உள்ளிடவும்', 'error');
        return;
    }
    
    if (username.length < 2) {
        showStatusMessage('⚠️ பயனர் பெயர் குறைந்தது 2 எழுத்துகள் இருக்க வேண்டும்', 'error');
        return;
    }
    
    if (password.length < 3) {
        showStatusMessage('⚠️ கடவுச்சொல் குறைந்தது 3 எழுத்துகள் இருக்க வேண்டும்', 'error');
        return;
    }
    
    try {
        // Show loading state
        showStatusMessage('உள்நுழைகிறது...', 'loading');
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<div class="loading-spinner"></div> உள்நுழைகிறது...';
        
        // Test Supabase connection first
        const client = await getSupabaseClient();

        // Test basic connection
        const { data: testData, error: testError } = await client
            .from('employees')
            .select('count')
            .limit(1);
        
        if (testError) {
            console.error('Supabase connection test failed:', testError);
            showStatusMessage('❌ தரவுத்தள இணைப்பு பிழை. மீண்டும் முயற்சிக்கவும்.', 'error');
            return;
        }
        
        console.log('Supabase connection test successful');
        
        // Authenticate employee
    const employee = await authenticateEmployee(username, password);
        
        if (employee) {
            console.log('Employee authenticated:', employee.username);
            
            // Create session
            const sessionData = {
                employeeId: employee.id,
                username: employee.username,
                fullName: employee.full_name,
                role: employee.role || 'employee',
                loginTime: new Date().getTime(),
                expiresAt: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours
            };
            
            // Store employee session data
            sessionStorage.setItem('bla_employee_session', JSON.stringify(sessionData));
            
            // Update last login time (optional - don't fail if this doesn't work)
            try {
                await updateLastLogin(employee.id);
            } catch (updateError) {
                console.warn('Could not update last login:', updateError);
            }
            
            // Success message
            showStatusMessage('✅ வெற்றிகரமாக உள்நுழைந்துள்ளீர்கள். வாக்காளர் சரிபார்ப்பு பக்கத்திற்கு செல்கிறீர்கள்...', 'success');
            
            // Redirect to voter check page
            setTimeout(() => {
                window.location.href = 'voter-check.html';
            }, 2000);
            
        } else {
            console.log('Authentication failed for username:', username);
            showStatusMessage('❌ தவறான பயனர் பெயர் அல்லது கடவுச்சொல். மீண்டும் முயற்சிக்கவும்.', 'error');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showStatusMessage(`❌ உள்நுழைவில் பிழை: ${error.message}`, 'error');
        
    } finally {
        // Reset login button
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> <span>உள்நுழைக</span>';
    }
}

// Authenticate employee
async function authenticateEmployee(username, password) {
    try {
        console.log('Authenticating employee:', username);
        
        // First, check if employees table exists and has data
        const client = await getSupabaseClient();

        const { data: employees, error } = await client
            .from('employees')
            .select('*')
            .eq('email', username)
            .eq('status', 'active')
            .limit(1);
        
        if (error) {
            console.error('Database query error:', error);
            
            // If table doesn't exist, try to create sample employees first
            if (error.code === 'PGRST116' || error.message.includes('relation "employees" does not exist')) {
                console.log('Employees table not found, creating sample employees...');
                await createSampleEmployees();
                
                // Try again after creating employees
                const { data: retryEmployees, error: retryError } = await client
                    .from('employees')
                    .select('*')
                    .eq('email', username)
                    .eq('status', 'active')
                    .limit(1);
                
                if (retryError) {
                    throw retryError;
                }
                
                if (!retryEmployees || retryEmployees.length === 0) {
                    console.log('No employee found with username:', username);
                    return null;
                }
                
                const employee = retryEmployees[0];
                console.log('Found employee after retry:', employee.email);
                
                if (employee.password === password) {
                    return employee;
                }
                
                return null;
            }
            
            throw error;
        }
        
        if (!employees || employees.length === 0) {
            console.log('No employee found with username:', username);
            
            // Check if this is a default employee that should exist
            if (['admin', 'manager', 'office'].includes(username)) {
                console.log('Default employee not found, creating sample employees...');
                await createSampleEmployees();
                
                // Try again
                const { data: retryEmployees, error: retryError } = await client
                    .from('employees')
                    .select('*')
                    .eq('email', username)
                    .eq('status', 'active')
                    .limit(1);
                
                if (!retryError && retryEmployees && retryEmployees.length > 0) {
                    const employee = retryEmployees[0];
                    if (employee.password === password) {
                        return employee;
                    }
                }
            }
            
            return null; // User not found
        }
        
        const employee = employees[0];
        console.log('Found employee:', employee.email);
        
        // Simple password comparison (plain text passwords in setup-employees.sql)
        if (employee.password === password) {
            return employee;
        }
        
        return null; // Invalid password
        
    } catch (error) {
        console.error('Authentication error:', error);
        
        // Fallback authentication for demo purposes if database fails
        const fallbackCredentials = {
            'admin': 'admin123',
            'manager': 'manager123',
            'office': 'office123'
        };
        
        if (fallbackCredentials[username] && fallbackCredentials[username] === password) {
            console.log('Using fallback authentication for:', username);
            return {
                id: 'fallback-' + username,
                username: username,
                full_name: username === 'admin' ? 'நிர்வாகி முருகன்' : 
                          username === 'manager' ? 'மேலாளர் கவிதா' : 
                          'அலுவலக பணியாளர் ராஜ்',
                role: username === 'admin' ? 'admin' : 
                      username === 'manager' ? 'manager' : 'data_entry',
                is_active: true
            };
        }
        
        return null;
    }
}

// Simple password verification (in production, use bcrypt)
async function verifyPassword(password, hash) {
    // For demo purposes, we'll check some default passwords
    const defaultPasswords = {
        'admin': 'admin123',
        'manager': 'manager123',
        'data_entry': 'entry123'
    };
    
    // Check if it's a hashed password or plain text (for demo)
    if (hash.length > 20) {
        // Assume it's hashed - in production, use bcrypt.compare()
        return false;
    } else {
        // Plain text comparison for demo
        return password === hash;
    }
}

// Update last login time
async function updateLastLogin(employeeId) {
    try {
        const client = await getSupabaseClient();

        const { error } = await client
            .from('employees')
            .update({ 
                last_login: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', employeeId);
        
        if (error) {
            console.error('Error updating last login:', error);
        }
    } catch (error) {
        console.error('Error updating last login:', error);
    }
}

// Toggle password visibility
function togglePasswordVisibility() {
    if (!passwordInput || !passwordToggle) {
        console.error('Password input or toggle button not found');
        return;
    }
    
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle icon
    if (type === 'text') {
        passwordToggle.classList.remove('fa-eye');
        passwordToggle.classList.add('fa-eye-slash');
    } else {
        passwordToggle.classList.remove('fa-eye-slash');
        passwordToggle.classList.add('fa-eye');
    }
}

// Handle forgot password
function handleForgotPassword(e) {
    e.preventDefault();
    showStatusMessage('📞 கடவுச்சொல் மீட்டமைக்க நிர்வாகியை தொடர்பு கொள்ளவும்: +91-9876543210', 'loading');
}

// Validate username
function validateUsername() {
    const username = usernameInput.value.trim();
    usernameInput.value = username.toLowerCase(); // Convert to lowercase
    
    // Remove invalid characters
    usernameInput.value = usernameInput.value.replace(/[^a-z0-9_]/g, '');
}

// Validate password
function validatePassword() {
    // Just ensure no leading/trailing spaces
    // Don't modify the password itself
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
}

// Hide status message
function hideStatusMessage() {
    statusMessage.style.display = 'none';
    statusMessage.className = 'status-message';
}

// Handle Enter key press
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !loginBtn.disabled) {
        loginForm.dispatchEvent(new Event('submit'));
    }
});

// Create sample employees (for demo purposes)
async function createSampleEmployees() {
    try {
        console.log('Creating sample employees...');
        
        // Ensure we have a Supabase client
        const client = await getSupabaseClient();

        const sampleEmployees = [
            {
                full_name: 'நிர்வாகி முருகன்',
                username: 'admin',
                password_hash: 'admin123', // In production, this should be hashed
                role: 'admin',
                is_active: true
            },
            {
                full_name: 'மேலாளர் கவிதா',
                username: 'manager',
                password_hash: 'manager123',
                role: 'manager',
                is_active: true
            },
            {
                full_name: 'அலுவலக பணியாளர் ராஜ்',
                username: 'office',
                password_hash: 'office123',
                role: 'data_entry',
                is_active: true
            }
        ];
        
        let createdCount = 0;
        
        // Try to insert each employee individually
        for (const employee of sampleEmployees) {
            try {
                // Check if employee already exists
                const { data: existing, error: checkError } = await client
                    .from('employees')
                    .select('username')
                    .eq('username', employee.username)
                    .limit(1);
                
                if (checkError) {
                    console.error(`Error checking employee ${employee.username}:`, checkError);
                    continue;
                }
                
                if (!existing || existing.length === 0) {
                    const { data, error } = await client
                        .from('employees')
                        .insert([employee])
                        .select();
                    
                    if (error) {
                        console.error(`Error creating employee ${employee.username}:`, error);
                    } else {
                        console.log(`✅ Created employee: ${employee.username}`);
                        createdCount++;
                    }
                } else {
                    console.log(`✅ Employee ${employee.username} already exists`);
                }
            } catch (err) {
                console.error(`Error processing employee ${employee.username}:`, err);
            }
        }
        
        console.log(`Sample employees creation completed - Created: ${createdCount}, Total Available: ${sampleEmployees.length}`);
        return createdCount;
        
    } catch (error) {
        console.error('Error in createSampleEmployees:', error);
        return 0;
    }
}

// Auto-create sample employees on first load (for demo)
if (localStorage.getItem('tvk_sample_employees_created') !== 'true') {
    setTimeout(() => {
        createSampleEmployees().then(() => {
            localStorage.setItem('tvk_sample_employees_created', 'true');
        });
    }, 2000);
}

// Test database connection function
async function testDatabaseConnection() {
    try {
        console.log('Testing database connection...');
        
        const client = await getSupabaseClient();

        // Test 1: Check if employees table exists and has data
        const { data: employees, error: empError } = await client
            .from('employees')
            .select('*')
            .limit(5);
        
        if (empError) {
            console.error('❌ Employees table error:', empError);
            return false;
        }
        
        console.log('✅ Employees table data:', employees);
        console.log(`📊 Found ${employees.length} employees in database`);
        
        // Test 2: Check if bla_members table exists
        const { data: members, error: memberError } = await client
            .from('bla_members')
            .select('count')
            .limit(1);
        
        if (memberError) {
            console.error('❌ BLA Members table error:', memberError);
        } else {
            console.log('✅ BLA Members table accessible');
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Database connection test failed:', error);
        return false;
    }
}

// Add test button to page (temporary for testing)
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const testBtn = document.createElement('button');
        testBtn.textContent = '🧪 Test Database Connection';
        testBtn.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999; background: #28a745; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;';
        testBtn.onclick = async () => {
            const result = await testDatabaseConnection();
            alert(result ? '✅ Database Connected!' : '❌ Database Connection Failed - Check Console');
        };
        document.body.appendChild(testBtn);
    }, 1000);
});

// Error handling for network issues
window.addEventListener('online', function() {
    showStatusMessage('✅ இணைய இணைப்பு மீண்டும் கிடைத்துள்ளது', 'success');
});

window.addEventListener('offline', function() {
    showStatusMessage('⚠️ இணைய இணைப்பு துண்டிக்கப்பட்டது', 'error');
});