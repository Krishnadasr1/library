require('dotenv').config()
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser())
app.use(cors())


app.use('/api/v1/amc',require('./routes/routing'))




module.exports = app;
