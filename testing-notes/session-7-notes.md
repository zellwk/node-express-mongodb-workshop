## Mock Functions

What a mock does is it substitutes the function that we want to mock, with another function.

Example: Code has `functionA`, but we don't have to test what is in `functionB`. So we can mock `functionA`.

When mocking:

- We just want to make sure main function work and we don't care about the sub function that we are mocking.
- We just want to make sure the function gets called.
- We just want to call the function and make it return some value.

## Testing an API

When we are testing an API, we are interested in the End-to-End functionality of the API.

Basically this means:

1. I give it an input
2. It should work
   1. It should give me the exact output that it should give me.
   2. The values should be populated into the database.
