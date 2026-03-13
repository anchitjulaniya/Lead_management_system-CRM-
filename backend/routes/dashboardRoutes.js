const router = require("express").Router();

const auth = require("../middlewares/authMiddleware");
const rbac = require("../middlewares/rbacMiddleware");

const dashboardController = require("../controllers/dashboardController");

/*
GET /dashboard/summary
Dashboard analytics
*/
router.get(
  "/summary",
  auth,
  rbac("dashboard:read"),
  dashboardController.getSummary
);

module.exports = router;