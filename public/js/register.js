//FROM LAB 10 SEAN PAYBA
document.addEventListener('DOMContentLoaded', function () {
const registerForm = document.getElementById('registration-form');
if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
        if (!validateRegisterForm()) {
            event.preventDefault();
        }
    });
}
});

function validateRegisterForm() {
    const firstName = document.getElementById('firstNameInput').value;
    const lastName = document.getElementById('lastNameInput').value;
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    const confirmPassword = document.getElementById('confirmPasswordInput').value;
    const line = document.getElementById('lineInput').value;
    if (!isValidName(firstName)) {
        alert('Invalid first name.');
        return false;
    }

    if (!isValidName(lastName)) {
        alert('Invalid last name.');
        return false;
    }

    if (!isValidEmail(email)) {
        alert('Invalid email address format.');
        return false;
    }

    if (!isValidPassword(password)) {
        alert('Invalid password format.');
        return false;
    }

    if (password !== confirmPassword) {
        alert('Password and Confirm Password must match.');
        return false;
    }

    if (line.trim()==="") {
        alert('Must select a line.');
        return false
    }

    // If all validations pass
    return true;
}

function isValidName(name) {
    return /^[a-zA-Z\s]+$/.test(name) && name.length >= 1 && name.length <= 25;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
}