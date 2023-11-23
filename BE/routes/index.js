const router = require("express").Router();

const Course = require("./courseRouter");
const Auth = require("./authRouter");
const Course = require("./courseRoutes");
const Module = require("./moduleRoutes");

router.use("/api/v1/courses", Course);
router.use("/api/v1/auth", Auth);
router.use("/api/v1/courses", Course);
router.use("/api/v1/modules", Module);

module.exports = router;
