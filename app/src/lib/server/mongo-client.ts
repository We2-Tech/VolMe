import { MongoClient } from 'mongodb'

/**
 * A raw MongoClient for the Auth.js MongoDB adapter.
 *
 * This is deliberately **not** shared with Mongoose. The two depend on different
 * major versions of the driver — `@auth/mongodb-adapter` on `mongodb@6`, Mongoose 9
 * on `mongodb@7` — so `mongoose.connection.getClient()` returns a client of the
 * wrong type for the adapter. Two pools against the same database is the cheap,
 * correct answer; unifying them means waiting for the adapter to move to driver 7.
 *
 * Cached on `globalThis` for the same reason `connectDB()` is: Next's dev server
 * re-evaluates modules on hot reload, and a fresh pool per reload exhausts
 * connections.
 */
const globalForMongo = globalThis as unknown as {
  _authMongoClient?: Promise<MongoClient>
}

export function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGO_URI
  if (!uri) throw new Error('MONGO_URI missing')

  if (!globalForMongo._authMongoClient) {
    globalForMongo._authMongoClient = new MongoClient(uri).connect()
  }
  return globalForMongo._authMongoClient
}
