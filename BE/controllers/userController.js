const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Auth } = require("../models");
const ApiError = require("../utils/ApiError");
const validator = require("validator");

const { uploadImage } = require("../lib/imagekitUploader");

const me = async (req, res, next) => {
  try {
    const { id } = req.user;

    console.log(req.user);

    const user = await User.findByPk(id, {
      include: ["Auth"],
    });

    if (!user) {
      throw new ApiError("User tidak ditemukan", 404);
    }

    res.status(200).json({
      status: "success",
      data: req.user,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, country, city } = req.body;
    const { id } = req.user;

    const user = await User.findByPk(id);

    if (!user) {
      return next(new ApiError("User tidak ditemukan", 404));
    }

    if (!name || !email || !phoneNumber) {
      return next(
        new ApiError("Harus menyertakan nama, email, dan nomor telepon", 400)
      );
    }

    if (!validator.isEmail(email)) {
      return next(new ApiError("Email tidak valid", 400));
    }

    if (!validator.isMobilePhone(phoneNumber)) {
      return next(new ApiError("Nomor telepon tidak valid", 400));
    }

    const updateDataUser = {
      name,
    };

    if (country) {
      updateData.country = country;
    }

    if (city) {
      updateData.city = city;
    }

    if (req.file) {
      const { imageUrl } = await uploadImage(req.file);
      if (!imageUrl) {
        return next(new ApiError("Gagal upload image", 400));
      }
      updateData.photoProfileUrl = imageUrl;
    }

    const [rowCountUser, [updatedUser]] = await User.update(updateDataUser, {
      where: {
        id,
      },
      returning: true,
    });

    if (rowCountUser === 0 && !updatedUser) {
      return next(new ApiError("Gagal update user", 500));
    }

    const [rowCountAuth, [updatedAuth]] = await Auth.update(
      {
        email,
        phoneNumber,
      },
      {
        where: {
          userId: id,
        },
        returning: true,
      }
    );

    if (rowCountAuth === 0 && !updatedAuth) {
      return next(new ApiError("Gagal update auth", 500));
    }

    res.status(200).json({
      status: "success",
      message: `Berhasil mengupdate data user id: ${id}`,
      data: {
        user: updatedUser,
        auth: updatedAuth,
      },
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

module.exports = {
  me,
};
