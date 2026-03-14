const router = require("express").Router();

const auth = require("../middlewares/authMiddleware");
const rbac = require("../middlewares/rbacMiddleware");

const notificationController = require("../controllers/notificationController");

router.get(
  "/",
  auth,
  rbac("notification:read"),
  notificationController.getNotifications
);

router.patch(
  "/:id/read",
  auth,
  rbac("notification:read"),
  notificationController.markAsRead
);

module.exports = router;