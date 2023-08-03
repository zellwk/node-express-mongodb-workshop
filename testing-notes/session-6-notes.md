## Testing Frameworks

1. Vitest
2. Jest

Mocha, Jasmine, AVA, etc etc.

## Vitest

Vitest picks up on any file that has `.test` or `.spec` in the name.

## Testing Methodologies

- TDD — Testing Driven Development — doesn't work
- Test what you may be worried about.

## How to test, what to test

- API — End to end test, test the results that comes back
- Controllers — Don't need to test this. Because we can test this with APIs.
- Services — test the function and the database at the same time
- Middlewares — if you have any middlewares
