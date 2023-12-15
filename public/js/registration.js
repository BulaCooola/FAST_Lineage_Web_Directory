function validateForm(formId) {
    document.addEventListener('DOMContentLoaded', function () {
        const form = document.getElementById(formId);
        const submitButton = document.getElementById('submitButton')
        disableButton();

        form.addEventListener('submit', (event) => {
            // document.getElementById('submitButton').disabled = true;
            if (submitButton.disabled) {
                event.preventDefault();
                return;
            }

            disableButton();

            if (!validateInputs(formId)) {
                enableButton();
                event.preventDefault();
            }

        });

        function enableButton() {
            submitButton.disabled = false;
        }

        function disableButton() {
            document.getElementById('submitButton').style.display = 'none';
            submitButton.disabled = true;
        }

        function validateInputs(formId) {
            const form = document.getElementById(formId);

            const firstNameInput = form.querySelector('#firstNameInput');
            const lastNameInput = form.querySelector('#lastNameInput');
            const userNameInput = form.querySelector('#userNameInput');
            const emailAddressInput = form.querySelector('#emailAddressInput');
            const passwordInput = form.querySelector('#passwordInput');
            const confirmPasswordInput = form.querySelector('#confirmPasswordInput');
            const lineInput = form.querySelector('#lineInput');

            const inputArr = [firstNameInput, lastNameInput, userNameInput, emailAddressInput, passwordInput, confirmPasswordInput, lineInput];

            if (!firstNameInput || !lastNameInput || !userNameInput || !emailAddressInput || !passwordInput || !confirmPasswordInput || !lineInput) {
                alert('All fields must be provided.');
                return false;
            }

            if (!inputArr.every(input => typeof input === 'string' && input.trim() !== '')) {
                alert('All inputs must be strings and/or cannot be empty spaces');
                return false;
            }


            if (!/^[a-zA-Z]+$/.test(firstNameInput) || firstNameInput.length < 2 || firstNameInput.length > 25) {
                alert('Invalid first name');
                return false;
            }

            if (!/^[a-zA-Z]+$/.test(lastName) || lastName.length < 2 || lastName.length > 25) {
                alert('Invalid last name');
                return false;
            }

            if (userName.length < 3) {
                alert(`Error: userName is too short.`);
                return false;
            }
            if (userName.length > 15) {
                alert(`Error: userName is too long.`);
                return false;
            }
            const userRegex = /^(?!.*[._]{2})[a-zA-Z0-9._]{1,30}(?<![._])$/;
            if (!(userRegex.test(userName))) {
                alert(`Error: Username must only have alphanumeric characters, ., and _. Username must not end with . or _.`);
                return false;
            }

            // regex from https://www.abstractapi.com/tools/email-regex-guide
            email_regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            if (!(email_regex.test(emailAddressInput))) {
                alert('Invalid email address');
                return false;
            };

            // regex from https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
            password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!(password_regex.test(passwordInput))) {
                alert('Invalid password (password is not strong)');
                return false;
            }

            if (lineInput.toLowerCase().trim() == '') {
                alert('Invalid line');
                return false;
            }

            enableButton()
            return true;
        }
    });
}

function disableButton() {
    document.getElementById('submitButton').style.display = 'none';

    // Show the loading indicator
    document.getElementById('loadingIndicator').style.display = 'block';

    // Simulate some asynchronous operation (replace this with your actual processing logic)
    setTimeout(() => {
        // After completing the operation, you can optionally hide the loading indicator
        document.getElementById('loadingIndicator').style.display = 'none';

        // Show the button again
        document.getElementById('submitButton').style.display = 'block';
    }, 10000);
}