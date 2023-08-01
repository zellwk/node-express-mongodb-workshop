import { vi } from 'vitest'

// ========================
// For Testing Express Middleware
// ========================
export function buildReq(args) {
  return {
    body: {},
    params: {},
    ...args,
  }
}

export function buildRes() {
  return {
    json: vi.fn(),
    status: vi.fn(),
  }
}

export function buildNext() {
  return vi.fn()
}
