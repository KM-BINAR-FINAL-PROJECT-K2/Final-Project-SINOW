const { Category, Course } = require("../models");
const { Op } = require("sequelize");
const ApiError = require("../utils/ApiError");

const { uploadImage } = require("../utils/imagekitUploader");

const createCategory = async (req, res, next) => {
  try {
    let { name } = req.body;

    if (!name) {
      return next(new ApiError("Name harus diisi", 400));
    }

    const existingCategory = await Category.findOne({
      where: {
        name,
      },
    });

    if (existingCategory) {
      return next(new ApiError("Nama category sudah ada", 400));
    }

    if (!req.file) {
      return next(new ApiError("Harus menyertakan gambar", 400));
    }

    const { imageUrl } = await uploadImage(req.file);

    const category = await Category.create({
      name,
      imageUrl,
    });

    res.status(201).json({
      status: "Success",
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

    const where = {};
    if (name) {
      where.name = {
        [Op.iLike]: `%${name}%`,
      };
    }

    const categories = await Category.findAll({
      where,
    });

    if (!categories) {
      return next(new ApiError("Category tidak ditemukan atau kosong", 404));
    }

    res.status(200).json({
      status: "Success",
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
      status: "Success",
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
      const existingCategory = await Category.findOne({
        where: {
          name,
        },
      });

      if (existingCategory) {
        return next(new ApiError("nama category sudah ada", 400));
      }
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
      status: "Success",
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
    return next(new ApiError("Gagal menghapus kategory karena sudah ada course dengan kategory ini", 400));
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
    status: "Success",
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
