const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.getHome = (req, res, next) => {
    return res.status(200).json({
        message: 'signing up'
    })
}

exports.getUser = async (req, res, next) => {
    try {
        console.log('id ', req.userId)
        const user = await User.findOne({ where: { id: req.userId}});
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        return res.status(200).json({
            status: 'Successful',
            statusCode: 200,
            message: 'Returning user',
            data: {
                user
            }
        })
    } catch(error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error)
    }
}

exports.postSignup = async (req, res, next) => {
    const { username, email, password } = req.body
    try {
        const user = await User.findOne({ where: { email: email }})
        if (user) {
            const error = new Error('Email exist! enter another email')
            error.statusCode = 422;
            throw error
        }
        const newUser = await User.create({
            username: username,
            email: email,
            password: await bcrypt.hash(password, 12)
        })
        if (!newUser) {
            const error = new Error('Error occured while saving on server side')
            error.statusCode = 500;
            throw error
        }
        return res.status(201).json({
            status: 'Successful',
            statusCode: 201,
            message: 'signing up',
            data: {
                user: newUser
            }
        })
    } catch(error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error)
    }
}

exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email: email }})
        if (!user) {
            const error = new Error('No user with email found')
            error.statusCode = 404;
            throw error
        }
        try {
            const matchedPassword = await bcrypt.compare(password, user?.password)
            if (!matchedPassword) {
                const error = new Error('Incorrect password!')
                error.statusCode = 422;
                throw error
            }
            const token = jwt.sign({
                id: user?.id,
                email: user?.email
            }, 'checktHis2SecreTkeY', { expiresIn: '1h'})

            user.token = token;
            
            return res.status(200).json({
                status: 'Successful',
                statusCode: 200,
                message: 'Loggin in',
                data: {
                    user,
                    token
                }
            })
        } catch(error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error)
        }
    } catch(error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error)
    }
}