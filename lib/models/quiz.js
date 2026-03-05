const mongoose = require("mongoose");

const QuizQuestionSchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: true,
      trim: true,
    },
    correctAnswer: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length >= 2,
        message: "A question must have at least 2 options",
      },
    },
  },
  { _id: false },
);

const QuizTopicSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    questions: {
      type: [QuizQuestionSchema],
      default: [],
    },
  },
  {
    collection: "quiz_topics",
    timestamps: true,
  },
);

const getQuizTopicModel = (conn) => {
  if (!conn) {
    return mongoose.models.quiz_topics || mongoose.model("quiz_topics", QuizTopicSchema);
  }

  return conn.models.quiz_topics || conn.model("quiz_topics", QuizTopicSchema);
};

module.exports = {
  getQuizTopicModel,
  QuizTopicSchema,
};
