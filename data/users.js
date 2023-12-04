import { ObjectId } from "mongodb";
import { users } from '..config/mongoCollections.js'
import * as validators from '../validators.js'

/* 
    TODO: Creating user function
    ! THIS WILL BE USED WHEN WE REGISTER FOR AN ACCOUNT ON THE REGISTER TAB
    * Parameters needed for registration
        * username, bio, firstName, lastName, email, major, graduationYear, links
    * What we need to put on the database
        * username, 
        * userBio, 
        * firstName, 
        * lastName, 
        * email, 
        * hashedPassword,
        * major, 
        * graduationYear, 
        ! bigs,
        ! littles,
        * links
    ?
*/
export const createUser = async (
    username,
    bio,
    firstName,
    lastName,
    email,
    hashpassword, // ? change after i do lab 10
    major,
    graduationYear,
    // big,
    // littles,
    links
) => {

}

// TODO getUser
// TODO getAllUsers
// TODO updateUser
// TODO deleteUser