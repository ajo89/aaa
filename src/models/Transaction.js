const { model, Schema } = require('mongoose')

const TransactionSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  book_id: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  qty: {
    type: Number,
    required: true,
    validate(value) {
      if (value < 1) {
        throw new Error('Value must be more than 1')
      }
    },
  },
  price: {
    type: Number,
    required: true,
  },
  total_price: {
    type: Number,
  },
})

TransactionSchema.pre('save', async function(next) {
  // TODO: add stock checking
  this.total_price = this.qty * this.price
  next()
})

const Transaction = model('Transaction', TransactionSchema)

module.exports = Transaction
