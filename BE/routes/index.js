const router = require("express").Router();

const Course = require("./courseRouter");
const Auth = require("./authRouter");

router.use("/api/v1/courses", Course);
router.use("/api/v1/auth", Auth);

module.exports = router;
