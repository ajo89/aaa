async function connectDatabase() {
  const mongoose = require('mongoose')
  mongoose.set('useCreateIndex', true)

  const host = process.env.DB_HOST || 'localhost'
  const port = process.env.DB_PORT || 27017
  const database = process.env.DB_DATABASE || 'acme-bookshop'

  const endpoint = `mongodb://${host}:${port}/${database}`

  await mongoose.connect(endpoint, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}

async function createServer() {
  const cors = require('cors')
  const express = require('express')
  const path = require('path')
  const fs = require('fs')

  const port = process.env.APP_PORT || 3000

  const app = express()

  app.use(express.json())
  app.use(cors())

  const baseRoutePath = path.join(__dirname, 'routes')
  fs.readdirSync(baseRoutePath).forEach(filename => {
    if (path.extname(filename) === '.js') {
      app.use(require(path.join(baseRoutePath, filename)))
    }
  })

  app.listen(port, () => {
    console.log(`Express instance is running at http://localhost:${port}`)
  })
}

module.exports = async function initialize() {
  await connectDatabase()
  await createServer()
}
