const mongoose = require('mongoose')

const deliverySchema = new mongoose.Schema({
    
    userName: {
        type: String,
        //required: true
    },
    cardNumber: {
        type: String,
        required: true
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
  
    pinCode: {
        type: String,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique:true,
        match: /^\d{10}$/
    },
    bookName:{
        type:String,
        required:true
    },
    accessioNo:{
        type:String,
        required:true
    },
    barcode:{
        type:String,
        required:true
    },
    deliveryPerson:{
        type:String,
        required:true
    },
    checkoutStatus: {
        type: String,
    required: true,
    default:"Open"
    //open when admin places a checkout
    //closed when delivery boy deliver the book
    },
    userInHand:{
        type:String,
        default:"F"
    },
    returnStatus: {
        type: String,
    required: true,
    default:"N"
    //N by default
    //open when user places a return
    //closed when delivery boy return the book to library
    //done when admin conforms the return
    },

    

}, { timestamps: true })

module.exports= mongoose.model('Delivery', deliverySchema)
