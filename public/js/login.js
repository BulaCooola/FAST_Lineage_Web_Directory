document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            if (!validateLoginForm()) {
                event.preventDefault();
            }
        });
    }
    });


function validateLoginForm() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    if (!isValidEmail(email)) {
        alert('Invalid email address format.');
        return false;
    }

    if (!isValidPassword(password)) {
        alert('Invalid password format.');
        return false;
    }

    // If all validations pass
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
}