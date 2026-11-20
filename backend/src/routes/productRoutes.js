const express = require("express");
const { authenticate, requireAdmin } = require("../middleware/auth");
const {
  createProduct,
  deleteProduct,
  getAdminProducts,
  getFeaturedProducts,
  getProducts,
  seedProducts,
  updateProduct,
} = require("../controllers/productController");

const router = express.Router();

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/admin", authenticate, requireAdmin, getAdminProducts);
router.post("/", authenticate, requireAdmin, createProduct);
router.post("/seed", authenticate, requireAdmin, seedProducts);
router.put("/:id", authenticate, requireAdmin, updateProduct);
router.delete("/:id", authenticate, requireAdmin, deleteProduct);

module.exports = router;
