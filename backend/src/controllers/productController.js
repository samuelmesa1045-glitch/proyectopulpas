const Product = require("../models/Product");
const Category = require("../models/Category");
const Promotion = require("../models/Promotion");
const initialProducts = require("../data/initialProducts");
const { getPromotedProducts } = require("../services/pricing");

const getProducts = async (req, res, next) => {
  try {
    const visibleCategories = await Category.find({ active: true }).select("name slug").lean();
    let categoryNames = visibleCategories.map((category) => category.name);
    if (req.query.category) {
      const selected = visibleCategories.find((category) =>
        category.slug === String(req.query.category).trim() || category.name === String(req.query.category).trim()
      );
      if (!selected) return res.json([]);
      categoryNames = [selected.name];
    }
    const filter = { active: true, category: { $in: categoryNames } };
    const products = await Product.find(filter).sort({
      featured: -1,
      name: 1,
    });

    res.json(await getPromotedProducts(products));
  } catch (error) {
    next(error);
  }
};

const getFeaturedProducts = async (req, res, next) => {
  try {
    const pulpas = await Category.findOne({ slug: "pulpas", active: true }).lean();
    if (!pulpas) return res.json([]);
    const products = await Product.find({
      active: true,
      featured: true,
      category: pulpas.name,
    }).sort({ name: 1 });

    res.json(await getPromotedProducts(products));
  } catch (error) {
    next(error);
  }
};

const getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ category: 1, name: 1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const parseProductInput = (body, existing = {}) => {
  const name = String(body.name ?? existing.name ?? "").trim();
  const category = String(body.category ?? existing.category ?? "Pulpas").trim();
  const image = String(body.image ?? existing.image ?? "").trim();
  const description = String(body.description ?? existing.description ?? "").trim();
  const price = Number(body.price ?? existing.price);
  const stock = Number(body.stock ?? existing.stock ?? 0);
  const validImage = ((image.startsWith("/images/") || image.startsWith("/api/uploads/")) && !image.includes("..")) || /^https:\/\//i.test(image);

  if (!name || name.length > 100) throw Object.assign(new Error("Escribe un nombre de hasta 100 caracteres."), { status: 400 });
  if (!Number.isInteger(price) || price < 1) throw Object.assign(new Error("El precio debe ser un valor entero mayor que cero."), { status: 400 });
  if (!category || category.length > 50) throw Object.assign(new Error("Escribe una categoría de hasta 50 caracteres."), { status: 400 });
  if (!validImage || image.length > 500) throw Object.assign(new Error("Usa una imagen local de la tienda o un enlace HTTPS."), { status: 400 });
  if (!Number.isInteger(stock) || stock < 0) throw Object.assign(new Error("El inventario debe ser un número entero igual o mayor a cero."), { status: 400 });
  if (description.length > 300) throw Object.assign(new Error("La descripción admite hasta 300 caracteres."), { status: 400 });

  const product = { name, price, image, description, category, stock };
  if (body.featured !== undefined) product.featured = body.featured === true;
  else if (existing.featured !== undefined) product.featured = existing.featured;
  if (body.active !== undefined) product.active = body.active === true;
  else if (existing.active !== undefined) product.active = existing.active;
  return product;
};

const createProduct = async (req, res, next) => {
  try {
    const values = parseProductInput(req.body);
    if (!(await Category.exists({ name: values.category }))) {
      return res.status(400).json({ message: "Selecciona una categoría que exista." });
    }
    const product = await Product.create(values);

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
      return res.status(400).json({ message: "El producto seleccionado no es válido." });
    }
    const existing = await Product.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "No encontramos ese producto." });
    const values = parseProductInput(req.body, existing.toObject());
    if (!(await Category.exists({ name: values.category }))) {
      return res.status(400).json({ message: "Selecciona una categoría que exista." });
    }
    Object.assign(existing, values);
    await existing.save();
    return res.json(existing);
  } catch (error) {
    return next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    if (!/^[a-f\d]{24}$/i.test(req.params.id)) return res.status(400).json({ message: "El producto seleccionado no es válido." });
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "No encontramos ese producto." });
    if (await Promotion.exists({ productIds: product._id })) {
      return res.status(409).json({ message: "Este producto pertenece a una promoción. Retíralo de ella antes de eliminarlo." });
    }
    await product.deleteOne();
    return res.status(204).end();
  } catch (error) { return next(error); }
};

const seedProducts = async (req, res, next) => {
  try {
    const count = await Product.countDocuments();

    if (count > 0) {
      return res.json({
        message: "Los productos iniciales ya existen",
        inserted: 0,
      });
    }

    const products = await Product.insertMany(initialProducts);

    return res.status(201).json({
      message: "Productos iniciales creados",
      inserted: products.length,
      products,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getProducts,
  getFeaturedProducts,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts,
};
