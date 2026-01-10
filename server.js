require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://studymvp.io.vn/", // domain frontend
    ],
  })
);

// Routes
const vocabRoute = require("./routes/vocab");
app.use("/", vocabRoute);

// Health check
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(process.env.PORT || 8000, () => {
      console.log("Server running");
    });
  })
  .catch((err) => {
    console.error("MongoDB error:", err);
  });
