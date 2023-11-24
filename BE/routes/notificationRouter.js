const router = require("express").Router();
const Notification = require("../controllers/notificationController");
const authenticate = require("../middlewares/authenticate");
const checkRole = require("../middlewares/checkRole");

router.post(
  "/push-notification",
  authenticate,
  checkRole("admin"),
  Notification.createNotificationForAllUsers
);

router.get(
  "/get-all",
  authenticate,
  checkRole("admin"),
  Notification.getAllNotifications
);

router.get("/user", authenticate, Notification.getUserNotification);
router.get("/user/:id", authenticate, Notification.openNotification);
router.delete(
  "/delete-by-id/:id",
  authenticate,
  checkRole("admin"),
  Notification.deleteNotificationById
);
router.delete(
  "/delete-by-title/:title",
  authenticate,
  checkRole("admin"),
  Notification.deleteNotificationByTitle
);
router.put(
  "/:id",
  authenticate,
  checkRole("admin"),
  Notification.updateNotification
);

module.exports = router;
