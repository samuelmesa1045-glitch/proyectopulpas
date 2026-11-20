const express = require("express");
const { authenticate, requireAdmin } = require("../middleware/auth");
const { getPublicCategories, getAdminCategories, createCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");

const router = express.Router();
router.get("/", getPublicCategories);
router.get("/admin", authenticate, requireAdmin, getAdminCategories);
router.post("/", authenticate, requireAdmin, createCategory);
router.put("/:id", authenticate, requireAdmin, updateCategory);
router.delete("/:id", authenticate, requireAdmin, deleteCategory);

module.exports = router;
