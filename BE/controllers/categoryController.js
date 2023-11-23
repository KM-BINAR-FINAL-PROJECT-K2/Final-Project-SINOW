const { Category, Course } = require("../models");
const { Op } = require("sequelize");
const ApiError = require("../utils/ApiError");

const { uploadImage } = require("../lib/imagekitUploader");

const createCategory = async (req, res, next) => {
  try {
    let { name, imageUrl } = req.body;

    if (!name || !imageUrl) {
      return next(new ApiError("Harus ada name dan imageUrl harus diisi", 400));
    }

    const category = await Category.create({
      name,
      imageUrl,
    });

    res.status(201).json({
      status: "success",
      message: "sukses membuat category",
      data: category,
    });
  } catch (error) {
    return next(new ApiError((error.message = 500)));
  }
};

const getAllCategory = async (req, res, next) => {
  try {
    const { name } = req.query;

    const categories = await Category.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
    });

    if (!categories) {
      return next(new ApiError("Category tidak ditemukan atau kosong", 404));
    }

    res.status(200).json({
      status: "success",
      message: "sukses mengambil data category",
      data: categories,
    });
  } catch (error) {
    return next(new ApiError((error.message = 500)));
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return next(new ApiError("Category tidak ditemukan", 404));
    }

    res.status(200).json({
      status: "success",
      message: "sukses mengambil data category",
      data: category,
    });
  } catch (error) {
    return next(new ApiError((error.message = 500)));
  }
};

const updateCategory = async (req, res, next) => {
  try {
    let { name, imageUrl } = req.body;

    const updateData = {};

    if (name) {
      updateData.name = name;
    }

    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    const category = await Category.update(updateData, {
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      status: "success",
      message: "sukses update category",
      data: category,
    });
  } catch (error) {
    return next(new ApiError((error.message = 500)));
  }
};

const deleteCategory = async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findByPk(id);
  if (!category) {
    return next(new ApiError("Category tidak ditemukan", 404));
  }

  const checkCourse = await Course.findOne({
    where: {
      categoryId: id,
    },
  });

  if (checkCourse) {
    return next(
      new ApiError(
        "Gagal menghapus kategory karena sudah ada course dengan kategory ini",
        400
      )
    );
  }

  const isCategoryDeleted = await category.destroy({
    where: {
      id,
    },
  });

  if (!isCategoryDeleted) {
    return next(new ApiError("Gagal menghapus category", 500));
  }

  res.status(200).json({
    status: "success",
    message: `Berhasil menghapus data category dengan id: ${id}`,
  });
};

module.exports = {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
