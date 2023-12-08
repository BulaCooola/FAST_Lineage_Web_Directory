import {lines} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import user from './users.js'
import validation from '../validators.js';

const exportedMethods = {
    async createLine(
      lineId,
      lineName,
      lineDescription,
      lineHead,
      totalMembers,
      members,
      images
    ) {
      return 0;
    },
    async getAllLines(){
        const lineCollection = await lines();
        return await lineCollection.find({}).toArray();
    },
    async getLineById(id) {
        id = validation.validId(id);            //subject to change
        const lineCollection = await lines();
        const line = await lineCollection.findOne({_id: new ObjectId(id)});
        if (!line) throw 'Error: Line not found';
        return line;
    },
    async getLineByName(name){
        name = validation.validString(name);        //subject to change
        const lineCollection = await lines();
        const line = await lineCollection.findOne({name: name});
        if (!line) throw 'Error: Line not found';
        return line;
    },
    async createLine(name, description, head){
        name = validation.validString(name);
        description = validation.validDescription(description)
        head = user.getUserByEmail(head.email)
        let newLine = {
            lineName : name,
            lineDescription : description,
            lineHead : head,
            members : []
        }
        const lineCollection = await lines();
        const line = await lineCollection.insertOne({newLine});
        if (line.insertedCount === 0) throw 'Error: Line could not be added';
        const newID = line.insertedId.toString();
        const eventID = await getLineById(newID)
        return eventID;
    }

};

// TODO getLine
// TODO getAllLines
// TODO updateLine
// TODO deleteLine

export default exportedMethods;

