import express from 'express';
import imageData from '../data/images.js';
const router = express.Router();
import * as validator from '../validators.js';

router.route('/')
  .get(async (req, res) => {
    try {
      // const allLines = await lineData.getAllLines();
      // *FROM LAB8* res.render('characterSearchResults', { title: "Characters Found", searchCharacterByName: searchTerm, characters: names })
      const allPics = await imageData.getAllImages()
      res.status(200).render('imagegallery', { pageTitle: "All Line Pictures", data: allPics})
    } catch (e) {
      return res.status(400).render('errors', { pageTitle: "Error", error: e });
    }
  })

  .post(async (req, res) =>{
    //From lab8
    if(!req.session.user){
      return res.redirect('/users/login');
    }
    try{
      let userLine = req.session.user.line;
      let inputs = req.body.imageURL;
      userLine = validator.validString(userLine)
      inputs = validator.validLink(inputs)
      const updateImage = await imageData.addImage(inputs, userLine);
      return res.redirect('/images')
    }
    catch(e){
      return res.status(400).render('errors', { pageTitle: "Error", error: e });
    }
  });
// /images/:lineName
// we get there from submitting filter from tag

export default router;