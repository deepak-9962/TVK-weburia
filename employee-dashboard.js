// This file handles the employee dashboard functionality.

document.addEventListener('DOMContentLoaded', () => {
    const employeeIdDisplay = document.getElementById('employeeIdDisplay');
    const logoutButton = document.getElementById('logoutButton');
    const addMemberForm = document.getElementById('addMemberForm');
    const successMessage = document.getElementById('successMessage');

    // Check for a logged-in employee in session storage
    const loggedInEmployee = JSON.parse(sessionStorage.getItem('loggedInEmployee'));

    if (!loggedInEmployee) {
        // If no employee is logged in, redirect to the login page
        window.location.href = 'employee-login.html';
        return;
    }

    // Display the employee's ID
    employeeIdDisplay.textContent = loggedInEmployee.employee_unique_id;

    // Handle logout
    logoutButton.addEventListener('click', () => {
        sessionStorage.removeItem('loggedInEmployee');
        window.location.href = 'employee-login.html';
    });

    // Handle the "Add New Member" form submission
    addMemberForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        successMessage.style.display = 'none';

        const fullName = document.getElementById('fullName').value.trim();
        const ward = document.getElementById('ward').value.trim();
        const district = document.getElementById('district').value.trim();

        if (!fullName || !ward || !district) {
            alert('Please fill out all fields.');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('members')
                .insert([{
                    full_name: fullName,
                    ward: ward,
                    district: district,
                    added_by_employee_id: loggedInEmployee.id
                }]);

            if (error) {
                throw error;
            }

            // Show success message and clear the form
            successMessage.textContent = `Successfully added member: ${fullName}`;
            successMessage.style.display = 'block';
            addMemberForm.reset();

            // Hide the success message after a few seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);

        } catch (err) {
            console.error('Error adding member:', err);
            alert(`Failed to add member. Error: ${err.message}`);
        }
    });
});
