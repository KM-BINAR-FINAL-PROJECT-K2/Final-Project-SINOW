const { Notification, User } = require("../models");
const ApiError = require("../utils/ApiError");
const { Op } = require("sequelize");

const createNotificationForAllUsers = async (req, res, next) => {
  try {
    const { type, title, content } = req.body;

    if (!type || !title || !content) {
      return next(
        new ApiError("type, title, content tidak boleh kosong!", 400)
      );
    }
    const users = await User.findAll({
      where: {
        role: "user",
      },
    });

    const notificationsData = users.map((user) => ({
      type,
      title,
      content,
      userId: user.id,
      isRead: false,
    }));

    await Notification.bulkCreate(notificationsData);

    res.status(201).json({
      status: "Success",
      message: "Notifications berhasil dibuat",
    });
  } catch (err) {
    return next(new ApiError(err.message, 500));
  }
};

const getAllNotifications = async (req, res, next) => {
  try {
    const { limit = 100, type, title, userId } = req.query;

    if (isNaN(limit) || limit <= 0) {
      return next(new ApiError("Batas jumlah notifikasi tidak valid", 400));
    }
    if (limit > 500) {
      return next(new ApiError("Batas notifikasi maksimal adalah 500", 400));
    }

    if (userId && (isNaN(userId) || userId <= 0)) {
      return next(new ApiError("ID pengguna tidak valid", 400));
    }

    const where = {};

    if (type) {
      where.type = {
        [Op.iLike]: `%${type}%`,
      };
    }

    if (title) {
      where.title = {
        [Op.iLike]: `%${title}%`,
      };
    }

    if (userId) {
      where.userId = userId;
    }

    const notifications = await Notification.findAll({
      where,
      limit,
      order: [["updatedAt", "DESC"]],
    });

    if (!notifications || notifications.length === 0) {
      return next(new ApiError("Tidak ada notifikasi", 404));
    }

    res.status(200).json({
      status: "Success",
      data: notifications,
    });
  } catch (err) {
    return next(new ApiError(err.message, 500));
  }
};

const updateNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, title, content } = req.body;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return next(new ApiError("Notifikasi tidak ditemukan", 404));
    }

    const updateData = {};

    if (type) {
      updateData.type = type;
    }

    if (title) {
      updateData.title = title;
    }

    if (content) {
      updateData.content = content;
    }

    const [rowCount, [updatedNotification]] = await Notification.update(
      updateData,
      {
        where: {
          id,
        },
        returning: true,
      }
    );

    if (rowCount === 0 || !updatedNotification) {
      return next(new ApiError("Notifikasi tidak ditemukan", 404));
    }

    res.status(200).json({
      status: "Success",
      message: "Notifikasi diperbarui",
    });
  } catch (err) {
    return next(new ApiError(err.message, 500));
  }
};

const deleteNotificationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedNotification = await Notification.destroy({
      where: {
        id,
      },
    });

    if (!deletedNotification) {
      return next(new ApiError("Notifikasi tidak ditemukan", 404));
    }

    res.status(200).json({
      status: "Success",
      message: `Berhasil menghapus notifikasi dengan id: ${id}`,
    });
  } catch (err) {
    return next(new ApiError(err.message, 500));
  }
};
const deleteNotificationByTitle = async (req, res, next) => {
  try {
    const { title } = req.params;

    const deletedNotification = await Notification.destroy({
      where: {
        title,
      },
    });

    if (!deletedNotification) {
      return next(new ApiError("Notifikasi tidak ditemukan", 404));
    }

    res.status(200).json({
      status: "Success",
      message: `Berhasil menghapus notifikasi dengan id: ${title}`,
    });
  } catch (err) {
    return next(new ApiError(err.message, 500));
  }
};

module.exports = {
  createNotificationForAllUsers,
  getAllNotifications,
  updateNotification,
  deleteNotificationById,
  deleteNotificationByTitle,
};
