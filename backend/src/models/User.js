const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ["buyer", "admin"], default: "buyer" },
  customerType: { type: String, enum: ["person", "company"], default: "person" },
  documentType: { type: String, trim: true },
  documentNumber: { type: String, trim: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  companyName: { type: String, trim: true },
  taxId: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
