require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const ApiError = require("./utils/ApiError");
const errorController = require("./controllers/errorController");
const router = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(router);

app.use("/", (req, res, next) => {
  if (req.originalUrl === "/") {
    res.status(301).redirect(`${process.env.BASE_URL}/api-docs`);
  } else {
    next();
  }
});

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "Failed",
    message: `Halaman tidak ditemukan, silahkan cek dokumentasi ${process.env.BASE_URL}/api-docs/`,
  });
});

app.use(errorController);

module.exports = app;
