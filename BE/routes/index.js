const router = require("express").Router();

const Course = require("./courseRouter");
const Auth = require("./authRouter");
const Module = require("./moduleRoutes");
const Category = require("./categoryRouter");
const Notification = require("./notificationRouter");
const User = require("./userRouter");
const Module = require("./moduleRouter");
const Notification = require("./notificationRouter");
const Chapter = require("./chapterRouter");

router.use("/api/v1/courses", Course);
router.use("/api/v1/auth", Auth);
router.use("/api/v1/courses", Course);
router.use("/api/v1/modules", Module);
router.use("/api/v1/category", Category);
router.use("/api/v1/notifications", Notification);
router.use("/api/v1/my-details", User);
router.use("/api/v1/chapter", Chapter);

module.exports = router;
