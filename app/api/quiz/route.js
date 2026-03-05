const { NextResponse } = require("next/server");
const connectDB = require("../../../lib/mongodb");
const { getQuizTopicModel } = require("../../../lib/models/quiz");
const { requireAdmin } = require("../../../lib/adminAuth");

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

const validatePayload = ({ slug, title, questions }) => {
  if (!slug || !title) {
    return "Missing slug or title";
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return "Quiz topic must include at least one question";
  }

  const hasInvalidQuestion = questions.some(
    (question) =>
      !question.word ||
      !question.correctAnswer ||
      !Array.isArray(question.options) ||
      question.options.length < 2 ||
      !question.options.includes(question.correctAnswer),
  );

  if (hasInvalidQuestion) {
    return "Each question must have word, correctAnswer and valid options";
  }

  return "";
};

exports.GET = async () => {
  try {
    const db = await connectDB(process.env.MONGODB_URI, "words");
    const QuizTopic = getQuizTopicModel(db);
    const topics = await QuizTopic.find()
      .sort({ createdAt: 1 })
      .select("slug title description questions")
      .lean();

    const mapped = topics.map((topic) => ({
      slug: topic.slug,
      title: topic.title,
      description: topic.description || "",
      questions: topic.questions || [],
      questionCount: (topic.questions || []).length,
    }));

    return jsonResponse(mapped);
  } catch (error) {
    return errorResponse("Failed to load quiz topics", 500, error.message);
  }
};

exports.POST = async (request) => {
  try {
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) return adminCheck.response;

    const db = await connectDB(process.env.MONGODB_URI, "words");
    const QuizTopic = getQuizTopicModel(db);
    const body = await request.json();

    const slug = String(body.slug || "").trim().toLowerCase();
    const title = String(body.title || "").trim();
    const description = String(body.description || "").trim();
    const questions = normalizeQuestions(body.questions);
    const errorMessage = validatePayload({ slug, title, questions });
    if (errorMessage) return errorResponse(errorMessage, 400);

    const created = await QuizTopic.create({
      slug,
      title,
      description,
      questions,
    });

    return jsonResponse(created, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse("Quiz slug already exists", 409);
    }
    return errorResponse("Failed to create quiz topic", 500, error.message);
  }
};
