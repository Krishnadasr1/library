const mongoose = require('mongoose')

const deliveryboySchema = new mongoose.Schema({

    image: {
        type: String
    },
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 10,
        match: /^[a-zA-Z]/,
        unique: true

    },
    address: {
       type: String,
       required: true
   },
   password: {
    type: String,
    required: true
},
    wardMemberId: {
        type: String,
        required: true
    },
    wardNumber: {
        type: String,
        required: true
    },
    status:{
        type:String
    },
    phoneNumber: {
        type: String,
       // required: true,
        match: /^\d{10}$/
    }
}, {timestamps: true})
 

module.exports = mongoose.model('Deliveryboy',deliveryboySchema)
