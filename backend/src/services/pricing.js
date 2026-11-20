const Promotion = require("../models/Promotion");

const calculatePromotionPrice = (price, promotion) => promotion.discountType === "percentage"
  ? Math.max(0, Math.round(price * (1 - promotion.discountValue / 100)))
  : Math.max(0, price - promotion.discountValue);

const getPromotedProducts = async (products, now = new Date()) => {
  if (!products.length) return [];
  const productIds = products.map((product) => product._id);
  const promotions = await Promotion.find({
    active: true,
    startsAt: { $lte: now },
    endsAt: { $gt: now },
    productIds: { $in: productIds },
  }).lean();
  const byProduct = new Map();

  for (const promotion of promotions) {
    for (const id of promotion.productIds) {
      const key = String(id);
      const current = byProduct.get(key) || [];
      current.push(promotion);
      byProduct.set(key, current);
    }
  }

  return products.map((document) => {
    const product = typeof document.toObject === "function" ? document.toObject() : document;
    const candidates = byProduct.get(String(product._id)) || [];
    const offers = candidates.map((promotion) => ({ promotion, price: calculatePromotionPrice(product.price, promotion) }))
      .sort((a, b) => a.price - b.price);
    const best = offers[0];
    if (!best || best.price >= product.price) return { ...product, originalPrice: product.price };
    return {
      ...product,
      originalPrice: product.price,
      salePrice: best.price,
      promotion: {
        id: String(best.promotion._id),
        title: best.promotion.title,
        endsAt: best.promotion.endsAt,
      },
    };
  });
};

module.exports = { getPromotedProducts, calculatePromotionPrice };
