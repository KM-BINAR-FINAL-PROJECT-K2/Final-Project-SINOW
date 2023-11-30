const { Transaction } = require("../models");
const Midtrans = require("midtrans-client");
const ApiError = require("../utils/ApiError");

const snap = new Midtrans.Snap({
  // Set to true if you want Production Environment (accept real transaction).
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

const getAllTransaction = async (req, res, next) => {
  try {
    const purchases = await Purchase.findAll();
    res.status(200).json({
      status: "Success",
      message: "sukses mengambil data purchase",
      data: purchases,
    });
  } catch (error) {
    return next(new ApiError((error.message = 500)));
  }
};

const createTransaction = async (req, res, next) => {
  const { id, productName, price, quantity } = req.body;

  try {
    const parameter = {
      item_details: {
        id: id,
        price: price,
        quantity: quantity,
        name: productName,
      },
      transaction_details: {
        order_id: id,
        gross_amount: price + (price * 11) / 100,
      },
    };

    const token = await snap.createTransactionToken(parameter);
    res.status(201).json({
      status: "Success",
      message: "sukses membuat transaksi",
      data: token,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};
