const { Module, Chapter, User } = require("../models");
const ApiError = require("../utils/ApiError");

const { uploadVideo } = require("../utils/imagekitUploader");

const createModule = async (req, res, next) => {
  try {
    let { name, no, chapterId, duration } = req.body;

    if (!name || !no || !chapterId) {
      return next(new ApiError("Semua field harus di isi", 400));
    }

    if (!req.file || Object.keys(req.file).length === 0) {
      return next(new ApiError("Harus menyertakan video", 400));
    }

    const checkChapter = await Chapter.findByPk(chapterId);
    if (!checkChapter) {
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
      duration: filesUrl.videoDuration,
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
        {
          model: User,
          as: "users",
        },
      ],
      order: [["id", "ASC"]],
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

const updateModule = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { name, no, chapterId, duration } = req.body;

    const module = await Module.findByPk(id);
    if (!module) {
      return next(new ApiError("Module tidak ditemukan", 404));
    }

    const updateData = {};

    if (name) {
      updateData.name = name;
    }

    if (no) {
      updateData.no = no;
    }
    if (chapterId) {
      const checkChapter = await Chapter.findByPk(chapterId);
      if (!checkChapter) {
        return next(new ApiError("Chapter tidak ditemukan", 404));
      }
      updateData.chapterId = chapterId;
    }
    if (duration) {
      updateData.duration = duration;
    }

    if (req.file && Object.keys(req.file).length > 0) {
      if (req.file) {
        const { videoUrl } = await uploadVideo(req.file);
        if (!videoUrl || Object.keys(videoUrl).length === 0) {
          next(new ApiError("Gagal upload file", 500));
        }
        updateData.videoUrl = videoUrl;
      }
    } else {
      updateData.videoUrl = module.videoUrl;
    }

    const [rowCount, [updatedModule]] = await Module.update(updateData, {
      where: {
        id,
      },
      returning: true,
    });

    if (rowCount === 0 && !updatedModule) {
      return next(new ApiError("Gagal update module", 500));
    }

    res.status(200).json({
      status: "success",
      message: `Berhasil mengupdate data module id: ${id}`,
      data: updatedModule,
    });
  } catch (error) {
    next(new ApiError(error, 500));
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
  updateModule,
};
