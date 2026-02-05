const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: {
      type: String,
      default: null
    },
    verificationTokenExpiry: {
      type: Date,
      default: null
    }
  },
  {
    collection: "account", // ✅ Tên collection trong MongoDB
    timestamps: true // ✅ Tự động thêm createdAt, updatedAt
  }
);

const getUserModel = (conn) => {
  if (!conn) {
    return mongoose.models.account || mongoose.model("account", userSchema);
  }

  return conn.models.account || conn.model("account", userSchema);
};

module.exports = {
  getUserModel,
  userSchema
};
