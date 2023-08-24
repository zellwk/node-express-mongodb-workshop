import User from './user.model.js'
import bcrypt from 'bcryptjs'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

function getMongooseID(id) {
  try {
    return new mongoose.Types.ObjectId(id)
  } catch (e) {
    throw createError(400, 'Invalid ID')
  }
}

export async function getUserById(id) {
  if (typeof id === 'string') id = getMongooseID(id)

  const user = await User.findOne({ _id: id })
  if (!user) throw createError(404, 'User is not found')
  return user
}

export async function getUserByEmail(email) {
  const user = await User.findOne({ email })
  if (!user) throw createError(404, 'User is not found')
  return user
}

export async function getUserByPasswordResetToken(token) {
  const user = await User.findOne({ passwordResetToken: token })
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
  await verifyPassword(password, user.password)

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

// ========================
// Password Functionality
// ========================
async function verifyPassword(password, hashedPassword) {
  const match = await bcrypt.compare(password, hashedPassword)
  if (!match) throw createError(401, 'Password is incorrect')
  return match
}

export async function changePassword({
  user,
  currentPassword,
  newPassword,
  confirmPassword,
}) {
  if (!currentPassword) {
    throw createError(400, 'Current password is required')
  }

  if (currentPassword !== user.password) {
    await verifyPassword(currentPassword, user.password)
  }

  if (!newPassword) {
    throw createError(400, 'New password is required')
  }

  if (!confirmPassword) {
    throw createError(400, 'Password confirmation is required')
  }

  if (currentPassword === newPassword) {
    throw createError(
      400,
      'New password must be different from the current password.'
    )
  }

  if (newPassword !== confirmPassword) {
    throw createError(
      400,
      'New password and password confirmation do not match.'
    )
  }

  const hashedPassword = await hashPassword(newPassword)
  user.password = hashedPassword

  const updated = await user.save()

  return updated
}

// ========================
// Reset Password Functionality
// ========================
// We just want to send out an email message here
export async function createResetPasswordToken(email) {
  const user = await getUserByEmail(email)

  const options = { expiresIn: '24h' }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, options)
  user.passwordResetToken = token

  return user.save()
}

export async function verifyToken(token) {
  const decoded = await decodeAccessToken(token)
  const { id, exp } = decoded

  // Not expired yet
  if (exp * 1000 > Date.now()) {
    const user = await getUserById(id)
    return user
  }

  throw createError(401, 'Token is expired')
}
