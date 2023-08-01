import User from './user.model.js'
import bcrypt from 'bcryptjs'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

export async function getUserById(id) {
  if (typeof id === 'string') {
    id = new mongoose.Types.ObjectId(id)
  }

  const user = await User.findOne({ _id: id })
  if (!user) throw createError(404, 'User is not found')
  return user
}

export async function getUserByEmail(email) {
  const user = await User.findOne({ email })
  if (!user) throw createError(404, 'User is not found')
  return user
}

// Creates a user
export async function createUser({ firstName, lastName, password, email }) {
  if (!email) throw createError(400, 'Email is required')
  if (!password) throw createError(400, 'Password is required')

  const exists = await User.findOne({ email })
  if (exists) throw createError(400, 'Email is already taken')

  const hashedPassword = await hashPassword(password)

  const user = new User({
    firstName,
    lastName,
    password: hashedPassword,
    email,
  })

  const u = await user.save()
  return u
}

async function hashPassword(password) {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

export async function deleteUser(id) {
  const deleted = await User.deleteOne({ _id: id })
  return deleted
}

// ========================
// Authentication and Authorization
// ========================
// Login functionality
export async function login(email, password) {
  const user = await getUserByEmail(email)

  const match = await bcrypt.compare(password, user.password)

  if (!match) throw createError(401, 'Password is incorrect')

  return user
}

export async function createAccessToken(user) {
  const options = {
    expiresIn: '1h',
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, options)

  return token
}

export async function decodeAccessToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded
  } catch (error) {
    throw createError(401, 'Invalid token')
  }
}
