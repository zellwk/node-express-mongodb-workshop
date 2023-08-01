import { expect, it } from 'vitest'

it('Give in a test suite name', _ => {
  const total = sum(1, 2)
  expect(total).toBe(3)
})

function sum(num1, num2) {
  return num1 + num2
}
