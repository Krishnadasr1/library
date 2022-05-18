const mongoose = require('mongoose')

const memberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
   phoneNumber: {
       type: String,
       required: true,
       unique: true,
   },
   name: {
    type: String,
    required: true,
    unique: true,
},
wardNumber: {
    type: String,
    required: true,
    
},
   
    


}, { timestamps: true })

module.exports= mongoose.model('Member', memberSchema)
