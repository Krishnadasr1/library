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
unavailableItems:{
    type:Array
},
category:{
    type:String,
    enum:["Novel","Story","Poem","Journals","AutoBiography","General"]
},
trends:{
    type:String,
    default:"0"
},
release:{
    type:String,
    default:"0"
}
})

module.exports= mongoose.model('Book', bookSchema)