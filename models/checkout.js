const mongoose = require('mongoose')

const chechoutSchema = new mongoose.Schema({
  
    
    patron_name: {
        type: String,
    required: true
    },
    book_name: {
        type: String,
    required: true
    },
    ward_number: {
        type: String,
    required: true
    },

}, { timestamps: true })

module.exports= mongoose.model('CK', Schema)
