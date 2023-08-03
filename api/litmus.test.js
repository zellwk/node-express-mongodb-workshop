import { expect, it } from 'vitest'
import { setupDB, setupServer } from '../tests/setup.js'

import zlFetch from 'zl-fetch'

setupDB()
const url = setupServer()

it('Litmus', async _ => {
  const response = await zlFetch(url + '/api/v1/litmus')

  expect(response.status).toBe(200)
  expect(response.body.message).toBe('hello world')
})
