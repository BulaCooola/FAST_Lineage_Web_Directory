import express from 'express';
import * as validator from '../validators.js';
import imageData from '../data/images.js';
import lineData from '../data/lines.js';
const router = express.Router();

router.route('/')
  .get(async (req, res) => {
    try {
      // const allLines = await lineData.getAllLines();
      // TODO: After handlebars are made, find the tag associated with 
      // *FROM LAB8* res.render('characterSearchResults', { title: "Characters Found", searchCharacterByName: searchTerm, characters: names })
      res.status(200).render('imagegallery')
    } catch (e) {
      // res.status(400).render('error', { title: "Error", error: `Invalid input: '${req.body.searchCharacterByName}'`, class: "error" })
    }
  });
// /images/:lineName
// we get there from submitting filter from tag

export default router;