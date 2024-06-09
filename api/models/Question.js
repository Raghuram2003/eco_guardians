import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    question : String,
    options : [{type: String}],
    answer : Number
}
);

export const Question = mongoose.model("Question",QuestionSchema);