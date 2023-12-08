// I don't know if we need this. Not hundred percent. - Branden Bulatao
import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import user from './users.js'
import validation from '../validators.js';
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
    async registerUser(userName, userBio, firstName, lastName, email, password, confirmPassword, major, gradYear, big, littles, links){
        //subject to change
        const userCollection = await users();
        const findUserName = await userCollection.findOne({userName: userName});
        if (findUserName) {
            throw `username already exists, pick another`
        }

        if(password !== confirmPassword){
            throw 'passwords must be the same';
        }

        const hashedPassword = await bcrypt.hash(password, 16);
        let newUser = { 
            userName:userName,
            userBio: userBio,
            firstName: firstName,
            lastName: lastName,
            email:email,
            password: hashedPassword,
            major: major,
            gradYear: gradYear,
            big:big,
            little:littles,
            links:links
        }

        let insertInfo = await userCollection.insertOne(newUser);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) {
            throw 'Could not add user';
        }
        return {insertedUser:true};
        }
}

export default exportedMethods;