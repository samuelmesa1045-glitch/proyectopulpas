const Category = require("../models/Category");
const Product = require("../models/Product");

const slugify = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const validImage = (image) => !image || (image.length <= 500 && (
  (image.startsWith("/images/") && !image.includes(".."))
  || (image.startsWith("/api/uploads/") && !image.includes(".."))
  || /^https:\/\//i.test(image)
));

const productCounts = async (names) => {
  const grouped = await Product.aggregate([
    { $match: { active: true, category: { $in: names } } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);
  return new Map(grouped.map((item) => [item._id, item.count]));
};

const getPublicCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ active: true }).sort({ sortOrder: 1, name: 1 }).lean();
    const counts = await productCounts(categories.map((category) => category.name));
    return res.json(categories.filter((category) => counts.has(category.name))
      .map((category) => ({ ...category, productCount: counts.get(category.name) })));
  } catch (error) { return next(error); }
};

const getAdminCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1, name: 1 }).lean();
    const grouped = await Product.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]);
    const counts = new Map(grouped.map((item) => [item._id, item.count]));
    return res.json(categories.map((category) => ({ ...category, productCount: counts.get(category.name) || 0 })));
  } catch (error) { return next(error); }
};

const parseCategory = (body, existing = {}) => {
  const name = String(body.name ?? existing.name ?? "").trim();
  const description = String(body.description ?? existing.description ?? "").trim();
  const image = String(body.image ?? existing.image ?? "").trim();
  const sortOrder = Number(body.sortOrder ?? existing.sortOrder ?? 50);
  if (!name || name.length > 50) throw Object.assign(new Error("Escribe un nombre de categoría de hasta 50 caracteres."), { status: 400 });
  if (description.length > 240) throw Object.assign(new Error("La descripción admite hasta 240 caracteres."), { status: 400 });
  if (!validImage(image)) throw Object.assign(new Error("Usa una imagen local de JuliT-REX o un enlace HTTPS."), { status: 400 });
  if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 999) throw Object.assign(new Error("El orden debe ser un número entre 0 y 999."), { status: 400 });
  return {
    name,
    slug: existing.slug || slugify(name),
    description,
    image,
    sortOrder,
    active: body.active === undefined ? (existing.active ?? false) : body.active === true,
  };
};

const createCategory = async (req, res, next) => {
  try {
    const fields = parseCategory(req.body);
    if (!fields.slug) return res.status(400).json({ message: "El nombre debe incluir letras o números." });
    const category = await Category.create({ ...fields, isSystem: false });
    return res.status(201).json({ ...category.toObject(), productCount: 0 });
  } catch (error) { return next(error); }
};

const updateCategory = async (req, res, next) => {
  try {
    if (!/^[a-f\d]{24}$/i.test(req.params.id)) return res.status(400).json({ message: "La categoría seleccionada no es válida." });
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "No encontramos esa categoría." });
    const previousName = category.name;
    const fields = parseCategory(req.body, category.toObject());
    if (fields.name !== previousName) {
      const duplicate = await Category.exists({ name: fields.name, _id: { $ne: category._id } });
      if (duplicate) return res.status(409).json({ message: "Ya existe una categoría con ese nombre." });
      await Product.updateMany({ category: previousName }, { $set: { category: fields.name } });
    }
    Object.assign(category, fields);
    await category.save();
    const productCount = await Product.countDocuments({ category: category.name });
    return res.json({ ...category.toObject(), productCount });
  } catch (error) { return next(error); }
};

const deleteCategory = async (req, res, next) => {
  try {
    if (!/^[a-f\d]{24}$/i.test(req.params.id)) return res.status(400).json({ message: "La categoría seleccionada no es válida." });
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "No encontramos esa categoría." });
    if (category.isSystem) return res.status(409).json({ message: "Las categorías base se pueden ocultar, pero no eliminar." });
    if (await Product.exists({ category: category.name })) return res.status(409).json({ message: "Retira o reasigna los productos antes de eliminar esta categoría." });
    await category.deleteOne();
    return res.status(204).end();
  } catch (error) { return next(error); }
};

module.exports = { getPublicCategories, getAdminCategories, createCategory, updateCategory, deleteCategory };
