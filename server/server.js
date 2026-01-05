const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;
const DATABASE_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối MongoDB
mongoose.connect(DATABASE_URL)
    .then(() => console.log("Kết nối MongoDB thành công"))
    .catch((err) => console.error("Lỗi kết nối MongoDB:", err));

// Routes mẫu
app.get('/', (req, res) => {
    res.json({ message: 'Server Express đang chạy!' });
});

app.get('/api/vocab', require('./api/vocab/route.js'));

// Thêm routes khác ở đây
// app.use('/api', require('./routes/api'));

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server đang chạy trên port ${PORT}`);
});
