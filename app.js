const express = require('express')
const bodyParser = require('body-parser');

const userRoute = require('./routes/user-auth')
const User = require('./models/user')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use('/auth', userRoute)

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

