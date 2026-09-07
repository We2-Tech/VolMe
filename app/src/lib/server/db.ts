import mongoose from 'mongoose'

// Cache the connection across hot-reloads / lambda invocations so we don't open
// a new pool on every request.
const globalForMongoose = globalThis as unknown as {
  _mongoose?: Promise<typeof mongoose>
}

export function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGO_URI
  if (!uri) throw new Error('MONGO_URI missing')

  if (!globalForMongoose._mongoose) {
    mongoose.set('strictQuery', true)
    globalForMongoose._mongoose = mongoose.connect(uri)
  }
  return globalForMongoose._mongoose
}
