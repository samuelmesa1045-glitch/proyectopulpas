const crypto = require("crypto");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (!token) return res.status(401).json({ message: "Inicia sesión para continuar." });
    const secret = process.env.JWT_SECRET || "solo-desarrollo-cambiar-en-produccion";
    const [header, payload, signature] = token.split(".");
    const expected = crypto.createHmac("sha256", secret).update(`${header}.${payload}`).digest();
    const actual = Buffer.from(signature || "", "base64url");
    if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) throw new Error("invalid token");
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (data.exp < Date.now()) throw new Error("expired token");
    req.user = await User.findById(data.sub);
    if (!req.user) throw new Error("unknown user");
    return next();
  } catch { return res.status(401).json({ message: "La sesión venció. Inicia sesión de nuevo." }); }
};

const requireAdmin = (req, res, next) => req.user?.role === "admin"
  ? next()
  : res.status(403).json({ message: "Esta sección es solo para administración." });

module.exports = { authenticate, requireAdmin };
