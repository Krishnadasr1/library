const mongoose = require('mongoose')

const deliverySchema = new mongoose.Schema({
    
    userName: {
        type: String,
        required: true
    },
    cardNumber: {
        type: String,
        required: true
    },
    houseName: {
        type: String,
        required: true,
    },
    wardName: {
        type: String,
        required: true,
    },
    wardNumber: {
        type: Number,
        required: true,
    },
    postOffice: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
        default:"Alappuzha"
    },
  
    pinCode: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        match: /^\d{10}$/
    },
    bookName:{
        type:String,
        required:true
    },
    accessionNo:{
        type:String,
        required:true
    },
    barcode:{
        type:String,
        unique:true,
        required:true
    },
    holdId:{
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
        default:"T"
       //open when admin places a checkout
       //closed when delivery boy deliver the book
    },
    userInHand:{
        type:String,
        default:"F"
    },
    dpInHand:{
        type:String,
        default:"F"
    },

    checkinStatus: {
      type: String,
      required: true,
      default:"F"
      //N by default
      //open when user places a return
      //closed when delivery boy return the book to library
      //done when admin conforms the return
    },

}, { timestamps: true })

module.exports= mongoose.model('Delivery', deliverySchema)
