const mongoose = require("mongoose");

const WordsSchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: true
    },
    definition: {
      type: String,
      required: true
    },
    example: {
      type: String,
      required: false
    }
  },
  {
    collection: "ielts_vocabulary",
    timestamps: true
  }
);

const getWordsModel = (conn) => {
  if (!conn) {
    return mongoose.models.words || mongoose.model("words", WordsSchema);
  }

  return conn.models.words || conn.model("words", WordsSchema);
};

module.exports = {
  getWordsModel,
  WordsSchema
};
