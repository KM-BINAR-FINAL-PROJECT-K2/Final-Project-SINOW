const router = require("express").Router();

const Course = require("../controllers/courseController");
const authenticate = require("../middlewares/authenticate");
const checkRole = require("../middlewares/checkRole");
const uploader = require("../middlewares/uploader");

router.get("/", Course.getAllCourse);
router.get("/:id", Course.getCourseById);
router.delete("/:id", authenticate, checkRole("admin"), Course.deleteCourse);
router.post(
  "/",
  authenticate,
  checkRole("admin"),
  uploader.fields([{ name: "image" }, { name: "video" }]),
  Course.createCourse
);
router.put(
  "/:id",
  authenticate,
  checkRole("admin"),
  uploader.fields([{ name: "image" }, { name: "video" }]),
  Course.updateCourse
);

module.exports = router;
