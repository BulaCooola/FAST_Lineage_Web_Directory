import { ObjectId } from "mongodb";
import { users } from '..config/mongoCollections.js'
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
export const createLine = async (
    lineId,
    lineName,
    lineDescription,
    lineHead,
    totalMembers,
    members,
    images
) => {

}

// TODO getLine
// TODO getAllLines
// TODO updateLine
// TODO deleteLine


