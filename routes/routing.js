const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser())
app.use(cors())

app.use('/user',require('../controller/userController.js'))
app.use('/admin',require('../controller/adminController'))
app.use('/dp',require('../controller/dpController'))
// app.use('/member',require('../controller/memberController'))

// app.use('/library',require('../controller/libraryController'))
 app.use('/books',require('../controller/bookController'))
 app.use('/hold',require('../controller/holdController'))
 app.use('/checkout',require('../controller/deliveryController'))




module.exports = app;