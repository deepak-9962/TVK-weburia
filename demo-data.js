// Demo Data for TVK Political Party App

// Sample BLA Members Data
const sampleBLAMembers = [
    {
        membershipNumber: 'TVK1728292800001',
        personalInfo: {
            fullName: 'முருகன் சௌந்தர்ராஜன்',
            fatherName: 'சௌந்தர்ராஜன்',
            dateOfBirth: '1985-06-15',
            gender: 'male',
            occupation: 'தொழிலதிபர்',
            education: 'graduate'
        },
        contact: {
            mobile: '9876543210',
            altMobile: '8765432109',
            email: 'murugan@example.com',
            address: 'எண் 45, பெரிய தெரு, தி.நகர்',
            district: 'chennai',
            pincode: '600017'
        },
        political: {
            voterId: 'TNE1234567',
            constituency: 'தி.நகர்',
            previousParty: 'இல்லை',
            interests: ['youth', 'business']
        },
        registrationDate: '2025-09-15T10:30:00.000Z',
        status: 'active'
    },
    {
        membershipNumber: 'TVK1728292800002',
        personalInfo: {
            fullName: 'பார்வதி கணேஷ்',
            fatherName: 'கணேஷ் குமார்',
            dateOfBirth: '1990-03-22',
            gender: 'female',
            occupation: 'ஆசிரியர்',
            education: 'post-graduate'
        },
        contact: {
            mobile: '9765432108',
            altMobile: '',
            email: 'parvathi@example.com',
            address: 'எண் 23, புது கடையீட்டு தெரு',
            district: 'coimbatore',
            pincode: '641001'
        },
        political: {
            voterId: 'TNC9876543',
            constituency: 'கோயம்புத்தூர் தெற்கு',
            previousParty: 'இல்லை',
            interests: ['women', 'social']
        },
        registrationDate: '2025-09-20T14:15:00.000Z',
        status: 'active'
    }
];

// Sample Complaints Data
const sampleComplaints = [
    {
        id: 1728292800001,
        name: 'ராஜ் குமார்',
        phone: '9876543201',
        email: 'raj@example.com',
        address: 'எண் 67, அண்ணா நகர், சென்னை',
        type: 'infrastructure',
        details: 'எங்கள் பகுதியில் சாலை மிகவும் மோசமான நிலையில் உள்ளது. மழைக் காலத்தில் தண்ணீர் தேங்கி நிற்கிறது.',
        priority: 'high',
        status: 'pending',
        date: '2025-09-25'
    },
    {
        id: 1728292800002,
        name: 'சுந்தரி அம்மாள்',
        phone: '9876543202',
        email: 'sundari@example.com',
        address: 'எண் 12, காமராஜர் நகர், மதுரை',
        type: 'public-service',
        details: 'மருத்துவமனையில் மருந்துகள் கிடைக்கவில்லை. வாரம் வாரம் சென்று வெறும் கையோடு திரும்ப வேண்டியுள்ளது.',
        priority: 'urgent',
        status: 'in-progress',
        date: '2025-09-23'
    },
    {
        id: 1728292800003,
        name: 'வேலுசாமி',
        phone: '9876543203',
        email: '',
        address: 'எண் 34, விவசாயி கிராமம், தஞ்சாவூர்',
        type: 'social-issue',
        details: 'கிராமத்தில் குடிநீர் வசதி இல்லை. தினமும் 2 கிலோமீட்டர் நடந்து தண்ணீர் எடுத்து வர வேண்டியுள்ளது.',
        priority: 'high',
        status: 'resolved',
        date: '2025-09-20'
    }
];

