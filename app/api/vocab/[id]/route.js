const { NextResponse } = require("next/server");
const connectDB = require("../../../../lib/mongodb");
const { getWordsModel } = require("../../../../server/model/words");

const jsonResponse = (data, init = {}) =>
  NextResponse.json(data, init);

const errorResponse = (message, status = 500, error) =>
  jsonResponse(
    { message, ...(error ? { error } : {}) },
    { status }
  );

exports.GET = async (request, context) => {
  try {
    const db = await connectDB(process.env.MONGODB_URI, "words");
    const Words = getWordsModel(db);
    const { id } = context.params;
    const flashcard = await Words.findById(id);

    if (!flashcard) {
      return errorResponse("Word not found", 404);
    }

    return jsonResponse(flashcard);
  } catch (error) {
    return errorResponse("Server error", 500, error.message);
  }
};

exports.PATCH = async (request, context) => {
  try {
    const db = await connectDB(process.env.MONGODB_URI, "words");
    const Words = getWordsModel(db);
    const { id } = context.params;
    const updates = await request.json();

    const vocab = await Words.findByIdAndUpdate(id, updates, { new: true });
    if (!vocab) {
      return errorResponse("Vocab not found", 404);
    }

    return jsonResponse(vocab);
  } catch (error) {
    return errorResponse("Update vocab failed", 500, error.message);
  }
};

exports.DELETE = async (request, context) => {
  try {
    const db = await connectDB(process.env.MONGODB_URI, "words");
    const Words = getWordsModel(db);
    const { id } = context.params;

    const vocab = await Words.findByIdAndDelete(id);
    if (!vocab) {
      return errorResponse("Vocab not found", 404);
    }

    return jsonResponse({ message: "Deleted successfully" });
  } catch (error) {
    return errorResponse("Delete vocab failed", 500, error.message);
  }
};
