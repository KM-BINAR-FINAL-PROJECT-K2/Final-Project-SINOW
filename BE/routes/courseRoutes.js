const router = require("express").Router();
const Course = require("../controllers/courseController");

router.get("/", Course.getAllCourse);
router.get("/:id", Course.getCourseById);
router.delete("/:id", Course.deleteCourse);

module.exports = router;
