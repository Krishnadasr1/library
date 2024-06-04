const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  bookTitle: String,
  image: String,
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
  shelfNo : String,
  translatedWork : String,
  stockNo:String,

trends:{
    type:String,
    default:"0"
},
release:{
    type:String,
    default:"0"
},

hold:{
  type:String,
  default:"F"
},
checkout:{
  type:String,
  default:"F"
}
},
{timestamps:true});

module.exports = mongoose.model('Book', bookSchema);
