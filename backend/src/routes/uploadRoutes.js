const express = require("express");
const { authenticate, requireAdmin } = require("../middleware/auth");
const { uploadImage } = require("../controllers/uploadController");

const router = express.Router();
router.post(
  "/",
  authenticate,
  requireAdmin,
  express.raw({ type: ["image/png", "image/jpeg", "image/webp"], limit: "5mb" }),
  uploadImage
);

module.exports = router;
