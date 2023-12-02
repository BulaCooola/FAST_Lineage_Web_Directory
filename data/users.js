import { ObjectId } from "mongodb";
import { users } from '..config/mongoCollections.js'
import bcrypt from 'bcrypt';
import { isStrongPassword } from validators;
import * as validators from '../validators.js'

/*
This will be used to register a new user
    The inputs that will be given client-side are:
    * username, bio, firstName, lastName, email
    ! hashpassword,
    * major
    * graduationYear
    * links
When registering, the following should be empty:
    * bio
    * links
    * major
The final json should look like this
{
    “_id”: "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
    userName: “johndoe123”,
    userBio: “",
    firstName: “John”,
    lastName: “Doe”,
    email: “jDoe@gmail.com”,
    hashPassword: "$2a$08$XdvNkfdNF8xsuIUeSbNOFgK0M0iV5HOskfVn7.PWncShU.O",
    major: “Computer Science”,
    graduationYear: 2025,
    “big”: {}
    littles: [],
    links: []
}

If you want to update the bio, get the littles/big, and add social media links, the user must be signed in.
There should be a separate function that (on routes, it's a patch/put) will update an existing JSON object with new information
*/
const exportedMethods = {
    async createUser(
        username,
        firstName,
        lastName,
        email,
        password,
        major,
        graduationYear,
    ) {
        const args = [
            username.trim(),
            firstName.trim(),
            lastName.trim(),
            email.trim(),
            password.trim(),
            major.trim(),
            graduationYear
        ];
        // Check for empty fields
        const checkEmpty = args.filter(arg => arg === null || arg === undefined || arg === '');
        if (checkEmpty.length != 0) {
            throw `Error: All data fields must have values.`;
        }

        // Validate Args
        try {
            username = validators.validString(username, 'Username');
            firstName = validators.validString(firstName, 'First Name');
            lastName = validators.validString(lastName, 'Last Name');
            email = validators.validEmail(email, 'Email');
            password = validators.validString(password, 'Password');
            major = validators.validString(major, 'Major');
            graduationYear = validators.graduationYear(graduationYear, 'Graduation Year');
        } catch (e) {
            throw `${e}`;
        }

        // Validate password 
        if (!isStrongPassword(password)) {
            throw `Error: Invalid password.`;
        }

        const usersCollection = await users();  // await user collection

        // Check if email exists
        const emailCheck = await usersCollection.findOne({ email: email });
        if (emailCheck) {
            throw `Error: Email Address already in use.`;
        }
        // Check if username exists
        const usernameCheck = await usersCollection.findOne({ username: username });
        if (usernameCheck) {
            throw `Error: Username already taken.`;
        }


        const hashedPassword = await bcrypt.hash(password, 10);  // encrypt password
        const userId = new ObjectId();  // create userId
        let userData = {
            _id: userId,
            username: username,
            firstName: firstName,
            lastName: lastName,
            bio: '',
            email: email,
            password: hashedPassword,
            major: major,
            graduationYear: graduationYear,
            big: {},
            littles: [],
            links: []
        }

        // Insert object into user Collection
        const result = await usersCollection.insertOne(userData);

        if (result.acknowledged) {
            return { insertedUser: true };
        } else {
            throw `Error: Failed to insert user`;
        }
    },
    // DONE loginUser
    async loginUser(email, password) {
        email = email.trim();
        password = password.trim();

        // Check valid type, if field does not exist, valid email, and correct type
        try {
            email = validators.validString(email, 'Email');
            password = validators.validString(password, '');
            email = validators.validEmail(email, 'Email');
        } catch (e) {
            throw `${e}`;
        }

        const usersCollection = await users();

        const user = await usersCollection.findOne({ email: email });
        if (!user) {
            throw `Error: Either the email address or password is invalid.`;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            return {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                bio: user.bio,
                email: user.email,
                major: user.major,
                graduationYear: user.graduationYear,
                big: user.big,
                littles: user.littles,
                links: user.links
            }
        } else {
            throw `Error: Either the email address or password is invalid.`;
        }

    },
    // DONE getUser
    async getUserByName(firstName, lastName) {
        firstName = firstName.trim();
        lastName = lastName.trim();

        try {
            firstName = validators.validString(firstName, 'First Name');
            lastName = validators.validString(lastName, 'Last Name');
        } catch (e) {
            throw `${e}`;
        }

        const usersCollection = await users();

        const user = await usersCollection.findOne({ firstName, lastName });
        if (user) {
            return {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                bio: user.bio,
                email: user.email,
                major: user.major,
                graduationYear: user.graduationYear,
                big: user.big,
                littles: user.littles,
                links: user.links
            }
        } else {
            throw `Error: User not found`;
        }
    },
    // DONE getUserByUsername
    async getUserByUsername(username) {
        username = username.trim();

        try {
            username = validators.validString(username, 'Username');
        } catch (e) {
            throw `${e}`;
        }

        const userCollection = await users();

        const user = await userCollection.findOne({ username });
        if (user) {
            return {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                bio: user.bio,
                email: user.email,
                major: user.major,
                graduationYear: user.graduationYear,
                big: user.big,
                littles: user.littles,
                links: user.links
            }
        } else {
            throw `Error: User not found`;
        }
    },
    // DONE getAllusers()
    async getAllUsers() {
        const usersCollection = await users();
        let userLists = await usersCollection.find({}).project({ _id: 1, 'username': 1, 'firstName': 1, 'lastName': 1, 'graduationYear': 1, 'major': 1 });
        if (!userLists) throw `Could not get all FAST members.`
        return userLists;
    },
    // TODO updateUserBio(bio)
    async updateUserBio(username, newBio) {
        newBio = newBio.trim();
        username = username.trim();

        try {
            username = validators.validString(username, 'Username');
            newBio = validators.validString(newBio, 'Bio');
        } catch (e) {
            throw `${e}`;
        }

        if (newBio.length > 300) {
            throw `Error: Max Capacity Reached. No more than 300 characters.`
        }

        const usersCollection = await users();
        const getUser = await getUserByUsername(username);
        if (newBio === getUser.bio) { throw `Error: cannot rename to same name`; }
        getUser.bio = newBio;
   
        const updatedBio = await usersCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: getUser },
            { returnDocument: 'after' }
        )

        if (updatedBio.modifiedCount === 0) {
            throw new Error("Could not update event successfully")
        } else {
            return updatedBio;
        }
    },
    // TODO updateUserBigLittle(username, littles)
    async updateUserBig(username, newBig) {
        // username will be username
        // big will be the username of the big
        newBig = newBig.trim();
        username = username.trim();

        try {
            username = validators.validString(username, 'Username');
            newBig = validators.validString(newBig, 'Big username');
        } catch (e) {
            throw `${e}`;
        }

        const usersCollection = await users();
        const getUser = await getUserByUsername(username);  // get User data object
        const getBig = await getUserByUsername(newBig);     // get Big data object
        if (newBig === getUser.big) { throw `Error: ${newBig} is already your big`; }


        getUser.big = newBig;
   
        const updatedBio = await usersCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: getUser },
            { returnDocument: 'after' }
        )

        if (updatedBio.modifiedCount === 0) {
            throw new Error("Could not update event successfully")
        } else {
            return updatedBio;
        }
    },
    // TODO updateUserLittles(username, littles) 
    async updateUserLittles(username, littles) {

    },
    // TODO deleteUser(email, password)
    async deleteUser(email, password) {
        return 0;
    }
}


export default exportedMethods;
