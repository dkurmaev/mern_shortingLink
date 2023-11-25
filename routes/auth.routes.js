const {Router} = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const router = Router();

router.post(
    '/register',// middleware
    [
        check('email', 'Incorrect email').isEmail(),//error message middleware
        check('password', 'Minimum password length is 6 characters').isLength({min: 6})//error message middleware
    ],
    async (req, res) => {
        try {
            //console.log('Body', req.body)
            const errors = validationResult(req);
            if (!errors.isEmpty()) {//if there are errors
                return res.status(400).json({//return error message
                    errors: errors.array(),
                    message: 'Incorrect registration data'
                })
            }
            const {email, password} = req.body;
            const candidate = await User.findOne({email});
            if (candidate) {
                return res.status(400).json({message: 'User already exists'});
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({email, password: hashedPassword});

            await user.save();
            res.status(201).json({message: 'User created'});

        } catch (e) {
            res.status(500).json({message: 'Something went wrong, try again'});
        }
    })

router.post(
    '/login',
    [
        check('email', 'Enter correct email').normalizeEmail().isEmail(),
        check('password', 'Enter password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {//if there are errors
                return res.status(400).json({//return error message
                    errors: errors.array(),
                    message: 'Incorrect registration data'
                })
            }

            const {email, password} = req.body;
            const user = await User.findOne({email});

            if (!user) {
                return res.status(400).json({message: 'User is not found'});
            }
            const {password: password1} = user;
            const isMatch = await bcrypt.compare(password, password1);

            if (!isMatch) {
                return res.status(400).json({message: 'Incorrect password, try again'});
            }
            const token = jwt.sign(
                {userId: user.id},
                config.get('jwtSecret'),
                {expiresIn: '1h'}
            );

            res.json({token, userId: user.id});

        } catch (e) {
            res.status(500).json({message: 'Something went wrong, try again'});
        }
    })


module.exports = router;