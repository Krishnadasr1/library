const mongoose = require('mongoose')
const moment = require('moment')

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
  },
  requestDate:{
    type: String,
    
},
   
}, { timestamps: true })

holdSchema.pre('save', function(next) {
  // Set requestDate to the current date and time in 'DD-MM-YY' format
  this.requestDate = moment().format('YYYY-MM-DD');
  next();
});

module.exports= mongoose.model('Hold', holdSchema)
