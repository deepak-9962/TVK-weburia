// Global Variables
let currentSection = 'dashboard';
let complaints = [];
let members = [];
let tvkDatabase = null;
let slideIndex = 1;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializeSlider();
    initializeMobileMenu();
    // Removed floating particles & counter animations for a cleaner static UI
});

// Initialize Slider
function initializeSlider() {
    showSlide(slideIndex);
}

// Slider Functions
function plusSlides(n) {
    showSlide(slideIndex += n);
}

function currentSlide(n) {
    showSlide(slideIndex = n);
}

function showSlide(n) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    
    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].classList.add('active');
    }
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add('active');
    }
}

// Initialize App
async function initializeApp() {
    try {
        // Initialize database connection
        await initializeDatabase();
        tvkDatabase = window.tvkDB = tvkDB;
        
        setupEventListeners();
        await loadDataFromDatabase();
        updateStats();
        
        showNotification('کاکت', 'Database connected successfully!', 'success');
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showNotification('خرابی', 'Database connection failed. Using local storage.', 'warning');
        loadDataFromLocalStorage();
        setupEventListeners();
        updateStats();
    }
}

// Data Loading Functions
async function loadDataFromDatabase() {
    try {
        // Load complaints from Supabase
        const complaintsResult = await tvkDatabase.getComplaints();
        if (complaintsResult.success) {
            complaints = complaintsResult.data.map(complaint => ({
                id: complaint.complaint_number,
                name: complaint.complainant_name,
                phone: complaint.phone,
                email: complaint.email,
                address: complaint.address,
                type: complaint.complaint_type,
                details: complaint.complaint_details,
                priority: complaint.priority,
                status: complaint.status,
                date: new Date(complaint.created_at).toLocaleDateString('ta-IN')
            }));
        }

        // Load members from Supabase
        const membersResult = await tvkDatabase.getBLAMembers();
        if (membersResult.success) {
            members = membersResult.data.map(member => ({
                id: member.membership_number,
                name: member.full_name,
                phone: member.mobile,
                joinDate: new Date(member.created_at).toLocaleDateString('ta-IN'),
                type: 'BLA'
            }));
        }

        console.log('Data loaded from database successfully');
    } catch (error) {
        console.error('Error loading data from database:', error);
        loadDataFromLocalStorage();
    }
}

function loadDataFromLocalStorage() {
    complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    members = JSON.parse(localStorage.getItem('members') || '[]');
}
// Setup Event Listeners
function setupEventListeners() {
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            setActiveNav(this);
        });
    });

    // Complaint form submission
    const complaintForm = document.getElementById('complaintForm');
    if (complaintForm) {
        complaintForm.addEventListener('submit', handleComplaintSubmission);
    }
}

