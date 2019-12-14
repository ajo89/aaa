const { model, Schema } = require('mongoose')

const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  qty: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
  writer: {
    type: String,
  },
  publisher: {
    type: String,
  },
  weight: {
    type: Number,
    default: 0,
  },
  imagee: {
    type: Buffer,
  },
})

const Book = model('Book', BookSchema)

module.exports = Book
