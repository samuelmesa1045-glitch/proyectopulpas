const test = require("node:test");
const assert = require("node:assert/strict");
const { calculatePromotionPrice } = require("../src/services/pricing");

test("applies percentage discounts and rounds to whole pesos", () => {
  assert.equal(calculatePromotionPrice(6500, { discountType: "percentage", discountValue: 15 }), 5525);
  assert.equal(calculatePromotionPrice(5501, { discountType: "percentage", discountValue: 10 }), 4951);
});

test("applies fixed discounts without allowing a negative price", () => {
  assert.equal(calculatePromotionPrice(7000, { discountType: "fixed", discountValue: 1200 }), 5800);
  assert.equal(calculatePromotionPrice(7000, { discountType: "fixed", discountValue: 9000 }), 0);
});
