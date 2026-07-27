const { NextResponse } = require("next/server");
const { ObjectId } = require("mongodb");
const connectDB = require("../../../../lib/mongodb");
const { getWordsModel } = require("../../../../lib/models/words");
const { requireAdmin } = require("../../../../lib/adminAuth");

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
    const flashcard = await Words.findOne({ _id: new ObjectId(id) });

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
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) return adminCheck.response;

    const db = await connectDB(process.env.MONGODB_URI, "words");
    const Words = getWordsModel(db);
    const { id } = context.params;
    const updates = await request.json();

    const result = await Words.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: "after" },
    );
    const vocab = result.value;
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
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) return adminCheck.response;

    const db = await connectDB(process.env.MONGODB_URI, "words");
    const Words = getWordsModel(db);
    const { id } = context.params;

    const result = await Words.deleteOne({ _id: new ObjectId(id) });
    const vocab = result.deletedCount > 0;
    if (!vocab) {
      return errorResponse("Vocab not found", 404);
    }

    return jsonResponse({ message: "Deleted successfully" });
  } catch (error) {
    return errorResponse("Delete vocab failed", 500, error.message);
  }
};
