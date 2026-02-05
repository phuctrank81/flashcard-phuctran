const { NextResponse } = require("next/server");
const connectDB = require("../../../lib/mongodb");
const { getWordsModel } = require("../../../server/model/words");

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
    console.log("[vocab] db:", db.name, "collection:", Words.collection.name);
    const flashcards = await Words.find();
    return jsonResponse(flashcards);
  } catch (error) {
    return errorResponse("Server error", 500, error.message);
  }
};

exports.POST = async (request) => {
  try {
    const db = await connectDB(process.env.MONGODB_URI, "words");
    const Words = getWordsModel(db);
    console.log("[vocab] db:", db.name, "collection:", Words.collection.name);
    const { word, definition, example } = await request.json();

    if (!word || !definition) {
      return errorResponse("Missing fields", 400);
    }

    const vocab = await Words.create({
      word,
      definition,
      example,
    });

    return jsonResponse(vocab, { status: 201 });
  } catch (error) {
    return errorResponse("Create vocab failed", 500, error.message);
  }
};
