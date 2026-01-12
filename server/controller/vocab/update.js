const Words = require("../../model/words.js");

module.exports = async (req, res) => {
  try {
    const vocab = await Words.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!vocab) {
      return res.status(404).json({ message: "Vocab not found" });
    }

    res.json(vocab);
  } catch (err) {
    res.status(500).json({ message: "Update vocab failed" });
  }
};
