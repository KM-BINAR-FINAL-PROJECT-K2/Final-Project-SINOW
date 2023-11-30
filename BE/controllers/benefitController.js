const { Benefit, Course } = require("../models");
const ApiError = require("../utils/ApiError");
const { Op } = require("sequelize");

const createBenefit = async (req, res, next) => {
  try {
    let { description, courseId } = req.body;

    const missingFields = ["description", "courseId"].filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return next(new ApiError(`Field ${missingFields.join(", ")} harus di isi`, 400));
    }

    const existingBenefit = await Benefit.findOne({
      where: {
        description,
      },
    });

    if (existingBenefit) {
      return next(new ApiError("Benefit sudah ada", 400));
    }

    if (isNaN(courseId)) {
      return next(new ApiError("Course ID harus berupa angka", 400));
    }

    const checkCourse = await Course.findByPk(courseId);
    if (!checkCourse) {
      return next(new ApiError("Kursus tidak tersedia, silahkan cek daftar kursus untuk melihat kursus yang tersedia", 404));
    }

    const benefit = await Benefit.create({
      description,
      courseId,
    });

    res.status(201).json({
      status: "Success",
      message: "Sukses menambahkan data benefit",
      data: benefit,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const getAllBenefit = async (req, res, next) => {
  try {
    const benefits = await Benefit.findAll({
      order: [["id", "ASC"]],
    });

    if (!benefits || benefits.length === 0) {
      return next(new ApiError("Benefit tidak ditemukan", 404));
    }

    res.status(200).json({
      status: "Success",
      message: "Berhasil mendapatkan data benefit",
      data: benefits,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};
const getBenefitById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const benefit = await Benefit.findByPk(id);

    if (!benefit) {
      return next(new ApiError("Benefit tidak ditemukan", 404));
    }

    res.status(200).json({
      status: "Success",
      message: `Berhasil mendapatkan data Benefit id: ${id};`,
      data: benefit,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const updateBenefit = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { description, courseId } = req.body;

    const benefit = await Benefit.findByPk(id);
    if (!benefit) {
      return next(new ApiError("Benefit tidak ditemukan", 404));
    }

    const updateData = {};

    if (description) {
      const existingBenefit = await Benefit.findOne({
        where: {
          description,
          courseId,
          id: { [Op.not]: id }, // Memastikan ID benefit yang dicek tidak sama dengan benefit yang sedang diupdate
        },
      });

      if (existingBenefit) {
        return next(new ApiError("Benefit sudah ada dalam course ini", 400));
      }
      updateData.description = description;
    }

    if (courseId) {
      if (isNaN(courseId)) {
        return next(new ApiError("Chapter ID harus berupa angka", 400));
      }

      const course = await Course.findByPk(courseId);
      if (!course) {
        return next(new ApiError("Kursus tidak tersedia, silahkan cek daftar kursus untuk melihat kursus yang tersedia", 404));
      }
      updateData.courseId = courseId;
    }

    const [rowCount, [updatedBenefit]] = await Benefit.update(updateData, {
      where: {
        id,
      },
      returning: true,
    });

    if (rowCount === 0 && !updatedBenefit) {
      return next(new ApiError("Gagal update data Benefit", 500));
    }

    res.status(200).json({
      status: "Success",
      message: `Berhasil mengupdate data benefit id: ${id}`,
      data: updatedBenefit,
    });
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};
const deleteBenefit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const benefit = await Benefit.findByPk(id);

    if (!benefit) {
      return next(new ApiError("Benefit tidak ditemukan", 404));
    }

    const isBenefitrDeleted = await Benefit.destroy({
      where: {
        id,
      },
    });

    if (!isBenefitrDeleted) {
      return next(new ApiError("Gagal menghapus Benefit", 500));
    }

    res.status(200).json({
      status: "Success",
      message: `Berhasil menghapus data Benefit id: ${id};`,
      data: benefit,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

module.exports = {
  createBenefit,
  getAllBenefit,
  getBenefitById,
  deleteBenefit,
  updateBenefit,
};
