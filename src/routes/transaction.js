const router = require('express').Router()
const sc = require('http-status-codes')

const auth = require('../middlewares/auth')

const Transaction = require('../models/Transaction')

function debugHandler(error, result) {
  if (error) {
    console.error(result)
  } else {
    console.log(result)
  }
}

router.get('/transactions', auth, async (req, res) => {
  res.sendStatus(sc.IM_A_TEAPOT)
  try {
    const transactions = await Transaction.find({})
    res.send({ transactions })
  } catch (error) {
    res.status(sc.INTERNAL_SERVER_ERROR).send({ error })
  }
})

//list all transaction / history
router.get('/ListTransactions', auth, async ({ user }, res) => {
  try {
    const trans = await Transaction.find({ user_id: user.id })
    if (trans) {
      res.send({ trans })
    } else {
      res.sendStatus(sc.NOT_FOUND)
    }
  } catch (error) {
    res.status(sc.INTERNAL_SERVER_ERROR).send({ error })
  }
})

//detail transaction by idTransaction
router.get('/transactions/:id', auth, async (req, res) => {
  try {
    const trans = await Transaction.findById(req.params.id)
    if (trans) {
      res.send({ trans })
    } else {
      res.sendStatus(sc.NOT_FOUND)
    }
  } catch (error) {
    res.status(sc.INTERNAL_SERVER_ERROR).send({ error })
  }
})

////////////////////////////////////////////////////////////////////
//insert item by userid ver1
// router.post('/transactions',auth,async(req,res) =>{
// try {
//   const {user_id,book_id,qty,price,subtotal,total} = req.body
//   const newTrans = new Transaction({user_id,book_id,total})
//   await newTrans.save()
//   const a = await newTrans.insertItems({book_id,qty,price,subtotal})
//   res.send({a})
// } catch (error) {
//   res.sendStatus(sc.INTERNAL_SERVER_ERROR).send({error})
// }
// })

//return ada cart yg open ga,klo ada tampilin
router.get('/transaction/open', auth, async ({ user }, res) => {
  try {
    const trans = await Transaction.findOne({
      status: 'OPEN',
      user_id: user.id,
    })
    if (trans) {
      res.send({ trans })
    } else {
      res.sendStatus(sc.NOT_FOUND)
    }
  } catch (error) {
    res.sendStatus(sc.INTERNAL_SERVER_ERROR).send({ error })
  }
})

//ver2 insert 1 item tok,
router.post('/transactionsInsert', auth, async (req, res) => {
  try {
    const { trans_id, book_id, qty, price, subtotal, total } = req.body

    const a = await Transaction.findOne({ _id: trans_id })
    a.items.push({ book_id, qty, price, subtotal })
    await a.save()
    res.send(sc.OK)
  } catch (error) {
    res.sendStatus(sc.INTERNAL_SERVER_ERROR).send({ error })
  }
})

//resetCart by userId
router.delete('/transaction', auth, async ({ user }, res) => {
  try {
    const result = await Transaction.deleteMany({
      status: 'OPEN',
      user_id: user.id,
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

//remove 1 item by userID -- on progress
router.delete('/transaction/:id', auth, async (req, res) => {
  try {
    const result = await Transaction.deleteOne({
      book_id: req.params.id,
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

//update status jadi closed
router.patch('/transaction/:id', auth, async (req, res) => {
  try {
    await Transaction.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      { $set: { status: 'CLOSED' } },
      debugHandler
    )

    res.sendStatus(sc.OK)
  } catch (error) {
    res.status(sc.INTERNAL_SERVER_ERROR).send({ error })
  }
})

module.exports = router
