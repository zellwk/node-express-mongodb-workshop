import {
  createUser,
  deleteUser,
  getUserById,
  login,
  updateUser,
} from '../src/user/user.controller.js'

import { Router } from 'express'
import { authenticate } from '../src/user/auth.middleware.js'

const router = Router()

// Generic Structure of an API:
// https://docs.google.com/document/d/1X2DhRB-MvaiscurQXVt6ycMutauOu1m-kLWFIpjTnMI/edit

// User Route
router.get('/users/:id', getUserById)
router.post('/user', createUser)
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)

router.post('/login', authenticate, login)

export default router
