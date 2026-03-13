const permissions = require("../utils/permissions");

module.exports = (permission) => {

  return (req, res, next) => {

    const role = req.user.role;

    if (!permissions[role].includes(permission)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};