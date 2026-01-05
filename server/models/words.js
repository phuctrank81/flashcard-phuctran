const mongoose = require('mongoose');

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
      required: true,
    },
  },
  {
    collection: "ielts_vocabulary",
    timestamps: true,
  }
);

module.exports = mongoose.models.Words ||
  mongoose.model("Words", WordsSchema);
