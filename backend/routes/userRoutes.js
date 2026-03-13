const router = require("express").Router();

const auth = require("../middlewares/authMiddleware");
const rbac = require("../middlewares/rbacMiddleware");

const userController = require("../controllers/userController");


router.get(
  "/",
  auth,
  rbac("user:read"),
  userController.getUsers
);

/*
PATCH /users/:id/role
Admin only
*/
router.patch(
  "/:id/role",
  auth,
  rbac("user:write"),
  userController.updateUserRole
);

module.exports = router;