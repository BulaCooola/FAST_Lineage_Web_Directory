import { lines } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import user from './users.js'
import validation from '../validators.js';

const exportedMethods = {
    async createLine(
        lineName,
        lineDescription,
        lineHead,
        totalMembers,
    ) {
        try {
            lineName = validation.validString(lineName, 'Line Name');
            lineDescription = validation.validString(lineDescription, 'Line Description');
            lineHead = validation.validObject(lineHead, 'Line Object');
            totalMembers = validation.validNumber(totalMembers, 'Total Members');
        } catch (e) {
            throw `${e}`;
        }

        const linesCollection = await lines();
        const checkExistingLine = await linesCollection.findOne({ lineName: lineName });
        if (checkExistingLine) {
            throw `username already exists, pick another`
        }

        let newLine = {
            lineId: new ObjectId(),
            lineName: lineName,
            lineDescription: lineDescription,
            lineHead: lineHead,
            totalMembers: 0,
            members: null,
            images: null
        }
        let insertLine = await linesCollection.insertOne(newLine);
        if (!insertLine.acknowledged || !insertLine.insertedId) {
            throw 'Error: Failed to add user';
        }
        return {insertedUser:true};
    },
    async getAllLines() {
        const lineCollection = await lines();
        return await lineCollection.find({}).toArray();
    },
    async getLineById(id) {
        id = validation.validId(id);            //subject to change
        const lineCollection = await lines();
        const line = await lineCollection.findOne({ _id: new ObjectId(id) });
        if (!line) throw 'Error: Line not found';
        return line;
    },
    async getLineByName(name) {
        name = validation.validString(name);        //subject to change
        const lineCollection = await lines();
        const line = await lineCollection.findOne({ name: name });
        if (!line) throw 'Error: Line not found';
        return line;
    }

};

// TODO getLine
// TODO getAllLines
// TODO updateLine
// TODO deleteLine

export default exportedMethods;

