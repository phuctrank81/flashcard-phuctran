const express = require("express");
const router = express.Router();
const Words = require("@/models/words.model");

router.get("/vocab", async (req, res) => {
  try {
    const words = await Words.find().lean();
    res.json(words);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Không lấy được dữ liệu" });
  }
});

module.exports = router;
