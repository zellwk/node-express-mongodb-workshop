import { vi } from 'vitest'

// ========================
// For Testing Express Middleware
// ========================
export function buildReq(args) {
  return {
    body: {},
    params: {},
    headers: {},
    locals: {},
    ...args,
  }
}

export function buildRes() {
  return {
    json: vi.fn(),
    status: vi.fn(),
    render: vi.fn(),
  }
}

export function buildNext() {
  return vi.fn()
}
