const router = require("express").Router();

const Course = require("./courseRouter");
const Auth = require("./authRouter");
const Module = require("./moduleRoutes");
const Notification = require("./notificationRouter");

router.use("/api/v1/courses", Course);
router.use("/api/v1/auth", Auth);
router.use("/api/v1/courses", Course);
router.use("/api/v1/modules", Module);
router.use("/api/v1/notifications", Notification);

module.exports = router;
