const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");

const imageTypes = {
  "image/jpeg": { extension: ".jpg", signature: (buffer) => buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff },
  "image/png": { extension: ".png", signature: (buffer) => buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) },
  "image/webp": { extension: ".webp", signature: (buffer) => buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP" },
};

const uploadImage = async (req, res, next) => {
  try {
    const type = imageTypes[req.headers["content-type"]?.split(";")[0].trim().toLowerCase()];
    const image = req.body;
    if (!type || !Buffer.isBuffer(image) || image.length === 0 || !type.signature(image)) {
      return res.status(400).json({ message: "Carga una imagen válida en formato PNG, JPEG o WebP." });
    }
    const filename = `${crypto.randomUUID()}${type.extension}`;
    const directory = path.resolve(__dirname, "../../uploads");
    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(path.join(directory, filename), image, { flag: "wx" });
    return res.status(201).json({ image: `/api/uploads/${filename}` });
  } catch (error) { return next(error); }
};

module.exports = { uploadImage };
