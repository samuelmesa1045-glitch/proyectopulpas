const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/proyectopulpas";

  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoUri);

  console.log("Base de datos conectada");
};

module.exports = connectDB;
