const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser())
app.use(cors())

app.use('/koha/book',require('./routing/bookRoutes'))
app.use('/koha/hold',require('./routing/holdRoutes'))
app.use('/koha/checkout',require('./routing/checkoutRoutes'))
app.use('/koha/patron',require('./routing/patronRoutes'))
app.use('/koha/library',require('./routing/libraryRoutes'))

app.use('/user',require('./routing/userRoutes'))
app.use('/admin',require('./routing/adminRoutes'))
app.use('/boy',require('./routing/boyRoutes'))
app.use('/member',require('./routing/memberRoutes'))



module.exports = app;
