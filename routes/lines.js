import express from 'express';
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
            let user = await userData.getUserByUserName(req.session.user.userName)
            if (user.big) {
                big = await userData.getUserByUserName(user.big)
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
            return res.render('myline', { pageTitle: 'My Line', user: user, big: big, grandbig: grandbig })

           // return res.render('myline', { pageTitle: 'My Line', user: req.session.user, big: big, grandbig: grandbig })
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
            if (newLittle.userName === userInfo.userName) {
                return res.status(400).render('errors', { error: "Cannot assign yourself as your own big or little!" });
            }
            if (newLittle.big) {
                return res.status(400).render('errors', { error: "This person has a big already!" });
            }
            if (newLittle.userName === userLine.lineHead.userName) {
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
            if (userInfo.littles.includes(newLittle) && (inputs.type === "little")) {
                return res.status(400).render('errors', { error: "This member is already your little" });
            }
            try {
                await userData.assignLittles(userInfo.userName, newLittle.userName)
                console.log("--- Successfully added " + newLittle.userName + " as " + req.session.user.userName + "'s little" + " ---");
                res.redirect('/lines/myline')
            } catch (e) {
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

//route for firstName
router.route('/searchuser')
    .get(async (req, res) => {
        res.render('searchResults');
    })
    .post(async (req, res) => {
        try {
            let searchValue = req.body.searchValue;
            searchValue = validator.validString(searchValue, 'Member Name URL parameter');
            let names = await userData.getUserByFirstName(searchValue);
            const filteredNames = names.map(user => ({
                firstName: user.firstName,
                lastName: user.lastName
            }));
            res.json(filteredNames)
        } catch (e) {
            return res.status(400).render('error', { title: "Error", error: `Invalid input: '${req.body.getUserByUserName}'`, class: "error" })
        }
    });

// route for major
router.route('/searchMajor')
    .get(async (req, res) => {
        res.render('searchResults');
    })
    .post(async (req, res) => {
        try {
            let searchValue = req.body.searchValue;
            searchValue = validator.validString(searchValue, 'Member Name URL parameter');
            let names = await userData.getUserByMajor(searchValue);
            const filteredNames = names.map(user => ({
                firstName: user.firstName,
                lastName: user.lastName
            }));
            res.json(filteredNames)
        } catch (e) {
            return res.status(400).render('error', { title: "Error", error: `Invalid input: '${req.body.getUserByMajor}'`, class: "error" })
        }
    });

// route for gradYear
router.route('/searchGradYear')
    .get(async (req, res) => {
        res.render('searchResults');
    })
    .post(async (req, res) => {
        try {
            let searchValue = Number(req.body.searchValue);
            searchValue = validator.validNumber(searchValue), 'Member Name URL parameter';
            let names = await userData.getUserByGradYear(searchValue);
            const filteredNames = names.map(user => ({
                firstName: user.firstName,
                lastName: user.lastName
            }));
            res.json(filteredNames)
        } catch (e) {
            return res.status(400).render('error', { title: "Error", error: `Invalid input: '${req.body.getUserByGradYear}'`, class: "error" })
        }
    });

router.get('/allusers', async (req, res) => {
    try {
        const allUsers = await userData.getAllUsers();
        const filteredUsers = allUsers.map(user => ({
            firstName: user.firstName,
            lastName: user.lastName,
            major: user.major,
            gradYear: user.gradYear
        }));
        res.json(filteredUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;

// GET REQUESTS:
// Search bar features: line name, profile name, graduation year, major
// Each sends a list of names
// ID specific pages: lines, users
// Comment Board: comments (comments might become its own collection)
// message board and tree on different pages
// Nov 28, 2023 POST REQUESTS: User profile, Lines, Comments

