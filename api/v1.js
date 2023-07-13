import {
  createUser,
  deleteUser,
  getUserById,
  updateUser,
} from '../src/user/user.controller.js'

import { Router } from 'express'

const router = Router()

// Generic Structure of an API:
// https://docs.google.com/document/d/1X2DhRB-MvaiscurQXVt6ycMutauOu1m-kLWFIpjTnMI/edit

// User Route
router.get('/users/:id', getUserById)
router.post('/user', createUser)
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)

export default router
