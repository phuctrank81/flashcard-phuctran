const connectDB = require("../../lib/mongodb.js");
const Words = require("../../models/words");

module.exports = async (req, res) => {
  try {
    await connectDB();

    const words = await Words.find().lean();

    res.json(words);
  } catch (error) {
    console.error("Lỗi lấy dữ liệu:", error);
    res.status(500).json({ error: "Không lấy được dữ liệu" });
  }
};