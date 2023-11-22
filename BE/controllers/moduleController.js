const { Module, Chapter, User } = require("../models");
const ApiError = require("../utils/ApiError");

const { uploadVideo } = require("../lib/imagekitUploader");

const createModule = async (req, res, next) => {
  try {
    const { name, no, chapterId, duration } = req.body;

    if (!name || !no || !chapterId || !duration) {
      return next(new ApiError("Semua field harus di isi", 400));
    }
    console.log(req.body);
    console.log(req.file);

    if (!req.file || Object.keys(req.file).length === 0) {
      return next(new ApiError("Harus menyertakan video", 400));
    }

    const chapter = await Chapter.findByPk(chapterId);
    if (!chapter) {
      return next(new ApiError("Chapter tidak ada", 404));
    }

    const filesUrl = await uploadVideo(req.file);

    if (!filesUrl) {
      return next(new ApiError("Gagal upload video", 400));
    }

    const module = await Module.create({
      name,
      no,
      videoUrl: filesUrl.videoUrl,
      chapterId,
      duration,
      createdBy: req.user.id,
    });

    if (!module) {
      return next(new ApiError("Gagal membuat module", 500));
    }

    res.status(201).json({
      status: "succes",
      message: "Sukses membuat module",
      data: module,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const getAllModule = async (req, res, next) => {
  try {
    const modules = await Module.findAll({
      include: [
        {
          model: Chapter,
          attributes: ["no", "name"],
          as: "chapter",
        },
        {
          model: User,
          as: "moduleCreator",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!modules || modules.length === 0) {
      return next(new ApiError("Module tidak ditemukan", 404));
    }

    res.status(200).json({
      status: "succes",
      message: "Berhasil mendapatkan data modules",
      data: modules,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};
const getModuleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const module = await Module.findByPk(id, {
      include: [
        {
          model: Chapter,
          attributes: ["no", "name"],
          as: "chapter",
        },
        {
          model: User,
          as: "moduleCreator",
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "users",
        },
      ],
    });

    if (!module || module.length === 0) {
      return next(new ApiError("Module tidak ditemukan", 404));
    }

    res.status(200).json({
      status: "succes",
      message: `Berhasil mendapatkan data module id: ${id};`,
      data: module,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};
const deleteModule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const module = await Module.findByPk(id);

    if (!module) {
      return next(new ApiError("Module tidak ditemukan", 404));
    }

    const isModuleDeleted = await Module.destroy({
      where: {
        id,
      },
    });
    if (!isModuleDeleted) {
      return next(new ApiError("Gagal menghapus module", 500));
    }

    res.status(200).json({
      status: "succes",
      message: `Berhasil menghapus data module id: ${id};`,
      data: module,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

module.exports = {
  createModule,
  getAllModule,
  getModuleById,
  deleteModule,
};
