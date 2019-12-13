const jwt = require('jsonwebtoken')
const sc = require('http-status-codes')
const User = require('../models/User')

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function auth(req, res, next) {
  try {
    const bearer = req.header('Authorization')

    if (!bearer) {
      throw 'Authorization header not found'
    }

    const token = bearer.replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.APP_SECRET || 'supersecret')
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

    if (!user) {
      throw 'User not found'
    }

    req.token = token
    req.user = user

    next()
  } catch (error) {
    res.status(sc.UNAUTHORIZED).send({ error })
  }
}

module.exports = auth
