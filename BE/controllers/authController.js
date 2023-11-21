const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Auth } = require("../models");
const ApiError = require("../utils/ApiError");
const validator = require("validator");

const register = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

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

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

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

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      throw new ApiError("Email tidak valid", 400);
    }

    if (!email || !password) {
      throw new ApiError("Email dan password harus diisi", 400);
    }

    const user = await Auth.findOne({
      where: {
        email,
      },
      include: ["User"],
    });

    if (!user) {
      throw new ApiError("Email tidak terdaftar", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new ApiError("Password salah", 400);
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
      },
    });
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
};

const checkToken = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      throw new ApiError("User tidak ditemukan", 404);
    }

    res.status(200).json({
      status: "success",
      message: "Berhasil mendapatkan data token",
      data: user,
    });
  } catch {
    next(new ApiError(error.message, 500));
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await User.findByPk(id, {
      include: ["Auth"],
    });

    if (!user) {
      throw new ApiError("User tidak ditemukan", 404);
    }

    res.status(200).json({
      status: "success",
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
  getUser,
};
