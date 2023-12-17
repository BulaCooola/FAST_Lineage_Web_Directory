import { ObjectId } from "mongodb";
import { users } from '../config/mongoCollections.js'
import * as validators from '../validators.js'
import lines from "./lines.js"

/*
    TODO createImageGallery
    * This will simply create a path to an image
*/

const exportedMethods = {
    async getAllImages() {
        let imgArr = []
        let lineArr = await lines.getAllLines()
        lineArr.forEach((line) => imgArr = imgArr + line.pictures)
        return lineArr;
    }
}


export default exportedMethods;

// TODO getImage
// TODO getAllImages
// TODO deleteImage