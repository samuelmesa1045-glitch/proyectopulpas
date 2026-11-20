const mongoose = require("mongoose");
const Category = require("../models/Category");
const Product = require("../models/Product");
const Promotion = require("../models/Promotion");
const { getPromotedProducts } = require("../services/pricing");

const promotionStatus = (promotion, now = new Date()) => {
  if (!promotion.active) return "paused";
  if (new Date(promotion.startsAt) > now) return "scheduled";
  if (new Date(promotion.endsAt) <= now) return "expired";
  return "active";
};

const getPublicPromotions = async (req, res, next) => {
  try {
    const now = new Date();
    const promotions = await Promotion.find({ active: true, startsAt: { $lte: now }, endsAt: { $gt: now } }).sort({ endsAt: 1 }).lean();
    if (!promotions.length) return res.json([]);
    const categoryNames = (await Category.find({ active: true }).select("name").lean()).map((category) => category.name);
    const selectedIds = promotions.flatMap((promotion) => promotion.productIds);
    const products = await Product.find({ _id: { $in: selectedIds }, active: true, category: { $in: categoryNames } }).lean();
    const priced = await getPromotedProducts(products, now);
    const productMap = new Map(priced.map((product) => [String(product._id), product]));
    const visible = promotions.map((promotion) => ({
      ...promotion,
      products: promotion.productIds.map((id) => productMap.get(String(id))).filter(Boolean),
    })).filter((promotion) => promotion.products.length);
    return res.json(visible);
  } catch (error) { return next(error); }
};

const getAdminPromotions = async (req, res, next) => {
  try {
    const now = new Date();
    const promotions = await Promotion.find().sort({ startsAt: -1 }).lean();
    const productIds = [...new Set(promotions.flatMap((promotion) => promotion.productIds.map(String)))];
    const products = await Product.find({ _id: { $in: productIds } }).select("name price").lean();
    const productMap = new Map(products.map((product) => [String(product._id), product]));
    return res.json(promotions.map((promotion) => ({
      ...promotion,
      status: promotionStatus(promotion, now),
      products: promotion.productIds.map((id) => productMap.get(String(id))).filter(Boolean),
    })));
  } catch (error) { return next(error); }
};

const validImage = (image) => !image || image.length <= 500 && (
  (image.startsWith("/images/") && !image.includes(".."))
  || (image.startsWith("/api/uploads/") && !image.includes(".."))
  || /^https:\/\//i.test(image)
);

const parsePromotion = async (body, existing = {}, currentId) => {
  const title = String(body.title ?? existing.title ?? "").trim();
  const description = String(body.description ?? existing.description ?? "").trim();
  const image = String(body.image ?? existing.image ?? "").trim();
  const discountType = body.discountType ?? existing.discountType;
  const discountValue = Number(body.discountValue ?? existing.discountValue);
  const startsAt = new Date(body.startsAt ?? existing.startsAt);
  const endsAt = new Date(body.endsAt ?? existing.endsAt);
  const active = body.active === undefined ? (existing.active ?? true) : body.active === true;
  const rawProductIds = body.productIds ?? existing.productIds ?? [];
  if (!Array.isArray(rawProductIds)) throw Object.assign(new Error("Selecciona productos válidos para la promoción."), { status: 400 });
  const productIds = [...new Set(rawProductIds.map(String))];

  if (!title || title.length > 80) throw Object.assign(new Error("Escribe un título de hasta 80 caracteres."), { status: 400 });
  if (description.length > 300) throw Object.assign(new Error("La descripción admite hasta 300 caracteres."), { status: 400 });
  if (!validImage(image)) throw Object.assign(new Error("Usa una imagen local de JuliT-REX o un enlace HTTPS."), { status: 400 });
  if (!["percentage", "fixed"].includes(discountType)) throw Object.assign(new Error("Selecciona porcentaje o descuento fijo."), { status: 400 });
  if (!Number.isFinite(discountValue) || discountValue <= 0 || discountType === "percentage" && discountValue > 100) {
    throw Object.assign(new Error("El descuento debe ser mayor que cero y el porcentaje no puede superar 100%."), { status: 400 });
  }
  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime()) || startsAt >= endsAt) {
    throw Object.assign(new Error("La fecha de finalización debe ser posterior a la fecha de inicio."), { status: 400 });
  }
  if (!productIds.length || productIds.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
    throw Object.assign(new Error("Selecciona al menos un producto válido."), { status: 400 });
  }

  const visibleCategories = await Category.find({ active: true }).select("name").lean();
  const products = await Product.find({ _id: { $in: productIds }, active: true, category: { $in: visibleCategories.map((category) => category.name) } }).select("_id price").lean();
  if (products.length !== productIds.length) {
    throw Object.assign(new Error("Solo puedes promocionar productos publicados en categorías visibles."), { status: 400 });
  }
  if (discountType === "fixed" && products.some((product) => discountValue > product.price)) {
    throw Object.assign(new Error("El descuento fijo no puede superar el precio de ninguno de los productos elegidos."), { status: 400 });
  }

  if (active) {
    const overlap = await Promotion.exists({
      ...(currentId ? { _id: { $ne: currentId } } : {}),
      active: true,
      productIds: { $in: productIds },
      startsAt: { $lt: endsAt },
      endsAt: { $gt: startsAt },
    });
    if (overlap) throw Object.assign(new Error("Uno de esos productos ya tiene otra promoción activa o programada en ese periodo."), { status: 409 });
  }

  return { title, description, image, discountType, discountValue, startsAt, endsAt, active, productIds };
};

const createPromotion = async (req, res, next) => {
  try {
    const promotion = await Promotion.create(await parsePromotion(req.body));
    return res.status(201).json({ ...promotion.toObject(), status: promotionStatus(promotion) });
  } catch (error) { return next(error); }
};

const updatePromotion = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "La promoción seleccionada no es válida." });
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) return res.status(404).json({ message: "No encontramos esa promoción." });
    Object.assign(promotion, await parsePromotion(req.body, promotion.toObject(), promotion._id));
    await promotion.save();
    return res.json({ ...promotion.toObject(), status: promotionStatus(promotion) });
  } catch (error) { return next(error); }
};

const deletePromotion = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "La promoción seleccionada no es válida." });
    const result = await Promotion.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "No encontramos esa promoción." });
    return res.status(204).end();
  } catch (error) { return next(error); }
};

module.exports = { getPublicPromotions, getAdminPromotions, createPromotion, updatePromotion, deletePromotion };
