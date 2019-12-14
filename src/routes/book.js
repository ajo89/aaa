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
    // Book.find({"id":req.params.id},function(e,docs){
    //   res.json(docs);
    // })
    const book = await Book.findById(req.params.id)
    if (book) {
      book.count = book.count
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

router.patch('/books/:id',auth,async(req,res)=>{
  try {
    const book = await Book.findByIdAndUpdate(req.params.id,req.body)
    res.send(book)
  } catch (error) {
    res.status(sc.INTERNAL_SERVER_ERROR).send({error})
  }
})


////untested
const upload = multer({
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'))
    }

    cb(undefined, true)
  },
})

router.post(
  '/booksImage/:id',
  auth,
  upload.single('imagee'),
  async (req, res) => {
    const book = await Book.findByIdAndUpdate(req.params.id,req.file.buffer)
    await book.save()
    res.send({ message: 'berhasil di upload' })
  },
  (error, req, res) => {
    res.status(400).send({ error: error.message })
  }
)

router.get('/booksImage/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book || !book.imagee) {
      throw Error()
    }
    res.set('Content-Type', 'image/png')
    res.send(book.imagee)
  } catch (e) {
    res.status(404).send({ message: 'image not found' })
  }
})
////


module.exports = router
