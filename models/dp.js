const mongoose = require('mongoose')

const dpSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,

    },
    address: {
        type: String,
        // required: true
    },
    email:{
        type:String,
        mmatch: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

    },
    password: {
        type: String,
        required: true
    },
    memberId: {
        type: String,
        //required: true
    },
    wardNumber: {
        type: Array,
        required: true
    },
    status: {
        type: String,
        default:"F"
    },
    phoneNumber: {
        type: String,
         required: true,
        match: /^\d{10}$/
    },
    checkoutList: {
        type: Array
    },
    returnList: {
        type: Array
    },
    otp:{
        type:String,
        default:null
    },

}, { timestamps: true })

module.exports= mongoose.model('DP', dpSchema)
