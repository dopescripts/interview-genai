require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/database");

connectDB();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
