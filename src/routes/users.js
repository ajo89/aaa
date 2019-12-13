const router = require('express').Router()
const sc = require('http-status-codes')

const auth = require('../middlewares/auth')

const User = require('../models/User')

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const newUser = new User({ name, email, password })
    await newUser.save()

    const token = await newUser.generateAuthToken()
    const user = newUser.toSafeObject()

    res.status(sc.CREATED).send({ user, token })
  } catch (error) {
    res.status(sc.BAD_REQUEST).send({ error })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const authenticatedUser = await User.findByCredentials({ email, password })

    const token = await authenticatedUser.generateAuthToken()
    const user = authenticatedUser.toSafeObject()

    res.send({ user, token })
  } catch (error) {
    res.status(sc.INTERNAL_SERVER_ERROR).send({ error })
  }
})

router.post('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(({ token }) => {
      return token !== req.token
    })
    await req.user.save()
    res.sendStatus(sc.OK)
  } catch (error) {
    res.status(sc.INTERNAL_SERVER_ERROR).send({ error })
  }
})

router.post('/logout_all', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.sendStatus(sc.OK)
  } catch (error) {
    res.status(sc.INTERNAL_SERVER_ERROR).send({ error })
  }
})

router.get('/users', auth, async (_req, res) => {
  try {
    const users = await User.find({}).then(users =>
      users.map(user => user.toSafeObject())
    )
    res.send({ users })
  } catch (error) {
    res.status(sc.INTERNAL_SERVER_ERROR).send({ error })
  }
})

router.get('/users/me', auth, async ({ user }, res) => {
  res.send({
    user: user.toSafeObject(),
  })
})

module.exports = router
