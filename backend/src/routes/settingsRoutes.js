const express = require("express");
const { authenticate, requireAdmin } = require("../middleware/auth");
const { getSettings, updateSettings } = require("../controllers/settingsController");

const router = express.Router();
router.get("/", getSettings);
router.put("/", authenticate, requireAdmin, updateSettings);

module.exports = router;
