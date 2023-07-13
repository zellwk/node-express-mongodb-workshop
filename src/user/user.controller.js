import * as userService from './user.service.js'

export async function getUserById(req, res) {
  const { id } = req.params
  const user = await userService.getUserById(id)
  return res.json(user)
}

export async function createUser(req, res) {
  const { firstName, lastName, email } = req.body
  const user = await userService.createUser({ firstName, lastName, email })

  return res.json(user)
}

export async function updateUser(req, res) {
  const { id } = req.params
  const user = await userService.getUserById(id)

  // Update the user
  const { firstName, lastName, email } = req.body
  user.firstName = firstName || user.firstName
  user.lastName = lastName || user.lastName
  user.email = email || user.email

  const u = await user.save()

  return res.json(u)
}

export async function deleteUser(req, res) {
  const { id } = req.params
  const user = await userService.deleteUser(id)

  return res.json({ message: 'User deleted', user })
}
