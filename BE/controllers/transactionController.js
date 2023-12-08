const { Transaction, Course } = require("../models");
const Midtrans = require("midtrans-client");
const ApiError = require("../utils/ApiError");

const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

const getAllTransaction = async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll();

    if (!transactions || transactions.length === 0) {
      return next(new ApiError("Data transaction masih kosong", 404));
    }
    res.status(200).json({
      status: "Success",
      message: "sukses mengambil data purchase",
      data: transactions,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const user = req.user;

    const checkTransaction = await Transaction.findOne({
      where: {
        userId: user.id,
        courseId,
      },
    });

    if (checkTransaction) {
      return next(new ApiError("Anda sudah membeli course ini", 400));
    }

    const course = await Course.findByPk(courseId);

    if (!course) {
      return next(new ApiError("Course tidak ditemukan", 404));
    }

    if (course.type !== "premium") {
      return next(new ApiError("Bukan course premium", 400));
    }

    const promoPrice = course.price - (course.price * course.promo) / 100;
    const totalPrice = promoPrice + (promoPrice * 11) / 100;

    const newTransaction = await Transaction.create({
      userId: user.id,
      courseId,
      coursePrice: totalPrice,
      totalPrice,
      promo: course.promo,
      status: "pending",
    });
    const parameter = {
      item_details: [
        {
          id: course.id,
          price: totalPrice,
          name: course.name,
          quantity: 1,
        },
      ],
      customer_details: {
        first_name: user.name,
        email: "muhammadfadhlan0011@gmail.com",
        phone: user.Auth.phoneNumber,
        customer_details_required_fields: ["first_name", "phone", "email"],
      },
      transaction_details: {
        order_id: newTransaction.id,
        gross_amount: totalPrice,
      },
      usage_limit: 1,
    };

    const midtransResponseData = await snap.createTransaction(parameter);

    res.status(201).json({
      status: "Success",
      message: "sukses membuat transaksi",
      data: midtransResponseData,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const paymentFinalize = async (req, res, next) => {
  try {
    const { transaction_status, fraud_status, order_id } = req.body;

    const transaction = await Transaction.findByPk(order_id);
    if (!transaction) {
      return next(new ApiError("Transaksi tidak ditemukan", 404));
    }

    if (transaction.status === "success") {
      return next(new ApiError("Transaksi sudah berhasil", 400));
    }

    if (transaction.status === "failed") {
      return next(new ApiError("Transaksi gagal", 400));
    }

    if (
      transaction_status === "capture" ||
      transaction_status === "settlement"
    ) {
      if (fraud_status === "accept") {
        transaction.status = "success";
        await transaction.save();
      } else {
        transaction.status = "failed";
        await transaction.save();
      }
    }

    if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      transaction.status = "failed";
      await transaction.save();
    }

    res.status(200).json({
      status: "Success",
      message: "sukses melakukan transaksi",
      data: {
        transaction_status,
        fraud_status,
        order_id,
        gross_amount,
        item_details,
      },
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

module.exports = {
  getAllTransaction,
  createTransaction,
  paymentFinalize,
};
