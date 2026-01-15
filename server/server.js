const express = require("express");
const connectDB = require("../server/connectdb");
const router = require("../server/routes/route");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://studymvp.io.vn",
  "https://www.studymvp.io.vn"
];

app.use(morgan("dev"));

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

app.get("/health", (req, res) => {
  res.send("OK");
});

// ✅ QUAN TRỌNG: connect DB nhưng KHÔNG listen
connectDB();

module.exports = app;
