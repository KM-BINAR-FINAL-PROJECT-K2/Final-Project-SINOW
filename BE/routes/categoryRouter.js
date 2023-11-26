const router = require("express").Router();
const uploader = require("../middlewares/uploader");
const Category = require("../controllers/categoryController");
const authenticate = require("../middlewares/authenticate");
const checkRole = require("../middlewares/checkRole");

router.get("/", Category.getAllCategory);
router.get("/:id", Category.getCategoryById);
router.post(
  "/",
  authenticate,
  checkRole("admin"),
  uploader.single("image"),
  Category.createCategory
);
router.put(
  "/:id",
  authenticate,
  checkRole("admin"),
  uploader.single("image"),
  Category.updateCategory
);
router.delete(
  "/:id",
  authenticate,
  checkRole("admin"),
  Category.deleteCategory
);

module.exports = router;
