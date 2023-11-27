import {lines} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import validation from '../validators.js';

const exportedMethods = {
    async getAllLines(){
        const lineCollection = await lines();
        return await lineCollection.find({}).toArray();
    },
    async getLineById(id) {
        id = validation.checkId(id);            //subject to change
        const lineCollection = await lines();
        const line = await lineCollection.findOne({_id: new ObjectId(id)});
        if (!line) throw 'Error: Line not found';
        return line;
    },
    async getLineByName(name){
        id = validation.checkName(name);        //subject to change
        const lineCollection = await lines();
        const line = await lineCollection.findOne({_name: new ObjectId(name)});
        if (!line) throw 'Error: Line not found';
        return line;
    }

};

export default exportedMethods;