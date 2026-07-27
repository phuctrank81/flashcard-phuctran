const { NextResponse } = require("next/server");
const connectDB = require("./mongodb");
const { getUserModel } = require("./models/user");

const jsonResponse = (data, init = {}) => NextResponse.json(data, init);

const getHeaderEmail = (request) => {
  const email = request.headers.get("x-admin-email");
  return email ? email.trim().toLowerCase() : "";
};

const requireAdmin = async (request) => {
  const adminEmail = getHeaderEmail(request);
  if (!adminEmail) {
    return {
      ok: false,
      response: jsonResponse({ message: "Missing admin identity" }, { status: 401 }),
    };
  }

  const db = await connectDB(process.env.MONGODB_URI, "users");
  const User = getUserModel(db);
  const user = await User.findOne({ email: adminEmail }, { projection: { email: 1, role: 1 } });

  if (!user || user.role !== "admin") {
    return {
      ok: false,
      response: jsonResponse({ message: "Admin permission required" }, { status: 403 }),
    };
  }

  return { ok: true, user };
};

module.exports = {
  requireAdmin,
};
