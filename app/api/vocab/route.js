const { NextResponse } = require("next/server");
const connectDB = require("../../../lib/mongodb");
const { getWordsModel } = require("../../../lib/models/words");
const { requireAdmin } = require("../../../lib/adminAuth");

const jsonResponse = (data, init = {}) =>
  NextResponse.json(data, init);

const errorResponse = (message, status = 500, error) =>
  jsonResponse(
    { message, ...(error ? { error } : {}) },
    { status }
  );

exports.GET = async () => {
  try {
    const db = await connectDB(process.env.MONGODB_URI, "words");
    const Words = getWordsModel(db);
    const flashcards = await Words.find({})
      .project({ word: 1, definition: 1, example: 1 })
      .toArray();
    return jsonResponse(flashcards);
  } catch (error) {
    return errorResponse("Server error", 500, error.message);
  }
};

exports.POST = async (request) => {
  try {
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) return adminCheck.response;

    const db = await connectDB(process.env.MONGODB_URI, "words");
    const Words = getWordsModel(db);
    const { word, definition, example } = await request.json();

    if (!word || !definition) {
      return errorResponse("Missing fields", 400);
    }

    const result = await Words.insertOne({
      word,
      definition,
      example,
    });

    return jsonResponse({ _id: result.insertedId, word, definition, example }, { status: 201 });
  } catch (error) {
    return errorResponse("Create vocab failed", 500, error.message);
  }
};
