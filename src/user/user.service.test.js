import 'dotenv/config'

import {
  changePassword,
  createResetPasswordToken,
  createUser,
  decodePasswordResetToken,
  login,
} from './user.service.js'
import { describe, expect, it } from 'vitest'

import User from './user.model.js'
import { buildUser } from '../../tests/builds/user.js'
import { setupDB } from '../../tests/setup'

setupDB()

describe('Create User', _ => {
  it('Create First User', async _ => {
    const user = buildUser()

    const returnedUser = await createUser(user)

    // Whether the user is created and placed into the database
    // Whether the user has the fields we need them to have?
    const allUsers = await User.find({})
    const foundUser = await User.findOne({ email: user.email })

    expect(foundUser.firstName).toBe(user.firstName)
    expect(foundUser.lastName).toBe(user.lastName)
    expect(foundUser.email).toBe(user.email.toLowerCase())
    expect(foundUser.password).not.toBe(user.password)

    // Whether the user is returned
    expect(returnedUser.firstName).toBe(user.firstName)
    expect(returnedUser.lastName).toBe(user.lastName)
    expect(returnedUser.email).toBe(user.email.toLowerCase())
    expect(returnedUser.password).not.toBe(user.password)
  })

  it('Duplicated User — should error', async _ => {
    const user = buildUser()

    try {
      await createUser(user)
      await createUser(user)
    } catch (error) {
      expect(error.message).toBe('Email is already taken')
    }
  })

  it('Create Second User', async _ => {
    const user = buildUser()
    const user2 = buildUser()

    await createUser(user)
    const returnedUser = await createUser(user2)

    // Whether the user is created and placed into the database
    // Whether the user has the fields we need them to have?
    const allUsers = await User.find({})
    const foundUser = await User.findOne({ email: user2.email })

    expect(foundUser.firstName).toBe(user2.firstName)
    expect(foundUser.lastName).toBe(user2.lastName)
    expect(foundUser.email).toBe(user2.email.toLowerCase())
    expect(foundUser.password).not.toBe(user2.password)

    // Whether the user is returned
    expect(returnedUser.firstName).toBe(user2.firstName)
    expect(returnedUser.lastName).toBe(user2.lastName)
    expect(returnedUser.email).toBe(user2.email.toLowerCase())
    expect(returnedUser.password).not.toBe(user2.password)
  })
})

describe('Login', _ => {
  it('No such user', async _ => {
    const user = buildUser()

    try {
      const returnedUser = await login(user.email, user.password)
    } catch (error) {
      expect(error.message).toBe('User is not found')
    }
  })

  it('Right username, right password', async _ => {
    const user = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'password',
    }

    await createUser(user)

    const returnedUser = await login(user.email, user.password)
    expect(returnedUser.firstName).toBe(user.firstName)
    expect(returnedUser.lastName).toBe(user.lastName)
    expect(returnedUser.email).toBe(user.email)
  })

  it('Right username, wrong password', async _ => {
    const user = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'password',
    }

    await createUser(user)

    try {
      const returnedUser = await login(user.email, 'wrongpassword')
    } catch (error) {
      expect(error.message).toBe('Password is incorrect')
    }
  })
})

describe('Change Password', _ => {
  it('Old password is wrong', async _ => {
    const u = buildUser()
    const user = await createUser(u)

    try {
      await changePassword({
        user,
        currentPassword: 'wrongpassword',
      })
    } catch (error) {
      expect(error.message).toBe('Password is incorrect')
    }
  })

  it('Change password successfully', async _ => {
    const u = buildUser()
    const user = await createUser(u)
    const oldPassword = user.password

    const updatedUser = await changePassword({
      user,
      currentPassword: u.password,
      newPassword: 'newpassword',
      confirmPassword: 'newpassword',
    })

    const foundUser = await User.findOne({ email: user.email })

    expect(foundUser.password).not.toBe(oldPassword)
    expect(foundUser.password).toEqual(updatedUser.password)
  })
})

describe('Reset Password', _ => {
  // If they're not in the database, return an error message
  it('No such user', async _ => {
    const user = buildUser()

    try {
      await createResetPasswordToken(user.email)
    } catch (error) {
      expect(error.message).toBe('User is not found')
    }
  })

  it('creates password reset token', async _ => {
    const u = buildUser()
    await createUser(u)

    const user = await createResetPasswordToken(u.email)
    expect(user.passwordResetToken).toBeDefined()
  })
})
