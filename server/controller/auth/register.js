const User = require("../../model/user");
const bcrypt = require("bcryptjs");

module.exports = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Validate
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Thiếu thông tin" });
    }

    // 2. Check email tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email đã tồn tại" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Tạo user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
