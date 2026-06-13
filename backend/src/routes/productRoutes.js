const express = require("express");
const {
  createProduct,
  getFeaturedProducts,
  getProducts,
  seedProducts,
} = require("../controllers/productController");

const router = express.Router();

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.post("/", createProduct);
router.post("/seed", seedProducts);

module.exports = router;
