const express = require("express");
const { authenticate, requireAdmin } = require("../middleware/auth");
const { getPublicPromotions, getAdminPromotions, createPromotion, updatePromotion, deletePromotion } = require("../controllers/promotionController");

const router = express.Router();
router.get("/", getPublicPromotions);
router.get("/admin", authenticate, requireAdmin, getAdminPromotions);
router.post("/", authenticate, requireAdmin, createPromotion);
router.put("/:id", authenticate, requireAdmin, updatePromotion);
router.delete("/:id", authenticate, requireAdmin, deletePromotion);

module.exports = router;
