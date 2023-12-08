// LINES or USERS???
import express from 'express';
import path from 'path';
import * as validators from 'validators.js';
const router = express.Router();

router
.route('/user')
  .get(async (req, res) => {
    // ! Get's the home/landing page from handlebars
    // const filePath = path.join(__dirname, '..', 'static', 'homepage.html')
    res.sendFile(filePath)
  });

// register route from lab 10 (Branden)
router.route('/register')
  .get(async (req, res) => {
    //code here for GET
    res.render('register');
  })
  .post(async (req, res) => {
    //code here for POST
    const { firstName, lastName, emailAddress, password, confirmPassword, role } = req.body;

    if (!firstName || !lastName || !emailAddress || !password || !confirmPassword || !role) {
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

    if (role !== 'admin' && role !== 'user') {
      return res.status(400).render('register', { error: 'Invalid role.' });
    }

    try {
      const result = await methods.registerUser(firstName, lastName, emailAddress, password, role);

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

