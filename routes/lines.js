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
            let big
            let grandbig
            if (req.session.user.big) {
                big = await userData.getUserByUserName(req.session.user.big)
            } else {
                big = null
            }
            if (big) {
                if (big.big) {
                    grandbig = await userData.getUserByUserName(big.big)
                } else {
                    grandbig = null
                }
            } else {
                grandbig = null
            }

            res.render('myline', { pageTitle: 'My Line', user: req.session.user, big: big, grandbig: grandbig})
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
        if (!req.session.user) {
            res.redirect('/users/login')
        } else {
            let inputs = req.body
            const userInfo = await userData.getUserByEmail(req.session.user.email)
            const userLine = await lineData.getLineByName(userInfo.line)
            if (!inputs.member) {
                return res.status(400).render('errors', { error: "Fields missing" });
            }
            let newLittle = await userData.getUserByUserName(inputs.member)
            console.log(newLittle)
            if (newLittle.userName === req.session.user.userName) {
                return res.status(400).render('errors', { error: "Cannot assign yourself as your own big or little!" });
            }
            if (newLittle.big) {
                return res.status(400).render('errors', { error: "This person has a big already!" });
            }
            if (newLittle === userLine.lineHead) {
                return res.status(400).render('errors', { error: "Cannot assign a line head as your little!" });
            }
            if (userInfo.big) {
                if ((newLittle === userInfo.big)) {
                    return res.status(400).render('errors', { error: "Cannot assign your big as your little!" });
                }
                if (userInfo.big.big) {
                    if ((newLittle === userInfo.big.big)) {
                        return res.status(400).render('errors', { error: "Cannot assign your grandbig as your little!" });
                    }
                }
            }
            console.log(req.session.user)
            if (req.session.user.littles.includes(newLittle) && (inputs.type === "little")) {
                return res.status(400).render('errors', { error: "This member is already your little" });
            }
            try {
                await userData.assignLittles(req.session.user.userName, newLittle.userName)
                console.log("--- Successfully added " + newLittle.userName + " as " + req.session.user.userName + "'s little" + " ---");
                res.redirect('/lines/myline')
            } catch(e) {
                return res.status(400).render('errors', { error: e });
            }
        }
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

