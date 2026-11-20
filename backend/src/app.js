const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const promotionRoutes = require("./routes/promotionRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const path = require("path");

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "http://localhost:3002",
  "http://127.0.0.1:3002",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:(3000|3002)$/.test(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error("Origen no permitido por CORS"));
    },
  })
);
app.use(express.json());
app.use("/api/uploads", express.static(path.resolve(__dirname, "../uploads"), { dotfiles: "deny", fallthrough: false }));

app.get("/", (req, res) => {
  res.json({
    message: "API de Proyecto Pulpas funcionando",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/admin/uploads", uploadRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Ruta no encontrada",
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  if (err.code === 11000) {
    return res.status(409).json({ message: "Ya existe un producto con ese nombre en esa categoría." });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "Revisa los datos del producto e inténtalo de nuevo." });
  }

  res.status(err.status || 500).json({
    message: err.message || "Error interno del servidor",
  });
});

module.exports = app;
