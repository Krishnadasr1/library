const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema({
    
   phone_number: {
       type: String,
       required: true,
       unique: true,
   },
   name: {
    type: String,
    required: true,
   // unique: true,
},
ward_number: {
    type: String,
    required: true,
    
},
password: {
    type: String,
    required: true
}   


}, { timestamps: true })

module.exports= mongoose.model('Member', memberSchema)
