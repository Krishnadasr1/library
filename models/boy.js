const mongoose = require('mongoose')

const boySchema = new mongoose.Schema({

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
    member_id: {
        type: String,
        //required: true
    },
    ward_number: {
        type: Array,
        required: true
    },
    status: {
        type: String
    },
    phone_number: {
        type: String,
         required: true,
        match: /^\d{10}$/
    },
    checkout_list: {
        type: Array
    },
    return_list: {
        type: Array
    },

}, { timestamps: true })


module.exports = mongoose.model('Boy', boySchema)
