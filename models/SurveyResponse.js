const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true }
}, { _id: false });

const surveyResponseSchema = new mongoose.Schema({
  answers: {
    type: [answerSchema],
    required: true,
    validate: {
      validator: value => value.length === 5,
      message: "A survey response must contain exactly 5 answers."
    }
  }
}, { timestamps: true });

module.exports = mongoose.model("SurveyResponse", surveyResponseSchema);
