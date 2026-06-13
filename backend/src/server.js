require("./config/loadEnv");

const app = require("./app");
const connectDB = require("./config/db");

const port = process.env.PORT || 4000;

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error("No se pudo iniciar el servidor:", error.message);
  process.exit(1);
});
