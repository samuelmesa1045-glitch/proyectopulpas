require("./config/loadEnv");

const app = require("./app");
const connectDB = require("./config/db");
const crypto = require("crypto");
const User = require("./models/User");
const Product = require("./models/Product");
const Category = require("./models/Category");
const initialProducts = require("./data/initialProducts");
const initialCategories = require("./data/initialCategories");
const StoreSettings = require("./models/StoreSettings");

const port = process.env.PORT || 4000;

const startServer = async () => {
  await connectDB();

  for (const category of initialCategories) {
    try {
      await Category.updateOne({ slug: category.slug }, { $setOnInsert: category }, { upsert: true });
    } catch (error) {
      if (error.code !== 11000) throw error;
    }
  }

  await StoreSettings.updateOne(
    { key: "store" },
    { $setOnInsert: {
      key: "store",
      whatsappNumber: process.env.STORE_WHATSAPP_NUMBER || "573103636112",
      location: process.env.STORE_LOCATION || "Santa Rosa de Osos, Antioquia",
      tagline: process.env.STORE_TAGLINE || "Una criatura, muchos sabores, infinitas aventuras.",
    } },
    { upsert: true }
  );

  await Product.collection.createIndex(
    { name: 1, category: 1 },
    { unique: true, name: "unique_product_category_name" }
  );
  const defaultPackages = initialProducts.filter((product) => product.category === "Paquetes");
  for (const product of defaultPackages) {
    try {
      await Product.updateOne(
        { name: product.name, category: product.category },
        { $setOnInsert: product },
        { upsert: true }
      );
    } catch (error) {
      if (error.code !== 11000) throw error;
    }
  }

  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
    const exists = await User.exists({ email, role: "admin" });
    if (!exists) {
      const passwordHash = await new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(16).toString("hex");
        crypto.scrypt(process.env.ADMIN_PASSWORD, salt, 64, (error, key) =>
          error ? reject(error) : resolve(`${salt}:${key.toString("hex")}`));
      });
      await User.create({ name: process.env.ADMIN_NAME || "Administrador", email, passwordHash, role: "admin" });
      console.log("Cuenta administradora inicial creada");
    }
  }

  app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error("No se pudo iniciar el servidor:", error.message);
  process.exit(1);
});
