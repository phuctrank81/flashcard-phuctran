const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendVerificationEmail = async (email, verificationToken, username) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Xac thuc email tai khoan Flashcard",
    html: `
      <h2>Chao ${username},</h2>
      <p>Cam on ban da dang ky tai khoan. Vui long xac thuc email cua ban bang cach click vao link duoi day:</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
        Xac thuc Email
      </a>
      <p>Hoac copy link nay: <br/> ${verificationUrl}</p>
      <p>Link nay se het han sau 24 gio.</p>
      <p>Neu ban khong tao tai khoan nay, vui long bo qua email nay.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Loi gui email:", error);
    return false;
  }
};

module.exports = { sendVerificationEmail };
