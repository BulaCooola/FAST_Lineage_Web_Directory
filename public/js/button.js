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
    }, 8000);
}

function toggleList(id) {
    let hiddenList = document.getElementById(id);
    if (hiddenList.style.display === "none") {
        hiddenList.style.display = "block";
    } else {
        hiddenList.style.display = "none";
    }
}

function toggleAnswer(eventId) {
    const eventDetails = document.querySelector(`.eventDetails[data-id="${eventId}"]`);
    eventDetails.toggle('show');
}

function validateHangoutForm(formId) {
    const form = document.getElementById(formId);
    const myErrors = document.getElementById('myErrors');

    form.addEventListener('submit', (event) => {
        if (!validateInputs(formId)) {
            event.preventDefault();
            
        }

    });

    function validateInputs(formId) {
        const form = document.getElementById(formId);

        const eventTitleInput = form.querySelector('#eventTitleInput').value;
        const eventDescriptionInput = form.querySelector('#eventDescriptionInput').value;
        const eventAddressInput = form.querySelector('#eventAddressInput').value;
        const eventCityInput = form.querySelector('#eventCityInput').value;
        const eventStateInput = form.querySelector('#eventStateInput').value;
        const eventZipcodeInput = form.querySelector('#eventZipcodeInput').value;
        const startTimeInput = form.querySelector('#startTimeInput').value;
        const endTimeInput = form.querySelector('#endTimeInput').value;
        const eventDateInput = form.querySelector('#eventDateInput').value
        
        const inputArr = [eventTitleInput, eventDescriptionInput, eventAddressInput, eventCityInput, eventStateInput, eventZipcodeInput, startTimeInput, endTimeInput, eventDateInput];

        if (!inputArr.every(input => !input || typeof input === 'string' || input.trim() !== '')) {
            myErrors.textContent = 'All inputs must be strings and/or cannot be empty spaces';
            return false;
        }

        if (eventTitleInput === 0 || eventTitleInput > 25) {
            myErrors.textContent = 'eventTitle input must be between length 1 to 25';
            return false
        }

        if (eventDescriptionInput === 0 || eventDescriptionInput > 250) {
            myErrors.textContent = 'eventDescription input must be between length 1 to 250';
            return false
        }

        if (eventAddressInput > 3 || eventCityInput > 3) {
            myErrors.textContent = 'address or city  must be more than length 3';
            return false;
        }

        let states = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC',
        'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
        'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO',
        'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP',
        'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN',
        'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];
        if (eventStateInput === 0) {
            myErrors.textContent = 'Empty State input' ;
            return false;
        }
        if (states.include(eventStateInput) === false) {
            myErrors.textContent ='Invalid State';
            return false;
        }

        if (eventZipcodeInput != 5) {
            myErrors.textContent = 'Zip code must be length 5';
            return false;
        }

        const timeRegex = /^(?:1[0-2]|0?[1-9]):[0-5][0-9] ([AP][M])$/;
        if (startTimeInput === 0 || endTimeInput === 0) {
            myErrors.textContent = 'starttime or endtime cannot be empty'
            return false;
        }
        if (timeRegex.test(startTimeInput)) {
            myErrors.textContent = 'Start Time invalid';
            return false;
        }
        if (timeRegex.test(endTimeInput)) {
            myErrors.textContent = 'End Time invalid';
            return false;
        }

        myErrors.textContent = '';
        return true;

    }

}