const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Auth, OTP } = require("../models");
const ApiError = require("../utils/ApiError");
const validator = require("validator");
const { sendVerificationEmail } = require("../utils/OtpUtils");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      return next(new ApiError("Email tidak valid", 400));
    }

    if (!email || !password) {
      return next(new ApiError("Email dan password harus diisi", 400));
    }

    const user = await Auth.findOne({
      where: {
        email,
      },
      include: ["User"],
    });

    if (!user) {
      return next(new ApiError("Email tidak terdaftar", 400));
    }

    if (!user.isEmailVerified) {
      return next(new ApiError("Email belum diverifikasi", 400));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new ApiError("Password salah", 400));
    }

    const token = jwt.sign(
      {
        id: user.userId,
        email: user.email,
        phoneNumber: user.phoneNumber,
        name: user.User.name,
        role: user.User.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    res.status(200).json({
      status: "success",
      message: "Berhasil login",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
};

const register = async (req, res, next) => {
  try {
    let { name, email, phoneNumber, password } = req.body;

    if (!name || !email || !phoneNumber || !password) {
      return next(
        new ApiError(
          "Kolom nama,email, nomor telepon,dan password harus diisi",
          400
        )
      );
    }

    email = email.toLowerCase();

    if (!validator.isEmail(email)) {
      return next(new ApiError("Email tidak valid", 400));
    }

    if (!validator.isMobilePhone(phoneNumber)) {
      return next(new ApiError("Nomor telepon tidak valid", 400));
    }

    if (`${phoneNumber}`.startsWith("0")) {
      phoneNumber = `${phoneNumber.slice(1)}`;
    }

    if (password.length < 8) {
      return next(new ApiError("Password min 8 karakter", 400));
    }

    if (password.length > 12) {
      return next(new ApiError("Password max 12 karakter", 400));
    }

    const isEmailExist = await Auth.findOne({ where: { email } });

    if (isEmailExist) {
      return next(new ApiError("Email sudah terdaftar", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      role: "user",
    });

    await Auth.create({
      email,
      phoneNumber,
      password: hashedPassword,
      userId: newUser.id,
    });

    const checkOtp = await OTP.findOne({
      where: {
        userEmail: email,
      },
    });

    if (checkOtp) {
      await OTP.destroy({
        where: {
          userEmail: email,
        },
      });
    }

    const otpCode = await sendVerificationEmail(email);

    const otp = await OTP.create({
      userEmail: email,
      otpValue: otpCode,
    });

    if (!otp) {
      return next(new ApiError("Gagal membuat OTP", 500));
    }

    res.status(200).json({
      status: "success",
      message: "OTP berhasil dikirim",
    });
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
};

const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new ApiError("Tidak ada email", 400));
    }

    if (!validator.isEmail(email)) {
      return next(new ApiError("Email tidak valid", 400));
    }

    const isEmailExist = await Auth.findOne({ where: { email } });
    if (!isEmailExist) {
      return next(new ApiError("Email tidak terdaftar", 400));
    }

    const checkOtp = await OTP.findOne({
      where: {
        userEmail: email,
      },
    });

    if (checkOtp) {
      await OTP.destroy({
        where: {
          userEmail: email,
        },
      });
    }

    const otpCode = await sendVerificationEmail(email);

    const otp = await OTP.create({
      userEmail: email,
      otpValue: otpCode,
    });

    if (!otp) {
      return next(new ApiError("Gagal membuat OTP", 500));
    }

    res.status(200).json({
      status: "success",
      message: "OTP berhasil dikirim",
    });
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { email, otpCode } = req.body;

    if (!email) {
      return next(new ApiError("Email harus diisi", 400));
    }

    const checkAuth = await Auth.findOne({
      where: {
        email,
      },
    });

    if (!checkAuth) {
      return next(new ApiError("Email tidak terdaftar", 400));
    }

    if (!otpCode) {
      return next(new ApiError("Kode OTP harus diisi", 400));
    }

    if (!validator.isNumeric(otpCode)) {
      return next(new ApiError("OTP harus berupa angka", 400));
    }

    if (otpCode.length !== 6) {
      return next(new ApiError("OTP harus 6 digit", 400));
    }

    const otp = await OTP.findOne({ where: { userEmail: email } });

    if (!otp) {
      return next(
        new ApiError(
          "OTP tidak ada OTP yang terhubung dengan email tersebut",
          400
        )
      );
    }

    if (otp.otpValue !== otpCode) {
      return next(new ApiError("OTP tidak valid", 400));
    }

    await Auth.update(
      {
        isEmailVerified: true,
      },
      {
        where: {
          email,
        },
      },
      {
        returning: true,
      }
    );

    const updatedUser = await Auth.findOne({
      where: {
        email,
      },
      include: ["User"],
    });

    await OTP.destroy({
      where: {
        userEmail: email,
      },
    });

    const token = jwt.sign(
      {
        id: updatedUser.userId,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        name: updatedUser.User.name,
        role: updatedUser.User.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.status(201).json({
      status: "success",
      message: "Berhasil registrasi",
      data: {
        token,
      },
    });
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!validator.isEmail(email)) {
      return next(new ApiError("Email tidak valid", 400));
    }

    const user = await Auth.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return next(new ApiError("Email tidak terdaftar", 400));
    }

    const checkOtp = await OTP.findOne({
      where: {
        userEmail: email,
      },
    });

    if (checkOtp) {
      await OTP.destroy({
        where: {
          userEmail: email,
        },
      });
    }

    const otpCode = await sendVerificationEmail(email);

    const otp = await OTP.create({
      userEmail: email,
      otpValue: otpCode,
    });

    if (!otp) {
      return next(new ApiError("Gagal membuat OTP", 500));
    }

    res.status(200).json({
      status: "success",
      message: "OTP berhasil dikirim",
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const verifyResetPassword = async (req, res, next) => {
  try {
    const { email, otpCode } = req.body;

    if (!validator.isEmail(email)) {
      return next(new ApiError("Email tidak valid", 400));
    }

    if (!otpCode) {
      return next(new ApiError("OTP harus diisi", 400));
    }

    const checkOtp = await OTP.findOne({
      where: {
        userEmail: email,
        otpValue: otpCode,
      },
    });

    if (!checkOtp) {
      return next(new ApiError("OTP tidak valid", 400));
    }

    res.status(200).json({
      status: "success",
      message: "OTP valid",
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;

    const user = await Auth.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return next(new ApiError("Email tidak terdaftar", 400));
    }

    if (password.length < 8) {
      return next(new ApiError("Password min 8 karakter!", 400));
    }

    if (password.length > 12) {
      return next(new ApiError("Password max 12 karakter!", 400));
    }

    if (password !== confirmPassword) {
      return next(new ApiError("Password tidak cocok!", 400));
    }

    const [countRowUpdated, [authUpdated]] = await Auth.update(
      {
        password,
      },
      {
        where: {
          email,
        },
      }
    );

    if (countRowUpdated === 0) {
      return next(new ApiError("Gagal mengganti password", 500));
    }

    res.status(200).json({
      status: "success",
      message: "Password berhasil diubah",
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const checkToken = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next(new ApiError("Gagal mendapatkan data token", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Berhasil mendapatkan data token",
      data: user,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

module.exports = {
  register,
  login,
  checkToken,
  verifyEmail,
  resendOtp,
  forgotPassword,
  verifyResetPassword,
  resetPassword,
};
