const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    image:{
        type:String
    },
    firstName: {
        type: String,
        //maxlength: 10,
       // match: /^[a-zA-Z]/,
    },
    lastName: {
        type: String,
       // maxlength: 10,
       // match: /^[a-zA-Z]/,
    },
    cardNumber: {
        type: String,
        default:null,
        //unique:true
        //required: true
    },
    category:{
        type:String,
       // enum:["A","B","C"]
    },
    password: {
        type: String,
    },

    houseName: {
        type: String,
    },
    wardName: {
        type: String,
    },
    wardNumber: {
        type: Number,
    },
    postOffice: {
        type: String,
    },
    district: {
        type: String,
        required: true,
        default:"Alappuzha"
    },
  
    pincode: {
        type: String,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique:true,
        match: /^\d{10}$/
    },
    otp:{
        type:String,
        default:null
    },
    otpFirstTimeVerifed:{
        type:String,
        default:"false"
    },
    gender:{
        type:String,
    },
    dob:{
        type:Date,
    },
    dateEnrolled:{
        type:Date,
        default:Date.now()
        
    },
    expiryDate:{
        type:Date,
    },

    age: {
        type : String
    },


    gender : {
        type: String
    },

    membershipNo : {
        type: String
    },

    status: {
        type: String,
        default:"T"
    }


}, { timestamps: true })

module.exports= mongoose.model('User', userSchema)
