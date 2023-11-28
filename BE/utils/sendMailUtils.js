const randomString = require("randomstring");
const nodemailer = require("nodemailer");
const ApiError = require("./ApiError");
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const generateOTP = () =>
  randomString.generate({ length: 6, charset: "numeric" });

const sendMail = async (mailOptions, next) => {
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

const sendOTPVerificationEmail = async (email, next) => {
  try {
    const otpCode = generateOTP();

    const mailOptions = {
      from: { name: "SiNow", address: process.env.APP_EMAIL },
      to: email,
      subject: "SiNow - Verifikasi OTP",
      text: `Kode verifikasi OTP Anda adalah:\n${otpCode}\n\nGunakan kode ini untuk verifikasi akun Anda. Jangan berikan kode ini kepada siapa pun.\n\nTerima kasih,\nSiNow Team`,
    };

    await sendMail(mailOptions, next);

    return otpCode;
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

const sendResetPasswordEmail = async (auth, next) => {
  try {
    const generateToken = jwt.sign(
      { id: auth.id, email: auth.email },
      process.env.JWT_SECRET,
      { expiresIn: 1800 }
    );

    const mailOptions = {
      from: { name: process.env.APP_NAME, address: process.env.EMAIL },
      to: auth.email,
      subject: "SiNow - Reset Password",
      html: `<p>Dear ${auth.User.name},</p>
      <p>Kami menerima permintaan untuk mereset kata sandi akun SiNow Anda. Silakan klik tautan berikut:</p>
      <p><a href="http://${process.env.CLIENT_URL}/reset-password/${generateToken}">Reset Password</a></p>
      <p>Jika Anda tidak membuat permintaan ini, harap abaikan email ini.</p>
      <p>Terima kasih,</br>SiNow Team</p>`,
    };

    await sendMail(mailOptions, next);
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

module.exports = { sendOTPVerificationEmail, sendResetPasswordEmail };
