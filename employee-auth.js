// ============================================
// TVK Employee Authentication & Dashboard Logic
// File: employee-auth.js
// ============================================

let supabaseInstance = null;

async function getSupabaseClient() {
    if (supabaseInstance) {
        return supabaseInstance;
    }

    if (typeof initializeSupabase !== 'function') {
        throw new Error('Supabase configuration is not loaded. Include supabase-config.js before employee-auth.js.');
    }

    supabaseInstance = await initializeSupabase();
    return supabaseInstance;
}

// ============================================
// EMPLOYEE LOGIN PAGE LOGIC
// ============================================

if (document.getElementById('employeeLoginForm')) {
    const loginForm = document.getElementById('employeeLoginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const btnText = document.getElementById('btnText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');
    const togglePassword = document.getElementById('togglePassword');

    // Password toggle functionality
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    }

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    }

    // Set loading state
    function setLoading(isLoading) {
        if (isLoading) {
            loginBtn.disabled = true;
            btnText.style.display = 'none';
            loadingSpinner.classList.add('active');
        } else {
            loginBtn.disabled = false;
            btnText.style.display = 'block';
            loadingSpinner.classList.remove('active');
        }
    }

    // Login function
    async function login(email, password) {
        try {
            setLoading(true);
            console.log('Attempting employee login for:', email);

            // Get Supabase client
            const supabase = await getSupabaseClient();

            // Query employees table directly for email and password match
            const { data: employee, error } = await supabase
                .from('employees')
                .select('*')
                .eq('email', email.toLowerCase())
                .eq('password', password)
                .eq('status', 'active')
                .single();

            if (error || !employee) {
                console.error('Login error:', error);
                showError('தவறான மின்னஞ்சல் அல்லது கடவுச்சொல் (Invalid email or password)');
                setLoading(false);
                return;
            }

            console.log('Employee login successful:', employee.employee_id);

            console.log('Employee login successful:', employee.employee_id);

            // Store employee session
            sessionStorage.setItem('tvk_employee_session', JSON.stringify({
                employeeId: employee.id,
                employee_id: employee.employee_id,
                email: employee.email,
                full_name: employee.full_name,
                role: employee.role,
                login_time: new Date().toISOString()
            }));

            // Also store for BLA office entry compatibility
            sessionStorage.setItem('bla_employee_session', JSON.stringify({
                employeeId: employee.id,
                id: employee.id,
                employee_id: employee.employee_id,
                email: employee.email,
                full_name: employee.full_name
            }));

            // Redirect to employee dashboard
            window.location.href = 'employee-dashboard.html';

        } catch (error) {
            console.error('Login error:', error);
            showError('உள்நுழைவில் பிழை ஏற்பட்டது (Login error occurred)');
            setLoading(false);
        }
    }

    // Handle form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            showError('மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும் (Please enter email and password)');
            return;
        }

        await login(email, password);
    });

    // Check if already logged in
    window.addEventListener('DOMContentLoaded', function() {
        const employeeSession = sessionStorage.getItem('tvk_employee_session');
        if (employeeSession) {
            try {
                const session = JSON.parse(employeeSession);
                if (session.employeeId || session.employee_id) {
                    // Already logged in, redirect to dashboard
                    window.location.href = 'employee-dashboard.html';
                }
            } catch (e) {
                sessionStorage.removeItem('tvk_employee_session');
                sessionStorage.removeItem('bla_employee_session');
            }
        }
    });
}

// ============================================
// EMPLOYEE DASHBOARD PAGE LOGIC
// ============================================

