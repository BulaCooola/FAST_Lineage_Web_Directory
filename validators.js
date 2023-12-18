import validator from 'validator';
import { ObjectId } from 'mongodb';
import isUrl from 'is-url';

export const validString = (string, argName) => {
    string = string.trim()
    if (!string) { throw `Error: ${argName} must be supplied`; }
    if (typeof string !== 'string') { throw `Error: ${argName} is not of type String`; }
    let newString = string.trim();
    if (newString.length === 0) { throw `Error: ${argName} has length 0. Empty string`; }
    return newString;
}
export const validNumber = (number, argName) => {
    if (number.toString().length == 0) { throw `Error: ${argName} must be supplied`; }
    if (typeof number !== 'number') { throw `Error: ${argName} is not of type Number`; }
    if (number < 0) { throw `Error: ${argName} should be a positive number`; }
    return number;
}
export const validObject = (obj, argName) => {
    if (!obj) { throw `Error: ${argName} must be supplied`; }
    if (typeof obj !== 'object') { throw `Error: ${argName} is not of type Object`; }
    return obj;
}
export const validId = (id, argName) => {
    if (!id) { throw `Error: ${argName} must be supplied`; }
    if (!ObjectId.isValid(id)) { throw `Error: invalid ObjectId ${id}` }
    return id;
}
export const validEmail = (email, argName) => {
    email = email.trim()
    email = validString(email, argName).toLowerCase();
    function isValidEmail(contact) {
        const emailFormat = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/; // from https://saturncloud.io/blog/how-can-i-validate-an-email-address-using-a-regular-expression/
        return emailFormat.test(contact);
    }
    if (isValidEmail(email) === false) { throw `Error: Email address ${email} is invalid`; }
    return email;
}
export const validBio = (string, argName) => {
    string = string.trim()
    if (!string) { throw `Error: ${argName} must be supplied`; }
    if (typeof string !== 'string') { throw `Error: ${argName} is not a valid description`; }
    if (string.length === 0) { throw `Error: ${argName} has length 0. Empty description`; }
    if (string.length > 250) { throw `Error: ${argName} has length over 250 characters. Too Long` }
    return string;
}
export const validLink = (string, argName) => {
    //regex from stack overflow
    var imgur_re = /^(https?:\/\/)?(www\.)?(i\.)?imgur\.com\/(gallery\/)?([a-zA-Z0-9]{5,})[^\s]*$/;
    if (isUrl(string)) {
        if (imgur_re.test(string)) {
            return string;
        }
        else {
            { throw `Error: ${argName} is not a valid imgur link`; }
        }
    }
    throw `Error: ${argName} is not a valid link`;
}
export const validName = (name, argName) => {
    name = name.trim()
    let _name = validString(name, argName);
    if (!(/^[a-zA-Z\s]{1,35}$/.test(_name))) {
        throw `Error: ${argName} must be between 1 and 35 characters.`;
    }
    return _name
}
export const validUsername = (str) => {
    let name = validString(str, 'Username');
    if (name.length < 3 || name.length > 15) {
        throw `Error: ${name} must be between 3 to 15 characters`;
    }
    const userRegex = /^(?!.*[._]{2})[a-zA-Z0-9._]{1,30}(?<![._])$/;
    if (!(userRegex.test(name))) {
        throw `Error: Username must only have alphanumeric characters, ., and _. Username must not end with . or _.`
    }
    return name;
}
function includesUpper(str) {
    if (/[A-Z]+/g.test(str)) {
        return true;
    }
}
function includesNum(str) {
    if (/\d+/g.test(str)) {
        return true;
    }
    return false;
}
function includesSpecial(str) {
    if (/[^a-zA-Z0-9]/g.test(str)) {
        return true;
    }

    if (!/\d/.test(password.value)) {
        messages.push('Password must contain at least one number')
    }

    if (password.value !== confirmPassword.value) {
        messages.push('Passwords do not match');
    }

    if (messages.length > 0) {
        e.preventDefault()
        errorElement.innerText = messages.join(', ')
    }
}
export const validPassword = (str) => {
    const password = validString(str, 'Password');

    if (password.length < 5 || password.length > 20) {
        throw 'Error: Password must be between 5 and 20 characters';
    }
    if (password.includes(' ') || !includesNum(password) || !includesUpper(password) || !includesSpecial(password)) {
        throw `Error: Password must contain at least one number, one uppercase character, and one special character`;
    }
    return password;
}
export const validSocialLink = (link, site) => {
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
//referenced lab 6
export const validTitle = (string, argName) => {
    string = string.trim()
    if (!string) { throw `Error: ${argName} must be supplied`; }
    if (typeof string !== 'string') { throw `Error: ${argName} is not a valid title`; }
    if (string.length === 0) { throw `Error: ${argName} has length 0. Empty title`; }
    if (string.length > 25) { throw `Error: ${argName} has length over 25 characters. Too Long` }
    return string;
}
export const validDate = (string, argName) => {
    //from lab 6
    let trimDate = string.trim()
    if (!string) { throw `Error: ${argName} must be supplied`; }
    if (typeof string !== 'string') { throw `Error: ${argName} is not a valid date`; }
    if (trimDate.length === 0) { throw `Error: ${argName} has length 0. Empty date`; }
    
    //error checking dates
    if (trimDate[2] !== "/" || trimDate[5] !== "/") {
        throw "Error: Invalid date format.";
    }
    if (trimDate.length != 10) {
        throw "Error: Invalid date."
    }
    let date = trimDate.split("/");
    if ((Number(date[0]) > 12) || (Number(date[0]) < 1)) {
        throw "Error: Month is not valid";
    }
    const thirtyOne = [1, 3, 5, 7, 8, 10, 12];
    const thirty = [4, 6, 9, 11];

    if ((thirtyOne.includes(Number(date[0])) && ((Number(date[1]) >= 31) || (Number(date[1]) <= 0))) || (thirty.includes(Number(date[0])) && ((Number(date[1]) >= 30) || (Number(date[1]) <= 0)))) {
        throw "Error: Date is not valid.";
    }
    //checking for leap years
    if (Number(date[0]) === 2) {
        if ((Number(date[2]) % 4 === 0 && Number(date[2]) % 100 !== 0) || Number(date[2]) % 400 === 0) {
            if (Number(date[1]) > 29 || Number(date[1]) < 1) {
                throw "Error: Invalid date.";
            }
        } else {
            if (Number(date[1]) > 28 || Number(date[1]) < 1) {
                throw "Error: Invalid date.";
            }
        }
    }

    //find current date and compare to given date
    const currDate = new Date();
    let currDay = currDate.getDate();
    let currMonth = currDate.getMonth() + 1;
    //console.log(currMonth);
    let currYear = currDate.getFullYear();

    if (Number(date[2]) < currYear) {
        throw "Error: Year is not valid.";
    }
    else if (Number(date[2]) === currYear) {
        if (Number(date[0]) > currMonth) {
            throw "Error: Month is not valid.";
        }
        else if (Number(date[0]) === currMonth) {
            console.log(Number(date[1]), currDay)
            if (Number(date[1]) < currDay) {
                throw "Error: Day is not valid.";
            }
        }
    }
    return trimDate
}
//referenced lab 6
export const validTime = (startTime, endTime) => {
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
            throw "Error: Invalid time.";
        }
        throw "Error: Invalid time.";
    }
    //check end time is at least 30 minutes later
    const startMin = Number(startTime[0]) * 60 + Number(startTime[1]);
    const endMin = Number(endTime[0]) * 60 + Number(endTime[1]);

    if ((endMin - startMin) < 30) {
        throw "Error: Invalid time.";
    }
    startTime[0] = startTime[0].toString()
    endTime[0] = endTime[0].toString()
    const finalTime = [startTime, endTime]
    return (finalTime)
}
//referenced lab 6
export const validAddress = (string, argName) => {
    if (!string) { throw `Error: ${argName} must be supplied`; }
    if (typeof string !== 'string') { throw `Error: ${argName} is not a valid address`; }
    string = string.trim()
    if (string.length === 0) { throw `Error: ${argName} has length 0. Empty address`; }
    if (string.length < 3) {
        throw "eventLocation.streetAddress must have length greater than 2"
    }
    return string
}
//referenced lab 6
export const validCity = (string, argName) => {
    if (!string) { throw `Error: ${argName} must be supplied`; }
    if (typeof string !== 'string') { throw `Error: ${argName} is not a valid city`; }
    string = string.trim()
    if (string.length === 0) { throw `Error: ${argName} has length 0. Empty city`; }
    if (string.length < 3) {
        throw "eventLocation.city must have length greater than 2"
    }
    return string
}
//referenced lab 6
export const validState = (string, argName) => {
    if (!string) { throw `Error: ${argName} must be supplied`; }
    if (typeof string !== 'string') { throw `Error: ${argName} is not a valid state`; }
    string = string.trim()
    if (string.length === 0) { throw `Error: ${argName} has length 0. Empty state`; }
    let states = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC',
        'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
        'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO',
        'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP',
        'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN',
        'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];
    if (states.includes(string) === false) {
        throw "eventLocation.state isn't a state"
    }
    return string
}
//referenced lab 6
export const validZipcode = (string, argName) => {
    if (string.length == 0) { throw `Error: ${argName} must be supplied`; }
    if (string.length != 5) {
        throw "eventLocation.zip should have length 5"
    }
    return string
}