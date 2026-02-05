const mongoose = require("mongoose");
const { getWordsModel } = require("../../model/words.js");

module.exports = async (req, res) => {
  try {
    const db = mongoose.connection.useDb("words", { useCache: true });
    const Words = getWordsModel(db);
    const vocab = await Words.findByIdAndDelete(req.params.id);

    if (!vocab) {
      return res.status(404).json({ message: "Vocab not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete vocab failed" });
  }
};
