import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema(    
  {
    name : String,
    questions: [{ type: mongoose.Schema.ObjectId, ref: "Question" }],
  },
  { timestamps: true }
);

export const Quiz = mongoose.model("Quiz",QuizSchema);