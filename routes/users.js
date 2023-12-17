import express from 'express';
import * as validator from '../validators.js';
import usersData from '../data/users.js';
import linesData from '../data/lines.js';
import xss from 'xss';
const router = express.Router();

// middleware to not be there?
router.route('/')
    .get(async (req, res) => {
        // return res.json({ error: 'YOU SHOULD NOT BE HERE!' });
        // add some error / redirect to login
    });

// login route (from 555 project)
router.route('/login')
    .get(async (req, res) => {
        res.render('login', { pageTitle: 'Login' });
    })
    .post(async (req, res) => {
        const inputs = req.body;
        try {
            if (!inputs.email || !inputs.password) {
                return res.status(400).render('errors', { pageTitle: "Error", error: "Username or password is incorrect" });
            }
        } catch (e) {
            return res.status(400).render('errors', { pageTitle: "Error", error: e });
        }
        try {
            let checkExists = await usersData.loginUser(inputs.email, inputs.password);
            console.log(checkExists)
            req.session.user = {
                firstName: checkExists.firstName,
                lastName: checkExists.lastName,
                userName: checkExists.userName,
                email: checkExists.email,
                line: checkExists.line,
                big: checkExists.big,
                littles: checkExists.littles
            };
            res.redirect('/users/profile');
        } catch (e) {
            console.error(e)
            return res.status(400).render('errors', { pageTitle: "Error", error: e });
        }
    });

// register route from lab 10 (Branden)
router.route('/register')
    .get(async (req, res) => {
        //code here for GET
        const allLines = await linesData.getAllLines();
        res.render('register', { pageTitle: 'Register', lines: allLines });
    })
    .post(async (req, res) => {
        //code here for POST
        const submittedToken = req.body.csrfToken;

        let { firstName, lastName, email, password, confirmPassword, line } = req.body;

        firstName = xss(firstName);
        lastName = xss(lastName);
        email = xss(email);
        password = xss(password);
        confirmPassword = xss(confirmPassword);
        line = xss(line);

        if (!firstName || !lastName || !email || !password || !confirmPassword || !line) {
            return res.status(400).render('errors', { pageTitle: "Error", error: 'All fields are required.' });
        }

        console.log('--- Checked All Fields ---');
        try {
            firstName = validator.validName(firstName, 'First Name');
            lastName = validator.validName(lastName, 'Last Name');
            email = validator.validEmail(email, 'Email routes');
            password = validator.validPassword(password);
            confirmPassword = validator.validPassword(confirmPassword);
            line = validator.validString(line, 'line');
        } catch (e) {
            console.error(e);
            res.status(400).render('errors'), { error: `${e}` };
        }

        console.log('--- Validating each field ---');
        if (password !== confirmPassword) {
            return res.status(400).render('errors', { pageTitle: "Error", error: 'Passwords do not match.' });
        }

        console.log('--- Confirming password ---');

        const userName = email.split("@")[0];

        try {
            const result = await usersData.registerUser(firstName, lastName, email, password, confirmPassword, line);
            console.log(result);
            if (result.insertedUser) {
                let checkExists = await usersData.loginUser(email, password);
                console.log(checkExists)
                req.session.user = {
                    firstName: checkExists.firstName,
                    lastName: checkExists.lastName,
                    userName: checkExists.userName,
                    email: checkExists.email,
                    line: checkExists.line,
                    big: checkExists.big,
                    littles: checkExists.littles
                };
                const addtoline = await linesData.addMember(line, checkExists)
                console.log(addtoline)
                res.redirect('/users/profile');
            } else {
                // ! different status code
                res.status(500).render('errors', { pageTitle: "Error", error: 'Internal Server Error' });
            }
        } catch (e) {
            res.status(500).render('errors', { pageTitle: "Error", error: e });
        }

    });

// profile
router.route('/profile')
    .get(async (req, res) => {
        console.log(req.session.user)
        const userInfo = await usersData.getUserByEmail(req.session.user.email)
        let type
        let id
        if (userInfo.links.spotify) {
            type = userInfo.links.spotify.split('/')[3]
            id = userInfo.links.spotify.split('/')[4].split('?')[0]
        }
        let socials = false;
        if (userInfo.links.instagram || userInfo.links.facebook) {
            socials = true;
        }
        if (userInfo.big) {
            const big = await usersData.getUserByUserName(userInfo.big);
            res.render('profile', {
                pageTitle: 'Your Profile',
                user: userInfo,
                big: big,
                me: true,
                type: type,
                id: id,
                socials: socials
            });
        } else {
            res.render('profile', {
                pageTitle: 'Your Profile',
                user: userInfo,
                big: null,
                me: true,
                type: type,
                id: id,
                socials: socials
            });
        }
    });

