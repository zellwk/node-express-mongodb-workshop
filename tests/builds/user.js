import { faker } from '@faker-js/faker'

export function buildUser(args) {
  return {
    firstName: faker.person.firstName().toLowerCase(),
    lastName: faker.person.lastName().toLowerCase(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(),
  }
}
