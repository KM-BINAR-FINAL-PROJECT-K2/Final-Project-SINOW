const {
  Course,
  User,
  Category,
  Chapter,
  Module,
  Benefit,
} = require("../models");
const { Op } = require("sequelize");
const ApiError = require("../utils/ApiError");

const { uploadImage, uploadVideo } = require("../utils/imagekitUploader");

const createCourse = async (req, res, next) => {
  const user = req.user;
  try {
    let {
      name,
      level,
      rating,
      categoryId,
      description,
      classCode,
      type,
      price,
      discount,
      courseBy,
    } = req.body;

    if (
      !name ||
      !level ||
      !rating ||
      !categoryId ||
      !description ||
      !classCode ||
      !type ||
      !price ||
      !courseBy
    ) {
      return next(new ApiError("Semua field harus diisi", 400));
    }

    if (!req.files || Object.keys(req.files).length !== 2) {
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

    if (!isNaN(rating)) {
      return next(new ApiError("Rating harus angka", 400));
    }

    if (type !== "gratis" && type !== "premium") {
      return next(new ApiError("Type harus 'gratis' atau 'premium'", 400));
    }

    if (isNaN(price)) {
      return next(new ApiError("Harga yang dimasukkan bukan angka", 400));
    }

    if (isNaN(discount)) {
      return next(new ApiError("Diskon harus angka", 400));
    }

    if (type === "premium" && price <= 0) {
      return next(new ApiError("Harga harus lebih dari 0", 400));
    }

    if (type === "gratis") {
      price = 0;
    }

    const checkCategory = await Category.findByPk(categoryId);

    if (!checkCategory) {
      return next(
        new ApiError(
          "Category tidak tersedia, cek 'localhost:3000/api/v1/category' untuk melihat daftar kategori yang tersedia",
          400
        )
      );
    }

    const { imageUrl } = await uploadImage(req.files.image[0], next);
    const { videoUrl } = await uploadVideo(req.files.video[0], next);

    const course = await Course.create({
      name,
      level,
      rating,
      categoryId,
      description,
      classCode,
      totalDuration: 0,
      totalModule: 0,
      type,
      price,
      discount,
      totalUser: 0,
      imageUrl: imageUrl,
      videoPreviewUrl: videoUrl,
      courseBy,
      createdBy: user.name,
    });

    if (!course) {
      return next(new ApiError("Gagal membuat course", 500));
    }

    res.status(201).json({
      status: "Success",
      message: "Berhasiil menambahkan data course",
      data: course,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const getAllCourse = async (req, res, next) => {
  try {
    const { search, category, level } = req.query;

    if (category) {
      if (Array.isArray(category)) {
        category.map((cat) => {
          if (isNaN(cat)) {
            return next(
              new ApiError(
                "Semua category harus berupa angka bilangan bulat",
                400
              )
            );
          }
        });
      } else {
        if (isNaN(category)) {
          return next(
            new ApiError("Category harus berupa angka bilangan bulat", 400)
          );
        }
      }
    }

    const validLevels = ["beginner", "intermediate", "advanced"];

    if (level) {
      if (typeof level === "string") {
        if (
          level !== "beginner" &&
          level !== "intermediate" &&
          level !== "advanced"
        ) {
          return next(
            new ApiError(
              "Level harus antara 'beginner', 'intermediate' atau 'advanced', perhatikan juga huruf kecil besarnya",
              400
            )
          );
        }
      } else if (Array.isArray(level)) {
        if (!level.every((item) => validLevels.includes(item))) {
          return next(
            new ApiError(
              "Level harus antara 'beginer', 'intermediate' atau 'advanced', perhatikan juga huruf kecil besarnya",
              400
            )
          );
        }
      }
    }

    const where = {};

    if (search) {
      where.name = {
        [Op.iLike]: `%${search}%`,
      };
    }
    if (category) {
      where.categoryId = {
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
          model: Benefit,
          as: "benefits",
          attributes: ["id", "description"],
        },
      ],
      where,
      order: [["id", "ASC"]],
    });

    if (!courses || courses.length === 0) {
      return next(new ApiError("Course tidak ditemukan", 404));
    }

    res.status(200).json({
      status: "Success",
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
          model: Benefit,
          as: "benefits",
          attributes: ["id", "description"],
        },
        {
          model: Chapter,
          as: "chapters",
          attributes: ["id", "no", "name"],
          include: [
            {
              model: Module,
              as: "modules",
              attributes: ["id", "no", "name", "videoUrl", "duration"],
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
      return next(new ApiError("Data course tidak ditemukan", 404));
    }

    res.status(200).json({
      status: "Success",
      message: `Berhasil mendapatkan data course id: ${id}`,
      data: course,
    });
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    let {
      name,
      level,
      rating,
      categoryId,
      description,
      classCode,
      type,
      price,
      courseBy,
    } = req.body;

    const course = await Course.findByPk(id);
    if (!course) {
      return next(new ApiError("Course tidak ditemukan", 404));
    }

    const updateData = {};

    if (name) {
      updateData.name = name;
    }

    if (level) {
      if (
        level !== "beginner" &&
        level !== "intermediate" &&
        level !== "advanced"
      ) {
        return next(
          new ApiError("Level harus beginner, intermediate, atau advanced", 400)
        );
      }
      updateData.level = level;
    }

    if (rating) {
      if (isNaN(rating)) {
        return next(new ApiError("Rating harus berupa angka", 400));
      }
      updateData.rating = rating;
    }

    if (categoryId) {
      if (categoryId < 1 || categoryId > 6) {
        return next(
          new ApiError(
            "Kategori course yang dimasukkan harus antara 1-6: 1. UI/UX Design, 2. Product Management, 3. Web Development, 4. Android Development, 5. iOS Development, 6. Data Science",
            400
          )
        );
      }
      updateData.categoryId = categoryId;
    }

    if (courseBy) {
      updateData.courseBy = courseBy;
    }

    if (description) {
      updateData.description = description;
    }

    if (classCode) {
      updateData.classCode = classCode;
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
        if (isNaN(price)) {
          return next(new ApiError("Harga yang dimasukkan bukan angka", 400));
        }
        updateData.price = price;
      }
      updateData.type = type;
    }
    if (req.files || Object.keys(req.files).length > 0) {
      if (req.files.image[0]) {
        const { imageUrl } = await uploadImage(req.files.image[0]);
        if (!imageUrl) {
          return next(new ApiError("Gagal upload image", 400));
        }
        updateData.imageUrl = imageUrl;
      }

      if (req.files.video[0]) {
        const { videoUrl } = await uploadVideo(req.files.video[0]);
        if (!videoUrl) {
          return next(new ApiError("Gagal upload video", 400));
        }
        updateData.videoUrl = videoUrl;
      }
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
      status: "Success",
      message: `Berhasil mengupdate data course id: ${id}`,
      data: updatedCourse,
    });
  } catch (error) {
    return next(new ApiError(error, 500));
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
      status: "Success",
      message: `Berhasil menghapus data course dengan id: ${id}`,
    });
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};

module.exports = {
  createCourse,
  getAllCourse,
  getCourseById,
  deleteCourse,
  updateCourse,
};
