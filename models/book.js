const mongoose = require('mongoose')
const mongoosePaginate = require("mongoose-paginate");

const bookSchema = new mongoose.Schema({
  bookTitle: String,
  ISBN: String,
  language: String,
  publicationPlace: String,
  publisherName: String,
  publicatonDate: String,
  author: String,
  editorOrTranslator:String,
  volume: String,
  price: String,
  pages: String,
  edition: String,
  classNo: String,
  accessionNo: String,
  callNo: String,
  subjectHeading: String,
  description: String,
  category:String,
  image: String,

trends:{
    type:String,
    default:"0"
},
release:{
    type:String,
    default:"0"
},
image: String,
hold:{
  type:String,
  default:"F"
},
checkout:{
  type:String,
  default:"F"
}
},
{timestamps:true})


module.exports = mongoose.model('Book', bookSchema)