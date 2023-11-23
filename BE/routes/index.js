const router = require("express").Router();

const Course = require("./courseRouter");
const Auth = require("./authRouter");
const Module = require("./moduleRoutes");
const Category = require("./categoryRouter");
const Notification = require("./notificationRouter");
const User = require("./userRouter");

router.use("/api/v1/courses", Course);
router.use("/api/v1/auth", Auth);
router.use("/api/v1/courses", Course);
router.use("/api/v1/modules", Module);
router.use("/api/v1/category", Category);
router.use("/api/v1/notifications", Notification);
router.use("/api/v1/my-details", User);

module.exports = router;
