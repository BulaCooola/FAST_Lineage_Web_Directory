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
        res.render('login', {pageTitle: 'Login'});
    })
    .post(async (req, res) => {
        const inputs = req.body;
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
        res.render('register', {pageTitle: 'Register'});
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
        } catch(e) {
            console.error(e);
            res.status(400).render('errors'), {error: `${e}`};
        }

        console.log('hello');
        if (password !== confirmPassword) {
            return res.status(400).render('errors', { error: 'Passwords do not match.' });
        }

        console.log('hello');

        try {
            const result = await usersData.registerUser(userName, firstName, lastName, email, password, confirmPassword);
            console.log(result);
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
        res.render('profile', {pageTitle: 'Your Profile', user: req.session.user });
    });

// profile edit
router.route('/profile/edit')
    .get(async (req, res) => {
        res.render('edit-profile', {pageTitle: 'Edit Profile'})
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

