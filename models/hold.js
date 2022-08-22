const mongoose = require('mongoose')

const holdSchema = new mongoose.Schema({
    
   accessionNo: String,
   cardNumber: String,
   userName: String,
   houseName: String,
   wardName: String,
   wardNumber: String,
   postOffice: String,
   pinCode: String,
   phoneNumber: String,
  checkoutStatus:{
   type:String,
   default:"F"
  }
}, { timestamps: true })

module.exports= mongoose.model('Hold', holdSchema)
