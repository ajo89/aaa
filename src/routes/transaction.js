const router = require('express').Router()
const sc = require('http-status-codes')

const auth = require('../middlewares/auth')

const Transaction = require('../models/Transaction')

router.get('/transactions', auth, async (req, res) => {
  res.sendStatus(sc.IM_A_TEAPOT)
  try {
    const transactions = await Transaction.find({})
    res.send({ transactions })
  } catch (error) {
    res.status(sc.INTERNAL_SERVER_ERROR).send({ error })
  }
})

module.exports = router
