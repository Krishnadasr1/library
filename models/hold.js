const mongoose = require('mongoose')

const holdSchema = new mongoose.Schema({
    
   accessionNo: String,
   bookName:String,
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
  },
  holdStatus:{
    type:String,
    default:"T"
  }
   
}, { timestamps: true })

module.exports= mongoose.model('Hold', holdSchema)