// profile edit
// TODO: add profile image
// TODO: major dropdown
router.route('/edit-profile')
    .get(async (req, res) => {
        const userInfo = await usersData.getUserByEmail(req.session.user.email)
        res.render('edit-profile', { pageTitle: 'Edit Profile', user: userInfo })
    })
    .post(async (req, res) => {
        let { firstName, lastName, major, gradYear, bio, email, password, profilePicture, facebook, instagram, spotify } = req.body;
        firstName = xss(firstName);
        lastName = xss(lastName);
        major = xss(major);
        gradYear = xss(gradYear);
        bio = xss(bio);
        email = xss(email);
        password = xss(password);
        profilePicture = xss(profilePicture);
        let user = null;
        let line = xss(req.session.user.line);
        facebook = xss(facebook);
        instagram = xss(instagram);
        spotify = xss(spotify);

        // validate email and password
        try {
            email = validator.validEmail(email, "Confirm Email");
            password = validator.validPassword(password);
        } catch (e) {
            return res.status(400).render('errors', { pageTitle: "Error", error: 'Either email or password is invalid' });
        }

        let userName = email.split("@")[0];

        userName = xss(userName);

        try {
            user = await usersData.getUserByEmail(email);
        } catch (e) {
            return res.status(404).render('errors', { pageTitle: "Error", error: 'User not found' })
        }

        try {
            if (firstName.trim() !== '') {
                firstName = validator.validName(firstName, 'First Name Edit');
            }
            if (lastName.trim() !== '') {
                lastName = validator.validName(lastName, 'Last Name Edit');
            }
            if (major.trim() !== '') {
                major = validator.validString(major, 'Major Edit');
            }
            if (gradYear.trim() !== '') {
                gradYear = validator.validNumber(parseInt(gradYear), 'gradYear Edit');
            }
            if (bio.trim() !== '') {
                bio = validator.validBio(bio, 'Bio Edit')
            }
            if (profilePicture.trim() !== '') {
                profilePicture = validator.validLink(profilePicture, 'profilePicture Edit');
            }
            if (facebook.trim() !== '') {
                facebook = validator.validSocialLink(facebook, 'facebook');
            }
            if (instagram.trim() !== '') {
                instagram = validator.validSocialLink(instagram, 'instagram');
            }
            if (spotify.trim() !== '') {
                spotify = validator.validSocialLink(spotify, 'spotify');
            }
        } catch (e) {
            return res.status(400).render('errors', { pageTitle: "Error", error: e });
        }

        const updateBody = {
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            major: major,
            gradYear: gradYear,
            userBio: bio,
            profilePicture: profilePicture,
            links: {facebook: facebook, instagram: instagram, spotify: spotify}
        }
        try {
            const updateInfo = await usersData.updateProfile(updateBody, email, password);
            req.session.user = {
                firstName: firstName,
                lastName: lastName,
                userName: userName,
                email: email,
                line: line,
                big: user.big,
                littles: user.littles
            }
            return res.redirect('/users/profile')
        } catch (e) {
            return res.status(500).render('errors', { pageTitle: "Error", error: e })
        }
    });
router.route('/profile/:userName')
    .get(async (req, res) => {
        try {
            req.params.userName = validator.validUsername(req.params.userName);
        } catch (e) {
            return res.status(404).render('errors', { pageTitle: "Error", error: e });
        }
        let userInfo
        try {
            userInfo = await usersData.getUserByUserName(req.params.userName)
        } catch (e) {
            return res.status(404).render('errors', { pageTitle: "Error", error: 'User not found' });
        }
        let type
        let id
        if (userInfo.links.spotify) {
            type = userInfo.links.spotify.split('/')[3]
            id = userInfo.links.spotify.split('/')[4].split('?')[0]
        }
        let socials = false;
        if (userInfo.links.instagram || userInfo.links.facebook) {
            socials = true;
        }
        if (userInfo.big) {
            const big = await usersData.getUserByUserName(userInfo.big);
            res.render('profile', {
                pageTitle: 'Your Profile',
                user: userInfo,
                big: big,
                me: true,
                type: type,
                id: id,
                socials: socials
            });
        } else {
            res.render('profile', {
                pageTitle: 'Your Profile',
                user: userInfo,
                big: null,
                me: true,
                type: type,
                id: id,
                socials: socials
            });
        }
    });

router.route('/logout').get(async (req, res) => {
    req.session.destroy();
    return res.redirect('/');
});
export default router;

