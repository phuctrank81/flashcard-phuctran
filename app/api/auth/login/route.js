const { NextResponse } = require("next/server");
const bcrypt = require("bcryptjs");
const connectDB = require("../../../../lib/mongodb");
const { getUserModel } = require("../../../../lib/models/user");

const jsonResponse = (data, init = {}) =>
  NextResponse.json(data, init);

const errorResponse = (message, status = 500, error) =>
  jsonResponse(
    { message, ...(error ? { error } : {}) },
    { status }
  );

exports.POST = async (request) => {
  try {
    const db = await connectDB(process.env.MONGODB_URI, "users");
    const User = getUserModel(db);
    console.log("[auth.login] db:", db.name, "collection:", User.collection.name);
    const { email, password } = await request.json();

    if (!email || !password) {
      return errorResponse("Thiếu email hoặc mật khẩu", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse("Sai email hoặc mật khẩu", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse("Sai email hoặc mật khẩu", 401);
    }

    return jsonResponse({
      message: "Đăng nhập thành công",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return errorResponse("Lỗi server", 500, error.message);
  }
};
