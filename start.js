import 'dotenv/config'

import mongoose from 'mongoose'
import server from './server.js'

const db = mongoose.connection
const dbUrl = 'mongodb://localhost:27017/node-express-mongodb-project'

mongoose.connect(dbUrl)

db.once('open', async _ => {
  console.log('Database connected:', dbUrl)
})

db.on('error', err => {
  console.error('connection error:', err)
})

server({ port: 3000 })
