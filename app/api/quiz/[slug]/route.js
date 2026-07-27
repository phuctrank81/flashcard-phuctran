const { NextResponse } = require("next/server");
const connectDB = require("../../../../lib/mongodb");
const { getQuizTopicModel } = require("../../../../lib/models/quiz");
const { requireAdmin } = require("../../../../lib/adminAuth");

const jsonResponse = (data, init = {}) => NextResponse.json(data, init);

const errorResponse = (message, status = 500, error) =>
  jsonResponse(
    { message, ...(error ? { error } : {}) },
    { status },
  );

const normalizeQuestions = (questions = []) =>
  questions.map((question) => ({
    word: String(question.word || "").trim(),
    correctAnswer: String(question.correctAnswer || "").trim(),
    options: Array.isArray(question.options)
      ? question.options.map((option) => String(option).trim()).filter(Boolean)
      : [],
  }));

const validateQuestions = (questions = []) =>
  questions.every(
    (question) =>
      question.word &&
      question.correctAnswer &&
      Array.isArray(question.options) &&
      question.options.length >= 2 &&
      question.options.includes(question.correctAnswer),
  );

exports.GET = async (request, context) => {
  try {
    const { slug } = context.params;
    const db = await connectDB(process.env.MONGODB_URI, "words");
    const QuizTopic = getQuizTopicModel(db);
    const topic = await QuizTopic.findOne({ slug: String(slug).toLowerCase() });

    if (!topic) {
      return errorResponse("Quiz topic not found", 404);
    }

    return jsonResponse(topic);
  } catch (error) {
    return errorResponse("Failed to load quiz topic", 500, error.message);
  }
};

exports.PATCH = async (request, context) => {
  try {
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) return adminCheck.response;

    const { slug } = context.params;
    const body = await request.json();
    const updates = {};

    if (typeof body.title === "string") {
      updates.title = body.title.trim();
    }
    if (typeof body.description === "string") {
      updates.description = body.description.trim();
    }
    if (Array.isArray(body.questions)) {
      const normalized = normalizeQuestions(body.questions);
      if (!validateQuestions(normalized) || normalized.length === 0) {
        return errorResponse("Invalid quiz questions payload", 400);
      }
      updates.questions = normalized;
    }

    const db = await connectDB(process.env.MONGODB_URI, "words");
    const QuizTopic = getQuizTopicModel(db);
    const updated = await QuizTopic.findOneAndUpdate(
      { slug: String(slug).toLowerCase() },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: "after" },
    );

    if (!updated) {
      return errorResponse("Quiz topic not found", 404);
    }

    return jsonResponse(updated);
  } catch (error) {
    return errorResponse("Failed to update quiz topic", 500, error.message);
  }
};

exports.DELETE = async (request, context) => {
  try {
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) return adminCheck.response;

    const { slug } = context.params;
    const db = await connectDB(process.env.MONGODB_URI, "words");
    const QuizTopic = getQuizTopicModel(db);
    const deleted = await QuizTopic.deleteOne({ slug: String(slug).toLowerCase() });

    if (deleted.deletedCount === 0) {
      return errorResponse("Quiz topic not found", 404);
    }

    return jsonResponse({ message: "Deleted successfully" });
  } catch (error) {
    return errorResponse("Failed to delete quiz topic", 500, error.message);
  }
};
