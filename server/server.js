const express = require("express");
const app = express();
const port = process.env.PORT;  // ← Thay đổi 1: Thêm process.env.PORT
const connectDB = require('./connectdb');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./routes/route'); 

const allowedOrigins = [
  "http://localhost:3000",
  "https://studymvp.io.vn",
  "https://www.studymvp.io.vn"  // ← Thay đổi 2: Thêm www
];

// 🔥 MIDDLEWARE PHẢI ĐẶT TRƯỚC ROUTE
app.use(morgan('dev'));

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// 🔥 ROUTES
app.use('/api', router);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// START SERVER
(async () => {
  try {
    await connectDB();
    app.listen(port, "0.0.0.0", () => {
      console.log(`✅ Server running on port ${port}`);  // ← Thay đổi 3: Bỏ hardcode localhost
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();