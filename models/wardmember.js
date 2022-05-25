const mongoose = require('mongoose')

const wardmemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
         minlength: 4,
         maxlength: 10,
         match: /^[a-zA-Z]/,
         

    }, 
    // address: {
    //     type: String,
    //      required: true
    // }, 
    phoneNumber: {
        type: String,
        match: /^\d{10}$/,
         required: true,
         unique: true
        
    },
    status:{
        type:String
    }, 
    password:{
        type:String,
        required: true
    }, 
     wardNumber: {
         type: String,
       required: true
     }


})
 
 
    


module.exports = mongoose.model('WardMember',wardmemberSchema)
