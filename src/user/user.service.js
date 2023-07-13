import User from './user.model.js'
import createError from 'http-errors'
import mongoose from 'mongoose'

export async function getUserById(id) {
  if (typeof id === 'string') {
    id = new mongoose.Types.ObjectId(id)
  }

  const user = await User.findOne({ _id: id })
  if (!user) throw createError(404, 'User is not found')
  return user
}

export async function createUser({ firstName, lastName, email }) {
  const user = await User.create({ firstName, lastName, email })
  const u = await user.save()
  return u
}

export async function deleteUser(id) {
  const deleted = await User.deleteOne({ _id: id })
  return deleted
}
