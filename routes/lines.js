// LINES or USERS???
import express from 'express';
import path from 'path';
const router = express.Router();

router.route('/user').get(async (req, res) => {
    // ! Get's the home/landing page from handlebars
    // const filePath = path.join(__dirname, '..', 'static', 'homepage.html')
    res.sendFile(filePath)
  });

export default router;

// GET REQUESTS: 
// Search bar features: line name, profile name, graduation year, major
// Each sends a list of names
// ID specific pages: lines, users
// Comment Board: comments (comments might become its own collection)
// Nov 28, 2023 POST REQUESTS: User profile, Lines, Comments
