import express from 'express';
import * as validator from '../validators.js';
import lineData from '../data/lines.js';
import userData from '../data/users.js';
import { lines } from '../config/mongoCollections.js';
import xss from 'xss';
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
            res.render('biglittle', { pageTitle: "Big/Little Form", user: userInfo, line: userLine })
        }
    })
    .post(async (req, res) => {
        if (!req.session.user) {
            res.redirect('/users/login')
        } else {
            try {
                let inputs = req.body
                const userInfo = await userData.getUserByEmail(req.session.user.email)
                const userLine = await lineData.getLineByName(userInfo.line)
                if (!inputs.member) {
                    throw "Fields missing";
                }
                let newLittle = await userData.getUserByUserName(inputs.member)
                if (newLittle.userName === userInfo.userName) {
                    throw "Cannot assign yourself as your own big or little!";
                }
                if (newLittle.big) {
                    throw "This person has a big already!";
                }
                if (newLittle.userName === userLine.lineHead.userName) {
                    throw "Cannot assign a line head as your little!";
                }
                if (userInfo.big) {
                    if ((newLittle === userInfo.big)) {
                        throw "Cannot assign your big as your little!";
                    }
                    if (userInfo.big.big) {
                        if ((newLittle === userInfo.big.big)) {
                            throw "Cannot assign your grandbig as your little!";
                        }
                    }
                }
                if (userInfo.littles.includes(newLittle) && (inputs.type === "little")) {
                    throw "This member is already your little";
                }
                await userData.assignLittles(userInfo.userName, newLittle.userName)
                console.log("--- Successfully added " + newLittle.userName + " as " + req.session.user.userName + "'s little" + " ---");
                res.redirect('/lines/myline')
            } catch (e) {
                return res.status(400).render('errors', { pageTitle: "Error", error: e });
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
            //console.log(line.messages)
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
                return res.status(400).render('messageBoard', { pageTitle: 'Message Board', error: e, messages: line.messages, user: req.session.user });
            }

            console.log('stage 2');

            try {
                const insertmessage = await lineData.createMessage(user, message, line);
                console.log(insertmessage)
                const updatedLine = await lineData.getLineByName(line);
                console.log(updatedLine);
                res.render('messageBoard', { pageTitle: 'Message Board', messages: updatedLine.messages, user: req.session.user });

            } catch (e) {
                return res.status(400).render('messageBoard', { pageTitle: 'Message Board', error: e, messages: line.messages.reverse(), user: req.session.user });
            }

            console.log('stage 3')

        }
    })

//route for firstName
router.route('/searchuser')
    .post(async (req, res) => {
        try {
            let searchValue = req.body.searchValue;
            searchValue = validator.validString(searchValue, 'Member Name URL parameter');
            let names = await userData.getUserByFirstName(searchValue);
            const filteredNames = names.map(user => ({
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.userName
            }));
            res.json(filteredNames)
        } catch (e) {
            return res.status(400).render('error', { title: "Error", error: `Invalid input: '${req.body.getUserByUserName}'`, class: "error" })
        }
    });

// route for major
router.route('/searchMajor')
    .post(async (req, res) => {
        try {
            let searchValue = req.body.searchValue;
            searchValue = validator.validString(searchValue, 'Member Name URL parameter');
            let names = await userData.getUserByMajor(searchValue);
            const filteredNames = names.map(user => ({
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.userName
            }));
            res.json(filteredNames)
        } catch (e) {
            return res.status(400).render('error', { title: "Error", error: `Invalid input: '${req.body.getUserByMajor}'`, class: "error" })
        }
    });

// route for gradYear
router.route('/searchGradYear')
    .post(async (req, res) => {
        try {
            let searchValue = Number(req.body.searchValue);
            searchValue = validator.validNumber(searchValue), 'Member Name URL parameter';
            let names = await userData.getUserByGradYear(searchValue);
            const filteredNames = names.map(user => ({
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.userName
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
            username: user.userName
        }));
        res.status(200).json(filteredUsers);
    } catch (error) {
        return res.status(500).render('error', { title: "Error", error: e })
    }
});

router.get('/myline/allhangouts', async (req, res) => {
    try {
        const line = req.session.user.line
        const allHangouts = await lineData.getAllHangouts(line);
        res.status(200).json(allHangouts);
    } catch (e) {
        res.status(500).json({ error: e })
    }
})

router.route('/myline/hangouts')
    .get(async (req, res) => {
        // VIEW ALL HANGOUT EVENTS
        if (!req.session.user) {
            res.redirect('/users/login')
        } else {
            const line = req.session.user.line;
            try {
                const allHangouts = await lineData.getAllHangouts(line);
                res.render('hangouts', { pageTitle: 'All Hangouts', hangout: allHangouts });
            } catch (e) {
                return res.status(500).render('errors', { error: e });
            }
        }
    })
    .post(async (req, res) => {
        if (!req.session.user) {
            res.redirect('/users/login')
        } else {
            const action = req.body.action; // Access the value of the clicked button
            if (action === 'accept') {
                // add user to the 
                let { eventNameInput } = req.body;
                console.log(eventNameInput, 'eventname')
                try {
                    eventNameInput = validator.validString(eventNameInput, 'Hangout Name');
                } catch (e) {
                    return res.status(400).render('errors', { error: e });
                }

                const line = req.session.user.line;
                const firstName = req.session.user.firstName;
                const lastName = req.session.user.lastName;
                const email = req.session.user.email;

                try {
                    const addUser = await lineData.addAttendee(eventNameInput, line, firstName, lastName, email);
                    console.log('added user', addUser)
                    return res.redirect('/lines/myline/hangouts');
                } catch (e) {
                    return res.status(400).render('errors', { error: e });
                }
            }
            if (action === 'delete' || action === 'create') {
                const line = await lineData.getLineByName(req.session.user.line)
                const the_lineHead = line.lineHead.email;
                if (req.session.user.email !== the_lineHead) {
                    return res.status(403).render('errors', { error: 'Forbidden' })
                } else {
                    if (action === 'delete') {
                        try {
                            let { eventNameInput } = req.body;
                            const deleteEvent = await lineData.removeHangout(eventNameInput, req.session.user.line)
                            return res.redirect('/lines/myline/hangouts');
                        } catch (e) {
                            return res.status(400).render('errors', { error: e });
                        }
                    } else {
                        res.redirect('/lines/myline/hangouts/create')
                    }
                }
            }
        }
    });

