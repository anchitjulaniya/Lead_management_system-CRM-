const router = require("express").Router();

const leadController = require("../controllers/leadController");


const auth = require("../middlewares/authMiddleware");
const rbac = require("../middlewares/rbacMiddleware");

router.post("/", auth, rbac("lead:write"), leadController.createLead);

router.get("/", auth, rbac("lead:read"), leadController.getLeads);
router.patch('/:id', auth, rbac("lead:write"), leadController.updateLead);
router.delete('/:id', auth, rbac("lead:write"), leadController.deleteLead);
module.exports = router;