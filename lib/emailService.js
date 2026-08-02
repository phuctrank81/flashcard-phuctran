const nodemailer = require("nodemailer");

const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const emailFrom = process.env.EMAIL_FROM || emailUser;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
});

const sendVerificationEmail = async (email, verificationToken, username, verificationUrl) => {
  const finalVerificationUrl = verificationUrl || `${process.env.NEXT_PUBLIC_FRONTEND_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify-email?token=${verificationToken}`;

  if (!emailUser || !emailPassword || !emailFrom) {
    const message = "Thiếu cấu hình Gmail. Vui lòng thiết lập EMAIL_USER, EMAIL_PASSWORD và EMAIL_FROM.";
    console.error("[emailService]", message);
    return { success: false, error: message };
  }

  const mailOptions = {
    from: emailFrom,
    to: email,
    subject: "Xac thuc email tai khoan Flashcard",
    html: `
      <h2>Chao ${username},</h2>
      <p>Cam on ban da dang ky tai khoan. Vui long xac thuc email cua ban bang cach click vao link duoi day:</p>
      <a href="${finalVerificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
        Xac thuc Email
      </a>
      <p>Hoac copy link nay: <br/> ${finalVerificationUrl}</p>
      <p>Link nay se het han sau 24 gio.</p>
      <p>Neu ban khong tao tai khoan nay, vui long bo qua email nay.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi gửi email";
    console.error("[emailService] Loi gui email:", message);
    return { success: false, error: message };
  }
};

module.exports = { sendVerificationEmail };
