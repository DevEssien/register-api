const express = require('express')
const bodyParser = require('body-parser');

const userRoute = require('./routes/user-auth')
const User = require('./models/user')
const auth = require('./middleware/auth')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use('/auth', userRoute)

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
})

app.use(auth);

app.use((error, req, res, next) => {
    const statusCode = error?.statusCode || 500;
    const message = error?.message || 'Server Side error';
    const data = error?.data || null;
    return res.status(statusCode).json({
        statusCode,
        message,
        data
    })
})
const createTable = async () => {
    await User.sync()
}
// createTable()

app.listen(3000, () => {
    console.log('server spinning at port 3000')
})

