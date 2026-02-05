const mongoose = require("mongoose");

let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = {};
}

const connectDB = async (uri = process.env.MONGODB_URI, dbName) => {
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  if (cached[uri]?.conn) return cached[uri].conn;

  if (!cached[uri]?.promise) {
    cached[uri] = {
      conn: null,
      promise: mongoose.connect(uri).then((mongooseInstance) => mongooseInstance.connection),
    };
  }

  cached[uri].conn = await cached[uri].promise;

  if (!dbName) return cached[uri].conn;

  return cached[uri].conn.useDb(dbName, { useCache: true });
};

module.exports = connectDB;
