// I don't know if we need this. Not hundred percent. - Branden Bulatao
import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import user from './users.js'
import * as validation from '../validators.js';
import bcrypt from 'bcrypt';

const exportedMethods = {
    async getAllUsers(){
        const userCollection = await users();
        return await userCollection.find({}).toArray();
    },
    async getUserById(id) {
        id = validation.validId(id);            //subject to change
        const userCollection = await lines();
        const user = await userCollection.findOne({_id: new ObjectId(id)});
        if (!user) throw 'Error: User not found';
        return user;
    },
    async getUserByEmail(email){
        email = validation.validEmail(email);        //subject to change
        const userCollection = await users();
        const user = await userCollection.findOne({email: email});
        if (!user) throw 'Error: Line not found';
        return user;
    },
    async registerUser(userName, firstName, lastName, email, password, confirmPassword){
        //subject to change
        try {
            userName = validation.validString(userName);
            firstName = validation.validString(firstName);
            lastName = validation.validString(lastName);
            email = validation.validEmail(email);
            password = validation.validPassword(password);
            confirmPassword = validation.validPassword(confirmPassword);
        } catch(e) {
            throw `${e}`;
        }
        userName = validation.validString(userName);
        firstName = validation.validString(firstName);
        lastName = validation.validString(lastName);
        email = validation.validEmail(email);
        password = validation.validPassword(password);
        confirmPassword = validation.validPassword(confirmPassword);

        const userCollection = await users();
        const findUser = await userCollection.findOne({userName: userName});
        if (findUser) {
            throw `email already exists, pick another`
        }

        if(password !== confirmPassword){
            throw 'passwords must be the same';
        }

        const hashedPassword = await bcrypt.hash(password, 16);
        let newUser = { 
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            email:email,
            password: hashedPassword,
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
        return {insertedUser:true};

    },
    async loginUser(emailAddress, password){
        validation.loginCheck(emailAddress, password)

        const userCollection = await users() 
      
        emailAddress = emailAddress.toLowerCase()
        const getUser = await userCollection.findOne({emailAddress: emailAddress})
        if (getUser === null) {
            throw {code: 400, error: `Either the emailAddress or password is invalid`}
        }
      
        let passMatch = await bcrypt.compare(password, getUser.password) 
        if (!passMatch) {
            throw {code: 400, error: `Either the emailAddress or password is invalid`}
        }
        return {
            userName: getUser.userName,
            firstName: getUser.firstName,
            lastName: getUser.lastName,
            userBio: getUser.userBio,
            gradYear: getUser.gradYear,
            big: getUser.big,
            littles: getUser.littles,
            emailAddress: getUser.emailAddress
        }
    }
}

export default exportedMethods;
