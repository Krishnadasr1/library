const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    
    name: {
        type: String,
    required: true
    },
    biblioId: {
        type: String,
        required: true,
        unique:true
    },
image:{
    type:String
},
items:{
    type:Array
},
category:{
    type:String,
    enum:["Novel","Story","Poem","Journals","AutoBiography","General"]
}
})

module.exports= mongoose.model('Book', bookSchema)