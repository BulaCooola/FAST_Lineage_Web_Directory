// validators
// list of validation helper functions

import validator from 'validator';
import { ObjectId } from 'mongodb';

export const validString = (string, argName) => {
    if (!string) { throw 'Error: ${argName} must be supplied'; }
    if (typeof string !== 'string') { throw 'Error: ${argName} is not of type String'; }
    let newString = string.trim();
    if (newString.length === 0) { throw 'Error: ${argName} has length 0. Empty string'; }
    return newString;
}

export const validNumber = (number, argName) => {
    if (number.length == 0) { throw 'Error: ${argName} must be supplied'; }
    if (typeof number !== 'number') { throw 'Error: ${argName} is not of type String'; }
    if (number < 0) { throw 'Error: ${argName} should be a positive number'; }
    return number;
}

export const validObject = (obj, argName) => {
    if (!obj) { throw 'Error: ${argName} must be supplied'; }
    if (typeof obj !== 'object') { throw 'Error: ${argName} is not of type Object'; }
    return obj;
}

export const validId = (id, argName) => {
    if (!id) { throw 'Error: ${argName} must be supplied' };
    if (!ObjectId.isValid(id)) { throw 'Error: invalid ObjectId ${id}' }
    return id;
}

export const validEmail = (email, argName) => {
    email = validString(email, argName);
    function isValidEmail(contact) {
        const emailFormat = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/; // from https://saturncloud.io/blog/how-can-i-validate-an-email-address-using-a-regular-expression/
        return emailFormat.test(contact);
    }
    if (isValidEmail(email) === false) { throw `Error: Email address ${argName} is invalid`; }
    return email;
}
