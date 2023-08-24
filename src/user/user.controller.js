import * as userService from './user.service.js'

export async function getUserById(req, res) {
  const { id } = req.params
  const user = await userService.getUserById(id)
  return res.json(user)
}

export async function createUser(req, res) {
  const { firstName, lastName, password, email } = req.body
  const user = await userService.createUser({
    firstName,
    lastName,
    password,
    email,
  })

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

export async function login(req, res) {
  const { user, token } = req.locals

  return res.json({ user, token })
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword, confirmPassword, email } = req.body

  const user = await userService.getUserByEmail(email)
  const updated = await userService.changePassword({
    currentPassword,
    newPassword,
    confirmPassword,
    user,
  })

  res.json(user)
}

export async function beginResetPassword(req, res) {
  const { email } = req.body

  const user = await userService.createResetPasswordToken(email)
  // Send out an email to the user with the link to reset the password
  res.json({ user })
}

export async function resetPassword(req, res) {
  const { newPassword, confirmPassword, passwordResetToken } = req.body

  const user = await userService.getUserByPasswordResetToken(passwordResetToken)

  // I didn't check whether this line works yet...
  const decoded = await userService.verifyToken(passwordResetToken)

  // This works...
  const updated = await userService.changePassword({
    user,
    currentPassword: user.password,
    newPassword,
    confirmPassword,
  })

  // Remove password reset token from user

  res.json(ready)
}
