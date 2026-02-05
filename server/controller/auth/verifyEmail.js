const mongoose = require("mongoose");
const { getUserModel } = require("../../model/user");

module.exports = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token xác thực không hợp lệ" });
    }

    // Tìm user với token này
    const db = mongoose.connection.useDb("users", { useCache: true });
    const User = getUserModel(db);
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() }, // Token chưa hết hạn
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Token xác thực không hợp lệ hoặc đã hết hạn" 
      });
    }

    // Cập nhật user: xác thực và xóa token
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();

    res.status(200).json({
      message: "Email đã được xác thực thành công!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("❌ Verify email error:", error);
    res.status(500).json({ 
      message: "Lỗi server khi xác thực email",
      error: error.message 
    });
  }
};
