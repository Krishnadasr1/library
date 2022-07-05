const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    image:{
        type:String
    },
    firstname: {
        type: String,
        required: true,
        maxlength: 10,
        match: /^[a-zA-Z]/,
    },
    surname: {
        type: String,
        required: true,
        maxlength: 10,
        match: /^[a-zA-Z]/,
    },
    patron_id: {
        type: String,
        default:null
        //required: true
    },
    password: {
        type: String,
        required: true
    },

    house_name: {
        type: String,
        required: true
    },
    ward_name: {
        type: String,
        required: true
    },
    ward_number: {
        type: String,
        required: true
    },
    post_office: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    postal_code: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        match: /^\d{10}$/
    },
    cardnumber:{
        type:String,
       // required:true
    },
    age: {
        type: Number,
       // required: true
    },
    gender:{
        type:String,
        required:true
    },
    date_of_birth:{
        type:Date,
        required:true
    },
    date_enrolled:{
        type:Date,
        
    },
    expiry_date:{
        type:Date,
    },
    library_id:{
        type:String,
        required:true,
        default:"LLIB"
    },
    category_id:{
        type:String,
        required:true,
        default:"PT"
    },
    status: {
        type: String,
        default:"T"
    }


}, { timestamps: true })

module.exports= mongoose.model('User', userSchema)
