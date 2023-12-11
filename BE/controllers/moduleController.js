const { Op } = require('sequelize')
const { Module, Chapter, User } = require('../models')
const ApiError = require('../utils/ApiError')

const { uploadVideo } = require('../utils/imagekitUploader')

const createModule = async (req, res, next) => {
  try {
    let { no } = req.body
    const { name, chapterId } = req.body

    const missingFields = ['name', 'no', 'chapterId'].filter(
      (field) => !req.body[field],
    )
    if (missingFields.length > 0) {
      return next(
        new ApiError(`Field ${missingFields.join(', ')} harus di isi`, 400),
      )
    }

    if (Number.isNaN(Number(no)) || Number.isNaN(Number(chapterId))) {
      return next(new ApiError('Nomor dan chapterId harus berupa angka', 400))
    }
    no = parseInt(no, 10)

    if (!req.file) {
      return next(new ApiError('Harus menyertakan video', 400))
    }

    const checkChapter = await Chapter.findByPk(chapterId)
    if (!checkChapter) {
      return next(
        new ApiError(
          'Chapter tidak ditemukan, silahkan cek daftar chapter untuk melihat chapter yang tersedia',
          404,
        ),
      )
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
    })

    if (existingModule) {
      const errorMessage = []

      if (existingModule.name === name) {
        errorMessage.push('Nama modul sudah ada dalam chapter ini')
      }

      if (existingModule.no === no) {
        errorMessage.push('Nomor modul sudah digunakan dalam chapter ini')
      }

      if (errorMessage.length > 0) {
        return next(new ApiError(errorMessage.join(', '), 400))
      }
    }

    const uploadedFile = await uploadVideo(req.file, next)

    const module = await Module.create({
      name,
      no,
      videoUrl: uploadedFile.videoUrl,
      chapterId,
      duration: uploadedFile.videoDuration,
      createdBy: req.user.id,
    })

    return res.status(201).json({
      status: 'success',
      message: 'Berhasil menambahkan data module',
      data: module,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const getAllModule = async (req, res, next) => {
  try {
    const modules = await Module.findAll({
      include: [
        {
          model: Chapter,
          attributes: ['no', 'name'],
          as: 'chapter',
        },
        {
          model: User,
          as: 'moduleCreator',
          attributes: ['id', 'name'],
        },
        {
          model: User,
          as: 'users',
        },
      ],
      order: [['id', 'ASC']],
    })

    if (!modules || modules.length === 0) {
      return next(new ApiError('Module tidak ditemukan', 404))
    }

    return res.status(200).json({
      status: 'success',
      message: 'Berhasil mendapatkan data modules',
      data: modules,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}
const getModuleById = async (req, res, next) => {
  try {
    const { id } = req.params
    const module = await Module.findByPk(id, {
      include: [
        {
          model: Chapter,
          attributes: ['no', 'name'],
          as: 'chapter',
        },
        {
          model: User,
          as: 'moduleCreator',
          attributes: ['id', 'name'],
        },
        {
          model: User,
          as: 'users',
        },
      ],
    })

    if (!module) {
      return next(new ApiError('Module tidak ditemukan', 404))
    }

    return res.status(200).json({
      status: 'success',
      message: `Berhasil mendapatkan data module id: ${id};`,
      data: module,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const updateModule = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, no, chapterId } = req.body

    const module = await Module.findByPk(id)
    if (!module) {
      return next(new ApiError('Module tidak ditemukan', 404))
    }

    const updateData = {}

    if (name) {
      const existingModule = await Module.findOne({
        where: {
          name,
          chapterId: chapterId || module.chapterId,
          id: { [Op.not]: id },
        },
      })

      if (existingModule) {
        return next(new ApiError('Nama modul sudah ada dalam chapter ini', 400))
      }
      updateData.name = name
    }

    if (no) {
      const parsedNo = parseInt(no, 10)
      if (Number.isNaN(Number(parsedNo))) {
        return next(new ApiError('Nomor modul harus berupa angka', 400))
      }

      const checkNumber = await Module.findOne({
        where: {
          no: parsedNo,
          chapterId: chapterId || module.chapterId,
          id: { [Op.not]: id },
        },
      })

      if (checkNumber) {
        return next(
          new ApiError('Nomor modul sudah digunakan dalam chapter ini', 400),
        )
      }
      updateData.no = parsedNo
    }

    if (chapterId) {
      if (Number.isNaN(Number(chapterId))) {
        return next(new ApiError('Chapter ID harus berupa angka', 400))
      }

      const checkChapter = await Chapter.findByPk(chapterId)
      if (!checkChapter) {
        return next(
          new ApiError(
            'Chapter tidak ditemukan, silahkan cek daftar chapter untuk melihat chapter yang tersedia',
            404,
          ),
        )
      }
      updateData.chapterId = chapterId
    }

    if (req.file) {
      const uploadedVideo = await uploadVideo(req.file)
      if (!uploadedVideo || Object.keys(uploadedVideo).length === 0) {
        return next(new ApiError('Gagal upload video', 400))
      }
      updateData.videoUrl = uploadedVideo.videoUrl
      updateData.duration = uploadedVideo.videoDuration
    }

    await module.update(updateData)

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil mengupdate data module id: ${id}`,
      data: module,
    })
  } catch (error) {
    return next(new ApiError(error, 500))
  }
}
const deleteModule = async (req, res, next) => {
  try {
    const { id } = req.params
    const module = await Module.findByPk(id)

    if (!module) {
      return next(new ApiError('Module tidak ditemukan', 404))
    }

    await module.destroy()

    return res.status(200).json({
      status: 'success',
      message: `Berhasil menghapus data module id: ${id};`,
      data: module,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

module.exports = {
  createModule,
  getAllModule,
  getModuleById,
  deleteModule,
  updateModule,
}
