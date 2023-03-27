const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.getHome = (req, res, next) => {
    res.status(200).json({
        message: 'signing up'
    })
}

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.userId}});
        if (!user) {
            //code
        }
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
                email: user?.email
            }, 'checktHis2SecreTkeY', { expiresIn: '1h'})
            return res.status(200).json({
                status: 'Successful',
                statusCode: 200,
                message: 'Loggin in',
                data: {
                    user: user
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