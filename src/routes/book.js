const router = require('express').Router()
const sc = require('http-status-codes')

const auth = require('../middlewares/auth')

const Book = require('../models/Book')

router.get('/books', auth, async (_req, res) => {
  try {
    const books = await Book.find({})
    res.send({ books })
  } catch (error) {
    res.status(sc.INTERNAL_SERVER_ERROR).send({ error })
  }
})

router.post('/books', auth, async (req, res) => {
  const book = new Book(req.body)
  try {
    await book.save()
    res.send({ book })
  } catch (error) {
    res.status(sc.BAD_REQUEST).send({ error })
  }
})

router.get('/books/:id', auth, async (req, res) => {
  try {
    const book = Book.findById(req.params.id)
    if (book) {
      res.send({ book })
    } else {
      res.sendStatus(sc.NOT_FOUND)
    }
  } catch (error) {
    res.status(sc.INTERNAL_SERVER_ERROR).send({ error })
  }
})

router.delete('/books/:id', auth, async (req, res) => {
  try {
    const result = await Book.deleteOne({
      _id: req.params.id,
    })

    if (result.deletedCount > 0) {
      res.sendStatus(sc.OK)
    } else {
      res.sendStatus(sc.NOT_FOUND)
    }
  } catch (error) {
    res.status(sc.INTERNAL_SERVER_ERROR).send({ error })
  }
})

module.exports = router
