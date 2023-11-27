const jwt = require("jsonwebtoken");
const {
  User,
  Auth,
  Course,
  UserCourse,
  Module,
  UserModule,
} = require("../models");
const ApiError = require("../utils/ApiError");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { createNotification } = require("../utils/notificationUtils");

const { uploadImage } = require("../utils/imagekitUploader");

const myDetails = async (req, res, next) => {
  try {
    res.status(200).json({
      status: "Success",
      message: "Berhasil mengambil detail user",
      data: req.user,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const updateMyDetails = async (req, res, next) => {
  try {
    const { name, country, city } = req.body;
    let { email, phoneNumber } = req.body;
    const { id } = req.user;

    const user = await User.findByPk(id, {
      include: ["Auth"],
    });

    if (!user) {
      return next(new ApiError("User tidak ditemukan", 404));
    }

    const updateDataUser = {};

    if (name && name !== "") {
      updateDataUser.name = name;
    }

    if (country) {
      updateDataUser.country = country;
    }

    if (city) {
      updateDataUser.city = city;
    }

    if (req.file) {
      const { imageUrl } = await uploadImage(req.file);
      if (!imageUrl) {
        return next(new ApiError("Gagal upload image", 400));
      }
      updateDataUser.photoProfileUrl = imageUrl;
    }

    const updateDataAuth = {};

    if (email) {
      email = email.toLowerCase();
      if (!validator.isEmail(email)) {
        return next(new ApiError("Email tidak valid", 400));
      }
      if (email !== user.Auth.email) {
        const isEmailExist = await Auth.findOne({ where: { email } });
        if (isEmailExist) {
          return next(new ApiError("Email sudah terdaftar di lain akun", 400));
        }
      }
      updateDataAuth.email = email;
    }

    if (phoneNumber) {
      if (`${phoneNumber}`.startsWith("0")) {
        phoneNumber = `${phoneNumber.slice(1)}`;
      }
      if (!validator.isMobilePhone(`0${phoneNumber}`, "id-ID")) {
        return next(new ApiError("Nomor telepon tidak valid", 400));
      }

      if (phoneNumber !== user.Auth.phoneNumber) {
        const isPhoneNumberExist = await Auth.findOne({
          where: { phoneNumber },
        });
        if (isPhoneNumberExist) {
          return next(
            new ApiError("Nomor telepon sudah terdaftar di lain akun", 400)
          );
        }
        updateDataAuth.phoneNumber = phoneNumber;
      }
    }

    if (Object.keys(updateDataUser).length !== 0) {
      const [rowCountUser, [updatedUser]] = await User.update(updateDataUser, {
        where: {
          id,
        },
        returning: true,
      });

      if (rowCountUser === 0 && !updatedUser) {
        return next(new ApiError("Gagal update user", 500));
      }
    }

    if (updateDataAuth.email || updateDataAuth.phoneNumber) {
      const [rowCountAuth, [updatedAuth]] = await Auth.update(updateDataAuth, {
        where: {
          id: user.Auth.id,
        },
        returning: true,
      });
      if (rowCountAuth === 0 && !updatedAuth) {
        return next(new ApiError("Gagal update auth", 500));
      }
    }

    await createNotification(
      "Notifikasi",
      "Berhasil memperbarui detail akun",
      id,
      "Detail akun Anda berhasil diperbarui"
    );

    res.status(200).json({
      status: "Success",
      message: `Berhasil mengupdate data user id: ${id}`,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const changeMyPassword = async (req, res, next) => {
  try {
    const { user } = req;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    const isMatch = await bcrypt.compare(oldPassword, user.Auth.password);
    if (!isMatch) {
      return next(new ApiError("Password lama tidak sesuai", 400));
    }
    if (newPassword !== confirmNewPassword) {
      return next(new ApiError("Password baru tidak sesuai", 400));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [rowCountAuth, [updatedAuth]] = await Auth.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          userId: user.id,
        },
        returning: true,
      }
    );
    if (rowCountAuth === 0 && !updatedAuth) {
      return next(new ApiError("Gagal update auth", 500));
    }

    await createNotification(
      "Notifikasi",
      "Password Berhasil Diubah",
      user.id,
      `Halo ${user.name},\n\nPassword akun Anda telah diubah. Jika Anda merasa tidak melakukan perubahan ini, segera hubungi dukungan pelanggan kami.\n\nTerima kasih,\nTim SiNow 🫡`
    );
    res.status(200).json({
      status: "Success",
      message: `Password berhasil diubah `,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const createUserCourse = async (req, res, next) => {
  try {
    const { user } = req;
    const { courseId } = req.params;

    const checkUserCourse = await UserCourse.findOne({
      where: {
        userId: user.id,
        courseId,
      },
    });

    if (checkUserCourse) {
      res.status(200).json({
        status: "Success",
        message: "User sudah mengikuti course ini",
      });
    }

    const course = await Course.findByPk(courseId);

    const userCourse = await UserCourse.create({
      userId: user.id,
      courseId,
      isAccessible: course.type === "gratis" ? true : false,
      progresss: 0,
      lastSeen: new Date(),
    });

    if (!userCourse) {
      return next(new ApiError("Gagal membuat user course", 500));
    }

    res.status(200).json({
      status: "Success",
      message: "Berhasil mengikuti course",
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const getMyCourses = async (req, res, next) => {
  try {
    const { user } = req;

    const course = await UserCourse.findAll({
      where: {
        userId: user.id,
      },
      include: [
        {
          model: Course,
        },
      ],
    });

    if (!course || course.length === 0) {
      return next(new ApiError("Data course masih kosong", 404));
    }

    res.status(200).json({
      status: "Success",
      message: "Berhasil mengambil data course",
      data: course,
    });
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

const openCourse = async (req, res, next) => {
  try {
    const { user } = req;
    const { courseId } = req.params;

    const course = await Course.findByPk(courseId);

    if (!course) {
      return next(new ApiError("Course tidak ditemukan", 404));
    }

    const [userCourse, created] = await UserCourse.findOrCreate({
      where: {
        userId: user.id,
        courseId,
      },
      defaults: {
        userId: user.id,
        courseId,
        isAccessible: course.type === "gratis",
        progress: 0,
        lastSeen: new Date(),
      },
      include: [
        {
          model: Course,
        },
      ],
    });

    if (!created) {
      await userCourse.update({
        lastSeen: new Date(),
      });

      return res.status(200).json({
        status: "Success",
        message: "Berhasil mendapatkan detail course user",
        data: userCourse,
      });
    }

    const newUserCourse = await UserCourse.findByPk(userCourse.id, {
      include: [
        {
          model: Course,
        },
      ],
    });

    res.status(200).json({
      status: "Success",
      message: "Berhasil mengikuti course",
      data: newUserCourse,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

module.exports = {
  myDetails,
  updateMyDetails,
  changeMyPassword,
  getMyCourses,
  openCourse,
};
