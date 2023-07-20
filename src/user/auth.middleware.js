import {
  createAccessToken,
  decodeAccessToken,
  getUserById,
  login,
} from './user.service.js'

import createError from 'http-errors'

export async function authenticate(req, res, next) {
  const { authorization } = req.headers
  if (!authorization) throw createError(401, 'User is unauthorizated')

  const type = authorization.split(' ')[0]

  if (type === 'Basic') {
    const encoded = authorization.split(' ')[1]
    const decoded = atob(encoded)
    const [email, password] = decoded.split(':')

    const user = await login(email, password)
    const token = await createAccessToken(user)

    req.locals.user = user
    req.locals.token = token
  }

  if (type === 'Bearer') {
    const token = authorization.split(' ')[1]
    const decoded = await decodeAccessToken(token)

    const { id } = decoded
    const user = await getUserById(id)

    req.locals.user = user
    req.locals.token = token
  }

  next()
}

// Basic Authentication
// Authorization Header
function atob(base64) {
  return Buffer.from(base64, 'base64').toString('binary')
}
