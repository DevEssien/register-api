const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.get('Authorization')
    if (!token) {
        req.isAuth = false;
        return next()
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'checktHis2SecreTkeY')
    } catch(error) {
        req.isAuth = false;
        return next();
    }
    if (!decodedToken) {
        const error = new Error('Authentication failed')
        error.statusCode = 401;
        throw error
    }
    req.userId = decodedToken?.id;
    req.isAuth = true;
    next()
}
