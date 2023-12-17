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

router.route('/myline/messages')
    .get(async (req, res) => {
        if (!req.session.user) {
            res.redirect('/users/login')
        } else {
            const userLine = req.session.user.line
            const line = await lineData.getLineByName(userLine);
            console.log(line.messages)
            res.render('messageBoard', { pageTitle: 'Message Board', messages: line.messages, user: req.session.user })
        }
    })
    .post(async (req, res) => {
        if (!req.session.user) {
            res.redirect('/users/login');
        } else {
            // req.body should be: userName, message
            // access line through req.session
            let { user, message } = req.body
            // let userName = req.session.user.userName;
            let line = req.session.user.line;

            console.log('stage 1');
            try {
                user = validator.validString(user, 'UserName');
                message = validator.validString(message, 'Text');
                line = validator.validString(line, 'Line');
            } catch (e) {
                res.status(400).render('messageBoard', { pageTitle: 'Message Board', error: e, messages: line.messages, user: req.session.user });
            }

            console.log('stage 2');

            try {
                const insertmessage = await lineData.createMessage(user, message, line);
                console.log(insertmessage)
                const updatedLine = await lineData.getLineByName(line);
                console.log(updatedLine);
                res.render('messageBoard', { pageTitle: 'Message Board', messages: updatedLine.messages, user: req.session.user });

            } catch (e) {
                res.status(400).render('messageBoard', { pageTitle: 'Message Board', error: e, messages: line.messages, user: req.session.user });
            }

            console.log('stage 3')

        }
    })

export default router;

// GET REQUESTS:
// Search bar features: line name, profile name, graduation year, major
// Each sends a list of names
// ID specific pages: lines, users
// Comment Board: comments (comments might become its own collection)
// message board and tree on different pages
// Nov 28, 2023 POST REQUESTS: User profile, Lines, Comments

