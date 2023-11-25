const { Module, Chapter, Course } = require("../models");
const ApiError = require("../utils/ApiError");

const createChapter = async (req, res, next) => {
  try {
    let { no, name, courseId } = req.body;

    if (!no || !name || !courseId) {
      return next(new ApiError("Semua field harus di isi", 400));
    }

    const checkCourse = await Course.findByPk(courseId);
    if (!checkCourse) {
      return next(new ApiError("Kursus tidak tersedia, silahkan cek daftar kursus untuk melihat kursus yang tersedia ", 404));
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
      updateData.no = no;
    }

    if (name) {
      updateData.name = name;
    }

    if (courseId) {
      const course = await Course.findByPk(courseId);
      if (!course) {
        return next(new ApiError("Kursus tidak tersedia, silahkan cek daftar kursus untuk melihat kursus yang tersedia ", 404));
      }
      updateData.courseId = courseId;
    }

    const updatedChapter = await Chapter.update(updateData, {
      where: {
        id,
      },
      returning: true,
    });

    if (!updatedChapter) {
      return next(new ApiError("Gagal memperbarui data Chapter", 500));
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
