const Product = require("../models/Product");
const initialProducts = require("../data/initialProducts");

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ active: true }).sort({
      featured: -1,
      name: 1,
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      active: true,
      featured: true,
    }).sort({ name: 1 });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
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
  createProduct,
  seedProducts,
};
