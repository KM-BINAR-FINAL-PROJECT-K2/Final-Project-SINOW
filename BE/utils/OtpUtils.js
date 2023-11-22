const randomString = require("randomstring");
const nodemailer = require("nodemailer");
const ApiError = require("../utils/ApiError");

const sendVerificationEmail = async (email) => {
  try {
    const otpCode = generateOtp();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: {
        name: "SiNow",
        address: process.env.EMAIL,
      },
      to: email,
      subject: "SiNow - Verifikasi OTP",
      text: `Verifikasi OTP anda adalah: ${otpCode}`,
    };

    const sendMail = async (transporter, mailOptions) => {
      try {
        await transporter.sendMail(mailOptions);
      } catch (error) {
        return next(new ApiError("Gagal mengirim email", 500));
      }
    };

    await sendMail(transporter, mailOptions);

    return otpCode;
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

const generateOtp = () => {
  return randomString.generate({
    length: 6,
    charset: "numeric",
  });
};

module.exports = {
  sendVerificationEmail,
};
