const { NextResponse } = require("next/server");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const connectDB = require("../../../../lib/mongodb");
const { getUserModel } = require("../../../../server/model/user");
const { sendVerificationEmail } = require("../../../../server/utils/emailService");

const jsonResponse = (data, init = {}) =>
  NextResponse.json(data, init);

const errorResponse = (message, status = 500, error) =>
  jsonResponse(
    { message, ...(error ? { error } : {}) },
    { status }
  );

exports.POST = async (request) => {
  try {
    const db = await connectDB(process.env.MONGODB_URI);
    const User = getUserModel(db);
    console.log("[auth.register] db:", db.name, "collection:", User.collection.name);
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return errorResponse("Thiếu thông tin", 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse("Email không hợp lệ", 400);
    }

    if (password.length < 6) {
      return errorResponse("Mật khẩu phải có ít nhất 6 ký tự", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse("Email đã tồn tại", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpiry,
    });

    const emailSent = await sendVerificationEmail(email, verificationToken, username);

    return jsonResponse(
      {
        message:
          "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản",
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          isVerified: newUser.isVerified,
        },
        emailSent,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse("Email đã tồn tại", 400);
    }

    return errorResponse("Lỗi server khi đăng ký", 500, error.message);
  }
};
