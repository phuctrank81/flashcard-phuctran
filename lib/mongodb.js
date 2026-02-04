const mongoose = require("mongoose");

let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = {};
}

const connectDB = async (uri) => {
  if (!uri) {
    throw new Error("Missing MongoDB connection string");
  }

  if (cached[uri]?.conn) return cached[uri].conn;

  if (!cached[uri]?.promise) {
    cached[uri] = {
      conn: null,
      promise: mongoose.connect(uri).then((mongooseInstance) => mongooseInstance),
    };
  }

  cached[uri].conn = await cached[uri].promise;
  return cached[uri].conn;
};

module.exports = connectDB;
