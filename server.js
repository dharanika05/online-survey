require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const SurveyResponse = require("./models/SurveyResponse");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

app.post("/api/responses", async (req, res) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length !== 5) {
      return res.status(400).json({ message: "Please submit answers to exactly 5 questions." });
    }

    const valid = answers.every(
      item => item &&
        typeof item.question === "string" && item.question.trim() &&
        typeof item.answer === "string" && item.answer.trim()
    );

    if (!valid) {
      return res.status(400).json({ message: "Every question must have an answer." });
    }

    const response = await SurveyResponse.create({
      answers: answers.map(item => ({
        question: item.question.trim(),
        answer: item.answer.trim()
      }))
    });

    res.status(201).json({
      message: "Survey response saved successfully.",
      responseId: response._id
    });
  } catch (error) {
    console.error("Save response error:", error);
    res.status(500).json({ message: "Unable to save response. Please try again." });
  }
});

app.get("/api/responses/count", async (req, res) => {
  try {
    const count = await SurveyResponse.countDocuments();
    res.json({ totalResponses: count });
  } catch (error) {
    res.status(500).json({ message: "Could not get response count." });
  }
});

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing. Add it to your .env file.");
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
