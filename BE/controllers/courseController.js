const { Course, User, Category, Chapter, Module } = require("../models");
const { Op } = require("sequelize");
const ApiError = require("../utils/ApiError");

const { uploadImageAndVideo } = require("../lib/imagekitUploader");

const createCourse = async (req, res, next) => {
  try {
    const { name, level, categoryId, description, type, price, courseBy } =
      req.body;

    if (
      !name ||
      !level ||
      !categoryId ||
      !description ||
      !type ||
      !price ||
      !courseBy
    ) {
      return next(new ApiError("Semua field harus diisi", 400));
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new ApiError("Harus menyertakan gambar dan video", 400));
    }

    if (
      level !== "beginner" &&
      level !== "intermediate" &&
      level !== "advance"
    ) {
      return next(
        new ApiError(
          "Level harus 'beginner', 'intermediate' atau 'advance', perhatikan juga huruf kecil besarnya",
          400
        )
      );
    }

    if (type !== "gratis" && type !== "premium") {
      return next(new ApiError("Type harus 'gratis' atau 'premium'", 400));
    }

    if (type === "premium" && price <= 0) {
      return next(new ApiError("Harga harus lebih dari 0", 400));
    }

    if (type === "gratis") {
      price = 0;
    }

    if (categoryId < 1 || categoryId > 6) {
      return next(
        new ApiError(
          "Category tidak tersedia, yang tersedia: 1: UI/UX Design, 2: Product Management, 3: Web Development, 4: Android Development, 5: iOS Development, 6: Data Science",
          400
        )
      );
    }

    const filesUrl = await uploadImageAndVideo(req.files);

    if (!filesUrl) {
      return next(new ApiError("Gagal upload gambar dan video", 400));
    }

    const course = await Course.create({
      name,
      level,
      categoryId,
      description,
      type,
      price,
      courseBy,
      imageUrl: filesUrl.imageUrl,
      videoPreviewUrl: filesUrl.videoUrl,
    });

    if (!course) {
      return next(new ApiError("Gagal membuat course", 500));
    }

    res.status(201).json({
      status: "success",
      message: "Sukses membuat course",
      data: course,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const getAllCourse = async (req, res, next) => {
  try {
    const { search, category, level } = req.query;

    const where = {};

    if (search) {
      where.name = {
        [Op.iLike]: `%${search}%`,
      };
    }
    if (category) {
      where.category = {
        [Op.in]: Array.isArray(category) ? category : [category],
      };
    }
    if (level) {
      where.level = {
        [Op.in]: Array.isArray(level) ? level : [level],
      };
    }

    const courses = await Course.findAll({
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
          as: "category",
        },
        {
          model: User,
          as: "courseCreator",
          attributes: ["id", "name"],
        },
        {
          model: Chapter,
          as: "chapters",
          attributes: ["no", "name"],
          include: [
            {
              model: Module,
              as: "modules",
              attributes: ["no", "name", "videoUrl", "duration"],
            },
          ],
        },
      ],
      where,
      order: [
        ["id", "ASC"],
        ["chapters", "no", "ASC"],
        ["chapters", "modules", "no", "ASC"],
      ],
    });

    if (!courses || courses.length === 0) {
      return next(new ApiError("Course tidak ditemukan", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Berhasil mendapatkan data course",
      data: courses,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(error, 500));
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id, {
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
          as: "category",
        },
        {
          model: User,
          as: "courseCreator",
          attributes: ["id", "name"],
        },
        {
          model: Chapter,
          as: "chapters",
          attributes: ["no", "name"],
          include: [
            {
              model: Module,
              as: "modules",
              attributes: ["no", "name", "videoUrl", "duration"],
            },
          ],
        },
      ],
      order: [
        ["id", "ASC"],
        ["chapters", "no", "ASC"],
        ["chapters", "modules", "no", "ASC"],
      ],
    });

    if (!course) {
      return next(new ApiError("Course tidak ditemukan", 404));
    }

    res.status(200).json({
      status: "success",
      message: `Berhasil mendapatkan data course id: ${id}`,
      data: course,
    });
  } catch (error) {
    next(new ApiError(error, 500));
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, level, categoryId, description, type, price, courseBy } =
      req.body;

    const user = req.user;

    const course = await Course.findByPk(id);
    if (!course) {
      return next(new ApiError("Course tidak ditemukan", 404));
    }

    const updateData = {};

    if (name) {
      updateData.name = name;
    }

    if (description) {
      updateData.description = description;
    }

    if (type) {
      if (type !== "free" && type !== "premium") {
        return next(
          new ApiError("Tipe course harus 'free' atau 'premium'", 400)
        );
      }
      if (type === "free") {
        updateData.price = 0;
      }
      if (type === "premium") {
        if (!price || price <= 0) {
          return next(new ApiError("Harga course harus lebih dari 0", 400));
        }
        updateData.price = price;
      }
      updateData.type = type;
    }
    if (req.files || Object.keys(req.files).length > 0) {
      const uploadedFiles = await uploadImageAndVideo(req.files, next);
      if (!uploadedFiles || Object.keys(uploadedFiles).length === 0) {
        next(new ApiError("Gagal upload file", 500));
      }
      updateData.imageUrl = uploadedFiles.imageUrl;
      updateData.videoUrl = uploadedFiles.videoUrl;
    }

    const [rowCount, [updatedCourse]] = await Course.update(updateData, {
      where: {
        id,
      },
      returning: true,
    });

    if (rowCount === 0 && !updatedCourse) {
      return next(new ApiError("Gagal update course", 500));
    }

    res.status(200).json({
      status: "success",
      message: `Berhasil mengupdate data course id: ${id}`,
      data: updatedCourse,
    });
  } catch (error) {
    next(new ApiError(error, 500));
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) {
      return next(new ApiError("Course tidak ditemukan", 404));
    }

    const isCourseDeleted = await course.destroy({
      where: {
        id,
      },
    });

    if (!isCourseDeleted) {
      return next(new ApiError("Gagal menghapus course", 500));
    }

    res.status(200).json({
      status: "success",
      message: `Berhasil menghapus data course dengan id: ${id}`,
    });
  } catch (error) {
    next(new ApiError(error, 500));
  }
};

module.exports = {
  createCourse,
  getAllCourse,
  getCourseById,
  deleteCourse,
  updateCourse,
};
