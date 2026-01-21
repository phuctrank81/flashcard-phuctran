require('dotenv').config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const connectDB = require("./connectdb");
const router = require("./routes/route");

const app = express();
const PORT = process.env.PORT || 10000;

// CORS
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api", router);

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: "Route not found",
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    message: err.message || 'Internal Server Error'
  });
});

// Start server
const startServer = async () => {
  try {
    // ✅ Connect DB một lần khi start server
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   ✅ Server running on port ${PORT}     ║
║   ✅ MongoDB connected                 ║
║   🌐 http://localhost:${PORT}          ║
╚════════════════════════════════════════╝

📌 Available routes:
  POST http://localhost:${PORT}/api/auth/register
  POST http://localhost:${PORT}/api/auth/login
  POST http://localhost:${PORT}/api/vocab
  GET  http://localhost:${PORT}/api/vocab
  GET  http://localhost:${PORT}/health
      `);
    });
  } catch (error) {
    console.error("❌ Failed to start:", error.message);
    process.exit(1);
  }
};
// Call the function to start the server
startServer();