if (document.getElementById('voterSelectionForm')) {
    const voterIdInput = document.getElementById('voterId');
    const areaSelect = document.getElementById('areaSelect');
    const partSelect = document.getElementById('partSelect');
    const continueBtn = document.getElementById('continueBtn');
    const errorMessage = document.getElementById('errorMessage');
    const logoutBtn = document.getElementById('logoutBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const voterForm = document.getElementById('voterSelectionForm');

    // Check authentication on page load
    window.addEventListener('DOMContentLoaded', async function() {
        const employeeSession = sessionStorage.getItem('tvk_employee_session');
        
        if (!employeeSession) {
            // Not logged in, redirect to login page
            window.location.href = 'employee-login.html';
            return;
        }

        try {
            const session = JSON.parse(employeeSession);
            if (!session.user_id) {
                window.location.href = 'employee-login.html';
                return;
            }

            // Load areas dropdown
            await loadAreas();
        } catch (e) {
            console.error('Session error:', e);
            sessionStorage.removeItem('tvk_employee_session');
            window.location.href = 'employee-login.html';
        }
    });

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    }

    // Show/hide loading overlay
    function setLoading(isLoading) {
        if (isLoading) {
            loadingOverlay.classList.add('active');
        } else {
            loadingOverlay.classList.remove('active');
        }
    }

    // Load all areas from database
    async function loadAreas() {
        try {
            setLoading(true);
            console.log('Loading areas from database...');

            const supabase = await getSupabaseClient();

            const { data: areas, error } = await supabase
                .from('areas')
                .select('id, name')
                .order('name', { ascending: true });

            if (error) {
                console.error('Error loading areas:', error);
                showError('பகுதிகளை ஏற்றுவதில் பிழை (Error loading areas)');
                setLoading(false);
                return;
            }

            console.log('Areas loaded:', areas.length);

            // Populate area dropdown
            areaSelect.innerHTML = '<option value="">-- பகுதியைத் தேர்ந்தெடுக்கவும் (Select Area) --</option>';
            
            areas.forEach(area => {
                const option = document.createElement('option');
                option.value = area.id;
                option.textContent = area.name;
                areaSelect.appendChild(option);
            });

            setLoading(false);
        } catch (error) {
            console.error('Error loading areas:', error);
            showError('பகுதிகளை ஏற்றுவதில் பிழை (Error loading areas)');
            setLoading(false);
        }
    }

    // Load parts for selected area
    async function loadParts(areaId) {
        try {
            setLoading(true);
            console.log('Loading parts for area:', areaId);

            const supabase = await getSupabaseClient();

            const { data: parts, error } = await supabase
                .from('parts')
                .select('id, part_number')
                .eq('area_id', areaId)
                .order('part_number', { ascending: true });

            if (error) {
                console.error('Error loading parts:', error);
                showError('பாகங்களை ஏற்றுவதில் பிழை (Error loading parts)');
                setLoading(false);
                return;
            }

            console.log('Parts loaded:', parts.length);

            // Populate part number dropdown
            partSelect.innerHTML = '<option value="">-- பாகம் எண்ணைத் தேர்ந்தெடுக்கவும் (Select Part Number) --</option>';
            
            parts.forEach(part => {
                const option = document.createElement('option');
                option.value = part.part_number;
                option.textContent = `பாகம் ${part.part_number} (Part ${part.part_number})`;
                partSelect.appendChild(option);
            });

            // Enable part select
            partSelect.disabled = false;
            setLoading(false);
        } catch (error) {
            console.error('Error loading parts:', error);
            showError('பாகங்களை ஏற்றுவதில் பிழை (Error loading parts)');
            setLoading(false);
        }
    }

    // Area selection change handler
    areaSelect.addEventListener('change', function() {
        const areaId = this.value;
        
        // Reset part select
        partSelect.innerHTML = '<option value="">-- முதலில் பகுதியைத் தேர்ந்தெடுக்கவும் (Select Area First) --</option>';
        partSelect.disabled = true;
        partSelect.value = '';
        
        // Validate continue button
        validateForm();

        if (areaId) {
            loadParts(areaId);
        }
    });

    // Validate form and enable/disable continue button
    function validateForm() {
        const voterId = voterIdInput.value.trim();
        const areaId = areaSelect.value;
        const partNumber = partSelect.value;

        if (voterId && areaId && partNumber) {
            continueBtn.disabled = false;
        } else {
            continueBtn.disabled = true;
        }
    }

    // Add validation listeners
    voterIdInput.addEventListener('input', validateForm);
    partSelect.addEventListener('change', validateForm);

    // Handle form submission
    voterForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const voterId = voterIdInput.value.trim().toUpperCase();
        const partNumber = partSelect.value;

        if (!voterId || !partNumber) {
            showError('அனைத்து புலங்களையும் நிரப்பவும் (Please fill all fields)');
            return;
        }

        console.log('Redirecting to registration with:', { voterId, partNumber });

        // Redirect to BLA registration form with URL parameters
        window.location.href = `bla-office-entry.html?voterId=${encodeURIComponent(voterId)}&partNumber=${encodeURIComponent(partNumber)}`;
    });

    // Logout functionality
    logoutBtn.addEventListener('click', async function() {
        try {
            // Sign out from Supabase
            const supabase = await getSupabaseClient();
            await supabase.auth.signOut();
            
            // Clear session
            sessionStorage.removeItem('tvk_employee_session');
            
            // Redirect to login page
            window.location.href = 'employee-login.html';
        } catch (error) {
            console.error('Logout error:', error);
            // Force logout anyway
            sessionStorage.removeItem('tvk_employee_session');
            window.location.href = 'employee-login.html';
        }
    });
}
