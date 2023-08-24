import 'dotenv/config'

import { describe, expect, it } from 'vitest'
import { setupDB, setupServer } from '../tests/setup.js'
import zlFetch, { createZlFetch } from 'zl-fetch'

import { buildUser } from '../tests/builds/user.js'

setupDB()
const url = setupServer()
const api = createZlFetch(`${url}/api/v1/`, { returnError: true, debug: true })

it('Create and GET User', async _ => {
  // Creating a user
  const user = buildUser()
  const { response, error } = await api.post(`/user`, { body: user })

  const { body } = response
  expect(body.firstName).toBe(user.firstName)
  expect(body.lastName).toBe(user.lastName)
  expect(body.email).toBe(user.email)
  expect(body.password).toBe(undefined)
  expect(body._id).toBeTruthy()

  // GET the user
  const id = body._id
  const { response: response1, error: error2 } = await api(`users/${id}`)

  const foundUser = response1.body
  expect(foundUser.firstName).toBe(user.firstName)
  expect(foundUser.lastName).toBe(user.lastName)
  expect(foundUser.email).toBe(user.email)
  expect(foundUser.password).toBe(undefined)
  expect(foundUser._id).toBeTruthy()
})

it(`User doesn't exist`, async _ => {
  const { response, error, debug } = await api(`users/${123123}`)

  expect(response).toBe(null)
  expect(error).toBeTruthy()

  const { status, body } = error
  expect(status).toBe(400)
  expect(body.message).toMatch(/Invalid ID/)
  expect(body.message).toMatchInlineSnapshot('"Invalid ID"')
})

it('Password Reset Flow', async _ => {
  // Setup for the test
  const u = buildUser()
  await api.post(`/user`, { body: u })

  // Begin the testing process
  const { response } = await api.post('/reset-password', {
    body: { email: u.email },
  })

  // ONE MORE STEP: Mock the email service
  const resetToken = response.body.user.passwordResetToken

  const { response: response2, error: error2 } = await api.post(
    'reset-password/change',
    {
      body: {
        newPassword: 'newPassword',
        confirmPassword: 'newPassword',
        passwordResetToken: resetToken,
      },
    }
  )

  // Be able to login with the new password
  const r3 = await api.post('/login', {
    auth: { username: u.email, password: 'newPassword' },
  })

  const loggedInUser = r3.response.body.user
  expect(loggedInUser.firstName).toBeTruthy()
})
