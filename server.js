import cors from 'cors'
import express from 'express'
import { normalizeRequest } from './middleware/normalize-request.js'
import nunjucks from 'nunjucks'

const app = express()

// Configure Nunjucks view engine
app.set('view engine', 'njk')
nunjucks.configure('views', {
  autoescape: true,
  express: app,
})

// Middleware
app.use(cors())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(normalizeRequest)

// Routes
app.get('/', (req, res) => {
  res.render('index.njk')
})

app.use('/api/v1', (await import('./api/v1.js')).default)

// Handle 404
app.use((req, res, next) => {
  console.log(`Not Found: ${req.originalUrl}`)
  return res.status(404).render('404')
})

// Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.json({
    code: err.status,
    message: err.message,
    stack: err.stack,
  })
})

export default function startServer({ port } = {}) {
  const env = process.env.NODE_ENV

  const server = app.listen(port, () => {
    if (env !== 'test') {
      console.log(`Listening to http://localhost:${server.address().port}`)
    }
  })

  return server
}
