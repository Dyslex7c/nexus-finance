import mongoose from "mongoose"

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
  var mongoose: { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null }
}

let cached = global.mongoose || (global.mongoose = { conn: null, promise: null })

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = { bufferCommands: false }

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((m) => m.connection) // Ensure we store mongoose.Connection
  }

  cached.conn = await cached.promise
  return cached.conn
}
