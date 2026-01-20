const bcrypt = require("bcryptjs");
const User = require("../../model/user");
const connectDB = require("@/server/connectdb");

module.exports = async (req, res) => {
  await connectDB();

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Thiếu thông tin" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email đã tồn tại" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    message: "Đăng ký thành công",
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    },
  });
};
