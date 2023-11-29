const { Module, Chapter, User } = require("../models");
const ApiError = require("../utils/ApiError");
const { Op } = require("sequelize");

const { uploadVideo } = require("../utils/imagekitUploader");

const createModule = async (req, res, next) => {
  try {
    let { name, no, chapterId } = req.body;

    const missingFields = ["name", "no", "chapterId"].filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return next(new ApiError(`Field ${missingFields.join(", ")} harus di isi`, 400));
    }

    if (isNaN(no) || isNaN(chapterId)) {
      return next(new ApiError("Nomor dan chapterId harus berupa angka", 400));
    }
    no = parseInt(no, 10);

    if (!req.file) {
      return next(new ApiError("Harus menyertakan video", 400));
    }

    const checkChapter = await Chapter.findByPk(chapterId);
    if (!checkChapter) {
      return next(new ApiError("Chapter tidak ditemukan, silahkan cek daftar chapter untuk melihat chapter yang tersedia", 404));
    }
    const existingModule = await Module.findOne({
      where: {
        [Op.and]: [
          { chapterId },
          {
            [Op.or]: [{ name }, { no }],
          },
        ],
      },
    });

    if (existingModule) {
      const errorMessage = [];

      if (existingModule.name === name) {
        errorMessage.push("Nama modul sudah ada dalam chapter ini");
      }

      if (existingModule.no === no) {
        errorMessage.push("Nomor modul sudah digunakan dalam chapter ini");
      }

      if (errorMessage.length > 0) {
        return next(new ApiError(errorMessage.join(", "), 400));
      }
    }

    const uploadedFile = await uploadVideo(req.file);

    const module = await Module.create({
      name,
      no,
      videoUrl: uploadedFile.videoUrl,
      chapterId,
      duration: uploadedFile.videoDuration,
      createdBy: req.user.id,
    });

    if (!module) {
      return next(new ApiError("Gagal membuat module", 500));
    }

    res.status(201).json({
      status: "success",
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
      status: "success",
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

    if (!module) {
      return next(new ApiError("Module tidak ditemukan", 404));
    }

    res.status(200).json({
      status: "success",
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
    let { name, no, chapterId } = req.body;

    const module = await Module.findByPk(id);
    if (!module) {
      return next(new ApiError("Module tidak ditemukan", 404));
    }

    const updateData = {};

    if (name) {
      const existingModule = await Module.findOne({
        where: {
          name,
          chapterId,
          id: { [Op.not]: id }, // Memastikan ID modul yang dicek tidak sama dengan modul yang sedang diupdate
        },
      });

      if (existingModule) {
        return next(new ApiError("Nama modul sudah ada dalam chapter ini", 400));
      }
      updateData.name = name;
    }

    if (no) {
      const parsedNo = parseInt(no, 10);
      if (isNaN(parsedNo)) {
        return next(new ApiError("Nomor modul harus berupa angka", 400));
      }

      const checkNumber = await Module.findOne({
        where: {
          no: parsedNo,
          chapterId,
          id: { [Op.not]: id },
        },
      });

      if (checkNumber) {
        return next(new ApiError("Nomor modul sudah digunakan dalam chapter ini", 400));
      }
      updateData.no = parsedNo;
    }

    if (chapterId) {
      if (isNaN(chapterId)) {
        return next(new ApiError("Chapter ID harus berupa angka", 400));
      }

      const checkChapter = await Chapter.findByPk(chapterId);
      if (!checkChapter) {
        return next(new ApiError("Chapter tidak ditemukan, silahkan cek daftar chapter untuk melihat chapter yang tersedia", 404));
      }
      updateData.chapterId = chapterId;
    }

    if (req.file) {
      const uploadedVideo = await uploadVideo(req.file);
      if (!uploadedVideo || Object.keys(uploadedVideo).length === 0) {
        return next(new ApiError("Gagal upload file", 500));
      }
      updateData.videoUrl = uploadedVideo.videoUrl;
      updateData.duration = uploadedVideo.videoDuration;
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
      status: "Success",
      message: `Berhasil mengupdate data module id: ${id}`,
      data: updatedModule,
    });
  } catch (error) {
    return next(new ApiError(error, 500));
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
      status: "success",
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
