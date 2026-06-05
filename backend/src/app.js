const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* registering application routes */
const authRoutes = require("./routes/auth.routes");
const interviewRoutes = require("./routes/interview.routes");

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);

module.exports = app;
