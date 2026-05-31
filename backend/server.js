require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/database");
const { resume, selfDescription, jobDescription } = require("./src/services/sample-data");
const { generateInterviewReport } = require("./src/services/ai.service");

async function startServer() {
  await connectDB(); // Wait for connection to complete
  const PORT = process.env.PORT;
  const APP_URL = process.env.APP_URL;


  await generateInterviewReport({ resume, selfDescription, jobDescription })

  app.listen(PORT, () => {
    console.log(`server running on ${APP_URL}:${PORT}`);
  });
}

startServer();
