require('dotenv').config()
const express = require('express')
const core = require('cors')
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser())
app.use(core())

app.get("/show" , (req, res) => {
    console.log("connected");
    res.send("success");
 })
app.use('/api/v1/amc',require('./routes/routing'))

module.exports = app

