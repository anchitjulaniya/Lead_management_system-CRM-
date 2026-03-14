const permissions = require("../utils/permissions");

module.exports = (permission) => {

  return (req, res, next) => {

    const role = req.user.role;

    const rolePermissions = permissions[role] || [];

     if (!rolePermissions.includes(permission)) {

      return res.status(403).json({
        message: "Forbidden"
      });

    }

    next();
  };
};