const { NextResponse } = require("next/server");
const connectDB = require("../../../../lib/mongodb");
const User = require("../../../../server/model/user");

const jsonResponse = (data, init = {}) =>
  NextResponse.json(data, init);

const errorResponse = (message, status = 500, error) =>
  jsonResponse(
    { message, ...(error ? { error } : {}) },
    { status }
  );

exports.POST = async (request) => {
  try {
    await connectDB(process.env.MONGODB_URI);
    const { token } = await request.json();

    if (!token) {
      return errorResponse("Token xác thực không hợp lệ", 400);
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return errorResponse(
        "Token xác thực không hợp lệ hoặc đã hết hạn",
        400
      );
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();

    return jsonResponse({
      message: "Email đã được xác thực thành công!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    return errorResponse("Lỗi server khi xác thực email", 500, error.message);
  }
};
