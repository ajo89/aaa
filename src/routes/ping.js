const router = require('express').Router()

router.get('/ping', (_req, res) => {
  res.send({ ping: 'pong' })
})

module.exports = router