router.route('/myline/hangouts/create')
    .get(async (req, res) => {
        try {
            const line = await lineData.getLineByName(req.session.user.line)
            const the_lineHead = line.lineHead
            if (req.session.user.firstName !== the_lineHead.firstName && req.session.user.lastName !== the_lineHead.lastName && req.session.user.email !== the_lineHead.email) {
                return res.redirect('/lines/myline/hangouts')
            } else {
                return res.render('create-hangouts', { pageTitle: 'Create Hangout' })
            }
        } catch (e) {
            return res.status(500).render('errors', { pageTitle: 'Errors', errors: e })
        }
    })
    .post(async (req, res) => {
        let { eventTitle, eventDescription, eventAddress, eventCity, eventState, eventZipcode, startTime, endTime, eventDate } = req.body
        eventTitle = xss(eventTitle)
        eventDescription = xss(eventDescription)
        eventAddress = xss(eventAddress)
        eventCity = xss(eventCity)
        eventState = xss(eventState)
        eventZipcode = xss(eventZipcode)
        startTime = xss(startTime)
        endTime = xss(endTime)
        eventDate = xss(eventDate)
        if (!eventTitle || !eventDescription || !eventAddress || !eventCity || !eventState || !eventZipcode || !startTime || !endTime || !eventDate) {
            return res.status(400).render('errors', { pageTitle: "Error", error: 'All fields are required.' });
        }
        try {
            eventTitle = validator.validTitle(eventTitle, "Event Name")
            eventDescription = validator.validBio(eventDescription, "Event Description")
            eventAddress = validator.validAddress(eventAddress, "Event Address")
            eventCity = validator.validCity(eventCity, "Event City")
            eventState = validator.validState(eventState, "Event State")
            eventZipcode = validator.validZipcode(eventZipcode, "Event Zipcode")
            let time = validator.validTime(startTime, endTime)
            startTime = (time)[0][0] + ":" + (time)[0][1]
            endTime = (time)[1][0] + ":" + (time)[1][1]
            eventDate = validator.validDate(eventDate, "Event Date")
        }
        catch (e) {
            return res.status(400).render('errors'), { error: e };
        }
        try {
            let eventLocation = { streetAddress: eventAddress, city: eventCity, state: eventState, zip: eventZipcode }
            // console.log(eventLocation)
            // console.log(eventTitle)
            const result = await lineData.createHangout(req.session.user.line, eventTitle, eventDescription, eventLocation, eventDate, startTime, endTime);
            // console.log(result);
            if (result) {
                res.redirect('/lines/myline/hangouts');
            } else {
                // ! different status code
                res.status(500).render('errors', { pageTitle: "Error", error: 'Internal Server Error' });
            }
        } catch (e) {
            res.status(500).render('errors', { pageTitle: "Error", error: e });
        }
    })

router.route('/myline/hangouts/:eventId/edit')
    .get(async (req, res) => {
        // ONLY LINE HEAD SHOULD HAVE ACCESS
        // TODO GET EDIT EVENT FORMS
        // * get lineHead
        // * if (req.session.user !== lineHead) REJECT
        // * else :
        //      *   
        //      * res.render('edit-hangouts', { pageTitle: })
        // * check if event id exists, is a valid string
        // * get event by id 
        try {
            // get the line to access the hangout field
            const line = await lineData.getLineByName(req.session.user.line)
            const the_lineHead = line.lineHead  // get the lineHead object to compare with user
            if (req.session.user.firstName !== the_lineHead.firstName && req.session.user.lastName !== the_lineHead.lastName && req.session.user.email !== the_lineHead.email) {
                return res.redirect('/lines/myline/hangouts')
            } else {
                const eventId = res.param.eventId   // obtain the eventId from the URL param

                res.render('edit-hangouts', { pageTitle: 'Edit Hangout' })
            }
        } catch (e) {
            return res.status(500).render('error', { error: e })
        }
    })
    .put(async (req, res) => {
        // TODO UPDATE EVENT
        // * get the req.body
        // * validate req
        // * try catch the update
    })
    .delete(async (req, res) => {
        // TODO DELETE EVENT
        // * try catch validating if the eventId exists
        // * try catch the remove
    });

router.route('/myline/hangouts/')


export default router;

// GET REQUESTS:
// Search bar features: line name, profile name, graduation year, major
// Each sends a list of names
// ID specific pages: lines, users
// Comment Board: comments (comments might become its own collection)
// message board and tree on different pages
// Nov 28, 2023 POST REQUESTS: User profile, Lines, Comments

