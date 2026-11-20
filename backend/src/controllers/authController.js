const crypto = require("crypto");
const User = require("../models/User");

const hashPassword = (password, salt = crypto.randomBytes(16).toString("hex")) =>
  new Promise((resolve, reject) => crypto.scrypt(password, salt, 64, (error, key) =>
    error ? reject(error) : resolve(`${salt}:${key.toString("hex")}`)));

const verifyPassword = async (password, stored) => {
  const [salt, key] = stored.split(":");
  const hashed = await hashPassword(password, salt);
  const expected = Buffer.from(key, "hex");
  const actual = Buffer.from(hashed.split(":")[1], "hex");
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
};

const createToken = (user) => {
  const secret = process.env.JWT_SECRET || "solo-desarrollo-cambiar-en-produccion";
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ sub: user.id, role: user.role, exp: Date.now() + 86400000 })).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(`${header}.${payload}`).digest("base64url");
  return `${header}.${payload}.${signature}`;
};

const sendSession = (res, user, status = 200) => res.status(status).json({
  token: createToken(user),
  user: {
    id: user.id, name: user.name, email: user.email, role: user.role,
    customerType: user.customerType, documentType: user.documentType,
    documentNumber: user.documentNumber, phone: user.phone, address: user.address,
    companyName: user.companyName, taxId: user.taxId,
  },
});

const register = async (req, res, next) => {
  try {
    const { name, email, password, customerType, documentType, documentNumber, phone, address, companyName, taxId } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 8 || !["person", "company"].includes(customerType) || !documentType?.trim() || !documentNumber?.trim() || !phone?.trim() || !address?.trim()) {
      return res.status(400).json({ message: "Completa todos los datos obligatorios y usa una contraseña de al menos 8 caracteres." });
    }
    if (customerType === "company" && (!companyName?.trim() || !taxId?.trim())) {
      return res.status(400).json({ message: "Para registrar una empresa necesitamos su razón social y NIT." });
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ message: "Ya existe una cuenta con ese correo." });
    const user = await User.create({
      name: name.trim(), email: normalizedEmail, passwordHash: await hashPassword(password), role: "buyer",
      customerType, documentType: documentType.trim(), documentNumber: documentNumber.trim(),
      phone: phone.trim(), address: address.trim(),
      companyName: customerType === "company" ? companyName.trim() : undefined,
      taxId: customerType === "company" ? taxId.trim() : undefined,
    });
    return sendSession(res, user, 201);
  } catch (error) { return next(error); }
};

const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email: String(email || "").trim().toLowerCase() }).select("+passwordHash");
    if (!user || !(await verifyPassword(password || "", user.passwordHash)) || user.role !== role) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos para este tipo de acceso." });
    }
    return sendSession(res, user);
  } catch (error) { return next(error); }
};

module.exports = { register, login };
