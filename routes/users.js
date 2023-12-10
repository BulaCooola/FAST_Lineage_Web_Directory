// LINES or USERS???
import express from 'express';
import path from 'path';
import * as validator from '../validators.js';
import usersData from '../data/users.js'
const router = express.Router();

// middleware to not be there?
router.route('/')
    .get(async (req, res) => {
        // return res.json({ error: 'YOU SHOULD NOT BE HERE!' });
    });

// login route (from 555 project)
router.route('/login')
    .get(async (req, res) => {
        res.render('login', { pageTitle: 'Login' });
    })
    .post(async (req, res) => {
        const inputs = req.body;
        console.log(req.body);
        try {
            if (!inputs.email || !inputs.password) {
                return res.status(400).render('login', { error: "Username or password is incorrect" });
            }
        } catch (e) {
            return res.status(400).render('login', { error: e });
        }
        try {
            let checkExists = await usersData.loginUser(inputs.email, inputs.password);
            console.log(checkExists)
            req.session.user = checkExists;
            res.redirect('/users/profile');
        } catch (e) {
            console.error(e)
            return res.status(400).render('errors', { error: e });
        }
    });

// register route from lab 10 (Branden)
router.route('/register')
    .get(async (req, res) => {
        //code here for GET
        res.render('register', { pageTitle: 'Register' });
    })
    .post(async (req, res) => {
        //code here for POST
        let { userName, firstName, lastName, email, password, confirmPassword, line } = req.body;

        if (!userName || !firstName || !lastName || !email || !password || !confirmPassword || !line) {
            return res.status(400).render('errors', { error: 'All fields are required.' });
        }

        console.log('hello');
        try {
            userName = validator.validUsername(userName);
            firstName = validator.validName(firstName, 'First Name');
            lastName = validator.validName(lastName, 'Last Name');
            email = validator.validEmail(email, 'Email routes');
            password = validator.validPassword(password);
        } catch (e) {
            console.error(e);
            res.status(400).render('errors'), { error: `${e}` };
        }

        console.log('hello');
        if (password !== confirmPassword) {
            return res.status(400).render('errors', { error: 'Passwords do not match.' });
        }

        console.log('hello');

        try {
            const result = await usersData.registerUser(userName, firstName, lastName, email, password, confirmPassword);
            if (result.insertedUser) {
                res.redirect('/users/login');
            } else {
                res.status(500).render('errors', { error: 'Internal Server Error' });
            }
        } catch (error) {
            res.status(500).render('errors', { error: 'Internal Server Error' });
        }

    });


// // home page (navigation to login, register, search profiles, and view own profile)
// router.route('/users/home')
//     .get(async (req, res) => {
//         res.render('profile');
//     });

// profile
router.route('/profile')
    .get(async (req, res) => {
        res.render('profile', { pageTitle: 'Your Profile', user: req.session.user });
    });

// profile edit
router.route('/profile/edit')
    .get(async (req, res) => {
        console.log('body', req.body);
        console.log('session', req.session);
        console.log('params', req.params)
        res.render('edit-profile', { pageTitle: 'Edit Profile' })
    })
    .post(async (req, res) => {
        // TODO: update profile (patch)
        /* 
            On page itself, there is going to be a form with a bunch of inputs of whatever the user 
            wants to edit. The user should not have to put all inputs down, as they should only fill
            out whatever they want to change. 
            ? (we could add ajax stuff to verify if the change is legal???)
            The req.body will still have (almost) every part of the user data. However, for the inputs
            that they did not fill out, it will be represented as null.
                ! This means that we need to find those that have characters in the inputs, trim them, then 
                ! check if valid
            The query function that will deal with this will have all possible elements that can be changed
            as the inputs (inputs could be null or not). 
                * if null, do not account for
                * if !null, 
                *   trim() and check if valid
                * validate each using validators.js
                * update
        */
        
        const queriedUser = null;
        try {
            const session_userName = req.session.user.userName;
            const session_email = req.session.user.email;
            const query_userName = await usersData.getUserByUserName(session_userName);
            const query_email = await usersData.getUserByEmail(session_email);
            console.log(query_userName.userName, query_email.userName);
            if (query_userName === query_email) {
                console.log('Same!')
                queriedUser = query_userName;
            } else {
                res.status(400).render('errors', { error: 'Associated username and email not the same'})
            }
        } catch (e) {
            res.status(500).render('errors', { error: 'Internal Server Error' });
        }
        const { firstName, lastName, userName, major, gradYear, line, big, bio, userNameCurrent, password } = req.body;
        console.log(req.body)

        let user = queriedUser;

        if (user) {
            if (firstName !== undefined && validator.validName(firstName, 'First Name')) {
                user.firstName = firstName.trim();
            }
            if (lastName !== undefined && validator.validName(lastName, 'Last Name')) {
                user.lastName = lastName.trim();
            }
            if (userName !== undefined && validator.validUsername(userName)) {
                user.userName = userName.trim();
            }
            // if (email !== undefined && validator.validEmail(email, 'Email')) {
            //     user.email = email.trim();
            // }
            if (major !== undefined && validator.validString(major, 'Major')) {
                user.major = major.trim();
            }
            if (gradYear !== undefined && validator.validNumber(parseInt(gradYear), 'gradYear')) {
                user.gradYear = gradYear;
            }
        } else {
            res.status(400).render('errors', { error: 'No user found' });
        }
    });

router.route('/searchuser')
    .get(async (req, res) => {
        res.render('searchResults');
    })
    .post(async (req, res) => {
        try {
            let searchTerm = req.body.searchMember;
            searchTerm = validator.validString(searchTerm, 'Member Name URL parameter');
            let names = await characterData.searchCharacterByName(searchTerm);
            res.render('searchResults', { title: "People Found", searchMember: searchTerm, member: names })
        } catch (e) {
            return res.status(400).render('error', { title: "Error", error: `Invalid input: '${req.body.searchCharacterByName}'`, class: "error" })
        }
    });

router.route('/searchuser/:userName')
    .get(async (req, res) => {
        // res.render('searchResults', { title: "People Found", searchCharacterByName: searchTerm, characters: names })
    });

export default router;

// GET REQUESTS:
// Search bar features: line name, profile name, graduation year, major
// Each sends a list of names
// ID specific pages: lines, users
// Comment Board: comments (comments might become its own collection)
// Nov 28, 2023 POST REQUESTS: User profile, Lines, Comments

