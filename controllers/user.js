const bcrypt = require('bcryptjs')

exports.getHome = (req, res, next) => {
    res.status(200).json({
        message: 'signing up'
    })
}

exports.postSignup = async (req, res, next) => {
    const { email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 12)
    res.status(200).json({
        message: 'signing up',
        hashedPassword
    })
}

exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;
}