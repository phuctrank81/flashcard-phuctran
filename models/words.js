import mongoose from "mongoose";

const WordsSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    word: String,
    definition: String,
    example: String,
  },
  {
    collection: "ielts_vocabulary", // ✅ map đúng collection
  }
);

export default mongoose.models.words ||
  mongoose.model("words", WordsSchema);