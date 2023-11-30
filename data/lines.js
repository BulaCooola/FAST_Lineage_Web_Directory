import { ObjectId } from "mongodb";
import { lines } from '..config/mongoCollections.js'
import * as validators from '../validators.js'

/* 
    TODO: Creating user function
    ! THIS WILL BE USED WHEN WE REGISTER FOR AN ACCOUNT ON THE REGISTER TAB
    * Parameters needed for registration
        * lineName, lineDescription, lineHead, members, images
    * What we need to put on the database
        ! lineId
        * lineName
        * lineDescription
        * lineHead
        ! totalMembers
        * members
        * images
    ?
*/

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

// TODO getLine
// TODO getAllLines
// TODO updateLine
// TODO deleteLine

export default exportedMethods;

