import mongoose from "mongoose";
import "./Category";

const { Schema } = mongoose;

const questionSchema = new Schema({
  question: { type: String, required: true, minlength: 3 },
  answer: { type: String, required: true },
  imagePublicId: { type: String },
  categories: {
    type: [Schema.Types.ObjectId],
    ref: "Category",
    required: true,
  },
});

const Question =
  mongoose.models.Question || mongoose.model("Question", questionSchema);

export default Question;
