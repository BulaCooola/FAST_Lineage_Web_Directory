import validator from 'validator';
import { ObjectId } from 'mongodb';
import isUrl from 'is-url';

export const validString = (string, argName) => {
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
    email = validString(email, argName);
    function isValidEmail(contact) {
        const emailFormat = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/; // from https://saturncloud.io/blog/how-can-i-validate-an-email-address-using-a-regular-expression/
        return emailFormat.test(contact);
    }
    if (isValidEmail(email) === false) { throw `Error: Email address ${email} is invalid`; }
    return email;
}

export const validBio = (string, argName) => {
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