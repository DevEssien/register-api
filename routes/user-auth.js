const express = require('express')
const { check, body } = require('express-validator')

const User = require('../models/user')
const userController = require('../controllers/user-auth');

const router = express.Router();

router.get('/', userController.getHome)

router.get('/user', userController.getUser)

router.post('/signup', [
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom( async (email, { req }) => {
        try {
            const foundUser = await User.findOne({ where: { email: email }});
            if (foundUser) {
                return Promise.reject(new Error('User with email already exist! please enter anothe email'));
            }
        } catch(error) {
            console.log(error);
        }
    })
    .normalizeEmail(),

    body('password', 'Password must be at least 4 characters long')
    .isLength({ min: 4})
    .isAlphanumeric()
    .trim(),

    body('confirmPassword')
    .custom(async (password, { req }) => {
        if (password !== req.body?.password) {
            throw new Error('Password must match')
        }
        return true
    })
    .trim()
], userController.postSignup);

router.post('/login', [
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),

    body('password').isAlphanumeric().trim()
], userController.postLogin);

module.exports = router;

