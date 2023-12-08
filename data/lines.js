import { lines } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import user from './users.js'
import * as validation from '../validators.js';

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
    },
    async createLine(name, head){
        name = validation.validString(name);
        //description = validation.validDescription(description)
        head = user.getUserByEmail(head.email)
        let newLine = {
            lineName : name,
            lineDescription : null,
            lineHead : head,
            members : []
        }
        const lineCollection = await lines();
        const line = await lineCollection.insertOne({newLine});
        if (line.insertedCount === 0) throw 'Error: Line could not be added';
        const newID = line.insertedId.toString();
        const lineID = await getLineById(newID)
        return lineID;
    },
    async updateLine(name,littles){
        let updatedLine = {
            littles: littles
        }
        const lineCollection = await lines();
        const newLine = await lineCollection.findOneAndReplace(
            name,
            updatedLine,
            {returnDocument:'after'}
        );
        if(!newLine){
            throw 'could not update line successfully';
        }
        return newLine;
    },
    async deleteLine(name){
        const lineCollection = await lines();
        const deletionInfo = await lineCollection.findOneAndDelete({
            name:name
        });

        if(!deletionInfo){
            throw 'Could not delete line ${name}';
        }
        return '${deletionInfo.name} has been deleted.';
    }

};

// TODO getLine
// TODO getAllLines
// TODO updateLine
// TODO deleteLine

export default exportedMethods;

