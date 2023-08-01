import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest'

import { MongoMemoryServer } from 'mongodb-memory-server'
import app from '../server.js'
import mongoose from 'mongoose'

// import seed from '../seed.js'

export function setupServer() {
  // Works because if you start server without a port, the port will automatically be assigned.
  const server = app()
  const serverURL = `http://localhost:${server.address().port}`

  afterAll(async () => {
    server.close()
  })

  return serverURL
}

/**
 * Spins up a database with seed values
 * Takes about 500ms for a test when you spin this up
 */
export function setupDB({ seedDB = false } = {}) {
  let mongod

  // Connect to Mongoose
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    await mongoose.connect(uri)
  })

  if (seedDB) {
    beforeEach(async _ => {
      // await seed()
    })
  }

  // Cleans up database between each test
  afterEach(async () => {
    await clearCollections()
  })

  // Disconnect Mongoose
  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongod.stop()
  })
}

async function clearCollections() {
  const collectionList = Object.keys(mongoose.connection.collections)
  const collectionMapPromise = collectionList.map(async name => {
    const collection = mongoose.connection.collections[name]
    await collection.deleteMany()
  })

  await Promise.all(collectionMapPromise)
}
