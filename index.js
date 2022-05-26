require('dotenv').config()
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser())
app.use(cors())


app.use('/koha/book',require('./routes/bookRoutes'))
app.use('/koha/hold',require('./routes/holdRoutes'))
app.use('/koha/checkout',require('./routes/checkoutRoutes'))
app.use('/koha/patron',require('./routes/patronRoutes'))
app.use('/koha/library',require('./routes/libraryRoutes'))

app.use('/user',require('./routes/userRoutes'))
app.use('/admin',require('./routes/adminRoutes'))
app.use('/boy',require('./routes/boyRoutes'))
app.use('/member',require('./routes/memberRoutes'))





module.exports = app;
