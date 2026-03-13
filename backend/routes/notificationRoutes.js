const router = require("express").Router();

const auth = require("../middlewares/authMiddleware");
const rbac = require("../middlewares/rbacMiddleware");

const notificationController = require("../controllers/notificationController");

/*
GET /notifications
Get notifications for logged-in user
*/
router.get(
  "/",
  auth,
  rbac("notification:read"),
  notificationController.getNotifications
);

/*
PATCH /notifications/:id/read
Mark notification as read
*/
router.patch(
  "/:id/read",
  auth,
  rbac("notification:read"),
  notificationController.markAsRead
);

module.exports = router;