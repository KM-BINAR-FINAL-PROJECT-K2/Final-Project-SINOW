const router = require("express").Router();

const User = require("../controllers/userController");
const authenticate = require("../middlewares/authenticate");

router.get("/", authenticate, User.myDetails);
router.put("/update", authenticate, User.updateMyDetails);
router.put("/change-password", authenticate, User.changeMyPassword);

module.exports = router;
