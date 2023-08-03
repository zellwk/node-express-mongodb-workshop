import { beforeEach, describe, expect, it, vi } from 'vitest'
import { buildNext, buildReq, buildRes } from '../../tests/builds/express.js'
import { createAccessToken, createUser, login } from './user.service.js'

import { authenticate } from './auth.middleware.js'
import { buildUser } from '../../tests/builds/user.js'

vi.mock('./user.service.js')

describe('Auth Middleware', _ => {
  it('Basic', async _ => {
    const user = buildUser()
    const auth = btoa(`${user.email}:${user.password}`)
    const req = buildReq({
      headers: {
        authorization: `Basic ${auth}`,
      },
    })
    const res = buildRes()
    const next = buildNext()

    login.mockResolvedValue(user) // Tested in user.service.test.js
    createAccessToken.mockResolvedValue('token')

    await authenticate(req, res, next)

    expect(login).toHaveBeenCalledOnce()
    expect(login).toHaveBeenCalledWith(user.email, user.password)
    expect(createAccessToken).toHaveBeenCalledOnce()
    expect(createAccessToken).toHaveBeenCalledWith(user)

    expect(req.locals.user).toBe(user)
    expect(req.locals.token).toBe('token')
  })
})
