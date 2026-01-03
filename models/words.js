import mongoose from "mongoose";

const WordsSchema = new mongoose.Schema(
  {
    word: String,
    definition: String,
    example: String,
  },
  {
    collection: "ielts_vocabulary", // ✅ map đúng collection
  }
);

export default mongoose.models.Words ||
  mongoose.model("Words", WordsSchema);
