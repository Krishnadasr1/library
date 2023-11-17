const mongoose = require('mongoose')

const holdSchema = new mongoose.Schema({
    
   accessionNo: String,
   bookName:String,
   author:String,
   cardNumber: String,
   userName: String,
   callNo: String,
   shelfNo : String,
   houseName: String,
   wardName: String,
   wardNumber: String,
   postOffice: String,
   pincode: String,
   phoneNumber: String,
   subjectHeading: String,
  checkoutStatus:{
   type:String,
   default:"F"
  },
  holdStatus:{
    type:String,
    default:"T"
  }
   
}, { timestamps: true })

module.exports= mongoose.model('Hold', holdSchema)
