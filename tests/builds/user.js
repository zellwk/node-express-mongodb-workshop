import { faker } from '@faker-js/faker'

export function buildUser(args) {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }
}
