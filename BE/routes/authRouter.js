const router = require("express").Router();

const Auth = require("../controllers/authController");
const authenticate = require("../middlewares/authenticate");

router.post("/register", Auth.register);
router.post("/login", Auth.login);
router.get("/check-token", authenticate, Auth.checkToken);
router.post("/verify-email", Auth.verifyEmail);
router.post("/resend-otp", Auth.resendOtp);

router.post("/reset-password", Auth.reqResetPassword);
router.post("/reset-password/:token", Auth.resetPassword);

module.exports = router;
