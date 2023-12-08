// LINES or USERS???
import express from 'express';
import path from 'path';
import * as validators from 'validators.js';
import usersData from '../data/users.js'
const router = express.Router();

// middleware to not be there?
router.route('/')
    .get(async (req, res) => {

    });

// home page (navigation to login, register, search profiles, and view own profile)
router.route('/home')
    .get(async (req, res) => {
        // res.status(200).status
    });

// view different user??? (must be authorized)
router.route('/user/:userid')
    .get(async (req, res) => {
        // ! Get's the home/landing page from handlebars
        // const filePath = path.join(__dirname, '..', 'static', 'homepage.html')
        res.sendFile(filePath)
    });

// login route (from 555 project)
router.route('/login')
    .get(async (req, res) => {
        res.render('login');
    })
    .post(async (req, res) => {
        const inputs = req.body;
        try {
            if (!inputs.emailAddress || !inputs.password) {
                return res.status(400).render('login', { error: "Username or password is incorrect" });
            }
        } catch (e) {
            return res.status(400).render('login', { error: e });
        }
        try {
            let checkExists = await usersData.loginUser(inputs.emailAddressInput, inputs.passwordInput);
            req.session.user = checkExists;
            res.redirect('/profile');
        } catch (e) {
            return res.status(400).render('login', { error: e });
        }
    });

// register route from lab 10 (Branden)
router.route('/register')
    .get(async (req, res) => {
        //code here for GET
        res.render('register');
    })
    .post(async (req, res) => {
        //code here for POST
        const { firstName, lastName, emailAddress, password, confirmPassword } = req.body;

        if (!firstName || !lastName || !emailAddress || !password || !confirmPassword) {
            return res.status(400).render('register', { error: 'All fields are required.' });
        }

        if (firstName.length < 2 || firstName.length > 25) {
            return res.status(400).render('register', { error: 'Invalid first name.' });
        }

        for (let char of firstName) {
            if (!((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z'))) {
                return res.status(400).render('register', { error: 'Invalid first name.' });
            }
        }

        if (lastName.length < 2 || lastName.length > 25) {
            return res.status(400).render('register', { error: 'Invalid last name.' });
        }

        for (let char of lastName) {
            if (!((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z'))) {
                return res.status(400).render('register', { error: 'Invalid last name.' });
            }
        }

        if (!(validators.validEmail(emailAddress, 'Email routes'))) {
            return res.status(400).render('register', { error: 'Invalid email address.' });
        }

        if (!(validators.validPassword(password))) {
            return res.status(400).render('register', { error: 'Invalid password.' });
        }

        if (password !== confirmPassword) {
            return res.status(400).render('register', { error: 'Passwords do not match.' });
        }

        try {
            const result = await methods.registerUser(firstName, lastName, emailAddress, password);

            if (result.insertedUser) {
                res.redirect('/login');
            } else {
                res.status(500).render('register', { error: 'Internal Server Error' });
            }
        } catch (error) {
            res.status(500).render('register', { error: 'Internal Server Error' });
        }

    });

export default router;

// GET REQUESTS:
// Search bar features: line name, profile name, graduation year, major
// Each sends a list of names
// ID specific pages: lines, users
// Comment Board: comments (comments might become its own collection)
// Nov 28, 2023 POST REQUESTS: User profile, Lines, Comments

