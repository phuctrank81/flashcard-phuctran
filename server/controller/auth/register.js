const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { getUserModel } = require("../../model/user");
const { sendVerificationEmail } = require("../../utils/emailService");

module.exports = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Thiếu thông tin" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email không hợp lệ" });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
    }

    // Check existing user
    const db = mongoose.connection.useDb("users", { useCache: true });
    const User = getUserModel(db);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 giờ

    // Create user với trạng thái chưa xác thực
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpiry,
    });

    // Gửi email xác thực
    const emailSent = await sendVerificationEmail(email, verificationToken, username);

    // Return success
    res.status(201).json({
      message: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isVerified: newUser.isVerified,
      },
      emailSent,
    });

  } catch (error) {
    console.error("❌ Register error:", error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    res.status(500).json({ 
      message: "Lỗi server khi đăng ký",
      error: error.message 
    });
  }
};
