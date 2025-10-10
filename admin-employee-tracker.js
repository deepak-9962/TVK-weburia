// This file handles the admin dashboard for tracking employee activity.

document.addEventListener('DOMContentLoaded', async () => {
    const mainView = document.getElementById('mainDashboardView');
    const detailView = document.getElementById('employeeDetailView');
    const employeeList = document.getElementById('employeeList');
    const backButton = document.getElementById('backButton');

    if (typeof supabase === 'undefined') {
        alert('Supabase client not found. Please check configuration.');
        return;
    }

    // Function to fetch and display all employees
    async function loadAllEmployees() {
        try {
            const { data: employees, error } = await supabase
                .from('employees')
                .select('id, employee_unique_id')
                .order('created_at', { ascending: false });

            if (error) throw error;

            employeeList.innerHTML = '';
            employees.forEach(emp => {
                const li = document.createElement('li');
                li.textContent = emp.employee_unique_id;
                li.dataset.employeeId = emp.id;
                li.dataset.employeeUniqueId = emp.employee_unique_id;
                li.addEventListener('click', () => showEmployeeDetails(emp));
                employeeList.appendChild(li);
            });
        } catch (err) {
            console.error('Error loading employees:', err);
            alert('Failed to load employees.');
        }
    }

    // Function to show detailed view for a single employee
    async function showEmployeeDetails(employee) {
        mainView.style.display = 'none';
        detailView.style.display = 'block';

        // Display basic info
        document.getElementById('detailEmployeeId').textContent = `Details for: ${employee.employee_unique_id}`;
        
        // Fetch full employee data for first login
        const { data: fullEmployee, error: empError } = await supabase
            .from('employees')
            .select('first_login_timestamp')
            .eq('id', employee.id)
            .single();
        
        if (empError) throw empError;

        const firstLogin = fullEmployee.first_login_timestamp 
            ? new Date(fullEmployee.first_login_timestamp).toLocaleString() 
            : 'Never logged in';
        document.getElementById('detailFirstLogin').textContent = firstLogin;

        // Fetch members added by this employee
        const { data: members, error: membersError } = await supabase
            .from('members')
            .select('full_name, ward, district, created_at')
            .eq('added_by_employee_id', employee.id)
            .order('created_at', { ascending: false });

        if (membersError) throw membersError;

        // Display total members added
        document.getElementById('detailTotalMembers').textContent = members.length;

        // Display activity breakdown
        const breakdownContainer = document.getElementById('activityBreakdown');
        const wardCounts = {};
        const districtCounts = {};
        members.forEach(m => {
            wardCounts[m.ward] = (wardCounts[m.ward] || 0) + 1;
            districtCounts[m.district] = (districtCounts[m.district] || 0) + 1;
        });

        let breakdownHtml = '<h4>By Ward:</h4><ul>';
        for (const ward in wardCounts) {
            breakdownHtml += `<li>${ward}: ${wardCounts[ward]} members</li>`;
        }
        breakdownHtml += '</ul><h4>By District:</h4><ul>';
        for (const district in districtCounts) {
            breakdownHtml += `<li>${district}: ${districtCounts[district]} members</li>`;
        }
        breakdownHtml += '</ul>';
        breakdownContainer.innerHTML = breakdownHtml;

        // Populate the members table
        const tableBody = document.getElementById('membersTableBody');
        tableBody.innerHTML = '';
        members.forEach(m => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td>${m.full_name}</td>
                <td>${m.ward}</td>
                <td>${m.district}</td>
                <td>${new Date(m.created_at).toLocaleDateString()}</td>
            `;
        });
    }

    // Handle back button click
    backButton.addEventListener('click', () => {
        detailView.style.display = 'none';
        mainView.style.display = 'block';
    });

    // Initial load
    loadAllEmployees();
});
