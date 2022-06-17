const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    
    name: {
        type: String,
    required: true
    },
    biblioId: {
        type: String,
        required: true
    },
image:{
    type:String
}
    

})

module.exports= mongoose.model('Book', bookSchema)