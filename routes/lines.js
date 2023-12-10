// LINES or USERS???
import express from 'express';
import path from 'path';
import * as validator from '../validators.js';
import lineData from '../data/lines.js';
const router = express.Router();

router.route('/')
  .get(async (req, res) => {
    try {
      const allLines = await lineData.getAllLines();
      console.log(allLines)
      res.render('alllines', { pageTitle: "All Lines" })
    } catch (e) {
      // res.status(400).render('error', { title: "Error", error: `Invalid input: '${req.body.searchCharacterByName}'`, class: "error" })
    }
  });

router.route('/myline')
  .get(async (req, res) => {
    // ! Get's the home/landing page from handlebars
    // const filePath = path.join(__dirname, '..', 'static', 'homepage.html')
    if (!req.session.user) {
      res.redirect('/users/register')
    } else {
      // const tree = await lineData
      res.render('myline', { pageTitle: 'My Line', user: req.session.user })
    }
  });


export default router;

// GET REQUESTS:
// Search bar features: line name, profile name, graduation year, major
// Each sends a list of names
// ID specific pages: lines, users
// Comment Board: comments (comments might become its own collection)
// Nov 28, 2023 POST REQUESTS: User profile, Lines, Comments

