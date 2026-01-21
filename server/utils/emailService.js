const nodemailer = require("nodemailer");

// Cấu hình transporter cho Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Hàm gửi email xác thực
const sendVerificationEmail = async (email, verificationToken, username) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Xác thực email tài khoản Flashcard",
    html: `
      <h2>Chào ${username},</h2>
      <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng xác thực email của bạn bằng cách click vào link dưới đây:</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
        Xác thực Email
      </a>
      <p>Hoặc copy link này: <br/> ${verificationUrl}</p>
      <p>Link này sẽ hết hạn sau 24 giờ.</p>
      <p>Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email này.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    return false;
  }
};

module.exports = { sendVerificationEmail };
