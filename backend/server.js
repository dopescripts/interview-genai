require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/database");

async function startServer() {
  await connectDB(); // Wait for connection to complete

  const PORT = process.env.PORT;
  const APP_URL = process.env.APP_URL;

  app.listen(PORT, () => {
    console.log(`server running on ${APP_URL}:${PORT}`);
  });
}

startServer();
