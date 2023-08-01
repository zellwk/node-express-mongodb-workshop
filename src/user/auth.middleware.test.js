import { buildNext, buildReq, buildRes } from '../../tests/builds/express.js'
import { describe, expect, it } from 'vitest'

import { authenticate } from './auth.middleware.js'
import { buildUser } from '../../tests/builds/user.js'
import { createUser } from './user.service.js'

describe('Auth Middleware', _ => {
  it('Basic', _ => {
    const user = buildUser()
  })

  it('Token', _ => {})
})
