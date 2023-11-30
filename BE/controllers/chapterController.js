const { Module, Chapter, Course } = require("../models");
const ApiError = require("../utils/ApiError");
const { Op } = require("sequelize");

const createChapter = async (req, res, next) => {
  try {
    let { no, name, courseId } = req.body;

    const missingFields = ["no", "name", "courseId"].filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return next(new ApiError(`Field ${missingFields.join(", ")} harus di isi`, 400));
    }

    if (isNaN(no) || isNaN(courseId)) {
      return next(new ApiError("Nomor chapter dan courseId harus berupa angka", 400));
    }

    no = parseInt(no, 10);

    const checkCourse = await Course.findByPk(courseId);
    if (!checkCourse) {
      return next(new ApiError("Kursus tidak tersedia, silahkan cek daftar kursus untuk melihat kursus yang tersedia", 404));
    }

    const existingChapter = await Chapter.findOne({
      where: {
        [Op.and]: [
          { courseId },
          {
            [Op.or]: [{ name }, { no }],
          },
        ],
      },
    });

    if (existingChapter) {
      const errorMessage = [];

      if (existingChapter.name === name) {
        errorMessage.push("Nama chapter sudah ada dalam course ini");
      }

      if (existingChapter.no === no) {
        errorMessage.push("Nomor chapter sudah digunakan dalam course ini");
      }

      if (errorMessage.length > 0) {
        return next(new ApiError(errorMessage.join(", "), 400));
      }
    }

    const chapter = await Chapter.create({
      no,
      name,
      courseId,
    });

    res.status(201).json({
      status: "Success",
      message: "Sukses menambahkan data chapter",
      data: chapter,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const getAllChapter = async (req, res, next) => {
  try {
    const chapters = await Chapter.findAll({
      include: [
        {
          model: Module,
          as: "modules",
        },
      ],
      order: [["id", "ASC"]],
    });

    if (!chapters || chapters.length === 0) {
      return next(new ApiError("Chapter tidak ditemukan", 404));
    }

    res.status(200).json({
      status: "Success",
      message: "Berhasil mendapatkan data chapter",
      data: chapters,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};
const getChapterById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const chapter = await Chapter.findByPk(id, {
      include: [
        {
          model: Module,
          as: "modules",
        },
      ],
    });

    if (!chapter) {
      return next(new ApiError("Chapter tidak ditemukan", 404));
    }

    res.status(200).json({
      status: "Success",
      message: `Berhasil mendapatkan data Chapter id: ${id};`,
      data: chapter,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const updateChapter = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { no, name, courseId } = req.body;

    const chapter = await Chapter.findByPk(id);
    if (!chapter) {
      return next(new ApiError("Chapter tidak ditemukan", 404));
    }

    const updateData = {};

    if (no) {
      const parsedNo = parseInt(no, 10);
      if (isNaN(parsedNo)) {
        return next(new ApiError("Nomor chapter harus berupa angka", 400));
      }

      const checkNumber = await Chapter.findOne({
        where: {
          no: parsedNo,
          courseId,
          id: { [Op.not]: id },
        },
      });

      if (checkNumber) {
        return next(new ApiError("Nomor chapter sudah digunakan dalam course ini", 400));
      }
      updateData.no = no;
    }

    if (name) {
      const existingChapter = await Chapter.findOne({
        where: {
          name,
          courseId,
          id: { [Op.not]: id }, // Memastikan ID chapter yang dicek tidak sama dengan chapter yang sedang diupdate
        },
      });

      if (existingChapter) {
        return next(new ApiError("Nama chapter sudah ada dalam course ini", 400));
      }
      updateData.name = name;
    }

    if (courseId) {
      if (isNaN(courseId)) {
        return next(new ApiError("Chapter ID harus berupa angka", 400));
      }
      const checkCourse = await Course.findByPk(courseId);
      if (!checkCourse) {
        return next(new ApiError("Kursus tidak tersedia, silahkan cek daftar kursus untuk melihat kursus yang tersedia", 404));
      }
      updateData.courseId = courseId;
    }

    const [rowCount, [updatedChapter]] = await Chapter.update(updateData, {
      where: {
        id,
      },
      returning: true,
    });

    if (rowCount === 0 && !updatedChapter) {
      return next(new ApiError("Gagal update data Chapter", 500));
    }

    res.status(200).json({
      status: "Success",
      message: `Berhasil mengupdate data chapter id: ${id}`,
      data: updatedChapter,
    });
  } catch (error) {
    return next(new ApiError(error, 500));
  }
};
const deleteChapter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const chapter = await Chapter.findByPk(id);

    if (!chapter) {
      return next(new ApiError("Chapter tidak ditemukan", 404));
    }

    const isChapterDeleted = await Chapter.destroy({
      where: {
        id,
      },
    });

    if (!isChapterDeleted) {
      return next(new ApiError("Gagal menghapus Chapter", 500));
    }

    res.status(200).json({
      status: "Success",
      message: `Berhasil menghapus data Chapter id: ${id};`,
      data: chapter,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

module.exports = {
  createChapter,
  getAllChapter,
  getChapterById,
  deleteChapter,
  updateChapter,
};
