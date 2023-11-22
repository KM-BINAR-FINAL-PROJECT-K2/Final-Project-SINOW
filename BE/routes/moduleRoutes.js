const router = require("express").Router();

const Module = require("../controllers/moduleController");
// const authenticate = require("../middlewares/authenticate");
// const authentication = require("../middlewares/authenticate");
// const checkRole = require("../middlewares/checkRole");
const uploader = require("../middlewares/uploader");

router.post("/", uploader.single("video"), Module.createModule);
router.get("/", Module.getAllModule);
router.get("/:id", Module.getModuleById);
router.delete("/:id", Module.deleteModule);

module.exports = router;
