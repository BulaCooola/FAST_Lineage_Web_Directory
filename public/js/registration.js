document.addEventListener('DOMContentLoaded', function () {
    var registrationForm = document.getElementById('registration-form');
    var errorList = document.getElementById('error-list');

    registrationForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Collect form data
        var formData = new FormData(registrationForm);

        // Make AJAX request
        fetch('/users/register', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log('Response Headers:', response.headers);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response Body:', data);
            // Check if there are errors
            if (data.errors) {
                // Clear existing error messages
                errorList.innerHTML = '';

                // Display new error messages
                data.errors.forEach(function (error) {
                    var li = document.createElement('li');
                    li.textContent = error;
                    errorList.appendChild(li);
                });
            } else {
                // Redirect or perform any other action on success
                window.location.href = '/users/login'; // Replace with your success page
            }
        })
        .catch(error => console.error('Error:', error));
    });
});