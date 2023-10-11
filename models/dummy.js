const mongoose = require('mongoose')
const dummySchema = new mongoose.Schema(
{


firstName: {
    type: String,
 
},
lastName: {
    type: String,
}}
);
module.exports= mongoose.model('Dummy', dummySchema);