import { Router } from 'express';
const router = Router();
import user from '../data/users.js';

router.route('/')
    .get(async(req,res)=>{
        res.redirect('/home')
    });

router.route('/register')
    .get(async (req, res) => {
    // return res.sendFile(path.resolve('front/register.html'));
    res.render('register');
    })
    .post(async (req, res) => {
        let registrationUser = req.body;
        try {
        let userCheck = await user.registerUser(registrationUser.userName,registrationUser.firstName, registrationUser.lastName, registrationUser.email, registrationUser.password, registrationUser.confirmPassword);
        if (userCheck.insertedUser) {
            return res.redirect('/login');
        }
        else {
            return res.status(500).send('error: Could not register user');
        }
        }
        catch (e) {
        return res.status(400).render('error', { error: `Internal Server Error: ${e}` });
        }

    });

router.route('/login')
    .get(async (req, res) => {
        res.render('login');
    })
    .post(async (req, res) => {
        const inputs = req.body;
        try {
        if (!inputs.emailAddressInput || !inputs.passwordInput) {
            return res.status(400).render('login', { error: "Username or password is incorrect" });
        }
        } catch (e) {
        return res.status(400).render('login', { error: e });
        }

        try {
        let checkLog = await user.loginUser(inputs.emailAddressInput, inputs.passwordInput);
        req.session.user = checkLog;
        res.redirect('/profile');
        } catch (e) {
        return res.status(400).render('login', { error: e });
        }


    });
    router.route('/profile')
    .get(async (req, res) => {
      // res.sendFile(path.resolve('front/profile.html'));
      if (!req.session.user) {
        res.redirect('/register');
      }
      else {
        res.render('profile', { user: req.session.user });
      }
    });

export default router;