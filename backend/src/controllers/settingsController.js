const StoreSettings = require("../models/StoreSettings");

const getSettings = async (req, res, next) => {
  try {
    const settings = await StoreSettings.findOne({ key: "store" }).lean();
    if (!settings) return res.status(503).json({ message: "La configuración de tienda aún no está disponible." });
    return res.json(settings);
  } catch (error) { return next(error); }
};

const updateSettings = async (req, res, next) => {
  try {
    const whatsappNumber = String(req.body.whatsappNumber || "").replace(/\D/g, "");
    const location = String(req.body.location || "").trim();
    const tagline = String(req.body.tagline || "").trim();
    if (!/^\d{10,15}$/.test(whatsappNumber)) return res.status(400).json({ message: "El WhatsApp debe incluir entre 10 y 15 dígitos, con código de país." });
    if (!location || location.length > 120) return res.status(400).json({ message: "Escribe una ubicación de hasta 120 caracteres." });
    if (!tagline || tagline.length > 120) return res.status(400).json({ message: "Escribe un eslogan de hasta 120 caracteres." });
    const settings = await StoreSettings.findOneAndUpdate(
      { key: "store" },
      { $set: { whatsappNumber, location, tagline } },
      { new: true, runValidators: true }
    );
    return res.json(settings);
  } catch (error) { return next(error); }
};

module.exports = { getSettings, updateSettings };
