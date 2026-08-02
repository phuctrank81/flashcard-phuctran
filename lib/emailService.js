const nodemailer = require("nodemailer");

const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;
  const emailFrom = process.env.EMAIL_FROM || emailUser;
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465;

  return {
    emailUser,
    emailPassword,
    emailFrom,
    transporter: nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      requireTLS: true,
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    }),
  };
};

const sendVerificationEmail = async (email, verificationToken, username, verificationUrl) => {
  const finalVerificationUrl = verificationUrl || `${process.env.NEXT_PUBLIC_FRONTEND_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify-email?token=${verificationToken}`;

  const { emailUser, emailPassword, emailFrom, transporter } = createTransporter();

  if (!emailUser || !emailPassword || !emailFrom) {
    const message = "Thiếu cấu hình Gmail. Vui lòng thiết lập EMAIL_USER, EMAIL_PASSWORD và EMAIL_FROM.";
    console.error("[emailService]", message);
    return { success: false, error: message };
  }

  const mailOptions = {
    from: `"Flashcard" <${emailFrom}>`,
    to: email,
    subject: "Xác thực email tài khoản Flashcard",
    html: `
      <h2>Chào ${username},</h2>
      <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng xác thực email bằng cách bấm vào nút dưới đây:</p>
      <a href="${finalVerificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 12px 0;">
        Xác thực Email
      </a>
      <p>Hoặc copy link này vào trình duyệt: <br/> ${finalVerificationUrl}</p>
      <p>Link này sẽ hết hạn sau 24 giờ.</p>
      <p>Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email này.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi gửi email";
    console.error("[emailService] Lỗi gửi email:", message);

    if (message.includes("Invalid login") || message.includes("Authentication failed")) {
      return {
        success: false,
        error: "Đăng nhập Gmail thất bại. Hãy dùng App Password cho tài khoản Gmail của bạn.",
      };
    }

    return { success: false, error: message };
  }
};

module.exports = { sendVerificationEmail };
