const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 80 },
  description: { type: String, trim: true, maxlength: 300, default: "" },
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }],
  discountType: { type: String, enum: ["percentage", "fixed"], required: true },
  discountValue: { type: Number, required: true, min: 0.01 },
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  image: { type: String, trim: true, maxlength: 500, default: "" },
  active: { type: Boolean, default: true },
}, { timestamps: true });

promotionSchema.index({ active: 1, startsAt: 1, endsAt: 1 });
promotionSchema.index({ productIds: 1 });

module.exports = mongoose.model("Promotion", promotionSchema);