// Sample Activities Data
const sampleActivities = [
    {
        id: 'ACT001',
        title: 'மக்கள் நலக்கூட்டம்',
        type: 'meeting',
        date: '2025-10-01',
        time: '10:00 AM',
        venue: 'கட்சி அலுவலகம், சென்னை',
        description: 'பகுதியின் அடிப்படை வசதிகள் குறித்த விவாதம்',
        status: 'upcoming',
        attendees: 50
    },
    {
        id: 'ACT002',
        title: 'உறுப்பினர் பதிவு முகாம்',
        type: 'registration',
        date: '2025-10-05',
        time: '9:00 AM - 5:00 PM',
        venue: 'சமுதாய மண்டபம், கோயம்புத்தூர்',
        description: 'புதிய உறுப்பினர்களை சேர்க்கும் சிறப்பு முகாம்',
        status: 'upcoming',
        attendees: 100
    },
    {
        id: 'ACT003',
        title: 'இலவச மருத்துவ முகாம்',
        type: 'service',
        date: '2025-09-15',
        time: '8:00 AM - 4:00 PM',
        venue: 'அரசு பள்ளி, மதுரை',
        description: 'இலவச மருத்துவ பரிசோதனை மற்றும் மருந்து வழங்குதல்',
        status: 'completed',
        attendees: 200
    }
];

// Sample Office Tasks Data
const sampleOfficeTasks = [
    {
        id: 'TASK001',
        title: 'உறுப்பினர் விண்ணப்பங்கள் மதிப்பீடு',
        description: 'புதிய உறுப்பினர் விண்ணப்பங்களை ஆய்வு செய்து அங்கீகரிக்க வேண்டும்',
        assignedTo: 'நிர்வாக குழு',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2025-10-01',
        progress: 60
    },
    {
        id: 'TASK002',
        title: 'குறை பதிவுகள் ஆய்வு',
        description: 'வந்துள்ள குறைகளை ஆய்வு செய்து தீர்வு காண வேண்டும்',
        assignedTo: 'குறைதீர்ப்பு குழு',
        status: 'in-progress',
        priority: 'urgent',
        dueDate: '2025-09-30',
        progress: 40
    },
    {
        id: 'TASK003',
        title: 'மாதாந்திர அறிக்கை தயாரிப்பு',
        description: 'செப்டம்பர் மாத செயல்பாடுகள் அறிக்கை தயாரிக்க வேண்டும்',
        assignedTo: 'செயலாளர் அலுவலகம்',
        status: 'completed',
        priority: 'medium',
        dueDate: '2025-09-28',
        progress: 100
    }
];

// Initialize demo data in localStorage
function initializeDemoData() {
    // Check if data already exists
    if (!localStorage.getItem('blaMembers')) {
        localStorage.setItem('blaMembers', JSON.stringify(sampleBLAMembers));
    }
    
    if (!localStorage.getItem('complaints')) {
        localStorage.setItem('complaints', JSON.stringify(sampleComplaints));
    }
    
    if (!localStorage.getItem('activities')) {
        localStorage.setItem('activities', JSON.stringify(sampleActivities));
    }
    
    if (!localStorage.getItem('officeTasks')) {
        localStorage.setItem('officeTasks', JSON.stringify(sampleOfficeTasks));
    }
    
    // Update general members list
    const generalMembers = sampleBLAMembers.map(member => ({
        id: member.membershipNumber,
        name: member.personalInfo.fullName,
        phone: member.contact.mobile,
        joinDate: new Date(member.registrationDate).toLocaleDateString('ta-IN'),
        type: 'BLA'
    }));
    
    if (!localStorage.getItem('members')) {
        localStorage.setItem('members', JSON.stringify(generalMembers));
    }
}

// Load demo data on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add a button to load demo data
    addDemoDataButton();
});

function addDemoDataButton() {
    const style = document.createElement('style');
    style.innerHTML = `
        .demo-button {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(52,152,219,0.3);
            transition: all 0.3s ease;
            font-size: 0.9rem;
        }
        .demo-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(52,152,219,0.4);
        }
        .demo-button i {
            margin-right: 8px;
        }
    `;
    document.head.appendChild(style);
    
    const button = document.createElement('button');
    button.className = 'demo-button';
    button.innerHTML = '<i class="fas fa-database"></i>Demo Data';
    button.onclick = loadDemoData;
    document.body.appendChild(button);
}

function loadDemoData() {
    initializeDemoData();
    
    // Show notification
    if (typeof showNotification === 'function') {
        showNotification('Demo Data', 'Sample data loaded successfully! Refresh the page to see the data.', 'success');
    } else {
        alert('Demo data loaded! Please refresh the page to see the sample data.');
    }
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sampleBLAMembers,
        sampleComplaints,
        sampleActivities,
        sampleOfficeTasks,
        initializeDemoData
    };
}