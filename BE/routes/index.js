const router = require("express").Router();

const Course = require("./courseRoutes");

router.use("/api/v1/courses", Course);

module.exports = router;
