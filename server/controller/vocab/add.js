const Words = require("../../model/words.js");

module.exports = async (req, res) => {
  try {
    const { word, definition, example } = req.body;

    if (!word || !definition) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const vocab = await Words.create({
      word,
      definition,
      example,
    });

    res.status(201).json(vocab);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Create vocab failed" });
  }
};
