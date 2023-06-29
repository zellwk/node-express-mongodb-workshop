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
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(normalizeRequest)

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Hello World',
    nested: {
      variable: 'This is a nested variable',
    },
    numUsers: 10,
    fruitsBasket: ['apple', 'banana', 'orange'],
  })
})

app.get('/contact', (req, res) => {
  res.render('contact')
})

app.post('/contact', (req, res) => {
  console.log(req.body)
  const { name, emailAddress, message } = req.body
  // Do something with the name, email, message

  // Send a Email here...
  res.redirect('/contact/thank-you')
})

app.get('/contact/thank-you', (req, res) => {
  res.render('contact/thank-you')
})

app.get('/products/:productId', (req, res) => {
  const { productId } = req.params
  console.log('Product ID:', productId)
})

app.use((req, res, next) => {
  console.log(`Not Found: ${req.originalUrl}`)
  return res.status(404).render('404')
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
