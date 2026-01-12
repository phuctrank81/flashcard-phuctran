const express = require("express");
const app = express();
const port = 8000;
const connectDB = require('./connectdb');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./routes/route'); // ❌ Sửa từ '../server/routes/route'

const allowedOrigins = [
  "http://localhost:3000",
  "https://studymvp.io.vn",
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
    app.listen(port, () => {
      console.log(`✅ Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();