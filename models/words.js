import mongoose from "mongoose";

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

export default mongoose.models.Words ||
  mongoose.model("Words", WordsSchema);
