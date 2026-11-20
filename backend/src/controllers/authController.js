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

const hashVerificationToken = (token) => crypto.createHash("sha256").update(token).digest("hex");
const getFrontendUrl = (req) => (req.get("origin") || process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:3000").replace(/\/+$/, "");
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;",
})[char]);

const sendVerificationEmail = async (user, token, req) => {
  const verificationUrl = `${getFrontendUrl(req)}/verificar-correo?token=${encodeURIComponent(token)}`;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    return { sent: false, verificationUrl: process.env.NODE_ENV === "production" ? undefined : verificationUrl };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [user.email],
        subject: "Confirma tu correo para JuliT-REX",
        html: `<p>Hola ${escapeHtml(user.name)},</p><p>Confirma tu correo para activar tu cuenta de JuliT-REX.</p><p><a href="${verificationUrl}">Confirmar mi correo</a></p><p>Este enlace vence en 30 minutos. Si no creaste esta cuenta, ignora este mensaje.</p>`,
      }),
      signal: AbortSignal.timeout(10000),
    });
    return { sent: response.ok };
  } catch {
    return { sent: false };
  }
};

const issueVerification = async (user, req) => {
  const token = crypto.randomBytes(32).toString("hex");
  user.emailVerified = false;
  user.emailVerificationTokenHash = hashVerificationToken(token);
  user.emailVerificationExpires = new Date(Date.now() + 30 * 60 * 1000);
  user.emailVerificationSentAt = new Date();
  await user.save();
  const delivery = await sendVerificationEmail(user, token, req);
  if (!delivery.sent && !delivery.verificationUrl) {
    user.emailVerificationSentAt = undefined;
    await user.save();
  }
  return delivery;
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
    if (process.env.NODE_ENV === "production" && (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM)) {
      return res.status(503).json({ message: "El servicio de confirmación de correo aún no está configurado." });
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ message: "Ya existe una cuenta con ese correo." });
    const user = await User.create({
      name: name.trim(), email: normalizedEmail, passwordHash: await hashPassword(password), role: "buyer",
      emailVerified: false, customerType, documentType: documentType.trim(), documentNumber: documentNumber.trim(),
      phone: phone.trim(), address: address.trim(),
      companyName: customerType === "company" ? companyName.trim() : undefined,
      taxId: customerType === "company" ? taxId.trim() : undefined,
    });
    const delivery = await issueVerification(user, req);
    return res.status(201).json({
      message: delivery.sent ? "Te enviamos un enlace para confirmar tu correo." : "Tu cuenta está creada, pero no se pudo entregar el correo. Puedes solicitar otro enlace.",
      verificationUrl: delivery.verificationUrl,
    });
  } catch (error) { return next(error); }
};

const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email: String(email || "").trim().toLowerCase() }).select("+passwordHash");
    if (!user || !(await verifyPassword(password || "", user.passwordHash)) || user.role !== role) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos para este tipo de acceso." });
    }
    if (user.role === "buyer" && user.emailVerified === false) {
      return res.status(403).json({ code: "EMAIL_NOT_VERIFIED", message: "Confirma tu correo antes de iniciar sesión." });
    }
    return sendSession(res, user);
  } catch (error) { return next(error); }
};

const verifyEmail = async (req, res, next) => {
  try {
    const token = String(req.body.token || "");
    if (!/^[a-f\d]{64}$/i.test(token)) return res.status(400).json({ message: "El enlace de confirmación no es válido." });
    const user = await User.findOne({
      emailVerificationTokenHash: hashVerificationToken(token),
      emailVerificationExpires: { $gt: new Date() }, emailVerified: false,
    }).select("+emailVerificationTokenHash +emailVerificationExpires");
    if (!user) return res.status(400).json({ message: "El enlace venció o ya fue utilizado. Solicita uno nuevo." });
    user.emailVerified = true;
    user.emailVerificationTokenHash = undefined;
    user.emailVerificationExpires = undefined;
    user.emailVerificationSentAt = undefined;
    await user.save();
    return res.json({ message: "Correo confirmado. Ya puedes iniciar sesión." });
  } catch (error) { return next(error); }
};

const resendVerification = async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!email) return res.status(400).json({ message: "Escribe tu correo electrónico." });
    if (process.env.NODE_ENV === "production" && (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM)) {
      return res.status(503).json({ message: "El servicio de correo aún no está configurado." });
    }
    const user = await User.findOne({ email, role: "buyer" }).select("+emailVerificationSentAt +emailVerificationTokenHash +emailVerificationExpires");
    const result = { message: "Si existe una cuenta pendiente con ese correo, enviaremos un nuevo enlace." };
    if (!user || user.emailVerified !== false) return res.json(result);
    if (user.emailVerificationSentAt && Date.now() - user.emailVerificationSentAt.getTime() < 60_000) return res.json(result);
    const delivery = await issueVerification(user, req);
    return res.json({ ...result, verificationUrl: delivery.verificationUrl });
  } catch (error) { return next(error); }
};

module.exports = { login, register, verifyEmail, resendVerification };
