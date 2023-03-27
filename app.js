const express = require('express')
const bodyParser = require('body-parser');

const userRoute = require('./routes/user-auth')
const User = require('./models/user')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use('/auth', userRoute)

const createTable = async () => {
    await User.sync()
}
// createTable()

app.listen(3000, () => {
    console.log('server spinning at port 3000')
})

