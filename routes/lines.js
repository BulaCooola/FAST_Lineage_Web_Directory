import express from 'express';
import path from 'path';
import * as validator from '../validators.js';
import lineData from '../data/lines.js';
import userData from '../data/users.js';
const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        try {
            const allLines = await lineData.getAllLines();
            res.render('alllines', { pageTitle: "All Lines", data: allLines })
        } catch (e) {
            //render an error, req.body.getLineByName???
            //status codes type beat
            // res.status(400).render('error', { title: "Error", error: `Invalid input: '${req.body.searchCharacterByName}'`, class: "error" })
        }
    });

router.route('/myline')
    .get(async (req, res) => {
        // Get's the home/landing page from handlebars
        // const filePath = path.join(__dirname, '..', 'static', 'homepage.html')
        if (!req.session.user) {
            res.redirect('/users/login')
        } else {
            res.render('myline', { pageTitle: 'My Line', user: req.session.user })
        }
    });
router.route('/myline/biglittle')
    .get(async (req, res) => {
        if (!req.session.user) {
            res.redirect('/users/register')
        } else {
            const userInfo = await userData.getUserByEmail(req.session.user.email)
            const userLine = await lineData.getLineByName(userInfo.line)
            res.render('biglittle', { user: userInfo, line: userLine })
        }
    })
    .post(async (req, res) => {

    });

export default router;

// GET REQUESTS:
// Search bar features: line name, profile name, graduation year, major
// Each sends a list of names
// ID specific pages: lines, users
// Comment Board: comments (comments might become its own collection)
// message board and tree on different pages
// Nov 28, 2023 POST REQUESTS: User profile, Lines, Comments

