function validateForm(formId) {
    const form = document.getElementById(formId);

    form.addEventListener('submit', (event) => {
        if (!validateInputs(formId)) {
            event.preventDefault();
        }

    });

    function validateInputs(formId) {
        const form = document.getElementById(formId);

        const firstNameInput = form.querySelector('#firstNameInput').value;
        const lastNameInput = form.querySelector('#lastNameInput').value;
        const email = form.querySelector('#email').value;
        const password = form.querySelector('#password').value;
        const major = form.querySelector('#majorInput').value;
        const gradYear = form.querySelector('#gradYearInput').value;
        const userBio = form.querySelector('#bioInput').value;
        const profilePicture = form.querySelector('#profilePictureInput').value;
        const facebook = form.querySelector('#facebook').value
        const instagram = form.querySelector('#instagram').value
        const spotify = form.querySelector('#spotify').value

        const inputArr = [firstNameInput, lastNameInput, email, password];

        if (!firstNameInput || !lastNameInput || !email || !password) {
            alert('All fields must be provided.');
            return false;
        }

        if (!inputArr.every(input => typeof input === 'string' || input.trim() !== '')) {
            alert('All inputs must be strings and/or cannot be empty spaces');
            return false;
        }


        if (!/^[a-zA-Z]+$/.test(firstNameInput) || firstNameInput.length < 2 || firstNameInput.length > 25) {
            alert('Invalid first name');
            return false;
        }
        
        if (!/^[a-zA-Z\s]+$/.test(lastNameInput) || lastNameInput.length < 2 || lastNameInput.length > 25) {
            alert('Invalid last name');
            return false;
        }

        // regex from https://www.abstractapi.com/tools/email-regex-guide
        email_regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        if (!(email_regex.test(email))) {
            alert('Invalid email address');
            return false;
        };

        // regex from https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
        if (!(password)) {
            alert('Type in password.');
            return false;
        }    

        const validString = (string, argName) => {
            string = string.trim()
            if (!string) { throw `Error: ${argName} must be supplied`; }
            if (typeof string !== 'string') { throw `Error: ${argName} is not of type String`; }
            let newString = string.trim();
            if (newString.length === 0) { throw `Error: ${argName} has length 0. Empty string`; }
            return newString;
        }
        const validNumber = (number, argName) => {
            if (number.toString().length == 0) { throw `Error: ${argName} must be supplied`; }
            if (typeof number !== 'number') { throw `Error: ${argName} is not of type Number`; }
            if (number < 0) { throw `Error: ${argName} should be a positive number`; }
            return number;
        }
        const validBio = (string, argName) => {
            string = string.trim()
            if (!string) { throw `Error: ${argName} must be supplied`; }
            if (typeof string !== 'string') { throw `Error: ${argName} is not a valid description`; }
            if (string.length === 0) { throw `Error: ${argName} has length 0. Empty description`; }
            if (string.length > 250) { throw `Error: ${argName} has length over 250 characters. Too Long` }
            return string;
        }
        const validLink = (string, argName) => {
            //regex from stack overflow
            var imgur_re = /^(https?:\/\/)?(www\.)?(i\.)?imgur\.com\/(gallery\/)?([a-zA-Z0-9]{5,})[^\s]*$/;
            if (imgur_re.test(string)) {
                return string;
            }
            throw `Error: ${argName} is not a valid link`;
        }
        const validSocialLink = (link, site) => {
            // regex from https://github.com/lorey/social-media-profiles-regexs
            link = link.trim();

            if (!link || link === '') {
                throw 'Error: no link provided';
            }

            let validLink;

            if (site === "instagram") {
                validLink = /^(?:https?:)?\/\/(?:www\.)?(?:instagram\.com|instagr\.am)\/(?<username>[A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)/;
            } else if (site === "facebook") {
                validLink = /^(?:https?:\/\/)?(?:www\.)?facebook\.com\/[A-Za-z0-9?=_./-]+$/;
            } else if (site === "spotify") {
                validLink = /^https:\/\/(?:open\.spotify\.com\/(?:track|album|playlist)\/|spotify:(?:track:|album:|playlist:))(?:[a-zA-Z0-9]+)(?:[\/?].*)?$/;
            } else {
                throw 'Error: Invalid social media site';
            }
            if (!validLink.test(link)) {
                throw "Invalid link for " + site;
            }

            return link;
        }
        
        try {
            if (major !== '')
            validString(major, 'Major');
            if (gradYear !== '') //cant do negative years
            validNumber(parseInt(gradYear), 'gradYear');
            if (userBio !== '')
            validBio(userBio, 'Bio');
            if (profilePicture !== '')
            validLink(profilePicture, 'profilePicture');
            if (facebook !== '')
            validSocialLink(facebook, 'facebook');
            if (instagram !== '')
            validSocialLink(instagram, 'instagram');
            if (spotify !== '')
            validSocialLink(spotify, 'spotify');
        } catch (e) {
            alert(e);
            return false;
        }

        return true;
    }

}