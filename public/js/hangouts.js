document.addEventListener('DOMContentLoaded', function () {
    const hangoutForm = document.getElementById('hangouts-form');
    if (hangoutForm) {
        hangoutForm.addEventListener('submit', (event) => {
            if (!validateHangoutForm()) {
                event.preventDefault();
            }
        });
    }
});

function validateHangoutForm() {
    const eventTitle = hangoutForm.querySelector('#eventTitleInput')
    const eventDescription = hangoutForm.querySelector('#eventDescription')
    const eventAddress = hangoutForm.querySelector('#eventAddress')
    const eventCity = hangoutForm.querySelector('#eventCity')
    const eventState = hangoutForm.querySelector('#eventState')
    const eventZipcode = hangoutForm.querySelector('#eventZipcode')
    const startTime = hangoutForm.querySelector('#startTime')
    const endTime = hangoutForm.querySelector('#endTime')
    const eventDate = hangoutForm.querySelector('#eventDate')

    eventTitle = validTitle(eventTitle, "Event Name")
    eventDescription = validBio(eventDescription, "Event Description")
    eventAddress = validAddress(eventAddress, "Event Address")
    eventCity = validCity(eventCity, "Event City")
    eventState = validState(eventState, "Event State")
    eventZipcode = validZipcode(eventZipcode, "Event Zipcode")
    let time = validTime(startTime, endTime)
    startTime = (time)[0][0] + ":" + (time)[0][1]
    endTime = (time)[1][0] + ":" + (time)[1][1]

    //referenced lab 6
    const validTitle = (string, argName) => {
        string = string.trim()
        if (!string) { alert(`Error: ${argName} must be supplied`); return false;}
        if (typeof string !== 'string') { alert(`Error: ${argName} is not a valid title`); return false;}
        if (string.length === 0) { alert(`Error: ${argName} has length 0. Empty title`); return false;}
        if (string.length > 25) { alert(`Error: ${argName} has length over 25 characters. Too Long`); return false;}
        return string;
    }
    const validDate = (string, argName) => {
        trimDate = string.trim()
        if (!string) { alert(`Error: ${argName} must be supplied`); return false;}
        if (typeof string !== 'string') { alert(`Error: ${argName} is not a valid date`); return false;}
        if (trimDate.length === 0) { alert(`Error: ${argName} has length 0. Empty date`); return false;}
        if (trimDate[2] !== "/" || trimDate[5] !== "/") {
            alert("Error: Invalid date format.");
            return false;
        }
        if (trimDate.length != 10) {
            alert( "Error: Invalid date.")
            return false;
        }
        let date = trimDate.split("/");
        if ((Number(date[0]) > 12) || (Number(date[0]) < 1)) {
            alert( "Error: Month is not valid.");
            return false;
        }
        const thirtyOne = [1, 3, 5, 7, 8, 10, 12];
        const thirty = [4, 6, 9, 11];

        if ((thirtyOne.includes(Number(date[0])) && ((Number(date[1]) >= 31) || (Number(date[1]) <= 0))) || (thirty.includes(Number(date[0])) && ((Number(date[1]) >= 30) || (Number(date[1]) <= 0)))) {
            alert( "Error: Date is not valid.");
            return false;
        }
        //checking for leap years
        if (Number(date[0]) === 2) {
            if ((Number(date[2]) % 4 === 0 && Number(date[2]) % 100 !== 0) || Number(date[2]) % 400 === 0) {
                if (Number(date[1]) > 29 || Number(date[1]) < 1) {
                    alert( "Error: Invalid date.");
                    return false;
                }
            } else {
                if (Number(date[1]) > 28 || Number(date[1]) < 1) {
                    alert( "Error: Invalid date.");
                    return false;
                }
            }
        }

        //find current date and compare to given date
        const currDate = new Date();
        let currDay = currDate.getDate();
        let currMonth = currDate.getMonth() + 1;
        let currYear = currDate.getFullYear();
        let currHour = currDate.getHours();
        let currMinute = currDate.getMinutes();

        if (Number(date[2]) < currYear) {
            alert( "Error: Year is not valid.");
            return false;
        }
        else if (Number(date[2]) === currYear) {
            if (Number(date[1]) > currMonth) {
                alert( "Error: Month is not valid.");
                return false;
            }
            else if (Number(date[1]) === currMonth) {
                if (Number(date[0]) > currDay) {
                    alert( "Error: Day is not valid.");
                    return false;
                }
                else if (Number(date[0]) === currDay) {
                    if (startTime[0] < currHour || (startTime[0] === currHour && startTime[1] <= currMinute)) {
                        alert( "Error: Time is not valid.");
                        return false;
                    }
                }
            }
        }
        return trimDate
    }
    const validTime = (startTime, endTime) => {
        startTime = startTime.split(":");
        endTime = endTime.split(":");
        let tempStart = (startTime[1].slice(0, 2));
        let tempStartAmPm = (startTime[1].slice(3));
        let tempEnd = (endTime[1].slice(0, 2));
        let tempEndAmPm = (endTime[1].slice(3));
        startTime[1] = tempStart;
        startTime[2] = tempStartAmPm;
        endTime[1] = tempEnd;
        endTime[2] = tempEndAmPm;
        //checking if start time is before end time
        if ((startTime[2] === endTime[2] && endTime[0] < startTime[0])) {
            if (startTime[0] === endTime[0] && endTime[1] < startTime[1]) {
                alert("Error: Invalid time.");
                return false;
            }
            alert( "Error: Invalid time.");
            return false;
        }
        //check end time is at least 30 minutes later
        const startMin = Number(startTime[0]) * 60 + Number(startTime[1]);
        const endMin = Number(endTime[0]) * 60 + Number(endTime[1]);

        if ((endMin - startMin) < 30) {
            alert("Error: Invalid time.");
            return false;
        }
        startTime[0] = startTime[0].toString()
        endTime[0] = endTime[0].toString()
        const finalTime = [startTime, endTime]
        return (finalTime)
    }
    const validAddress = (string, argName) => {
        if (!string) { alert(`Error: ${argName} must be supplied`); return false;}
        if (typeof string !== 'string') { alert(`Error: ${argName} is not a valid address`); return false;}
        string = string.trim()
        if (string.length === 0) { alert(`Error: ${argName} has length 0. Empty address`); return false;}
        if (string.length < 3) {
            alert("eventLocation.streetAddress must have length greater than 2")
            return false;
        }
        return string
    }
    const validCity = (string, argName) => {
        if (!string) { alert(`Error: ${argName} must be supplied`); return false;}
        if (typeof string !== 'string') { alert(`Error: ${argName} is not a valid city`); return false;}
        string = string.trim()
        if (string.length === 0) { alert( `Error: ${argName} has length 0. Empty city`); return false;}
        if (string.length < 3) {
            alert( "eventLocation.city must have length greater than 2")
            return false;
        }
        return string
    }
    const validState = (string, argName) => {
        if (!string) { alert( `Error: ${argName} must be supplied`); }
        if (typeof string !== 'string') { alert( `Error: ${argName} is not a valid state`); return false;}
        string = string.trim()
        if (string.length === 0) { alert( `Error: ${argName} has length 0. Empty state`); return false;}
        let states = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC',
            'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
            'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO',
            'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP',
            'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN',
            'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];
        if (states.includes(string) === false) {
            alert( "eventLocation.state isn't a state")
            return false;
        }
        return string
    }
    const validZipcode = (string, argName) => {
        if (string.length == 0) { alert( `Error: ${argName} must be supplied`); return false;}
        if (string.length != 5) {
            alert( "eventLocation.zip should have length 5")
            return false;
        }
        return string
    }
    const validBio = (string, argName) => {
        string = string.trim()
        if (!string) { alert(`Error: ${argName} must be supplied`); return false;}
        if (typeof string !== 'string') { alert(`Error: ${argName} is not a valid description`); return false;}
        if (string.length === 0) { alert(`Error: ${argName} has length 0. Empty description`); return false;}
        if (string.length > 250) { alert( `Error: ${argName} has length over 250 characters. Too Long`); return false;}
        return string;
    }
}