const { MongoClient } = require("mongodb");

let cached = global._mongoClient;

if (!cached) {
  cached = global._mongoClient = {};
}

const connectDB = async (uri = process.env.MONGODB_URI, dbName) => {
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  if (cached[uri]?.db) return cached[uri].db;

  if (!cached[uri]?.promise) {
    const client = new MongoClient(uri);
    cached[uri] = {
      client,
      db: null,
      promise: client.connect().then(() => client.db(dbName || undefined)),
    };
  }

  cached[uri].db = await cached[uri].promise;
  return cached[uri].db;
};

module.exports = connectDB;
