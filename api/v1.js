import { Router } from 'express'

const router = Router()

// GET /api/v1
router.get('/', (req, res) => {
  console.log('test v1')
})

// GET /api/v1/test
router.post('/login', (req, res) => {
  res.json({ message: 'Hello' })
})

export default router
