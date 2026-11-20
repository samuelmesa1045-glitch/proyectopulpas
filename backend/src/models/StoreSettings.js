const mongoose = require("mongoose");

const storeSettingsSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: "store" },
  whatsappNumber: { type: String, required: true, match: /^\d{10,15}$/ },
  location: { type: String, required: true, trim: true, maxlength: 120 },
  tagline: { type: String, required: true, trim: true, maxlength: 120 },
}, { timestamps: true });

module.exports = mongoose.model("StoreSettings", storeSettingsSchema);
