const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  bookTitle: String,
  ISBN: String,
  language: String,
  publicationPlace: String,
  publisherName: String,
  publicatonDate: String,
  author: String,
  editor: String,
  translator: String,
  volume: String,
  price: String,
  pages: String,
  edition: String,
  classNo: String,
  accessionNo: String,
  callNo: String,
  subjectHeading: String,
  description: String,

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
}
},
{timestamps:true})

module.exports = mongoose.model('Book', bookSchema)