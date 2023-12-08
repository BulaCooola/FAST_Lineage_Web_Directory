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
        let userCheck = await user.registerUser(registrationUser.userName, registrationUser.firstName, registrationUser.lastName, registrationUser.email, registrationUser.password, registrationUser.confirmPassword);
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