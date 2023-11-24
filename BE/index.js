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

app.all("*", (req, res, next) => {
  next(new ApiError("Routes tidak tersedia", 404));
});

app.use(errorController);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server berjalan di port: ${port}`);
});
