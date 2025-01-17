const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const {
  User, Auth, OTP, sequelize,
} = require('../models')
const ApiError = require('../utils/ApiError')
const { createNotification } = require('../utils/notificationUtils')
const { createToken } = require('../utils/jwtUtils')
const {
  sendOTPVerificationEmail,
  sendResetPasswordEmail,
} = require('../utils/sendMailUtils')

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return next(new ApiError('Email dan password harus diisi', 400))
    }

    if (!validator.isEmail(email)) {
      return next(new ApiError('Email tidak valid', 400))
    }

    const user = await Auth.findOne({
      where: {
        email,
      },
      include: ['User'],
    })

    if (!user) {
      return next(new ApiError('Email tidak terdaftar', 400))
    }

    if (!user.isEmailVerified) {
      return next(new ApiError('Email belum diverifikasi', 400))
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return next(new ApiError('Password salah', 400))
    }

    const token = createToken({
      id: user.userId,
      name: user.User.name,
      role: user.User.role,
    })

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil login',
      data: {
        token,
      },
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const register = async (req, res, next) => {
  try {
    let { email, phoneNumber } = req.body

    const { name, password } = req.body

    if (!name || !email || !phoneNumber || !password) {
      return next(
        new ApiError(
          'Kolom nama,email, nomor telepon,dan password harus diisi',
          400,
        ),
      )
    }

    email = email.toLowerCase()

    if (!validator.isEmail(email)) {
      return next(new ApiError('Email tidak valid', 400))
    }

    if (!validator.isMobilePhone(phoneNumber)) {
      return next(new ApiError('Nomor telepon tidak valid', 400))
    }

    if (`${phoneNumber}`.startsWith('0')) {
      phoneNumber = `+62${phoneNumber.slice(1)}`
    }

    if (!`${phoneNumber}`.startsWith('+')) {
      phoneNumber = `+62${phoneNumber}`
    }
    if (password.length < 8) {
      return next(new ApiError('Password min 8 karakter', 400))
    }

    if (password.length > 12) {
      return next(new ApiError('Password max 12 karakter', 400))
    }

    const isEmailExist = await Auth.findOne({ where: { email } })

    if (isEmailExist) {
      if (isEmailExist.isEmailVerified) {
        return next(new ApiError('Email sudah terdaftar', 400))
      }

      if (!isEmailExist.isEmailVerified) {
        await isEmailExist.destroy()
      }
    }

    const isPhoneNumberExist = await Auth.findOne({
      where: { phoneNumber },
    })

    if (isPhoneNumberExist) {
      if (isPhoneNumberExist.isEmailVerified) {
        return next(new ApiError('Nomor telepon sudah terdaftar', 400))
      }
      if (!isPhoneNumberExist.isEmailVerified) {
        await isPhoneNumberExist.destroy()
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      name,
      role: 'user',
    })

    const otpCode = await sendOTPVerificationEmail(email, next)

    const checkOtp = await OTP.findOne({
      where: {
        userEmail: email,
      },
    })

    if (checkOtp) {
      await OTP.destroy({
        where: {
          userEmail: email,
        },
      })
    }

    await OTP.create({
      userEmail: email,
      otpValue: otpCode,
    })

    await Auth.create({
      email,
      phoneNumber,
      password: hashedPassword,
      userId: newUser.id,
    })

    return res.status(201).json({
      status: 'Success',
      message:
        'Registrasi berhasil & OTP berhasil dikirim ke email anda, silahkan verifikasi OTP sebelum login',
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body

    if (!email) {
      return next(new ApiError('Email harus diisi', 400))
    }

    if (!validator.isEmail(email)) {
      return next(new ApiError('Email tidak valid', 400))
    }

    const isEmailExist = await Auth.findOne({ where: { email } })
    if (!isEmailExist) {
      return next(new ApiError('Email tidak terdaftar', 400))
    }

    if (isEmailExist.isEmailVerified) {
      return next(
        new ApiError(
          'Email sudah diverifikasi, tidak memerlukan autentikasi OTP',
          400,
        ),
      )
    }

    const checkOtp = await OTP.findOne({
      where: {
        userEmail: email,
      },
    })

    if (checkOtp) {
      await OTP.destroy({
        where: {
          userEmail: email,
        },
      })
    }

    const otpCode = await sendOTPVerificationEmail(email, next)

    await OTP.create({
      userEmail: email,
      otpValue: otpCode,
    })

    return res.status(200).json({
      status: 'Success',
      message: 'Kode OTP berhasil dikirim ulang ke email',
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const verifyEmail = async (req, res, next) => {
  try {
    const { email, otpCode } = req.body

    if (!email || !otpCode) {
      return next(new ApiError('Email dan kode OTP harus diisi', 400))
    }

    if (!validator.isEmail(email)) {
      return next(new ApiError('Email tidak valid', 400))
    }

    if (!validator.isNumeric(otpCode) || otpCode.length !== 6) {
      return next(
        new ApiError('Kode OTP harus terdiri dari 6 digit numerik', 400),
      )
    }

    const checkAuth = await Auth.findOne({
      where: {
        email,
      },
    })

    if (!checkAuth) {
      return next(new ApiError('Email tidak terdaftar', 400))
    }

    if (checkAuth.isEmailVerified) {
      return next(new ApiError('Email sudah diverifikasi', 400))
    }

    const otp = await OTP.findOne({ where: { userEmail: email } })

    if (otp.otpValue !== otpCode) {
      return next(new ApiError('OTP tidak valid', 400))
    }

    let updatedAuth

    await sequelize.transaction(async (t) => {
      await Auth.update(
        {
          isEmailVerified: true,
        },
        {
          where: {
            email,
          },
          transaction: t,
        },
      )

      updatedAuth = await Auth.findOne({
        where: {
          email,
        },
        include: ['User'],
      })

      await createNotification(
        'Notifikasi',
        'Yeay! Akun mu berhasil dibuat',
        updatedAuth.userId,
        `Selamat Bergabung di SINOW!\n\nKami dengan senang hati menyambut Anda di SINOW, tempat terbaik untuk belajar melalui kursus daring. Sekarang Anda memiliki akses penuh ke ribuan kursus berkualitas dari berbagai bidang IT.\n\nDengan SINOW, belajar menjadi lebih fleksibel dan mudah. Temukan kursus yang sesuai dengan minat dan tujuan karir Anda, ikuti perkembangan terbaru dalam industri IT, dan tingkatkan keterampilan Anda dengan materi pembelajaran terkini.\n\nJangan lewatkan kesempatan untuk:\n\n📚 Menjelajahi kursus-kursus unggulan dari instruktur terbaik.\n🎓 Mendapatkan\n🌐 Bergabung dengan komunitas pembelajar aktif dan berbagi pengetahuan.\n🚀 Memulai perjalanan pendidikan online Anda menuju kesuksesan.\n\nSelamat belajar,\nTim SINOW 🫡`,
        next,
      )

      await OTP.destroy({
        where: {
          userEmail: email,
        },
        transaction: t,
      })
    })

    const token = createToken(
      {
        id: updatedAuth.User.id,
        name: updatedAuth.User.name,
        role: updatedAuth.User.role,
      },
      next,
    )

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil verifikasi email',
      data: {
        token,
      },
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const reqResetPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    if (!email) {
      return next(new ApiError('Email harus diisi', 400))
    }
    if (!validator.isEmail(email)) {
      return next(new ApiError('Email tidak valid', 400))
    }

    const auth = await Auth.findOne({
      where: {
        email,
      },
      include: ['User'],
    })

    if (!auth) {
      return next(new ApiError('Email tidak terdaftar', 400))
    }

    await sendResetPasswordEmail(auth, next)

    return res.status(200).json({
      status: 'Success',
      message: 'Tautan reset password berhasil dikirim ke email',
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
      return next(new ApiError('Token tidak valid', 400))
    }

    const { password, confirmPassword } = req.body

    if (!password) {
      return next(new ApiError('Password harus diisi', 400))
    }

    if (!confirmPassword) {
      return next(new ApiError('Konfirmasi password harus diisi', 400))
    }
    if (password.length < 8) {
      return next(new ApiError('Panjang password minimal 8 karakter', 400))
    }
    if (password.length > 12) {
      return next(new ApiError('Panjang password maksimal 12 karakter', 400))
    }
    if (password !== confirmPassword) {
      return next(new ApiError('Password tidak cocok', 400))
    }

    const auth = await Auth.findOne({
      where: {
        id: decoded.id,
      },
    })

    if (!auth) {
      return next(new ApiError('Token tidak valid', 400))
    }

    const passwordHash = await bcrypt.hash(password, 10)

    auth.update({
      password: passwordHash,
    })

    await createNotification(
      'Notifikasi',
      'Password Berhasil Diubah',
      decoded.id,
      `Halo,\n\nPassword akun Anda telah berhasil diubah. Jika Anda merasa tidak melakukan perubahan ini, segera hubungi dukungan pelanggan kami.\n\nTerima kasih,\nTim SINOW 🫡`,
      next,
    )

    return res.status(200).json({
      status: 'Success',
      message: 'Password berhasil diubah',
    })
  } catch (error) {
    return next(new ApiError(error, 500))
  }
}

module.exports = {
  login,
  register,
  verifyEmail,
  resendOtp,
  reqResetPassword,
  resetPassword,
}
