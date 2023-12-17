import { ObjectId } from "mongodb";
import { lines, users } from '../config/mongoCollections.js'
import * as validators from '../validators.js'
import lineData from "./lines.js"

/*
    TODO createImageGallery
    * This will simply create a path to an image
*/

const exportedMethods = {
    async getAllImages() {
        try{
            let imgArr = []
            let lineArr = await lineData.getAllLines()
            lineArr.forEach((line) => imgArr = imgArr + line.pictures)
            return lineArr;
        }
        catch(e){
            throw `${e}`
        }
    },
    
    async addImage(imageUrl, lineName){
        try{
            imageUrl = validators.validLink(imageUrl, "imageUrl")
            lineName = validators.validString(lineName, "lineName")
            const linesCollection = await lines();
            const findLine = await linesCollection.findOne({ lineName: lineName })
            const updatePictures = await linesCollection.updateOne(
                { _id: findLine._id },
                {
                    $push: { "pictures": imageUrl },
                }
            )
            if (updatePictures.modifiedCount === 0) { throw `Error: Could not add picture` }
            return { status: "success", message: "Member added successfully." };
        }
        catch(e){
            throw `${e}`
        }
    }
}


export default exportedMethods;

// TODO getImage
// TODO getAllImages
// TODO deleteImage