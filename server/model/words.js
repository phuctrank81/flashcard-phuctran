const mongoose = require("mongoose");

const WordsSchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: true,
    },
    definition: {
      type: String,
      required: true,
    },
    example: {
      type: String,
    },
  },
  {
    collection: "ielts_vocabulary", // 👈 BẮT BUỘC
    timestamps: true,
  }
);

module.exports =
  mongoose.models.words || mongoose.model("words", WordsSchema);
