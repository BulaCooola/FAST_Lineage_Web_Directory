import { lines } from '../config/mongoCollections.js'
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
            //console.log(lineArr);
            for(let i = 0; i < lineArr.length; i++){
                //console.log("lineArr = " + lineArr)
                //console.log("lineArrData 1 = " + lineArr[i].pictures)
                imgArr = imgArr.concat(lineArr[i].pictures)
            }
            //console.log("imgArr = " + imgArr)
            return imgArr;
        }
        catch(e){
            throw `${e}`
        }
    },

    async addImage(imageUrl, lineName){
        try{
            imageUrl = validators.validLink(imageUrl, "imageUrl")
            console.log(imageUrl);
            lineName = validators.validString(lineName, "lineName")
            console.log(lineName);
            const linesCollection = await lines();
            const findLine = await linesCollection.findOne({ lineName: lineName })
            const updatePictures = await linesCollection.updateOne(
                { _id: findLine._id },
                {
                    $push: { "pictures": imageUrl }
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