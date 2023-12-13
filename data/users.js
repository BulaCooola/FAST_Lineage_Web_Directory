// I don't know if we need this. Not hundred percent. - Branden Bulatao
import { lines, users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import user from './users.js'
import * as validation from '../validators.js';
import linesData from './lines.js';
import bcrypt from 'bcrypt';

const exportedMethods = {
    async getAllUsers() {
        const userCollection = await users();
        return await userCollection.find({}).toArray();
    },
    async getUserById(id) {
        id = validation.validId(id);            //subject to change
        const userCollection = await lines();
        const user = await userCollection.findOne({ _id: new ObjectId(id) });
        if (!user) throw 'Error: User not found';
        return user;
    },
    async getUserByEmail(email) {
        email = validation.validEmail(email);        //subject to change
        const userCollection = await users();
        const user = await userCollection.findOne({ email: email });
        if (!user) throw 'Error: User not found';
        return user;
    },
    async getUserByUserName(userName) {
        userName = validation.validString(userName);        //subject to change
        const userCollection = await users();
        const user = await userCollection.findOne({ userName: userName });
        if (!user) throw 'Error: User not found';
        return user;
    },
    async registerUser(userName, firstName, lastName, email, password, confirmPassword, line) {
        //subject to change
        try {
            userName = validation.validString(userName, 'User Name');
            firstName = validation.validString(firstName, 'First Name');
            lastName = validation.validString(lastName, 'Last Name');
            email = validation.validEmail(email, 'Email');
            password = validation.validPassword(password);
            confirmPassword = validation.validPassword(confirmPassword);
            line = validation.validString(line, 'Line');
        } catch (e) {
            throw `${e}`;
        }

        const userCollection = await users();
        const findUser = await userCollection.findOne({ userName: userName });
        if (findUser) {
            throw `Error: userName already exists, pick another.`;
        }

        const findEmail = await userCollection.findOne({ email: email });
        if (findEmail) {
            throw `Error: email already exists, pick another.`;
        }

        if (password !== confirmPassword) {
            throw 'Error: Passwords must be the same';
        }

        // const findLine = await linesData.getLineByName(line);
        // if (!findLine) {
        //     throw `Error: Line doesn't exists, please pick an existing line`
        // }

        const hashedPassword = await bcrypt.hash(password, 16);
        let newUser = {
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            line: line,
            userBio: null,
            major: null,
            gradYear: null,
            big: null,
            littles: null,
            links: null
        }

        let insertInfo = await userCollection.insertOne(newUser);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) {
            throw 'Error: Failed to add user';
        }
        return { insertedUser: true };

    },
    async loginUser(email, password) {
        // * Not sure what this is below
        // validation.loginCheck(email, password)

        const userCollection = await users()

        email = email.toLowerCase()
        const getUser = await userCollection.findOne({ email: email })
        if (getUser === null) {
            // throw {code: 400, error: `Either the email or password is invalid`}
            throw `Either the email or password is invalid`;
        }

        let passMatch = await bcrypt.compare(password, getUser.password)
        if (!passMatch) {
            // throw {code: 400, error: `Either the email or password is invalid`}
            throw `Either the email or password is invalid`;
        }
        return {
            userName: getUser.userName,
            firstName: getUser.firstName,
            lastName: getUser.lastName,
            userBio: getUser.userBio,
            gradYear: getUser.gradYear,
            line: getUser.line,
            big: getUser.big,
            littles: getUser.littles,
            email: getUser.email
        }
    },
    async updateProfile(user, email, password) {
        // user refers to an object describing the user
        const userCollection = await users()
        email = email.toLowerCase()
        const getUser = await userCollection.findOne({ email: email })

        if (getUser === null) {
            // throw {code: 400, error: `Either the email or password is invalid`}
            throw `Either the email or password is invalid`;
        }

        let passMatch = await bcrypt.compare(password, getUser.password)
        if (!passMatch) {
            // throw {code: 400, error: `Either the email or password is invalid`}
            throw `Either the email or password is invalid`;
        }

        const filteredData = Object.fromEntries(
            Object.entries(user).filter(([key, value]) => value !== '')
        );
        console.log(filteredData);

        if (Object.keys(filteredData).length > 0) {
            const updateInfo = await userCollection.updateOne(
                { _id: getUser._id },
                { $set: filteredData },
            );
            if (!updateInfo) throw `Error: Update failed`

            return await updateInfo;
        } else {
            throw `Nothing to update`
        }
    },
    async assignLittle(userName, little_userName) {
        /* 
            WHEN ON THE FORM FOR ASSIGNING A BIG OR LITTLE, THEY MUST 
            When calling this function, you will take userName from cookie and the user that they call on
            ! try using ajax
                * When finding little or big, you will be directed to a page that searches for users
                *   Search for all members on line and everyone on the same year as you and below:
                *       If search parameter results in no user:  throw `Error: No results`
                *       If they are not in your line:  throw `Error: Member choosen is not in the same line`
                *       
                *       
        */

        const userCollection = await users()

        const getUser = await userCollection.findOne({ userName: userName });
        const getLittle = await userCollection.findOne({ userName: little_userName });
        if (getUser === null) {
            // throw {code: 400, error: `Either the email or password is invalid`}
            throw `Error: User not found.`;
        }
        if (getLittle === null) {
            throw `Error: User searched not found.`;
        }

        if (parseInt(getLittle.gradYear) < parseInt(getUser.gradYear)) {
            throw `Error: User cannot be your little, as they are a grade higher than you.`
        }

    },
    async assignBig(userName, big_userName) {

    }
}

export default exportedMethods;
