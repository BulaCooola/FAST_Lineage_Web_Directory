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
        email = validation.validEmail(email).toLowerCase();        //subject to change
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
    async getUserByFirstName(firstName) {
        firstName = validation.validString(firstName);        //subject to change
        const userCollection = await users();
        const user = await userCollection.find({ firstName: { $regex: firstName, $options: 'i' } }).toArray();
        if (!user) throw 'Error: User not found';
        return user;
    },
    async getUserByMajor(major) {
        major = validation.validString(major);        //subject to change
        const userCollection = await users();
        const user = await userCollection.find({ major: { $regex: major, $options: 'i' } }).toArray();
        if (!user) throw 'Error: Major not found';
        return user;
    },
    async getUserByGradYear(gradYear) {
        gradYear = validation.validNumber(gradYear);        //subject to change
        const userCollection = await users();
        const user = await userCollection.find({ gradYear: gradYear }).toArray();
        if (!user) throw 'Error: Graduation Year not found';
        return user;
    },
    async registerUser(firstName, lastName, email, password, confirmPassword, line) {
        //subject to change
        try {
            firstName = validation.validString(firstName, 'First Name');
            lastName = validation.validString(lastName, 'Last Name');
            email = validation.validEmail(email, 'Email').toLowerCase();
            password = validation.validPassword(password);
            confirmPassword = validation.validPassword(confirmPassword);
            line = validation.validString(line, 'Line');
        } catch (e) {
            throw e;
        }

        const userCollection = await users();

        const findEmail = await userCollection.findOne({ email: email.toLowerCase() });
        if (findEmail) {
            throw `Error: email already exists, pick another.`;
        }

        const userName = email.split("@")[0];

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
            littles: [],
            links: {facebook: null, instagram: null, spotify: null},
            profilePicture: null
        }

        let insertInfo = await userCollection.insertOne(newUser);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) {
            throw 'Error: Failed to add user';
        }
        return { insertedUser: true };

    },
    async loginUser(email, password) {
        const userCollection = await users()

        email = email.toLowerCase()
        const getUser = await userCollection.findOne({ email: email })
        if (getUser === null) {
            throw `Either the email or password is invalid`;
        }

        const userName = email.split("@")[0];

        let passMatch = await bcrypt.compare(password, getUser.password)
        if (!passMatch) {
            throw `Either the email or password is invalid`;
        }
        return {
            userName: getUser.userName,
            firstName: getUser.firstName,
            lastName: getUser.lastName,
            userBio: getUser.userBio,
            major: getUser.major,
            gradYear: getUser.gradYear,
            line: getUser.line,
            big: getUser.big,
            littles: getUser.littles,
            email: getUser.email,
            profilePicture: getUser.profilePicture
        }
    },
    async updateProfile(user, email, password) {
        // user refers to an object describing the user

        let { firstName, lastName, major, gradYear, userBio, profilePicture, links } = user;

        let userName

        try {
            email = validation.validEmail(email, 'Email').toLowerCase();
            userName = email.split("@")[0].toLowerCase();
            password = validation.validPassword(password);
            firstName = validation.validName(firstName, 'First Name Edit');
            lastName = validation.validName(lastName, 'Last Name Edit');
            if (major === '') { major = null; }
            else major = validation.validString(major, 'Major Edit');
            if (gradYear === '') { gradYear = null; } //cant do negative years
            else gradYear = validation.validNumber(gradYear, 'gradYear Edit');
            if (userBio === '') { userBio = null; }
            else userBio = validation.validBio(userBio, 'Bio Edit');
            if (profilePicture === '') { profilePicture = null; }
            else profilePicture = validation.validLink(profilePicture, 'profilePicture Edit');
            if (links.facebook === '') { links.facebook = null; }
            else links.facebook = validation.validSocialLink(links.facebook, 'facebook');
            if (links.instagram === '') {links.instagram = null; }
            else links.instagram = validation.validSocialLink(links.instagram, 'instagram');
            if (links.spotify === '') { links.spotify = null; }
            else links.spotify = validation.validSocialLink(links.spotify, 'spotify');
        } catch (e) {
            throw `${e}`;
        }

        let cleanedUser = {
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            major: major,
            gradYear: gradYear,
            userBio: userBio,
            profilePicture: profilePicture,
            links: links
        }

        console.log(cleanedUser);

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
            Object.entries(cleanedUser).filter(([key, value]) => value !== 0)
        );
        // console.log("filteredData: " + filteredData);

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
    async assignLittles(userName, requested_userName) {
        const userCollection = await users();
        const lineCollection = await lines();

        const userInfo = await userCollection.findOne({ userName: userName });
        const newLittle = await userCollection.findOne({ userName: requested_userName });


        // Check if users are found.
        if (!userInfo) {
            throw `Error: User not found.`;
        }
        if (!newLittle) {
            throw `Error: User searched not found.`;
        }

        const userLine = await lineCollection.findOne({ lineName: userInfo.line })

        // Check if selected user is already your little
        if (newLittle.userName === userInfo.userName) {
            throw "Cannot assign yourself as your own big or little!";
        }
        if (newLittle.big) {
            throw "This person has a big already!";
        }
        if (newLittle.userName === userLine.lineHead.userName) {
            throw "Cannot assign a line head as your little!"
        }

        userInfo.littles.push(newLittle);
        newLittle.big = userInfo.userName;

        const updateUserInfo = await userCollection.updateOne(
            { _id: userInfo._id },
            { $push: { littles: newLittle } },
        );
        const updateLittleInfo = await userCollection.updateOne(
            { _id: newLittle._id },
            { $set: { big: userInfo.userName } }
        );

        if (!updateUserInfo) {
            throw `Error: Could not assign ${newLittle.userName} as the little for ${userInfo.userName}`;
        }
        if (!updateLittleInfo) {
            throw `Error: Could not assign ${userInfo.userName} as the big for ${newLittle.userName}`
        }

        // Update the littles of ancestors recursively
        await linesData.updateAncestorsLittles(userCollection, userInfo.userName, newLittle);

        return updateUserInfo;
    }

}

export default exportedMethods;
