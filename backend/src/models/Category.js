const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 50 },
  slug: { type: String, required: true, trim: true, lowercase: true, unique: true, maxlength: 60 },
  description: { type: String, trim: true, maxlength: 240, default: "" },
  image: { type: String, trim: true, maxlength: 500, default: "" },
  active: { type: Boolean, default: false },
  isSystem: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

categorySchema.index({ name: 1 }, { unique: true, name: "unique_category_name" });

module.exports = mongoose.model("Category", categorySchema);
