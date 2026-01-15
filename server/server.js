const express = require("express");
const app = express();
const connectDB = require("./connectdb");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./routes/route");

const PORT = process.env.PORT || 8000;

app.use(morgan("dev"));

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://studymvp.io.vn",
    "https://www.studymvp.io.vn",
  ],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

app.get("/health", (req, res) => {
  res.send("OK");
});

(async () => {
  await connectDB();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
})();
