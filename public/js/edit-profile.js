
// document.addEventListener('DOMContentLoaded', function () {
//     const form = document.querySelector('form');

//     form.addEventListener('submit', function (event) {
//       if (!validateForm()) {
//         event.preventDefault();
//       }
//     });

//     function validateForm() {
//       let isValid = true;

//       // Validate First Name
//       isValid = validateInput('firstNameInput', 'First Name is required.') && isValid;

//       // Validate Last Name
//       isValid = validateInput('lastNameInput', 'Last Name is required.') && isValid;

//       // Validate Username
//       isValid = validateInput('userNameInput', 'Username is required.') && isValid;

//       // Validate Major
//       isValid = validateInput('majorInput', 'Major is required.') && isValid;

//       // Validate Graduation Year
//       isValid = validateInput('gradYearInput', 'Graduation Year is required.') && isValid;

//       // Validate Bio
//       isValid = validateInput('bioInput', 'Bio is required.') && isValid;

//       // Validate Email
//       isValid = validateEmail('email', 'Invalid email address.') && isValid;

//       // Validate Password
//       isValid = validateInput('password', 'Password is required.') && isValid;

//       return isValid;
//     }

//     function validateInput(id, errorMessage) {
//       const input = document.getElementById(id);
//       const value = input.value.trim();
//       const errorElement = input.nextElementSibling;

//       if (value === '') {
//         showError(errorElement, errorMessage);
//         return false;
//       }

//       hideError(errorElement);
//       return true;
//     }

//     function validateEmail(id, errorMessage) {
//       const input = document.getElementById(id);
//       const value = input.value.trim();
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       const errorElement = input.nextElementSibling;

//       if (!emailRegex.test(value)) {
//         showError(errorElement, errorMessage);
//         return false;
//       }

//       hideError(errorElement);
//       return true;
//     }

//     function showError(element, message) {
//       element.textContent = message;
//       element.style.color = 'red';
//     }

//     function hideError(element) {
//       element.textContent = '';
//     }
//   });