// Navigation Functions
function setActiveNav(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Section Management Functions
function openBLASection() {
    hideAllSections();
    document.getElementById('blaSection').style.display = 'block';
    document.getElementById('blaSection').classList.add('fade-in');
    currentSection = 'bla';
}

function closeBLASection() {
    document.getElementById('blaSection').style.display = 'none';
    currentSection = 'dashboard';
}

function openComplaintSection() {
    hideAllSections();
    document.getElementById('complaintSection').style.display = 'block';
    document.getElementById('complaintSection').classList.add('fade-in');
    currentSection = 'complaint';
}

function closeComplaintSection() {
    document.getElementById('complaintSection').style.display = 'none';
    currentSection = 'dashboard';
}

function hideAllSections() {
    document.getElementById('blaSection').style.display = 'none';
    document.getElementById('complaintSection').style.display = 'none';
}

// BLA Section Functions
function openAdminPanel() {
    showNotification('நிர்வாக பிரிவு', 'நிர்வாக பலகம் விரைவில் கிடைக்கும்', 'info');
    // Here you can implement admin panel functionality
    createAdminModal();
}

function openBLAActivities() {
    showNotification('BLA செயல்பாடுகள்', 'செயல்பாடுகள் பிரிவு விரைவில் கிடைக்கும்', 'info');
    // Here you can implement BLA activities functionality
    createBLAActivitiesModal();
}

function openOfficeActivities() {
    showNotification('அலுவலக செயல்பாடுகள்', 'அலுவலக பிரிவு விரைவில் கிடைக்கும்', 'info');
    // Here you can implement office activities functionality
    createOfficeActivitiesModal();
}

// Modal Creation Functions
function createAdminModal() {
    const modal = createModal('நிர்வாக பிரிவு', `
        <div class="admin-panel">
            <div class="admin-stats">
                <div class="stat-card">
                    <h3>மொத்த உறுப்பினர்கள்</h3>
                    <p class="stat-number">${members.length}</p>
                </div>
                <div class="stat-card">
                    <h3>புதிய குறைகள்</h3>
                    <p class="stat-number">${complaints.filter(c => c.status === 'pending').length}</p>
                </div>
            </div>
            <div class="admin-actions">
                <button class="action-btn" onclick="showMembersList()">
                    <i class="fas fa-users"></i> உறுப்பினர்கள் பட்டியல்
                </button>
                <button class="action-btn" onclick="showComplaintsList()">
                    <i class="fas fa-clipboard-list"></i> குறைகள் பட்டியல்
                </button>
                <button class="action-btn" onclick="generateReport()">
                    <i class="fas fa-chart-bar"></i> அறிக்கை தயாரிப்பு
                </button>
            </div>
        </div>
    `);
}

function createBLAActivitiesModal() {
    const modal = createModal('BLA செயல்பாடுகள்', `
        <div class="bla-activities">
            <div class="activities-tabs">
                <button class="tab-btn active" onclick="showActivitiesTab('upcoming')">
                    வரவிருக்கும் நிகழ்வுகள்
                </button>
                <button class="tab-btn" onclick="showActivitiesTab('completed')">
                    முடிந்த நிகழ்வுகள்
                </button>
                <button class="tab-btn" onclick="showActivitiesTab('meetings')">
                    கூட்டங்கள்
                </button>
            </div>
            <div class="activities-content" id="activitiesContent">
                <div class="activity-item">
                    <h4>மக்கள் நலக்கூட்டம்</h4>
                    <p>தேதி: 2025-10-01</p>
                    <p>இடம்: கட்சி அலுவலகம்</p>
                    <p>நேரம்: காலை 10:00 AM</p>
                </div>
                <div class="activity-item">
                    <h4>உறுப்பினர் பதிவு முகாம்</h4>
                    <p>தேதி: 2025-10-05</p>
                    <p>இடம்: சமுதாய மண்டபம்</p>
                    <p>நேரம்: காலை 9:00 AM - மாலை 5:00 PM</p>
                </div>
            </div>
            <div class="add-activity">
                <button class="action-btn" onclick="showAddActivityForm()">
                    <i class="fas fa-plus"></i> புதிய செயல்பாடு சேர்க்க
                </button>
            </div>
        </div>
    `);
}

function createOfficeActivitiesModal() {
    const modal = createModal('அலுவலக செயல்பாடுகள்', `
        <div class="office-activities">
            <div class="office-tabs">
                <button class="tab-btn active" onclick="showOfficeTab('daily')">
                    தினசரி பணிகள்
                </button>
                <button class="tab-btn" onclick="showOfficeTab('documents')">
                    ஆவணங்கள்
                </button>
                <button class="tab-btn" onclick="showOfficeTab('resources')">
                    வளங்கள்
                </button>
            </div>
            <div class="office-content" id="officeContent">
                <div class="office-task">
                    <h4>உறுப்பினர் விண்ணப்பங்கள் மதிப்பீடு</h4>
                    <p>நிலை: செயலில்</p>
                    <p>பொறுப்பாளர்: நிர்வாக குழு</p>
                </div>
                <div class="office-task">
                    <h4>குறை பதிவுகள் ஆய்வு</h4>
                    <p>நிலை: செயலில்</p>
                    <p>பொறுப்பாளர்: குறைதீர்ப்பு குழு</p>
                </div>
            </div>
            <div class="add-task">
                <button class="action-btn" onclick="showAddTaskForm()">
                    <i class="fas fa-plus"></i> புதிய பணி சேர்க்க
                </button>
            </div>
        </div>
    `);
}

// Modal Management
function createModal(title, content) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles for modal
    addModalStyles();
    
    return modal;
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

function addModalStyles() {
    if (document.getElementById('modalStyles')) return;
    
    const style = document.createElement('style');
    style.id = 'modalStyles';
    style.innerHTML = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            background: white;
            border-radius: 15px;
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 30px;
            border-bottom: 1px solid #eee;
            background: linear-gradient(135deg, #ff6b35, #f7931e);
            color: white;
            border-radius: 15px 15px 0 0;
        }
        
        .modal-header h3 {
            margin: 0;
            font-size: 1.5rem;
        }
        
        .modal-close {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            background: rgba(255,255,255,0.3);
            transform: rotate(90deg);
        }
        
        .modal-body {
            padding: 30px;
        }
        
        .admin-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            border-left: 4px solid #ff6b35;
        }
        
        .stat-card h3 {
            font-size: 1rem;
            color: #666;
            margin-bottom: 10px;
        }
        
        .stat-number {
            font-size: 2.5rem;
            font-weight: bold;
            color: #ff6b35;
            margin: 0;
        }
        
        .admin-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            justify-content: center;
        }
        
        .action-btn {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102,126,234,0.4);
        }
        
        .activities-tabs, .office-tabs {
            display: flex;
            margin-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        
        .tab-btn {
            background: none;
            border: none;
            padding: 15px 25px;
            cursor: pointer;
            font-weight: 600;
            color: #666;
            border-bottom: 2px solid transparent;
            transition: all 0.3s ease;
        }
        
        .tab-btn.active {
            color: #ff6b35;
            border-bottom-color: #ff6b35;
        }
        
        .activity-item, .office-task {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 15px;
            border-left: 4px solid #ff6b35;
        }
        
        .activity-item h4, .office-task h4 {
            margin-bottom: 10px;
            color: #2c3e50;
        }
        
        .activity-item p, .office-task p {
            margin: 5px 0;
            color: #666;
        }
    `;
    document.head.appendChild(style);
}

// Complaint Handling
async function handleComplaintSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const complaint = {
        complainant_name: formData.get('complainantName'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        address: formData.get('address'),
        complaint_type: formData.get('complaintType'),
        complaint_details: formData.get('complaintDetails'),
        priority: formData.get('priority'),
        status: 'pending'
    };
    
    try {
        if (tvkDatabase) {
            // Save to Supabase
            const result = await tvkDatabase.createComplaint(complaint);
            if (result.success) {
                const savedComplaint = {
                    id: result.data.complaint_number,
                    name: result.data.complainant_name,
                    phone: result.data.phone,
                    email: result.data.email,
                    address: result.data.address,
                    type: result.data.complaint_type,
                    details: result.data.complaint_details,
                    priority: result.data.priority,
                    status: result.data.status,
                    date: new Date(result.data.created_at).toLocaleDateString('ta-IN')
                };
                
                complaints.push(savedComplaint);
                showNotification('வெற்றி!', 'உங்கள் குறை வெற்றிகரமாக பதிவு செய்யப்பட்டது. குறை எண்: ' + savedComplaint.id, 'success');
            } else {
                throw new Error(result.error);
            }
        } else {
            // Fallback to localStorage
            const localComplaint = {
                ...complaint,
                id: Date.now(),
                date: new Date().toLocaleDateString('ta-IN')
            };
            complaints.push(localComplaint);
            localStorage.setItem('complaints', JSON.stringify(complaints));
            showNotification('வெற்றி!', 'உங்கள் குறை வெற்றிகரமாக பதிவு செய்யப்பட்டது. குறை எண்: ' + localComplaint.id, 'success');
        }
    } catch (error) {
        console.error('Error saving complaint:', error);
        showNotification('பிழை', 'குறை சமர்ப்பிக்கும்போது பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.', 'error');
    }
    
    e.target.reset();
    updateStats();
}

// Notification System
function showNotification(title, message, type = 'info') {
    // Remove existing notifications
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
    
    // Add notification styles
    addNotificationStyles();
    
    // Auto remove after 5 seconds
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
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 400px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 1100;
            animation: slideInRight 0.3s ease;
        }
        
        .notification.success {
            border-left: 4px solid #27ae60;
        }
        
        .notification.info {
            border-left: 4px solid #3498db;
        }
        
        .notification.warning {
            border-left: 4px solid #f39c12;
        }
        
        .notification.error {
            border-left: 4px solid #e74c3c;
        }
        
        .notification-content {
            padding: 20px;
        }
        
        .notification-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .notification-header strong {
            color: #2c3e50;
            font-size: 1.1rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: #7f8c8d;
            cursor: pointer;
            font-size: 1rem;
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .notification-close:hover {
            background: #ecf0f1;
            color: #2c3e50;
        }
        
        .notification p {
            margin: 0;
            color: #555;
            line-height: 1.5;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// Utility Functions
async function updateStats() {
    try {
        if (tvkDatabase) {
            const stats = await tvkDatabase.getStatistics();
            if (stats.success) {
                console.log('Database stats:', stats.data);
                return;
            }
        }
        
        // Fallback to local data
        console.log('Local stats:', {
            totalComplaints: complaints.length,
            totalMembers: members.length,
            pendingComplaints: complaints.filter(c => c.status === 'pending').length
        });
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

function showMembersList() {
    const membersList = members.length > 0 ? 
        members.map(member => `
            <div class="member-item">
                <h4>${member.name}</h4>
                <p>தொலைபேசி: ${member.phone}</p>
                <p>சேர்ந்த தேதி: ${member.joinDate}</p>
            </div>
        `).join('') : 
        '<p>இன்னும் உறுப்பினர்கள் இல்லை.</p>';
        
    createModal('உறுப்பினர்கள் பட்டியல்', `
        <div class="members-list">
            ${membersList}
        </div>
    `);
}

function showComplaintsList() {
    const complaintsList = complaints.length > 0 ?
        complaints.map(complaint => `
            <div class="complaint-item">
                <h4>குறை #${complaint.id}</h4>
                <p><strong>பெயர்:</strong> ${complaint.name}</p>
                <p><strong>வகை:</strong> ${complaint.type}</p>
                <p><strong>முன்னுரிமை:</strong> ${complaint.priority}</p>
                <p><strong>நிலை:</strong> ${complaint.status}</p>
                <p><strong>தேதி:</strong> ${complaint.date}</p>
                <p><strong>விவரம்:</strong> ${complaint.details}</p>
            </div>
        `).join('') :
        '<p>இன்னும் குறைகள் இல்லை.</p>';
        
    createModal('குறைகள் பட்டியல்', `
        <div class="complaints-list">
            ${complaintsList}
        </div>
    `);
}

function generateReport() {
    const report = `
        <div class="report-section">
            <h4>மாதாந்திர அறிக்கை</h4>
            <div class="report-stats">
                <div class="report-stat">
                    <span class="stat-label">மொத்த உறுப்பினர்கள்:</span>
                    <span class="stat-value">${members.length}</span>
                </div>
                <div class="report-stat">
                    <span class="stat-label">மொத்த குறைகள்:</span>
                    <span class="stat-value">${complaints.length}</span>
                </div>
                <div class="report-stat">
                    <span class="stat-label">நிலுவையில் உள்ள குறைகள்:</span>
                    <span class="stat-value">${complaints.filter(c => c.status === 'pending').length}</span>
                </div>
                <div class="report-stat">
                    <span class="stat-label">தீர்க்கப்பட்ட குறைகள்:</span>
                    <span class="stat-value">${complaints.filter(c => c.status === 'resolved').length}</span>
                </div>
            </div>
            <div class="report-actions">
                <button class="action-btn" onclick="downloadReport()">
                    <i class="fas fa-download"></i> அறிக்கையை பதிவிறக்கம்
                </button>
                <button class="action-btn" onclick="printReport()">
                    <i class="fas fa-print"></i> அச்சிடு
                </button>
            </div>
        </div>
    `;
    
    createModal('அறிக்கை', report);
}

function downloadReport() {
    showNotification('பதிவிறக்கம்', 'அறிக்கை பதிவிறக்கம் விரைவில் கிடைக்கும்', 'info');
}

function printReport() {
    showNotification('அச்சிடுதல்', 'அச்சிடும் வசதி விரைவில் கிடைக்கும்', 'info');
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC key to close modals and sections
    if (e.key === 'Escape') {
        closeModal();
        if (currentSection !== 'dashboard') {
            closeBLASection();
            closeComplaintSection();
        }
    }
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// ================================================
// MOBILE MENU FUNCTIONALITY
// ================================================

function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!mobileMenuBtn || !navMenu) return;
    
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    navMenu.classList.toggle('active');
    
    // Update button icon
    const icon = mobileMenuBtn.querySelector('i');
    if (navMenu.classList.contains('active')) {
        icon.className = 'fas fa-times';
    } else {
        icon.className = 'fas fa-bars';
    }
}

function closeMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (!navMenu || !mobileMenuBtn) return;
    
    navMenu.classList.remove('active');
    
    // Reset button icon
    const icon = mobileMenuBtn.querySelector('i');
    if (icon) {
        icon.className = 'fas fa-bars';
    }
}

// ================================================
// CREATIVE ENHANCEMENTS
// ================================================

// Removed particles, counter animation, scroll parallax & typing effect