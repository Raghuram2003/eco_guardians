import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import { Quiz } from "./models/Quiz.js";
import { Question } from "./models/Question.js";

config();

const app = express();
app.use(express.json());

const PORT = 4040;

try {
  const db = mongoose.connect(process.env.MONGO_URI);
  console.log("db connected");
} catch (e) {
  console.log("db not connected");
}

app.get("/test", (req, res) => {
  res.send("Test ok");
});

app.get("/quiz", async (req, res) => {
  const { quizName } = req.body;
  const quizDoc = await Quiz.findOne({ name: quizName });
  console.log(quizDoc.questions);
  let response = [];
  for (const question of quizDoc.questions) {
    const questionDoc = await Question.findOne({ _id: question._id });
    response.push({
      question: questionDoc.question,
      options: questionDoc.options,
      answer: questionDoc.answer,
    });
  }
  res.json(response);
});

app.get("/quizCheck", async (req, res) => {
  const { quizName } = req.body;
  const { options } = req.body;
  const quizDoc = await Quiz.findOne({ name: quizName });
  let i = 0;
  let result = 0;
  for (const question of quizDoc.questions) {
    const questionDoc = await Question.findOne({ _id: question._id });
    if (questionDoc.answer === options[i]) result++;
    i++;
  }
  res.json({ result });
});

app.post("/addQuestion", async (req, res) => {
  const { quizName, question, options, answer } = req.body;
  const newQuestion = await Question.create({ question, options, answer });
  const quizDoc = await Quiz.findOne({ name: quizName });
  if (quizDoc) {
    const updatedQuizDoc = await Quiz.findOneAndUpdate(
      {
        name: quizName,
      },
      { $push: { questions: newQuestion._id } },
      { new: true }
    );
    res.json(updatedQuizDoc.questions)
  }
  else{
    const newQuiz = await Quiz.create({name : quizName, questions : [newQuestion._id]});
    res.json(newQuiz.questions)
  }
});

app.listen(PORT, () => {
  console.log("server is listening");
});
